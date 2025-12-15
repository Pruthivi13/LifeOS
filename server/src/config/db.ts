import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        console.error('---------------------------------------------------');
        console.error('⚠️  MongoDB Connection Failed!');
        console.error('Please check your .env file in the server directory.');
        console.error('Make sure MONGO_URI is set to your actual MongoDB connection string.');
        console.error('Example: mongodb+srv://<user>:<password>@cluster.mongodb.net/lifeos');
        console.error('---------------------------------------------------');
        // process.exit(1); // Do not exit, keep server running for other features if any
    }
};

export default connectDB;
