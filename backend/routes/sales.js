// backend/routes/sales.js
import express from "express";
import Sale from "../models/Sale.js";

import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";

const router = express.Router();

router.use(protect);

// Create sale
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      saleDate,
      paidAmount,
      discount,
      items = [],
      isEMI = false,
      emiDetails = null,
    } = req.body;

    // Validate and Deduct Stock
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product not found: ${item.itemName}` });
        }
        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for: ${product.name}` });
        }
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Defensive compute total server-side to ensure correctness
    const totalAmount = items.reduce((acc, it) => {
      const qty = Number(it.quantity) || 0;
      const rate = Number(it.rate) || 0;
      const tax = Number(it.taxPercent) || 0;
      const sub = qty * rate;
      const taxAmt = (sub * tax) / 100;
      return acc + sub + taxAmt;
    }, 0);

    const pendingAmount =
      totalAmount - (Number(paidAmount) || 0) - (Number(discount) || 0);

    const sale = new Sale({
      customerName,
      saleDate,
      paidAmount,
      discount,
      totalAmount,
      pendingAmount,
      items,
      isEMI,
      emiDetails,
    });

    const saved = await sale.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/sales error:", err);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    res.json(sales);
  } catch (err) {
    console.error("GET /api/sales error:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// Update sale
router.put("/:id", async (req, res) => {
  try {
    const {
      customerName,
      saleDate,
      paidAmount = 0,
      discount = 0,
      items = [],
      isEMI = false,
      emiDetails = null,
    } = req.body;

    const totalAmount = items.reduce((acc, it) => {
      const qty = Number(it.quantity) || 0;
      const rate = Number(it.rate) || 0;
      const tax = Number(it.taxPercent) || 0;
      const sub = qty * rate;
      const taxAmt = (sub * tax) / 100;
      return acc + sub + taxAmt;
    }, 0);

    const pendingAmount =
      totalAmount - (Number(paidAmount) || 0) - (Number(discount) || 0);

    const updated = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        saleDate,
        paidAmount,
        discount,
        items,
        isEMI,
        emiDetails,
        totalAmount,
        pendingAmount,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/sales/:id error:", err);
    res.status(500).json({ error: "Failed to update sale" });
  }
});

// Delete sale
router.delete("/:id", async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/sales/:id error:", err);
    res.status(500).json({ error: "Failed to delete sale" });
  }
});

// Generate Invoice PDF
router.get("/:id/invoice", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${sale._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown();

    // Company Info
    doc
      .fontSize(12)
      .text("MMSC ramser", { align: "right" })
      .text("New Delhi, Delhi, 110058, India.", { align: "right" })
      .text("GSTIN: 07AAAAA0000A1Z5", { align: "right" })
      .moveDown();

    // Customer & Sale Info
    doc
      .text(`Invoice Number: ${sale._id.slice(-6).toUpperCase()}`, 50, 150)
      .text(`Date: ${new Date(sale.saleDate).toLocaleDateString()}`, 50, 165)
      .text(`Customer: ${sale.customerName}`, 50, 180)
      .moveDown();

    // Table Header
    const tableTop = 250;
    doc.font("Helvetica-Bold");
    doc.text("Item", 50, tableTop);
    doc.text("Qty", 250, tableTop);
    doc.text("Rate", 300, tableTop);
    doc.text("Tax %", 380, tableTop);
    doc.text("Total", 450, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Items
    let y = tableTop + 25;
    doc.font("Helvetica");

    sale.items.forEach((item) => {
      const total = item.quantity * item.rate;
      doc
        .text(item.itemName, 50, y)
        .text(item.quantity.toString(), 250, y)
        .text(item.rate.toFixed(2), 300, y)
        .text(`${item.taxPercent}%`, 380, y)
        .text(total.toFixed(2), 450, y);
      y += 20;
    });

    doc.moveTo(50, y).lineTo(550, y).stroke();

    // Totals
    y += 20;
    doc.font("Helvetica-Bold");
    doc.text(`Total Amount: ${sale.totalAmount.toFixed(2)}`, 350, y);
    doc.text(`Paid Amount: ${sale.paidAmount.toFixed(2)}`, 350, y + 20);
    doc.text(`Pending Amount: ${sale.pendingAmount.toFixed(2)}`, 350, y + 40);

    // Tax Breakdown (New Section)
    y += 80;
    doc.font("Helvetica-Bold").text("Tax Breakdown", 50, y);
    y += 20;
    doc.font("Helvetica").fontSize(10);

    const taxableValue = sale.totalAmount / 1.18;
    const taxAmount = sale.totalAmount - taxableValue;

    doc.text(`Taxable Value: ${taxableValue.toFixed(2)}`, 50, y);
    doc.text(`CGST (9%): ${(taxAmount / 2).toFixed(2)}`, 200, y);
    doc.text(`SGST (9%): ${(taxAmount / 2).toFixed(2)}`, 350, y);
    doc.text(`Total Tax: ${taxAmount.toFixed(2)}`, 480, y);

    // Footer / Signature / QR Placeholder
    y += 50;
    doc.fontSize(10).text("Terms & Conditions:", 50, y);
    doc.text("1. Goods once sold will not be taken back.", 50, y + 15);
    doc.text("2. Subject to Delhi Jurisdiction.", 50, y + 30);

    // QR CODE PLACEHOLDER
    // To add a real QR code in PDF, you need to generate it as an image buffer first
    // doc.image(qrCodeBuffer, 50, y + 60, { width: 80 });
    doc.rect(50, y + 60, 80, 80).stroke();
    doc.text("Scan to Pay", 60, y + 95);

    // SIGNATURE PLACEHOLDER
    // doc.image('path/to/signature.png', 400, y + 60, { width: 100 });
    doc.text("For MMSC ramser", 400, y + 60);
    doc.text("(Authorized Signatory)", 400, y + 130);

    doc.end();
  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

export default router;
