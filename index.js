import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import mockApiRoutes from "./src/routes/mockApiRoutes.js";
import { errorHandler } from "./src/middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mock", mockApiRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Mock API Server is running");
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Uncomment for debugging
});

