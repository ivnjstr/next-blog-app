import { connectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { getAuthUser } from "@/lib/getAuthUser";
const { NextResponse } = require("next/server");

//for live use cloudinary
import cloudinary from "@/lib/cloudinary";

const isOwnerOrAdmin = (dbUser, blog) =>
  dbUser.role === "admin" || String(blog.createdBy) === String(dbUser._id);

//API ENDPOINT TO GET ALL BLOGS, OR A SINGLE BLOG BY ID
export async function GET(request) {
    try {
        await connectDB();
        const blogId = request.nextUrl.searchParams.get("id");
        const dbUser = await getAuthUser();

        if (blogId) {
            const blog = await BlogModel.findById(blogId);
            if (!blog) {
                return NextResponse.json(null, { status: 404 });
            }

            // Published posts are public. Anything else (pending/rejected) is
            // only visible to its own author or an admin — never trust the
            // `id` alone as proof of access. A 404 (not a 200+null) lets both
            // the public blog page and the admin edit page's existing
            // error handling treat "not yours" the same as "doesn't exist".
            if (blog.status !== "published" && (!dbUser || !isOwnerOrAdmin(dbUser, blog))) {
                return NextResponse.json(null, { status: 404 });
            }

            return NextResponse.json(blog);
        }

        // The `scope` param is only a hint about intent — it is never itself
        // proof of authorization. What gets returned is always derived from
        // the server-verified session/role below, never from the query string.
        const scope = request.nextUrl.searchParams.get("scope");

        let filter = { status: "published" };
        if (scope === "admin" && dbUser) {
            if (dbUser.role === "admin") {
                filter = {};
            } else {
                filter = { createdBy: dbUser._id };
            }
        }

        const blogs = await BlogModel.find(filter).lean();
        return NextResponse.json({ blogs });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

//API ENDPOINT FOR UPLOADING BLOGS
export async function POST(request) {
  try {
    await connectDB();

    const dbUser = await getAuthUser();
    if (!dbUser) {
      return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the image to a Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a Promise and upload_stream
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "blogs" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const isAdmin = dbUser.role === "admin";
    // Only an admin's submitted value for isFeatured is honored — authors
    // can never feature their own post, no matter what the client sends.
    const isFeatured = isAdmin && formData.get('isFeatured') === 'true';
    const hasVideo = formData.get('hasVideo') === 'true';

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      authorImage: formData.get('authorImage'),
      isFeatured,
      hasVideo,
      createdBy: dbUser._id,
      status: isAdmin ? "published" : "pending"
    };

    // Only one post can be featured at a time
    if (isFeatured) {
      await BlogModel.updateMany({}, { isFeatured: false });
    }

    await BlogModel.create(blogData);

    return NextResponse.json({ success: true, msg: isAdmin ? "Blog Added!" : "Blog submitted for approval!" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, msg: "Upload failed" }, { status: 500 });
  }
}

// API ENDPOINT TO UPDATE AN EXISTING BLOG
export async function PUT(request) {
  try {
    await connectDB();

    const dbUser = await getAuthUser();
    if (!dbUser) {
      return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
    }

    if (!isOwnerOrAdmin(dbUser, blog)) {
      return NextResponse.json({ success: false, msg: "You can only edit your own posts." }, { status: 403 });
    }

    const isAdmin = dbUser.role === "admin";

    const formData = await request.formData();
    const image = formData.get('image');

    const isFeatured = isAdmin && formData.get('isFeatured') === 'true';
    const hasVideo = formData.get('hasVideo') === 'true';

    const update = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      authorImage: formData.get('authorImage'),
      isFeatured,
      hasVideo
    };

    // Admin edits never change moderation status. An author editing any of
    // their own posts (published or previously rejected) sends it back to
    // "pending" — anything they've changed needs a fresh review.
    if (!isAdmin) {
      update.status = "pending";
      update.rejectionReason = "";
    }

    // Only one post can be featured at a time
    if (isFeatured) {
      await BlogModel.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }

    // Only touch Cloudinary/image fields if a new thumbnail file was actually sent
    if (image && typeof image !== 'string' && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      if (blog.public_id) {
        await cloudinary.uploader.destroy(blog.public_id);
      }

      update.image = uploadResponse.secure_url;
      update.public_id = uploadResponse.public_id;
    }

    await BlogModel.findByIdAndUpdate(id, update);

    return NextResponse.json({ success: true, msg: "Blog updated successfully!" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, msg: "Update failed" }, { status: 500 });
  }
}

// ADMIN-ONLY: approve or reject a pending/rejected post
export async function PATCH(request) {
  try {
    await connectDB();

    const dbUser = await getAuthUser();
    if (!dbUser) {
      return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
    }
    if (dbUser.role !== "admin") {
      return NextResponse.json({ success: false, msg: "Only admins can approve or reject posts." }, { status: 403 });
    }

    const { id, action, rejectionReason } = await request.json();
    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, msg: "A valid id and action are required." }, { status: 400 });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
    }

    if (action === "approve") {
      blog.status = "published";
      blog.rejectionReason = "";
    } else {
      blog.status = "rejected";
      blog.rejectionReason = rejectionReason || "";
    }

    await blog.save();

    return NextResponse.json({ success: true, msg: action === "approve" ? "Post approved!" : "Post rejected." });
  } catch (error) {
    console.error("Moderation error:", error);
    return NextResponse.json({ success: false, msg: "Update failed" }, { status: 500 });
  }
}

//For cloud delete
export async function DELETE(request) {
    try {
        await connectDB();

        const dbUser = await getAuthUser();
        if (!dbUser) {
            return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
        }

        const id = request.nextUrl.searchParams.get("id");

        const blog = await BlogModel.findById(id);

        if (!blog) {
            return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
        }

        if (!isOwnerOrAdmin(dbUser, blog)) {
            return NextResponse.json({ success: false, msg: "You can only delete your own posts." }, { status: 403 });
        }

        // Only call Cloudinary if we actually have an ID stored
        if (blog.public_id) {
            console.log("Deleting from Cloudinary:", blog.public_id);
            const result = await cloudinary.uploader.destroy(blog.public_id);
            console.log("Cloudinary result:", result);
        } else {
            console.log("No public_id found for this blog. Only deleting from DB.");
        }

        await BlogModel.findByIdAndDelete(id);

        return NextResponse.json({ success: true, msg: "Blog deleted successfully!" });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ success: false, msg: "Delete failed" }, { status: 500 });
    }
}
