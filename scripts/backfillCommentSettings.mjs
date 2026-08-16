// One-off migration: existing blog posts and user accounts predate the
// allowComments / defaultAllowComments fields. Mongoose schema defaults
// don't get written to existing documents retroactively, and .lean() reads
// skip default application entirely — so without this script, old posts
// and users would read back as missing the field rather than defaulting on.
// Run with: npm run migrate:comment-settings
// Reads MONGODB_URI from .env.local
// Safe to re-run (only touches documents missing the field).

import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
}

const BlogSchema = new mongoose.Schema({}, { strict: false });
const BlogModel = mongoose.models.blog || mongoose.model("blog", BlogSchema);

const UserSchema = new mongoose.Schema({}, { strict: false });
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);

async function main() {
    await mongoose.connect(MONGODB_URI);

    const blogResult = await BlogModel.updateMany(
        { allowComments: { $exists: false } },
        { $set: { allowComments: true } }
    );
    console.log(`allowComments backfilled on ${blogResult.modifiedCount} post(s).`);

    const userResult = await UserModel.updateMany(
        { defaultAllowComments: { $exists: false } },
        { $set: { defaultAllowComments: true } }
    );
    console.log(`defaultAllowComments backfilled on ${userResult.modifiedCount} user(s).`);

    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
