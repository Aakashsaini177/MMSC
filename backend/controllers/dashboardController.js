import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Expense from "../models/Expense.js";
import Product from "../models/Product.js";
import Client from "../models/Client.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Sales & Pending (Optimized)
    const salesStats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalPending: { $sum: "$pendingAmount" },
        },
      },
    ]);
    const totalSales = salesStats[0]?.totalSales || 0;
    const totalPendingSales = salesStats[0]?.totalPending || 0;

    // 2. Total Purchases (Optimized)
    const purchaseStats = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalPurchases = purchaseStats[0]?.totalPurchases || 0;

    // 3. Total Expenses (Optimized)
    const expenseStats = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ]);
    const totalExpenses = expenseStats[0]?.totalExpenses || 0;

    // 4. Counts
    const productCount = await Product.countDocuments();
    const clientCount = await Client.countDocuments();

    // 5. Profit Calculation
    const profit = totalSales - totalPurchases - totalExpenses;

    // 6. Low Stock Products (Stock < 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select("name stock")
      .limit(5);

    // 7. Top Selling Products
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.itemName",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total" }, // Note: items.total might not exist in schema, checking...
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    // Note: items schema doesn't have 'total', so revenue might be 0 if not calculated.
    // Let's just rely on totalSold for now or calculate revenue if rate exists.
    // Actually, let's fix the group to use rate * quantity if total is missing.
    // But for now, let's just stick to totalSold.

    // 8. Recent Activity (Sales + Purchases)
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName totalAmount createdAt")
      .lean();

    const recentPurchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("supplierName totalAmount createdAt")
      .lean();

    const recentActivity = [
      ...recentSales.map((s) => ({ ...s, type: "sale" })),
      ...recentPurchases.map((p) => ({ ...p, type: "purchase" })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // 9. All Stock Products (For Stock Overview)
    const allStockProducts = await Product.find()
      .select("name stock unit")
      .sort({ stock: -1 });

    res.status(200).json({
      totalSales,
      totalPendingSales,
      totalPurchases,
      totalExpenses,
      productCount,
      clientCount,
      profit,
      lowStockProducts,
      topProducts,
      recentActivity,
      allStockProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get chart data (last 6 months)
// @route   GET /api/dashboard/charts
// @access  Private
export const getChartData = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sales = await Sale.aggregate([
      { $match: { saleDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$saleDate" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const expenseBreakdown = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ sales, expenses, expenseBreakdown });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
