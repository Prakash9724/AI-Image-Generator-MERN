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
    console.log('Connecting to MongoDB...');
    await connectDB(process.env.MONGODB_URL);
    
    app.listen(8080, () => {
      console.log("Server has started on port 8080");
      console.log("MongoDB URL:", process.env.MONGODB_URL);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();