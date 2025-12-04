import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";

// @desc    Get GSTR-1 Data (Sales)
// @route   GET /api/gst/gstr1
export const getGSTR1 = async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const sales = await Sale.find({
      saleDate: { $gte: startDate, $lte: endDate },
    });

    const b2b = [];
    const b2cLarge = [];
    const b2cSmall = [];

    sales.forEach((sale) => {
      const isB2B = !!sale.customerGSTIN;
      const isLarge = sale.totalAmount > 250000;

      const entry = {
        invoiceNumber: sale._id, // Should be sale.invoiceNumber if available
        invoiceDate: sale.saleDate,
        customerName: sale.customerName,
        gstin: sale.customerGSTIN || "",
        invoiceValue: sale.totalAmount,
        placeOfSupply: sale.placeOfSupply || "07-Delhi",
        reverseCharge: sale.isReverseCharge ? "Yes" : "No",
        items: sale.items,
        taxableValue: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
      };

      // Calculate Tax Breakdown
      sale.items.forEach((item) => {
        const taxable = item.quantity * item.rate;
        const taxAmount = (taxable * item.taxPercent) / 100;

        entry.taxableValue += taxable;

        // Simple logic: If Place of Supply is different state -> IGST, else CGST+SGST
        // Assuming default state is Delhi (07)
        if (entry.placeOfSupply.startsWith("07")) {
          entry.cgst += taxAmount / 2;
          entry.sgst += taxAmount / 2;
        } else {
          entry.igst += taxAmount;
        }
      });

      if (isB2B) {
        b2b.push(entry);
      } else if (isLarge) {
        b2cLarge.push(entry);
      } else {
        b2cSmall.push(entry); // Usually aggregated by state, but listing for now
      }
    });

    res.json({ b2b, b2cLarge, b2cSmall });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching GSTR-1 data" });
  }
};

// @desc    Get GSTR-2 Data (Purchases)
// @route   GET /api/gst/gstr2
export const getGSTR2 = async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate, $lte: endDate },
    }).populate("supplier", "name gstNumber");

    const b2b = purchases.map((p) => {
      let taxable = 0;
      let igst = 0;
      let cgst = 0;
      let sgst = 0;

      p.items.forEach((item) => {
        const sub = item.quantity * item.rate;
        const tax = (sub * item.taxPercent) / 100;
        taxable += sub;
        // Assuming local purchase for simplicity unless supplier has state code
        cgst += tax / 2;
        sgst += tax / 2;
      });

      return {
        supplierName: p.supplier?.name,
        gstin: p.supplier?.gstNumber || p.supplierGSTIN,
        invoiceNumber: p.invoiceNumber || p._id,
        date: p.purchaseDate,
        taxableValue: taxable,
        igst,
        cgst,
        sgst,
        itcEligible: p.itcEligible ? "Yes" : "No",
      };
    });

    res.json({ b2b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching GSTR-2 data" });
  }
};

// @desc    Get GSTR-3B Summary
// @route   GET /api/gst/gstr3b
export const getGSTR3B = async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const sales = await Sale.find({
      saleDate: { $gte: startDate, $lte: endDate },
    });
    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate, $lte: endDate },
    });

    let outwardTax = { taxable: 0, igst: 0, cgst: 0, sgst: 0 };
    let itc = { taxable: 0, igst: 0, cgst: 0, sgst: 0 };

    sales.forEach((s) => {
      s.items.forEach((i) => {
        const sub = i.quantity * i.rate;
        const tax = (sub * i.taxPercent) / 100;
        outwardTax.taxable += sub;
        // Logic for state check needed here, using simplified assumption
        if ((s.placeOfSupply || "07").startsWith("07")) {
          outwardTax.cgst += tax / 2;
          outwardTax.sgst += tax / 2;
        } else {
          outwardTax.igst += tax;
        }
      });
    });

    purchases.forEach((p) => {
      if (p.itcEligible) {
        p.items.forEach((i) => {
          const sub = i.quantity * i.rate;
          const tax = (sub * i.taxPercent) / 100;
          itc.taxable += sub;
          itc.cgst += tax / 2;
          itc.sgst += tax / 2;
        });
      }
    });

    const payable = {
      igst: Math.max(0, outwardTax.igst - itc.igst),
      cgst: Math.max(0, outwardTax.cgst - itc.cgst),
      sgst: Math.max(0, outwardTax.sgst - itc.sgst),
    };

    res.json({ outwardTax, itc, payable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching GSTR-3B data" });
  }
};

// @desc    Get HSN Summary
// @route   GET /api/gst/hsn
export const getHSNSummary = async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const sales = await Sale.find({
      saleDate: { $gte: startDate, $lte: endDate },
    });

    const hsnMap = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const hsn = item.hsn || "Unknown";
        if (!hsnMap[hsn]) {
          hsnMap[hsn] = {
            hsn,
            description: item.itemName, // Taking first item name as desc
            uqc: "PCS", // Default
            totalQty: 0,
            totalValue: 0,
            taxableValue: 0,
            igst: 0,
            cgst: 0,
            sgst: 0,
            cess: 0,
          };
        }

        const taxable = item.quantity * item.rate;
        const taxAmount = (taxable * item.taxPercent) / 100;

        hsnMap[hsn].totalQty += item.quantity;
        hsnMap[hsn].taxableValue += taxable;
        hsnMap[hsn].totalValue += taxable + taxAmount;

        if ((sale.placeOfSupply || "07").startsWith("07")) {
          hsnMap[hsn].cgst += taxAmount / 2;
          hsnMap[hsn].sgst += taxAmount / 2;
        } else {
          hsnMap[hsn].igst += taxAmount;
        }
      });
    });

    res.json(Object.values(hsnMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching HSN Summary" });
  }
};
