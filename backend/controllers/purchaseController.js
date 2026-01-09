import Purchase from "../models/Purchase.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";

// @desc    Create Purchase
// @route   POST /api/purchases
// @access  Private
export const createPurchase = async (req, res) => {
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
      } else if (item.itemName) {
        // Handle manual items (no ID)
        // Check if product exists by name (case-insensitive)
        let product = await Product.findOne({
          name: { $regex: new RegExp(`^${item.itemName}$`, "i") },
        });

        if (product) {
          // Product exists, update stock and link ID
          product.stock += Number(item.quantity);
          await product.save();
          item.productId = product._id;
        } else {
          // Create new product
          product = new Product({
            name: item.itemName,
            stock: Number(item.quantity),
            price: Number(item.rate), // Use purchase rate as initial selling price
            description: item.description || "Auto-created from Purchase",
            unit: "pcs",
          });
          await product.save();
          item.productId = product._id;
        }
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
};

// @desc    Fetch All Purchases
// @route   GET /api/purchases
// @access  Private
export const getPurchases = async (req, res) => {
  try {
    const { supplier, startDate, endDate } = req.query;
    let query = {};

    if (supplier) {
      query.supplier = supplier;
    }

    if (startDate && endDate) {
      query.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const purchases = await Purchase.find(query)
      .populate("supplier")
      .sort({ purchaseDate: -1 })
      .lean();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

// @desc    Update Purchase
// @route   PUT /api/purchases/:id
// @access  Private
export const updatePurchase = async (req, res) => {
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
};

// @desc    Delete Purchase
// @route   DELETE /api/purchases/:id
// @access  Private
export const deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};
