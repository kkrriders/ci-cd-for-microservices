const mongoose = require("mongoose");

const catalogSchema = new mongoose.Schema(
  {
    name: String,
    price: Number
  },
  { collection: "catalog_db" }
);

const Catalog = mongoose.model("Catalog", catalogSchema);

module.exports = Catalog;
