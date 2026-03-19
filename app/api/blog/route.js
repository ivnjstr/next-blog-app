// in this file we create api t o manage our blog data in the mongo db using the blog modal we created in the lib/models/BlogModal.js file and we will perform CRUD operations on our blog data in the mongo db using this api route

import { connectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import {writeFile} from 'fs/promises'; // - this will be used to write the image file in the public folder
const { NextResponse } = require("next/server");

const LoadDB = async () => {
    // we use this to connect to the database \
    await connectDB();
}

LoadDB();


//first we will check if out api are working or not
export async function GET(request) {
    //await connectDB(); 
    //so whenever we will send the get req on this route this function will be ewxecuted
    console.log('GET request received on /api/blog route'); // - this printed in terminal
    return NextResponse.json({ message: 'API Working' }); // - this printed in postman
}

//then export the function to use it in our application

//create api for storing the blog data in the mongo db using the post req on this route
export async function POST(request) {

    const formData = await request.formData(); // - this will get the form data from the request
    const timestamp = Date.now(); // - this will get the current timestamp for rename in images

    //extract the image from the form data
    const image = formData.get('image'); // - this will get the image from the form data
    //using this store the image in the public folder and rename it with the timestamp to avoid name conflicts
    const imageByteData = await image.arrayBuffer(); // - this will get the byte data of the image
    const buffer = Buffer.from(imageByteData); // - this will convert the byte data to buffer
    const path = `./public/${timestamp}_${image.name}`; // - this will create the path for the image in the public folder
    await writeFile(path, buffer); // - this will write the image file in the public folder (storing the image in the public folder)
    const imageUrl = `/${timestamp}_${image.name}`; // - this will create the url for the image to store in the mongo db (storing the image url in the mongo db)
    // test
    // console.log(imageUrl);


    // now for the title, descripotiona and ect store in db
    const blogData = {
        title: `${formData.get('title')}`,
        description: `${formData.get('description')}`,
        category: `${formData.get('category')}`,
        author: `${formData.get('author')}`,
        image:`${imageUrl}`,
        authorImage:`${formData.get('authorImage')}`
    }
    //we will use this blogdata to store in db

    await BlogModel.create(blogData)
    console.log("Blog Saved!")



    return NextResponse.json({success:true,msg:"Blog Added!"});
}