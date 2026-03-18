// here we will create the schema for our blog data and schema
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    //in this schema we will define the fields for our blog data and their types
    // we will not created the id field because mongoose will automatically create it for us and we can use it to identify each blog post uniquely in the database
    title:{
        type:String,
        required:true
        //if false then it will throw an error the blog post not created
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    authorImage:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
        //using default we can set the default value for the date field to the current date and time when the blog post is created
    }

})

//now create a modal for our blog data and export it

const BlogModal = mongoose.models.blog || mongoose.model('blog', Schema)
//here we have problem whenever we run this project in that case it will try to create a modal again to solve add mongoose.models.blog ||
// using this mongoose.models.blog || so if the blog modal is available in the mongo db it will us that modal thatb will assign in this variable BlogModal
// if the blog modal is not available in the mongo db it will create a new modal using the schema and assign it to this variable BlogModal
// now export this BlogModal to use it in our api routes to perform CRUD operations on our blog data in the mongo db

export default BlogModal