import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import cloudinary from "@/lib/cloudinary";

// Returns the logged-in user's own profile. Identity comes from the
// server session, never from a client-supplied id, so you can only ever
// read/edit your own account through this route.
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await UserModel.findOne({ email: session.user.email }).select("-password");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
    });
}

export async function PUT(request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        await connectDB();
        const user = await UserModel.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const image = formData.get("image");
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");

        const update = {};

        if (name) update.name = name;

        if (email && email !== user.email) {
            const existing = await UserModel.findOne({ email });
            if (existing) {
                return NextResponse.json({ success: false, msg: "That email is already in use." }, { status: 400 });
            }
            update.email = email;
        }

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ success: false, msg: "Enter your current password to set a new one." }, { status: 400 });
            }
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ success: false, msg: "Current password is incorrect." }, { status: 400 });
            }
            update.password = await bcrypt.hash(newPassword, 10);
        }

        if (image && typeof image !== "string" && image.size > 0) {
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

            if (user.image_public_id) {
                await cloudinary.uploader.destroy(user.image_public_id);
            }

            update.image = uploadResponse.secure_url;
            update.image_public_id = uploadResponse.public_id;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(user._id, update, { new: true }).select("-password");

        return NextResponse.json({
            success: true,
            msg: "Profile updated!",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image
            }
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ success: false, msg: "Update failed" }, { status: 500 });
    }
}
