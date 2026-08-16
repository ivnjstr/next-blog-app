import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import BlogModel from "@/lib/models/BlogModel";
import { getAuthUser } from "@/lib/getAuthUser";

// Admin-only: list every user with their post count.
export async function GET() {
    const dbUser = await getAuthUser();
    if (!dbUser) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (dbUser.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const users = await UserModel.find({}).select("-password").sort({ createdAt: 1 }).lean();

    const postCounts = await BlogModel.aggregate([
        { $group: { _id: "$createdBy", count: { $sum: 1 } } }
    ]);
    const countByUserId = new Map(postCounts.map((p) => [String(p._id), p.count]));

    const usersWithCounts = users.map((u) => ({
        ...u,
        postCount: countByUserId.get(String(u._id)) || 0
    }));

    return NextResponse.json({ users: usersWithCounts });
}

// Admin-only: change another user's role.
export async function PATCH(request) {
    const dbUser = await getAuthUser();
    if (!dbUser) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (dbUser.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id, role } = await request.json();
        if (!id || !["admin", "author"].includes(role)) {
            return NextResponse.json({ success: false, msg: "A valid id and role are required." }, { status: 400 });
        }

        await connectDB();
        const target = await UserModel.findById(id);
        if (!target) {
            return NextResponse.json({ success: false, msg: "User not found." }, { status: 404 });
        }

        if (target.role === "admin" && role === "author") {
            const otherAdmins = await UserModel.countDocuments({ role: "admin", _id: { $ne: target._id } });
            if (otherAdmins === 0) {
                return NextResponse.json({ success: false, msg: "You can't demote the last remaining admin." }, { status: 400 });
            }
        }

        target.role = role;
        await target.save();

        return NextResponse.json({ success: true, msg: "Role updated." });
    } catch (error) {
        console.error("Role update error:", error);
        return NextResponse.json({ success: false, msg: "Update failed" }, { status: 500 });
    }
}
