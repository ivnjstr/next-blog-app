import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { isRateLimited } from "@/lib/rateLimit";
import cloudinary from "@/lib/cloudinary";

// Public signup endpoint. Anyone can register, but every account created
// here is forced to role "author" server-side — role is never read from
// the request body, so nobody can self-register as admin.
export async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(`register:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
            return NextResponse.json({ success: false, msg: "Too many signup attempts. Please try again later." }, { status: 429 });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        const image = formData.get("image");

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, msg: "Name, email and password are all required." }, { status: 400 });
        }
        // Never trust client-only validation for this — re-check server-side too.
        if (password !== confirmPassword) {
            return NextResponse.json({ success: false, msg: "Password and confirmation don't match." }, { status: 400 });
        }

        await connectDB();

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, msg: "That email is already in use." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            password: hashedPassword,
            role: "author"
        };

        // Avatar is optional — if the upload fails, don't fail the whole signup over it.
        if (image && typeof image !== "string" && image.size > 0) {
            try {
                const arrayBuffer = await image.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: "auto", folder: "avatars" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });

                userData.image = uploadResponse.secure_url;
                userData.image_public_id = uploadResponse.public_id;
            } catch (error) {
                console.error("Signup avatar upload failed, continuing without it:", error);
            }
        }

        await UserModel.create(userData);

        return NextResponse.json({ success: true, msg: "Account created!" });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong while signing up." }, { status: 500 });
    }
}
