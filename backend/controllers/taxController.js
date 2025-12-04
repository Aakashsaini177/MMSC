import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Expense from "../models/Expense.js";
import Product from "../models/Product.js";

// @desc    Get Income Tax Summary (Profit, Presumptive, Normal, Balance Sheet)
// @route   GET /api/tax/income-tax
export const getIncomeTaxSummary = async (req, res) => {
  const { year } = req.query; // Financial Year (e.g., 2025 for FY 24-25)
  // Define FY dates: April 1st of (year-1) to March 31st of (year)
  // Example: If year=2025, FY is 2024-2025 (1 Apr 2024 - 31 Mar 2025)

  // Default to current FY if not provided
  const currentYear = year || new Date().getFullYear();
  const startDate = new Date(currentYear - 1, 3, 1); // 1st April
  const endDate = new Date(currentYear, 2, 31, 23, 59, 59); // 31st March

  try {
    const sales = await Sale.find({
      saleDate: { $gte: startDate, $lte: endDate },
    });
    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate, $lte: endDate },
    });
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    });
    const products = await Product.find(); // For closing stock

    // 1. Business Profit Calculation
    const totalRevenue = sales.reduce(
      (acc, s) => acc + (s.totalAmount || 0),
      0
    );
    const totalPurchases = purchases.reduce(
      (acc, p) => acc + (p.totalAmount || 0),
      0
    );
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    // Simple COGS approximation: Opening Stock + Purchases - Closing Stock
    // For now, assuming Purchases as Direct Expenses and Expenses as Indirect
    const netProfit = totalRevenue - totalPurchases - totalExpenses;

    // 2. Presumptive Tax Calculation
    // 44AD: 6% for digital (assuming all digital for simplicity or 8% mixed)
    // Let's show both or an average. Assuming 8% for conservative estimate.
    const presumptive44AD = {
      turnover: totalRevenue,
      taxableIncome6Percent: totalRevenue * 0.06,
      taxableIncome8Percent: totalRevenue * 0.08,
    };

    // 44ADA: 50% of turnover (for professionals)
    const presumptive44ADA = {
      turnover: totalRevenue,
      taxableIncome: totalRevenue * 0.5,
    };

    // 3. Normal Tax Calculation (Simplified Slabs for Individuals < 60)
    // Old Regime (approx): 0-2.5L: 0%, 2.5-5L: 5%, 5-10L: 20%, >10L: 30%
    // New Regime (approx): 0-3L: 0%, 3-6L: 5%, 6-9L: 10%, 9-12L: 15%, 12-15L: 20%, >15L: 30%
    // Using New Regime for calculation
    let taxableIncome = Math.max(0, netProfit);
    let normalTax = 0;

    if (taxableIncome > 300000) {
      // 3L - 6L @ 5%
      const slab1 = Math.min(taxableIncome, 600000) - 300000;
      normalTax += slab1 * 0.05;
    }
    if (taxableIncome > 600000) {
      // 6L - 9L @ 10%
      const slab2 = Math.min(taxableIncome, 900000) - 600000;
      normalTax += slab2 * 0.1;
    }
    if (taxableIncome > 900000) {
      // 9L - 12L @ 15%
      const slab3 = Math.min(taxableIncome, 1200000) - 900000;
      normalTax += slab3 * 0.15;
    }
    if (taxableIncome > 1200000) {
      // 12L - 15L @ 20%
      const slab4 = Math.min(taxableIncome, 1500000) - 1200000;
      normalTax += slab4 * 0.2;
    }
    if (taxableIncome > 1500000) {
      // > 15L @ 30%
      const slab5 = taxableIncome - 1500000;
      normalTax += slab5 * 0.3;
    }

    // 4. Balance Sheet Summary
    // Assets
    const closingStockValue = products.reduce(
      (acc, p) => acc + p.stock * p.price,
      0
    );
    const debtors = sales.reduce((acc, s) => acc + (s.pendingAmount || 0), 0);
    const cashInHand = totalRevenue - debtors - totalExpenses; // Very rough approximation

    // Liabilities
    const creditors = purchases.reduce(
      (acc, p) => acc + (p.pendingAmount || 0),
      0
    );
    // Capital Account = Assets - Liabilities (Accounting Equation)
    const totalAssets = closingStockValue + debtors + Math.max(0, cashInHand);
    const capitalAccount = totalAssets - creditors;

    res.json({
      period: `FY ${currentYear - 1}-${currentYear}`,
      profitAndLoss: {
        revenue: totalRevenue,
        purchases: totalPurchases,
        expenses: totalExpenses,
        netProfit: netProfit,
      },
      presumptiveTax: {
        section44AD: presumptive44AD,
        section44ADA: presumptive44ADA,
      },
      normalTax: {
        taxableIncome: taxableIncome,
        taxPayable: normalTax,
      },
      balanceSheet: {
        assets: {
          closingStock: closingStockValue,
          debtors: debtors,
          cashBank: Math.max(0, cashInHand),
          total: totalAssets,
        },
        liabilities: {
          creditors: creditors,
          capital: capitalAccount,
          total: creditors + capitalAccount,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating Income Tax Summary" });
  }
};
