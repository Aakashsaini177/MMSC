import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
import PDFDocument from "pdfkit";

// @desc    Create a new sale
// @route   POST /api/sales
export const createSale = async (req, res) => {
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

    // Defensive compute total server-side
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
};

// @desc    Get all sales
// @route   GET /api/sales
export const getSales = async (req, res) => {
  try {
    // Optimization: Use lean() and potentially limit for performance
    // For now, retaining sort by date
    const sales = await Sale.find().sort({ saleDate: -1 }).lean();
    res.json(sales);
  } catch (err) {
    console.error("GET /api/sales error:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
};

// @desc    Update a sale
// @route   PUT /api/sales/:id
export const updateSale = async (req, res) => {
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
};

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
export const deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/sales/:id error:", err);
    res.status(500).json({ error: "Failed to delete sale" });
  }
};

// @desc    Generate Invoice PDF
// @route   GET /api/sales/:id/invoice
export const generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).lean();
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const settings = await Settings.findOne().lean();
    const companyName = settings?.companyName || "MMSC Services";
    const address = settings?.address || "";
    const cityState = `${settings?.city || ""}, ${settings?.state || ""} - ${
      settings?.pincode || ""
    }`;
    const gstin = settings?.gstin || "";
    const terms = settings?.termsAndConditions || [
      "Goods once sold will not be taken back.",
      "Subject to Local Jurisdiction.",
    ];

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
    doc.fontSize(12).text(companyName, { align: "right" });
    if (address) doc.text(address, { align: "right" });
    if (cityState.trim() !== ",  -") doc.text(cityState, { align: "right" });
    if (gstin) doc.text(`GSTIN: ${gstin}`, { align: "right" });
    doc.moveDown();

    // Customer & Sale Info
    doc
      .text(
        `Invoice Number: ${sale._id.toString().slice(-6).toUpperCase()}`,
        50,
        150
      )
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

    // Items and Tax Calculation
    let y = tableTop + 25;
    doc.font("Helvetica");

    let totalTaxable = 0;
    let totalTaxAmount = 0;

    sale.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const taxPercent = Number(item.taxPercent) || 0;

      const subTotal = qty * rate;
      const tax = (subTotal * taxPercent) / 100;
      const total = subTotal + tax;

      totalTaxable += subTotal;
      totalTaxAmount += tax;

      doc
        .text(item.itemName, 50, y)
        .text(qty.toString(), 250, y)
        .text(rate.toFixed(2), 300, y)
        .text(`${taxPercent}%`, 380, y)
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

    // Tax Breakdown (Calculated correctly from items)
    y += 80;
    doc.font("Helvetica-Bold").text("Tax Breakdown", 50, y);
    y += 20;
    doc.font("Helvetica").fontSize(10);

    doc.text(`Taxable Value: ${totalTaxable.toFixed(2)}`, 50, y);
    // Assuming intra-state (CGST+SGST) for simplicity, or 50/50 split of total tax
    // To be perfectly accurate we need Place of Supply, but for now 50/50 is the assumed default
    doc.text(`CGST: ${(totalTaxAmount / 2).toFixed(2)}`, 200, y);
    doc.text(`SGST: ${(totalTaxAmount / 2).toFixed(2)}`, 350, y);
    doc.text(`Total Tax: ${totalTaxAmount.toFixed(2)}`, 480, y);

    // Footer / Terms & Conditions
    y += 50;
    doc.fontSize(10).text("Terms & Conditions:", 50, y);
    terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 50, y + 15 + index * 15);
    });

    // QR CODE PLACEHOLDER
    const qrY = y + 15 + terms.length * 15 + 20;
    doc.rect(50, qrY, 80, 80).stroke();
    doc.text("Scan to Pay", 60, qrY + 35);

    // SIGNATURE PLACEHOLDER
    doc.text(`For ${companyName}`, 400, qrY);
    doc.text("(Authorized Signatory)", 400, qrY + 70);

    doc.end();
  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
