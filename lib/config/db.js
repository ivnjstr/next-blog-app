// import mongoose from "mongoose";


// export const connectDB = async () => {
//     // in this function we will set up the connection to the database using mongoose

//     await mongoose.connect('mongodb+srv://ivanjesterechon:ivan0427@cluster0.8ejhozs.mongodb.net/?appName=Cluster0')
//     console.log('Connected to MongoDB');
// }

//after that we well export the connectDB function so that we can use it in other parts of our application using export statement


import mongoose from "mongoose";

// Cache the connection (and in-flight connection promise) on the global object.
// Without this, dev hot-reloads / serverless invocations can each try to open
// their own connection, which is what caused the "buffering timed out" errors.
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI)
            .then((mongooseInstance) => {
                console.log('Connected to MongoDB');
                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;
                console.error('MongoDB connection error:', error);
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}