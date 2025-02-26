const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: Number.isFinite,
            message: 'Price must be a valid number'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Electronics', 'Books', 'Clothing', 'Food', 'Other'],
            message: 'Invalid category selection'
        }
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        match: [/^[A-Za-z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens']
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock quantity cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Stock quantity must be a whole number'
        }
    },
    imageUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Image URL must be a valid URL'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 }, { unique: true });

// Virtual for product status
productSchema.virtual('status').get(function() {
    if (!this.isActive) return 'inactive';
    return this.stockQuantity > 0 ? 'in-stock' : 'out-of-stock';
});

// Pre-save middleware
productSchema.pre('save', function(next) {
    if (this.stockQuantity === 0) {
        this.isActive = false;
    }
    next();
});

// Instance method to check availability
productSchema.methods.checkAvailability = function(quantity) {
    return this.stockQuantity >= quantity;
};

// Static method to find by category
productSchema.statics.findByCategory = function(category) {
    return this.find({ category, isActive: true });
};

// Query middleware
productSchema.pre(/^find/, function(next) {
    // this refers to the query
    this.find({ isActive: { $ne: false } });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;