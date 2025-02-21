require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8083;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/Services_db";

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📦 Connected to orders MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Orders Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerName: String,
    items: [{
      product: String,
      quantity: Number,
      price: Number
    }],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "orders_db" }
);

const Order = mongoose.model("Order", orderSchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Orders Service!");
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create a new order
app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.listen(PORT, () => {
  console.log(`📦 Orders Service running on port ${PORT}`);
});
