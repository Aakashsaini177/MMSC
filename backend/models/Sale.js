// backend/models/Sale.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Optional if selecting from DB
  itemName: { type: String, required: true }, // Keep for historical record or manual entry
  hsn: { type: String }, // Added for GST Reporting
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
  taxPercent: { type: Number, default: 18 },
});

const emiSchema = new mongoose.Schema({
  installments: { type: Number },
  startDate: { type: Date },
  installmentAmount: { type: Number },
});

const saleSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerGSTIN: { type: String }, // For B2B
    placeOfSupply: { type: String }, // State Code or Name
    invoiceNumber: { type: String }, // Custom Invoice Number
    isReverseCharge: { type: Boolean, default: false },
    saleDate: { type: Date, required: true },
    paidAmount: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    pendingAmount: { type: Number, required: true, default: 0 },
    items: [itemSchema],
    isEMI: { type: Boolean, default: false },
    emiDetails: emiSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
