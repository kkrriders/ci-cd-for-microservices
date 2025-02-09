require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📦 Connected to catalog MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Catalog Schema
const catalogSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String
  },
  { collection: "catalog_db" } 
);

const Catalog = mongoose.model("Catalog", catalogSchema);

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the Catalog Service!");
});


app.get("/catalog", async (req, res) => {
  try {
    const items = await Catalog.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch catalog items" });
  }
});


app.post("/catalog", async (req, res) => {
  try {
    const newItem = new Catalog(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

app.listen(PORT, () => {
  console.log(`📦 Catalog Service running on port ${PORT}`);
});
