import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: Number,
    required: false,
  },
});

export default mongoose.model("Document", documentSchema);
