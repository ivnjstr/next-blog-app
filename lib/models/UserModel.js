import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        // bcrypt hash, never the plain password
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "author"],
        default: "admin"
    },
    image: {
        type: String,
        default: ""
    },
    image_public_id: {
        type: String
    },
    // Default applied to allowComments when this user creates a new post.
    // Changing it never touches posts that already exist.
    defaultAllowComments: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const UserModel = mongoose.models.user || mongoose.model("user", Schema);

export default UserModel;
