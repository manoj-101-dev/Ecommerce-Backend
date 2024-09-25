import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// POST route to create a new product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, quantity, imageUrl } = req.body;

    if (
      !name ||
      !category ||
      !price ||
      !description ||
      !quantity ||
      !imageUrl
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      description,
      quantity,
      imageUrl,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const query = category ? { category } : {};

    const products = await Product.find(query); // Fetch products based on the query
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
