import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined to be unique if needed, though usually SKU should be present
    trim: true,
  },
  hsn: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    default: "pcs",
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
