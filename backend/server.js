import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

/* ===== CORS ===== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.static("uploads"));

/* ===== ROUTES ===== */
app.use(postRoutes);
app.use(userRoutes);

/* ===== SERVER ===== */
const PORT = process.env.PORT || 7870;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "jobadda",
    });

    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
};

start();
