db = db.getSiblingDB("Services_db");  // Switch to the correct database

// Add error handling
try {
    db.catalog_db.insertMany(require("/docker-entrypoint-initdb.d/catalog.json"));
    print("✅ Successfully imported catalog.json");
} catch (e) {
    print("❌ Error importing catalog.json:", e);
}

try {
    db.orders_db.insertMany(require("/docker-entrypoint-initdb.d/orders.json"));
    print("✅ Successfully imported orders.json");
} catch (e) {
    print("❌ Error importing orders.json:", e);
}

print("Database initialization completed!");
