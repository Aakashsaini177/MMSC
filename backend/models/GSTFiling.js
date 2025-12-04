// backend/models/GstFiling.js
import mongoose from "mongoose";

const gstFilingSchema = new mongoose.Schema({
  period: { type: String, required: true }, // e.g. "10-2025" or "Oct-2025"
  month: { type: Number, required: true },   // 1..12 (useful for queries)
  year: { type: Number, required: true },
  state: { type: String, default: "Rajasthan" },
  city: { type: String, default: "Ajmer" },

  totalSales: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },

  cgstCollected: { type: Number, default: 0 },
  sgstCollected: { type: Number, default: 0 },
  igstCollected: { type: Number, default: 0 },

  cgstPaid: { type: Number, default: 0 },
  sgstPaid: { type: Number, default: 0 },
  igstPaid: { type: Number, default: 0 },

  gstPayable: { type: Number, default: 0 }, // (collected - paid)
  status: { type: String, enum: ["Pending", "Filed"], default: "Pending" },
  filingDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("GstFiling", gstFilingSchema);
