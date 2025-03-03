const mongoose = require("mongoose");

// Define the order item schema
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Reference to the Product model
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
});

// Create the OrderItem model
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
