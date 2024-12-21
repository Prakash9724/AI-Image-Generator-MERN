import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connent.js";
import postRoutes from './routes/postRoutes.js'
import dallERoutes from './routes/DallERoutes.js'
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: err.message 
    });
});

app.use('/api/v1/dalle', dallERoutes);
app.use('/api/v1/post', postRoutes);

app.get("/", async (req, res) => {
  res.send("hello");
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
startServer();
