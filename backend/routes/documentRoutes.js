import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

import Document from "../models/Document.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// GET all documents
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error });
  }
});

// POST upload document
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newDoc = new Document({
      fileName: req.file.originalname,
      filePath: req.file.filename,
      size: req.file.size,
    });

    await newDoc.save();

    res.status(201).json({
      message: "File uploaded successfully",
      document: newDoc,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
});

// DELETE document
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Delete file from filesystem
    const filePath = path.join(uploadDir, doc.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting document", error });
  }
});

export default router;
