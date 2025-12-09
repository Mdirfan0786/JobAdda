import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.static("uploads"));

app.use(postRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 7870;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "jobadda",
    });
    console.log("MongoDB connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  } catch (err) {
    console.log("failed to start server!", err.message);
    process.exit(1);
  }
};

start();
