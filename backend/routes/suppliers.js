import express from "express";
import Supplier from "../models/Supplier.js";
import Purchase from "../models/Purchase.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const saved = await newSupplier.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ error: "Failed to create supplier" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Failed to update supplier" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted successfully" });
  } catch {
    res.status(400).json({ error: "Failed to delete supplier" });
  }
});

// @desc    Get Supplier Ledger (Purchase History)
// @route   GET /api/suppliers/:id/ledger
router.get("/:id/ledger", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    // Find purchases for this supplier
    const purchases = await Purchase.find({ supplier: req.params.id }).sort({
      purchaseDate: -1,
    });

    const ledger = purchases.map((purchase) => ({
      date: purchase.purchaseDate,
      description: `Invoice #${purchase.invoiceNumber || "N/A"}`,
      credit: purchase.totalAmount, // Amount we owe (Credit in supplier's books, but typically we view it as Payable)
      // Actually, in our books:
      // Purchase = Credit (We owe money) -> Wait, standard accounting:
      // Supplier Account: Credit increases balance (we owe more). Debit decreases balance (we paid).
      // So Purchase = Credit, Payment = Debit.
      // Let's stick to Credit/Debit terminology or just "PurchaseAmount" / "PaidAmount".
      // For consistency with Client Ledger (Debit=Sale, Credit=Paid),
      // For Supplier: Credit=Purchase, Debit=Paid.
      debit: purchase.paidAmount,
      balance: purchase.pendingAmount,
    }));

    // Calculate total pending
    const totalPending = purchases.reduce(
      (acc, p) => acc + (p.pendingAmount || 0),
      0
    );

    res.json({ supplier, ledger, totalPending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
