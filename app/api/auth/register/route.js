import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { isRateLimited } from "@/lib/rateLimit";

// Public signup endpoint. Anyone can register, but every account created
// here is forced to role "author" server-side — role is never read from
// the request body, so nobody can self-register as admin.
export async function POST(request) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(`register:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
            return NextResponse.json({ success: false, msg: "Too many signup attempts. Please try again later." }, { status: 429 });
        }

        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, msg: "Name, email and password are all required." }, { status: 400 });
        }

        await connectDB();

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, msg: "That email is already in use." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: "author"
        });

        return NextResponse.json({ success: true, msg: "Account created!" });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong while signing up." }, { status: 500 });
    }
}
