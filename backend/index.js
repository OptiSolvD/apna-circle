import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads/"));
app.use(postRoutes);
app.use(userRoutes);



const start = async ()=>{
    const connectDB= await mongoose.connect("mongodb+srv://rajkaushik103_db_user:OA3fbV7vUW2MTNgI@apna-circle.ligdqbu.mongodb.net/?appName=apna-circle");
    app.listen(8000 ,()=>{
        console.log("server is runnig at port 8000")
    });

};

start();
