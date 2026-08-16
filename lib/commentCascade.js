import CommentModel from "@/lib/models/CommentModel";
import LikeModel from "@/lib/models/LikeModel";

// Deletes the given comments and every Like pointing at any of them. Shared
// by single-comment deletion (its direct replies) and account deletion
// (all of a user's comments, and all comments left on their deleted posts),
// so both routes clean up likes the same way instead of duplicating it.
export async function deleteCommentsByIds(commentIds) {
    if (!commentIds.length) return;
    await LikeModel.deleteMany({ targetType: "comment", targetId: { $in: commentIds } });
    await CommentModel.deleteMany({ _id: { $in: commentIds } });
}
