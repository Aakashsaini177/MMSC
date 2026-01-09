import GstFiling from "../models/GstFilingModel.js";
import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Settings from "../models/Settings.js";

// Helper: compute total & gst amounts from a sale/purchase document.
function computeTotalsFromDoc(doc, type = "sale") {
  let total = 0;
  let gstTotal = 0;

  if (typeof doc.totalAmount === "number") total = doc.totalAmount;
  if (typeof doc.gstAmount === "number") gstTotal = doc.gstAmount;

  if (Array.isArray(doc.items) && doc.items.length > 0) {
    let t = 0;
    let g = 0;
    doc.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const taxPercent = Number(item.taxPercent) || 0;
      t += rate * qty;
      g += (rate * qty * taxPercent) / 100;
    });
    if (!total || total === 0) total = t + g;
    if (!gstTotal || gstTotal === 0) gstTotal = g;
  }

  total = Number(total || 0);
  gstTotal = Number(gstTotal || 0);

  return { total, gstTotal };
}

// @desc    Calculate GST for a specific month/year
// @route   POST /api/gstfilings/calculate
export const calculateGSTLink = async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year)
      return res.status(400).json({ message: "month and year required" });

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59);

    const sales = await Sale.find({
      saleDate: { $gte: start, $lte: end },
    }).lean();

    const purchases = await Purchase.find({
      purchaseDate: { $gte: start, $lte: end },
    }).lean();

    let totalSales = 0;
    let totalPurchases = 0;
    let cgstCollected = 0,
      sgstCollected = 0,
      igstCollected = 0;
    let cgstPaid = 0,
      sgstPaid = 0,
      igstPaid = 0;

    // Fetch Company State dynamically
    // Settings imported at top level
    const settings = await Settings.findOne();
    const COMPANY_STATE = settings?.state || "Rajasthan";

    const getSaleState = (s) =>
      s.customerState || (s.customer && s.customer.state) || COMPANY_STATE;
    const getPurchaseState = (p) =>
      p.supplierState || (p.supplier && p.supplier.state) || COMPANY_STATE;

    for (const s of sales) {
      const { total, gstTotal } = computeTotalsFromDoc(s, "sale");
      totalSales += total;
      const state = getSaleState(s);
      if (state && state.toLowerCase() === COMPANY_STATE.toLowerCase()) {
        cgstCollected += gstTotal / 2;
        sgstCollected += gstTotal / 2;
      } else {
        igstCollected += gstTotal;
      }
    }

    for (const p of purchases) {
      const { total, gstTotal } = computeTotalsFromDoc(p, "purchase");
      totalPurchases += total;
      const state = getPurchaseState(p);
      if (state && state.toLowerCase() === COMPANY_STATE.toLowerCase()) {
        cgstPaid += gstTotal / 2;
        sgstPaid += gstTotal / 2;
      } else {
        igstPaid += gstTotal;
      }
    }

    const round = (v) => Math.round((v + Number.EPSILON) * 100) / 100;
    const gstPayable = round(
      cgstCollected +
        sgstCollected +
        igstCollected -
        (cgstPaid + sgstPaid + igstPaid)
    );

    const periodStr = `${String(month).padStart(2, "0")}-${year}`;

    // Check if filing already exists
    let filing = await GstFiling.findOne({ month, year });

    if (filing) {
      // Update existing
      filing.totalSales = round(totalSales);
      filing.totalPurchases = round(totalPurchases);
      filing.cgstCollected = round(cgstCollected);
      filing.sgstCollected = round(sgstCollected);
      filing.igstCollected = round(igstCollected);
      filing.cgstPaid = round(cgstPaid);
      filing.sgstPaid = round(sgstPaid);
      filing.igstPaid = round(igstPaid);
      filing.gstPayable = gstPayable;
      // Keep status if already Filed, otherwise update
      if (filing.status !== "Filed") {
        filing.status = gstPayable <= 0 ? "Filed" : "Pending";
      }
    } else {
      // Create new
      filing = new GstFiling({
        period: periodStr,
        month,
        year,
        state: COMPANY_STATE,
        city: "Ajmer", // Hardcoded fallback
        totalSales: round(totalSales),
        totalPurchases: round(totalPurchases),
        cgstCollected: round(cgstCollected),
        sgstCollected: round(sgstCollected),
        igstCollected: round(igstCollected),
        cgstPaid: round(cgstPaid),
        sgstPaid: round(sgstPaid),
        igstPaid: round(igstPaid),
        gstPayable,
        status: gstPayable <= 0 ? "Filed" : "Pending",
      });
    }

    await filing.save();
    res.status(200).json({ message: "GST calculated and saved", filing });
  } catch (error) {
    console.error("GST calculate error:", error);
    res
      .status(500)
      .json({ message: "Error calculating GST", error: error.message });
  }
};

// @desc    Get all filings
// @route   GET /api/gstfilings
export const getFilings = async (req, res) => {
  try {
    const filings = await GstFiling.find().sort({ year: -1, month: -1 }).lean();
    res.json(filings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching filings", error: err.message });
  }
};

// @desc    Mark filing as filed
// @route   PUT /api/gstfilings/:id/mark-filed
export const markFilingAsFiled = async (req, res) => {
  try {
    const updated = await GstFiling.findByIdAndUpdate(
      req.params.id,
      { status: "Filed", filingDate: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating filing", error: err.message });
  }
};
