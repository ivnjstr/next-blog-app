import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // null = top-level comment, otherwise this is a reply to that comment.
    // Replies can never themselves have replies — enforced in the API, not here.
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    }
}, { timestamps: true });

const CommentModel = mongoose.models.comment || mongoose.model('comment', Schema);

export default CommentModel;
