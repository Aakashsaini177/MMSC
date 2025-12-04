import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, default: "My Company" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    gstin: { type: String, default: "" },
    pan: { type: String, default: "" },
    bankDetails: {
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
      branch: { type: String, default: "" },
    },
    termsAndConditions: {
      type: [String],
      default: [
        "Goods once sold will not be taken back.",
        "Interest @ 18% p.a. if not paid by due date.",
        "Subject to Local Jurisdiction.",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
