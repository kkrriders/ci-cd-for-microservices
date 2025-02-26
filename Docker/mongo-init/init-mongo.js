db = db.getSiblingDB("Services_db");  // Switch to the correct database

// Create users
db.createUser({
    user: "root",
    pwd: "example",
    roles: [
        {
            role: "readWrite",
            db: "Services_db"
        }
    ]
});

// Create collections with validation
db.createCollection("products", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "price", "category", "sku", "stockQuantity"],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 2,
                    maxLength: 100
                },
                description: {
                    bsonType: "string",
                    minLength: 10,
                    maxLength: 1000
                },
                price: {
                    bsonType: "number",
                    minimum: 0
                },
                category: {
                    enum: ["Electronics", "Books", "Clothing", "Food", "Other"]
                },
                sku: {
                    bsonType: "string",
                    pattern: "^[A-Za-z0-9-]+$"
                },
                stockQuantity: {
                    bsonType: "int",
                    minimum: 0
                }
            }
        }
    }
});

// Create indexes
db.products.createIndex({ "sku": 1 }, { unique: true });
db.products.createIndex({ "name": 1 });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });

// Insert sample data
try {
    db.products.insertMany([
        {
            name: "Laptop Pro",
            description: "High-performance laptop for professionals",
            price: 1299.99,
            category: "Electronics",
            sku: "LAPTOP-PRO-001",
            stockQuantity: 50,
            imageUrl: "https://example.com/laptop.jpg"
        },
        {
            name: "Wireless Headphones",
            description: "Premium noise-cancelling headphones",
            price: 199.99,
            category: "Electronics",
            sku: "HEAD-001",
            stockQuantity: 100,
            imageUrl: "https://example.com/headphones.jpg"
        },
        {
            name: "Programming Book",
            description: "Complete guide to modern programming",
            price: 49.99,
            category: "Books",
            sku: "BOOK-PROG-001",
            stockQuantity: 75,
            imageUrl: "https://example.com/book.jpg"
        }
    ]);
    print("✅ Sample products inserted successfully");
} catch (error) {
    print("❌ Error inserting sample products:", error);
}

print("Database initialization completed!");
