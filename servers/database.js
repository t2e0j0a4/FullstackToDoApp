import mongoose from "mongoose";
import env from "dotenv";

env.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery',false);

const connectToMongoDB = async ()=>{
    mongoose.connect(MONGO_URI,()=>{
        console.log('Connected to MongoDB...');
    })
}

export default connectToMongoDB;