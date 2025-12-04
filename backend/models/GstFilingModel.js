import mongoose from "mongoose";

const gstFilingSchema = new mongoose.Schema(
  {
    period: { type: String, required: true }, // e.g., "02-2025"
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    state: { type: String, default: "Rajasthan" },
    city: { type: String, default: "Ajmer" },

    // Sales (Output Tax)
    totalSales: { type: Number, default: 0 },
    cgstCollected: { type: Number, default: 0 },
    sgstCollected: { type: Number, default: 0 },
    igstCollected: { type: Number, default: 0 },

    // Purchases (Input Tax Credit)
    totalPurchases: { type: Number, default: 0 },
    cgstPaid: { type: Number, default: 0 },
    sgstPaid: { type: Number, default: 0 },
    igstPaid: { type: Number, default: 0 },

    // Net Payable
    gstPayable: { type: Number, default: 0 },

    status: { type: String, enum: ["Pending", "Filed"], default: "Pending" },
    filingDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("GstFiling", gstFilingSchema);
