import { query } from "express";
import mongoose from "mongoose";

const connectDB = (url) =>{
    mongoose.set('strictQuery',true);

    mongoose.connect(url)
    .then(()=> console.log("MongoDB connected successfully! 🚀"))
    .catch((err)=> console.log(err));
}

export default connectDB;