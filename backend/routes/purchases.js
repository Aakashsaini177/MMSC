import express from "express";
import Purchase from "../models/Purchase.js";
import Supplier from "../models/Supplier.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.use(protect);

// ✅ Create Purchase
router.post("/", async (req, res) => {
  try {
    const { supplier, items, paidAmount, purchaseDate } = req.body;
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists)
      return res.status(400).json({ message: "Supplier not found" });

    // Validate and Add Stock
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product not found: ${item.itemName}` });
        }
        product.stock += Number(item.quantity);
        await product.save();
      }
    }

    let totalAmount = 0;
    items.forEach((item) => {
      const gst = (item.rate * item.quantity * item.taxPercent) / 100;
      totalAmount += item.rate * item.quantity + gst;
    });

    const pendingAmount = totalAmount - paidAmount;
    const status = pendingAmount === 0 ? "Paid" : "Pending";

    const newPurchase = new Purchase({
      supplier,
      items,
      status,
      paidAmount,
      totalAmount,
      pendingAmount,
      purchaseDate,
    });

    const saved = await newPurchase.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

// ✅ Fetch All Purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("supplier");
    res.json(purchases);
  } catch {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// ✅ Update Purchase
router.put("/:id", async (req, res) => {
  try {
    const { supplier, items, paidAmount, purchaseDate } = req.body;
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists)
      return res.status(400).json({ message: "Supplier not found" });

    let totalAmount = 0;
    items.forEach((item) => {
      const gst = (item.rate * item.quantity * item.taxPercent) / 100;
      totalAmount += item.rate * item.quantity + gst;
    });

    const pendingAmount = totalAmount - paidAmount;
    const status = pendingAmount === 0 ? "Paid" : "Pending";

    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        supplier,
        items,
        status,
        paidAmount,
        totalAmount,
        pendingAmount,
        purchaseDate,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

// ✅ Delete Purchase
router.delete("/:id", async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete purchase" });
  }
});

export default router;
