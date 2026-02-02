import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.LOCAL_URL, process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.options("*", cors());

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
