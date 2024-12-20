import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connent.js";
import postRoutes from './routes/postRoutes.js'
import dallERoutes from './routes/DallERoutes.js'

dotenv.config();

const app = express();

app.use(cors());
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

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log("Server has started"));
  } catch (error) {
    console.log(error);
  }
};
startServer();
