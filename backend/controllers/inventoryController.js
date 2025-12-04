import InventoryAdjustment from "../models/InventoryAdjustment.js";
import Product from "../models/Product.js";

// @desc    Add new inventory adjustment
// @route   POST /api/inventory
// @access  Private
export const addAdjustment = async (req, res) => {
  const { productId, type, quantity, reason } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product stock
    if (type === "increase") {
      product.stock += Number(quantity);
    } else if (type === "decrease") {
      if (product.stock < quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient stock for decrease" });
      }
      product.stock -= Number(quantity);
    } else {
      return res.status(400).json({ message: "Invalid adjustment type" });
    }

    await product.save();

    // Create adjustment record
    const adjustment = await InventoryAdjustment.create({
      product: productId,
      type,
      quantity,
      reason,
    });

    const populatedAdjustment = await InventoryAdjustment.findById(
      adjustment._id
    ).populate("product", "name sku");

    res.status(201).json(populatedAdjustment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all inventory adjustments
// @route   GET /api/inventory
// @access  Private
export const getAdjustments = async (req, res) => {
  try {
    const adjustments = await InventoryAdjustment.find()
      .populate("product", "name sku")
      .sort({ date: -1 });
    res.status(200).json(adjustments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
