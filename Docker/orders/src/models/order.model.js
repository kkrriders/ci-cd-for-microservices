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

// Define the order schema
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Reference to the User model
        },
        items: [orderItemSchema], // Array of order items
        shippingAddress: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            zipCode: {
                type: String,
                required: true,
                match: [/^\d{5}(-\d{4})?$/, 'Invalid zip code format']
            }
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount cannot be negative']
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'CASH']
        },
        status: {
            type: String,
            default: 'PENDING',
            enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        cancelledAt: {
            type: Date
        },
        refundStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED'],
            default: 'PENDING'
        },
        refundedAt: {
            type: Date
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create indexes for better query performance
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
