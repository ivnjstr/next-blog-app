import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import CommentModel from "@/lib/models/CommentModel";
import LikeModel from "@/lib/models/LikeModel";
import BlogModel from "@/lib/models/BlogModel";
import { getAuthUser } from "@/lib/getAuthUser";
import { isRateLimited } from "@/lib/rateLimit";
import { deleteCommentsByIds } from "@/lib/commentCascade";

const isOwnerOrAdmin = (dbUser, comment, post) =>
    dbUser.role === "admin" ||
    String(comment.userId) === String(dbUser._id) ||
    (post && String(post.createdBy) === String(dbUser._id));

// Deletes a comment along with its direct replies (one level only, so this
// is a bounded cascade) and every Like pointing at any of them.
async function cascadeDeleteComment(comment) {
    const replies = await CommentModel.find({ parentId: comment._id }).select("_id");
    const idsToDelete = [comment._id, ...replies.map((r) => r._id)];
    await deleteCommentsByIds(idsToDelete);
}

function serializeComment(comment, likeCountById, likedCommentIds) {
    const id = String(comment._id);
    return {
        _id: comment._id,
        postId: comment.postId,
        parentId: comment.parentId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        edited: comment.updatedAt?.getTime() !== comment.createdAt?.getTime(),
        user: comment.userId ? { _id: comment.userId._id, name: comment.userId.name, image: comment.userId.image } : null,
        likeCount: likeCountById.get(id) || 0,
        likedByMe: likedCommentIds.has(id)
    };
}

// Public: every comment on a post, flat (client groups top-level vs replies
// via parentId). Visible regardless of the post's allowComments value —
// disabling comments only blocks new ones, existing ones stay visible.
export async function GET(request) {
    try {
        await connectDB();
        const postId = request.nextUrl.searchParams.get("postId");
        if (!postId) {
            return NextResponse.json({ error: "postId is required" }, { status: 400 });
        }

        const comments = await CommentModel.find({ postId })
            .populate("userId", "name image")
            .sort({ createdAt: 1 })
            .lean();

        const commentIds = comments.map((c) => c._id);

        // Batched — one query for every comment's like count, not N+1.
        const likeCounts = await LikeModel.aggregate([
            { $match: { targetType: "comment", targetId: { $in: commentIds } } },
            { $group: { _id: "$targetId", count: { $sum: 1 } } }
        ]);
        const likeCountById = new Map(likeCounts.map((l) => [String(l._id), l.count]));

        const dbUser = await getAuthUser();
        let likedCommentIds = new Set();
        if (dbUser) {
            const myLikes = await LikeModel.find({
                userId: dbUser._id,
                targetType: "comment",
                targetId: { $in: commentIds }
            }).select("targetId").lean();
            likedCommentIds = new Set(myLikes.map((l) => String(l.targetId)));
        }

        return NextResponse.json({
            comments: comments.map((c) => serializeComment(c, likeCountById, likedCommentIds))
        });
    } catch (error) {
        console.error("Fetch comments error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const dbUser = await getAuthUser();
        if (!dbUser) {
            return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
        }

        if (isRateLimited(`comment:${dbUser._id}`, { limit: 10, windowMs: 5 * 60 * 1000 })) {
            return NextResponse.json({ success: false, msg: "You're commenting too quickly. Please slow down." }, { status: 429 });
        }

        const { postId, content, parentId } = await request.json();

        const post = await BlogModel.findById(postId);
        if (!post) {
            return NextResponse.json({ success: false, msg: "Post not found" }, { status: 404 });
        }
        if (!post.allowComments) {
            return NextResponse.json({ success: false, msg: "Comments are closed for this post." }, { status: 403 });
        }

        const trimmed = (content || "").trim();
        if (!trimmed) {
            return NextResponse.json({ success: false, msg: "Comment can't be empty." }, { status: 400 });
        }
        if (trimmed.length > 2000) {
            return NextResponse.json({ success: false, msg: "Comment is too long." }, { status: 400 });
        }

        let parentComment = null;
        if (parentId) {
            parentComment = await CommentModel.findById(parentId);
            if (!parentComment || String(parentComment.postId) !== String(postId)) {
                return NextResponse.json({ success: false, msg: "Reply target not found." }, { status: 400 });
            }
            if (parentComment.parentId) {
                return NextResponse.json({ success: false, msg: "Replies can only be one level deep." }, { status: 400 });
            }
        }

        const comment = await CommentModel.create({
            postId,
            userId: dbUser._id,
            parentId: parentComment ? parentComment._id : null,
            content: trimmed
        });

        return NextResponse.json({
            success: true,
            comment: serializeComment(
                { ...comment.toObject(), userId: { _id: dbUser._id, name: dbUser.name, image: dbUser.image } },
                new Map(),
                new Set()
            )
        });
    } catch (error) {
        console.error("Create comment error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong" }, { status: 500 });
    }
}

// Editing is owner-only — moderation (below) covers deletion, not rewriting
// someone else's words.
export async function PUT(request) {
    try {
        await connectDB();

        const dbUser = await getAuthUser();
        if (!dbUser) {
            return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
        }

        const id = request.nextUrl.searchParams.get("id");
        const comment = await CommentModel.findById(id);
        if (!comment) {
            return NextResponse.json({ success: false, msg: "Comment not found" }, { status: 404 });
        }
        if (String(comment.userId) !== String(dbUser._id)) {
            return NextResponse.json({ success: false, msg: "You can only edit your own comments." }, { status: 403 });
        }

        const { content } = await request.json();
        const trimmed = (content || "").trim();
        if (!trimmed) {
            return NextResponse.json({ success: false, msg: "Comment can't be empty." }, { status: 400 });
        }
        if (trimmed.length > 2000) {
            return NextResponse.json({ success: false, msg: "Comment is too long." }, { status: 400 });
        }

        comment.content = trimmed;
        await comment.save();

        return NextResponse.json({ success: true, msg: "Comment updated." });
    } catch (error) {
        console.error("Edit comment error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong" }, { status: 500 });
    }
}

// Admin: any comment. Post owner: comments on their own post. Everyone
// else: only their own comment. All three checked fresh, server-side.
export async function DELETE(request) {
    try {
        await connectDB();

        const dbUser = await getAuthUser();
        if (!dbUser) {
            return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
        }

        const id = request.nextUrl.searchParams.get("id");
        const comment = await CommentModel.findById(id);
        if (!comment) {
            return NextResponse.json({ success: false, msg: "Comment not found" }, { status: 404 });
        }

        const post = await BlogModel.findById(comment.postId);

        if (!isOwnerOrAdmin(dbUser, comment, post)) {
            return NextResponse.json({ success: false, msg: "You can't delete this comment." }, { status: 403 });
        }

        await cascadeDeleteComment(comment);

        return NextResponse.json({ success: true, msg: "Comment deleted." });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ success: false, msg: "Something went wrong" }, { status: 500 });
    }
}
