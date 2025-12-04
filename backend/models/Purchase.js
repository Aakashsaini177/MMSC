import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  itemName: { type: String, required: true },
  description: { type: String },
  hsn: { type: String },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxPercent: { type: Number, required: true },
});

const purchaseSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  items: [itemSchema],
  invoiceNumber: { type: String },
  supplierGSTIN: { type: String },
  itcEligible: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
  paidAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  pendingAmount: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});

export default mongoose.model("Purchase", purchaseSchema);
