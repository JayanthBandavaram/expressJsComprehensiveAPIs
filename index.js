import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import AppError from "./utils/appError.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Main API Route
app.use("/api", userRoutes);

// Route Not Found
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
