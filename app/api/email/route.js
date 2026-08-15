//Now here we have to create a custom header function
//Connect db first

import { connectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectDB();
    const formData = await request.formData(); // using this whatever we are sending in this formdata will be stored om this formData variable
    const emailData = {
        //make it similar same in schema
        email: `${formData.get('email')}` //field name is 'email' > whene we are sending the email in formData we have to send it using the fieldname called email
    }
    //after creating this emailData we have to save this email data in db

    await EmailModel.create(emailData);
    return NextResponse.json({ success: true, msg: "Email Subscribed!" })
}

// GET
export async function GET(request) {
    //find all the email in db and send it as reposnse
    await connectDB();
    const emails = await EmailModel.find({});
    return NextResponse.json({ emails });
}

//DELETE

export async function DELETE(request) {
    await connectDB();
    //in this request we will pass the mongo id form the admin panel
    const id = await request.nextUrl.searchParams.get("id");
    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, msg: "Email Deleted!" })
}