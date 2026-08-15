// One-off script to create (or update) the admin user in MongoDB.
// Run with: npm run seed:admin
// Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD / MONGODB_URI from .env.local

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing MONGODB_URI, ADMIN_EMAIL or ADMIN_PASSWORD in .env.local");
    process.exit(1);
}

const Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }
}, { timestamps: true });

const UserModel = mongoose.models.user || mongoose.model("user", Schema);

async function main() {
    await mongoose.connect(MONGODB_URI);

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const user = await UserModel.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        {
            name: ADMIN_NAME || "Admin",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        },
        { upsert: true, returnDocument: "after" }
    );

    console.log(`Admin user ready: ${user.email}`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
