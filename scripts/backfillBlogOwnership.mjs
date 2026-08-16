// One-off migration: existing blog posts predate the createdBy/status
// fields. Mongoose schema defaults don't get written to existing documents
// retroactively, and the blog list API uses .lean(), which skips default
// application entirely — so without this script, old posts would silently
// stop appearing on the public site once status filtering ships.
// Run with: npm run migrate:blog-ownership
// Reads MONGODB_URI / ADMIN_EMAIL from .env.local
// Safe to re-run (only touches documents missing the field).

import mongoose from "mongoose";

const { MONGODB_URI, ADMIN_EMAIL } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL) {
    console.error("Missing MONGODB_URI or ADMIN_EMAIL in .env.local");
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);

const BlogSchema = new mongoose.Schema({}, { strict: false });
const BlogModel = mongoose.models.blog || mongoose.model("blog", BlogSchema);

async function main() {
    await mongoose.connect(MONGODB_URI);

    const adminUser = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
        console.error(`No user found for ADMIN_EMAIL (${ADMIN_EMAIL}). Run "npm run seed:admin" first.`);
        process.exit(1);
    }

    const statusResult = await BlogModel.updateMany(
        { status: { $exists: false } },
        { $set: { status: "published" } }
    );
    console.log(`status backfilled on ${statusResult.modifiedCount} post(s).`);

    const ownerResult = await BlogModel.updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: adminUser._id } }
    );
    console.log(`createdBy backfilled on ${ownerResult.modifiedCount} post(s) (assigned to ${adminUser.email}).`);

    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
