import Client from "../models/Client.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

// @desc    Global Search
// @route   GET /api/search?q=query
// @access  Private
export const globalSearch = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const regex = new RegExp(query, "i"); // Case-insensitive regex

    // 1. Search Clients
    const clients = await Client.find({
      $or: [{ name: regex }, { email: regex }, { mobile: regex }],
    })
      .select("name email mobile")
      .limit(5)
      .lean();

    const clientResults = clients.map((client) => ({
      type: "client",
      title: client.name,
      subtitle: client.email,
      id: client._id,
      link: `/clients`, // Frontend can append ID if detail view exists
    }));

    // 2. Search Products
    const products = await Product.find({
      $or: [{ name: regex }, { sku: regex }],
    })
      .select("name sku price stock")
      .limit(5)
      .lean();

    const productResults = products.map((product) => ({
      type: "product",
      title: product.name,
      subtitle: `SKU: ${product.sku || "N/A"} | Price: ₹${product.price}`,
      stock: product.stock,
      id: product._id,
      link: `/products`,
    }));

    // 3. Search Sales (Invoices)
    const sales = await Sale.find({
      $or: [{ customerName: regex }, { invoiceNumber: regex }],
    })
      .select("customerName invoiceNumber totalAmount saleDate")
      .limit(5)
      .lean();

    const saleResults = sales.map((sale) => ({
      type: "invoice",
      title: `Inv #${sale.invoiceNumber || "N/A"}`,
      subtitle: `${sale.customerName} - ₹${sale.totalAmount}`,
      id: sale._id,
      link: `/sales`,
    }));

    const results = [...clientResults, ...productResults, ...saleResults];

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
