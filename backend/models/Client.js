import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gstNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
