// routes/Bookings.js
import express from "express";
import Booking from "../models/Booking.js"; // Adjust the path as necessary
import { verifyToken } from "../middleware/auth.js"; // Middleware to verify token (if needed)

const router = express.Router();

// Get bookings for a specific user
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate(
      "productId"
    ); // Fetch user bookings and populate product details
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity, deliveryAddress, price, productName } = req.body;

  try {
    const newBooking = new Booking({
      userId: req.user.id, // Assuming you have the user ID from the token
      productId,
      quantity,
      deliveryAddress,
      price,
      productName,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
