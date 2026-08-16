import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import LikeModel from "@/lib/models/LikeModel";
import { getAuthUser } from "@/lib/getAuthUser";

// Toggles a like on a post or a comment. Always requires auth — a
// logged-out visitor can see counts (returned inline by the post/comment
// GET routes) but liking always needs a real, server-verified user.
export async function POST(request) {
    try {
        await connectDB();

        const dbUser = await getAuthUser();
        if (!dbUser) {
            return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
        }

        const { targetType, targetId } = await request.json();
        if (!["post", "comment"].includes(targetType) || !targetId) {
            return NextResponse.json({ success: false, msg: "A valid targetType and targetId are required." }, { status: 400 });
        }

        const existing = await LikeModel.findOne({ userId: dbUser._id, targetType, targetId });

        let liked;
        if (existing) {
            await LikeModel.deleteOne({ _id: existing._id });
            liked = false;
        } else {
            try {
                await LikeModel.create({ userId: dbUser._id, targetType, targetId });
                liked = true;
            } catch (error) {
                // Duplicate-key race (two rapid clicks): treat as already liked,
                // not an error — the unique index is what actually prevents the
                // duplicate, this just makes the response consistent.
                if (error.code === 11000) {
                    liked = true;
                } else {
                    throw error;
                }
            }
        }

        const count = await LikeModel.countDocuments({ targetType, targetId });

        return NextResponse.json({ success: true, liked, count });
    } catch (error) {
        console.error("Like toggle error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong" }, { status: 500 });
    }
}
