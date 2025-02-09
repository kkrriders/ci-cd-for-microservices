require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8083;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📦 Connected to Orders MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Catalog Service!");
});

app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});
