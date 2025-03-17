//this is our api for frontend


import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json()); //middleware to parse the json data

app.use("/api/auth", authRoutes);


app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
})