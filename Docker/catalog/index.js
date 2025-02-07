const express = require("express");

const app = express();
const PORT = process.env.PORT || 8082;


const catalog = [
  { id: 1, name: "Laptop", price: 2400 },
  { id: 2, name: "Mouse", price: 2545 },
  { id: 3, name: "Keyboard", price: 5000 },
];


app.get("/", (req, res) => {
  res.send("Welcome to the Catalog Service!");
});

app.get("/catalog", (req, res) => {
  res.json(catalog);
});

app.get("/catalog/:id", (req, res) => {
  const product = catalog.find((p) => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).send("Product not found");
});


app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});
