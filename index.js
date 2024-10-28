import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/Products.js";
import bookingRoutes from "./routes/Bookings.js";
import dotenv from "dotenv";
import stripe from "stripe"; // Import Stripe
import Product from "./models/Product.js";

// Initialize the app
const app = express();

// Load environment variables
dotenv.config();

// Set the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Your service is live");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY);

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.items;

    const lineItems = await Promise.all(
      items.map(async (item) => {
        const storeItem = await Product.findById(item.id);

        if (!storeItem) {
          throw new Error(`Item with ID ${item.id} not found`);
        }
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: Math.round(storeItem.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Error creating checkout session:", e);
    res.status(500).json({ error: e.message });
  }
});

// Routes
app.use("/api/products", productRoutes); // Products API routes
app.use("/api/bookings", bookingRoutes); // Bookings API routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
