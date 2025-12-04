// backend/routes/gstFilingRoutes.js
import express from "express";
import GstFiling from "../models/GstFiling.js";
import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// Helper: compute total & gst amounts from a sale/purchase document.
// This tries to use an existing gstAmount on the document (if present).
// Otherwise it computes from items: sum(item.rate * item.quantity) and item-level taxPercent.
function computeTotalsFromDoc(doc, type = "sale") {
  // doc may have: totalAmount or items[] with rate, quantity, taxPercent, and maybe gstAmount
  let total = 0;
  let gstTotal = 0;

  // Prefer explicit fields if available
  if (typeof doc.totalAmount === "number") total = doc.totalAmount;
  if (typeof doc.gstAmount === "number") gstTotal = doc.gstAmount;

  // If items exist, use them to compute amounts (and override if more accurate)
  if (Array.isArray(doc.items) && doc.items.length > 0) {
    let t = 0;
    let g = 0;
    doc.items.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const taxPercent = Number(item.taxPercent) || 0;
      t += rate * qty;
      g += (rate * qty * taxPercent) / 100;
    });
    // If totalAmount was not present, set it from items; otherwise keep explicit totalAmount
    if (!total || total === 0) total = t + g; // include tax in total
    // If gstAmount not present, use computed
    if (!gstTotal || gstTotal === 0) gstTotal = g;
  }

  // Safety: ensure numeric
  total = Number(total || 0);
  gstTotal = Number(gstTotal || 0);

  return { total, gstTotal };
}

// POST /api/gstfilings/calculate
// body: { month: <1..12>, year: <yyyy> }
router.post("/calculate", async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) return res.status(400).json({ message: "month and year required" });

    // build date range
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59); // last day of month

    // fetch sales and purchases in the month (uses saleDate / purchaseDate fields)
    const sales = await Sale.find({
      saleDate: { $gte: start, $lte: end }
    }).lean();

    const purchases = await Purchase.find({
      purchaseDate: { $gte: start, $lte: end }
    }).lean();

    // accumulate totals and CGST/SGST/IGST based on states
    let totalSales = 0;
    let totalPurchases = 0;

    let cgstCollected = 0, sgstCollected = 0, igstCollected = 0;
    let cgstPaid = 0, sgstPaid = 0, igstPaid = 0;

    // Helper to get doc state: try explicit fields otherwise fallback to Rajasthan
    const getSaleState = (s) => s.customerState || (s.customer && s.customer.state) || "Rajasthan";
    const getPurchaseState = (p) => p.supplierState || (p.supplier && p.supplier.state) || "Rajasthan";

    // Process sales
    for (const s of sales) {
      const { total, gstTotal } = computeTotalsFromDoc(s, "sale");
      totalSales += total;

      const state = getSaleState(s);
      if (state && state.toLowerCase() === "rajasthan") {
        // intra-state -> split between CGST & SGST (half-half)
        cgstCollected += gstTotal / 2;
        sgstCollected += gstTotal / 2;
      } else {
        // inter-state -> IGST
        igstCollected += gstTotal;
      }
    }

    // Process purchases
    for (const p of purchases) {
      const { total, gstTotal } = computeTotalsFromDoc(p, "purchase");
      totalPurchases += total;

      const state = getPurchaseState(p);
      if (state && state.toLowerCase() === "rajasthan") {
        cgstPaid += gstTotal / 2;
        sgstPaid += gstTotal / 2;
      } else {
        igstPaid += gstTotal;
      }
    }

    // Round numbers to 2 decimals
    const round = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

    const gstPayable = round((cgstCollected + sgstCollected + igstCollected) - (cgstPaid + sgstPaid + igstPaid));

    // create period string
    const periodStr = `${String(month).padStart(2, "0")}-${year}`;

    const filing = new GstFiling({
      period: periodStr,
      month,
      year,
      state: "Rajasthan",
      city: "Ajmer",
      totalSales: round(totalSales),
      totalPurchases: round(totalPurchases),
      cgstCollected: round(cgstCollected),
      sgstCollected: round(sgstCollected),
      igstCollected: round(igstCollected),
      cgstPaid: round(cgstPaid),
      sgstPaid: round(sgstPaid),
      igstPaid: round(igstPaid),
      gstPayable,
      status: gstPayable <= 0 ? "Filed" : "Pending", // optional auto-mark logic
    });

    await filing.save();

    res.status(200).json({ message: "GST calculated and saved", filing });
  } catch (error) {
    console.error("GST calculate error:", error);
    res.status(500).json({ message: "Error calculating GST", error: error.message || error });
  }
});

// GET /api/gstfilings  - list filings
router.get("/", async (req, res) => {
  try {
    const filings = await GstFiling.find().sort({ year: -1, month: -1 });
    res.json(filings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching filings", error: err.message || err });
  }
});

// PUT /api/gstfilings/:id/mark-filed
router.put("/:id/mark-filed", async (req, res) => {
  try {
    const updated = await GstFiling.findByIdAndUpdate(req.params.id, { status: "Filed", filingDate: new Date() }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating filing", error: err.message || err });
  }
});

export default router;
