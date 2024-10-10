import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/Products.js";
import bookingRoutes from "./routes/Bookings.js";
import dotenv from "dotenv";

// Initialize the app
const app = express();

// Set the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Load environment variables
dotenv.config();

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Your service is live");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes); // Products API routes
app.use("/api/bookings", bookingRoutes); // Bookings API routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
