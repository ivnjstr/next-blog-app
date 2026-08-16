import mongoose from "mongoose";

// One shared model for both post likes and comment likes, rather than two
// near-identical collections — targetType + targetId identifies what's liked.
const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    targetType: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

// A user can only like a given post/comment once — enforced at the database
// level, not just in application logic, so a race between two rapid
// duplicate requests can't both succeed.
Schema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

const LikeModel = mongoose.models.like || mongoose.model('like', Schema);

export default LikeModel;
