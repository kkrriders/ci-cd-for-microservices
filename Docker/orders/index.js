const express = require("express");

const app = express();
const PORT = process.env.PORT || 8083; // Use environment variable for flexibility

app.use(express.json());

// Sample orders data
const orders = [
  { id: 1, user: "John Doe", product: "Laptop", quantity: 1 },
  { id: 2, user: "Jane Doe", product: "Mouse", quantity: 2 }
];

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Orders Service!");
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  order ? res.json(order) : res.status(404).send("Order not found");
});

// Start the service
app.listen(PORT, () => {
  console.log(`Orders Service running on port ${PORT}`);
});
