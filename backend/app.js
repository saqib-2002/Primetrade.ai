import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
dotenv.config();

import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // replace with your frontend URL
    credentials: true, // allowing cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// routes
app.use("/api/auth", authRoutes); // authRoutes
app.use("/api/tasks", taskRoutes); // tasksRoutes

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
