// in this file we create api t o manage our blog data in the mongo db using the blog modal we created in the lib/models/BlogModal.js file and we will perform CRUD operations on our blog data in the mongo db using this api route

import { connectDB } from "@/lib/config/db";

const { NextResponse } = require("next/server");

const LoadDB = async () => {
    // we use this to connect to the database \
    await connectDB();
}

LoadDB();


//first we will check if out api are working or not
export async function GET(request) {
    await connectDB(); 
    //so whenever we will send the get req on this route this function will be ewxecuted
    console.log('GET request received on /api/blog route'); // - this printed in terminal
    return NextResponse.json({ message: 'API Working' }); // - this printed in postman
}

//then export the function to use it in our application