// in this file we create api t o manage our blog data in the mongo db using the blog modal we created in the lib/models/BlogModal.js file and we will perform CRUD operations on our blog data in the mongo db using this api route

import { connectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
// import { writeFile } from 'fs/promises'; // - this will be used to write the image file in the public folder
const { NextResponse } = require("next/server");
// const fs = require('fs'); //this is for deleteng the image also

//for live use cloudinary
import cloudinary from "@/lib/cloudinary";

const LoadDB = async () => {
    // we use this to connect to the database \
    await connectDB();
}

LoadDB();



// //API ENDPOINT TO GET ALL BLOGS
// //first we will check if out api are working or not
// export async function GET(request) {
//     //await connectDB(); 
//     //so whenever we will send the get req on this route this function will be ewxecuted
//     console.log('GET request received on /api/blog route'); // - this printed in terminal
//     return NextResponse.json({ message: 'API Working' }); // - this printed in postman
// }

// //then export the function to use it in our application


//API ENDPOINT TO GET ALL BLOGS
export async function GET(request) {
    try {
        const blogId = request.nextUrl.searchParams.get("id");
        if (blogId) { //if we are sending the blogId from the frontend then display the particular blog data
            const blog = await BlogModel.findById(blogId);
            return NextResponse.json(blog); //if we  send the blog id we will return the particular blog in this response
        } else {
            const blogs = await BlogModel.find({});
            return NextResponse.json({ blogs });
        } // if we are not sending any blog id then we will return all the blog data in response

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    //now using this data we will display the blog in homepage
}




//API ENDPOINT FOR UPLOADING BLOGS
//create api for storing the blog data in the mongo db using the post req on this route
// export async function POST(request) {

//     const formData = await request.formData(); // - this will get the form data from the request
//     const timestamp = Date.now(); // - this will get the current timestamp for rename in images

//     //extract the image from the form data
//     const image = formData.get('image'); // - this will get the image from the form data
//     //using this store the image in the public folder and rename it with the timestamp to avoid name conflicts

//     // UPDATE USE THIS FOR LOCAL
//     // const imageByteData = await image.arrayBuffer(); // - this will get the byte data of the image
//     // const buffer = Buffer.from(imageByteData); // - this will convert the byte data to buffer
//     // const path = `./public/${timestamp}_${image.name}`; // - this will create the path for the image in the public folder
//     // await writeFile(path, buffer); // - this will write the image file in the public folder (storing the image in the public folder)
//     // const imageUrl = `/${timestamp}_${image.name}`; // - this will create the url for the image to store in the mongo db (storing the image url in the mongo db)
//     // // test
//     // // console.log(imageUrl);

//     // UPDATED USE  cloudinary FOR LIVE SITE
    
//     const bytes = await image.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadResponse = await new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream({}, (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//     }).end(buffer);
//     });

//     const imageUrl = uploadResponse.secure_url;
//     const public_id = uploadResponse.public_id;


//     // now for the title, descripotiona and ect store in db
//     const blogData = {
//         title: `${formData.get('title')}`,
//         description: `${formData.get('description')}`,
//         category: `${formData.get('category')}`,
//         author: `${formData.get('author')}`,
//         image: `${imageUrl}`,
//          public_id: public_id, // 👈 ADD THIS
//         authorImage: `${formData.get('authorImage')}`
//     }
//     //we will use this blogdata to store in db

//     await BlogModel.create(blogData)
//     console.log("Blog Saved!")



//     return NextResponse.json({ success: true, msg: "Blog Added!" });
// }



//UPDATED POSTS
export async function POST(request) {
  try {
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

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      authorImage: formData.get('authorImage')
    };

    await BlogModel.create(blogData);
    
    return NextResponse.json({ success: true, msg: "Blog Added!" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, msg: "Upload failed" }, { status: 500 });
  }
}

// Creating API Endpoint to delete blog
// export async function DELETE(request){
//     //to delete we need blog id
//     const id  = request.nextUrl.searchParams.get("id"); //mongo db id as a parameter
//     const blog = await BlogModel.findById(id);
//     fs.unlink(`./public${blog.image}`,() =>{}); //image will be deleted
//     await BlogModel.findByIdAndDelete(id); // also blog will be deleted
//     return NextResponse.json({msg:"Blog deleted!"});
// }

//old
// Creating API Endpoint to delete blog
// export async function DELETE(request){
//     //to delete we need blog id
//     const id  = request.nextUrl.searchParams.get("id"); //mongo db id as a parameter
//     const blog = await BlogModel.findById(id);
//     fs.unlink(`./public${blog.image}`,() =>{}); //image will be deleted
//     await BlogModel.findByIdAndDelete(id); // also blog will be deleted
//     return NextResponse.json({msg:"Blog deleted!"});
// }


//For cloud delete
export async function DELETE(request) {
    try {
        await connectDB(); // Always connect first
        const id = request.nextUrl.searchParams.get("id");

        const blog = await BlogModel.findById(id);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Log to see what is actually being sent to Cloudinary
        console.log("Attempting to delete Public ID:", blog.public_id);

        if (blog.public_id) {
            // Cloudinary destroy returns a result object
            const result = await cloudinary.uploader.destroy(blog.public_id);
            
            // Check if result is 'ok' or 'not found'
            console.log("Cloudinary response:", result);
            
            if (result.result !== 'ok') {
                console.warn("Cloudinary delete failed or image already gone:", result);
            }
        }

        await BlogModel.findByIdAndDelete(id);

        return NextResponse.json({ success: true, msg: "Blog and image deleted!" });

    } catch (error) {
        console.error("Delete API Error:", error);
        return NextResponse.json({ error: "Delete failed", details: error.message }, { status: 500 });
    }
}