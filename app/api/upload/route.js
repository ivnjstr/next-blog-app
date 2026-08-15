import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Generic image upload endpoint used by the blog content editor
// to insert images inline (separate from the blog thumbnail upload).
export async function POST(request) {
    try {
        const formData = await request.formData();
        const image = formData.get("image");

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "blogs/content" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({ success: true, url: uploadResponse.secure_url });
    } catch (error) {
        console.error("Content image upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
