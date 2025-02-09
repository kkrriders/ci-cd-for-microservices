const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    item: String,
    quantity: Number
  },
  { collection: "orders_db" } // Ensuring it connects to the correct collection
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
