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
    }
}, { timestamps: true });

const UserModel = mongoose.models.user || mongoose.model("user", Schema);

export default UserModel;
