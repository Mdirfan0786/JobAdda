import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.LOCAL_URL, process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use(postRoutes);
app.use(userRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

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
