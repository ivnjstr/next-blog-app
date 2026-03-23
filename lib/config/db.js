// import mongoose from "mongoose";


// export const connectDB = async () => {
//     // in this function we will set up the connection to the database using mongoose

//     await mongoose.connect('mongodb+srv://ivanjesterechon:ivan0427@cluster0.8ejhozs.mongodb.net/?appName=Cluster0')
//     console.log('Connected to MongoDB');
// }

//after that we well export the connectDB function so that we can use it in other parts of our application using export statement


import mongoose from "mongoose";

export const connectDB = async () => {
    // This looks for the variable in your .env file or Vercel settings
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}