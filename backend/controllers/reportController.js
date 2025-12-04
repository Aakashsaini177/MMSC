import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Expense from "../models/Expense.js";
import ExcelJS from "exceljs";

// @desc    Get GST Report
// @route   GET /api/reports/gst
// @access  Private
export const getGSTReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const query = {};
    if (startDate && endDate) {
      query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(query);

    // Calculate Output GST (Collected)
    let outputGST = 0;
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const qty = item.quantity || 0;
        const rate = item.rate || 0;
        const tax = item.taxPercent || 0;
        const sub = qty * rate;
        outputGST += (sub * tax) / 100;
      });
    });

    // Calculate Input GST (Paid on Purchases)
    // Note: Purchase model needs to be queried similarly
    const purchaseQuery = {};
    if (startDate && endDate) {
      purchaseQuery.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const purchases = await Purchase.find(purchaseQuery);

    let inputGST = 0;
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        const qty = item.quantity || 0;
        const rate = item.rate || 0;
        const tax = item.taxPercent || 0;
        const sub = qty * rate;
        inputGST += (sub * tax) / 100;
      });
    });

    res.status(200).json({
      outputGST,
      inputGST,
      netGST: outputGST - inputGST,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get Profit & Loss Report
// @route   GET /api/reports/pnl
// @access  Private
export const getPnLReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$lte = new Date(endDate);
    }

    const sales = await Sale.find(startDate ? { saleDate: dateFilter } : {});
    const purchases = await Purchase.find(
      startDate ? { purchaseDate: dateFilter } : {}
    );
    const expenses = await Expense.find(startDate ? { date: dateFilter } : {});

    const totalSales = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const totalPurchases = purchases.reduce(
      (acc, p) => acc + (p.totalAmount || 0),
      0
    );
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    const netProfit = totalSales - totalPurchases - totalExpenses;

    res.status(200).json({
      totalSales,
      totalPurchases,
      totalExpenses,
      netProfit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Export GST Report to Excel
// @route   GET /api/reports/gst/excel
// @access  Private
export const exportGSTReportToExcel = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const query = {};
    if (startDate && endDate) {
      query.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(query);
    const purchaseQuery = {};
    if (startDate && endDate) {
      purchaseQuery.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const purchases = await Purchase.find(purchaseQuery);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("GST Report");

    worksheet.columns = [
      { header: "Type", key: "type", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Party Name", key: "party", width: 25 },
      { header: "Taxable Amount", key: "taxable", width: 15 },
      { header: "GST Amount", key: "gst", width: 15 },
      { header: "Total Amount", key: "total", width: 15 },
    ];

    // Add Sales (Output GST)
    sales.forEach((sale) => {
      let gstAmount = 0;
      let taxableAmount = 0;
      sale.items.forEach((item) => {
        const sub = (item.quantity || 0) * (item.rate || 0);
        taxableAmount += sub;
        gstAmount += (sub * (item.taxPercent || 0)) / 100;
      });

      worksheet.addRow({
        type: "Sale (Output)",
        date: new Date(sale.saleDate).toLocaleDateString(),
        party: sale.customerName,
        taxable: taxableAmount,
        gst: gstAmount,
        total: sale.totalAmount,
      });
    });

    // Add Purchases (Input GST)
    purchases.forEach((purchase) => {
      let gstAmount = 0;
      let taxableAmount = 0;
      purchase.items.forEach((item) => {
        const sub = (item.quantity || 0) * (item.rate || 0);
        taxableAmount += sub;
        gstAmount += (sub * (item.taxPercent || 0)) / 100;
      });

      worksheet.addRow({
        type: "Purchase (Input)",
        date: new Date(purchase.purchaseDate).toLocaleDateString(),
        party: purchase.supplier?.name || "Unknown",
        taxable: taxableAmount,
        gst: gstAmount,
        total: purchase.totalAmount,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=gst-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Excel Export Failed" });
  }
};

// @desc    Export P&L Report to Excel
// @route   GET /api/reports/pnl/excel
// @access  Private
export const exportPnLReportToExcel = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$lte = new Date(endDate);
    }

    const sales = await Sale.find(startDate ? { saleDate: dateFilter } : {});
    const purchases = await Purchase.find(
      startDate ? { purchaseDate: dateFilter } : {}
    );
    const expenses = await Expense.find(startDate ? { date: dateFilter } : {});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Profit & Loss");

    worksheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Description", key: "desc", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    // Income
    sales.forEach((s) => {
      worksheet.addRow({
        category: "Income (Sale)",
        desc: `Sale to ${s.customerName}`,
        date: new Date(s.saleDate).toLocaleDateString(),
        amount: s.totalAmount,
      });
    });

    // Expenses (Purchases)
    purchases.forEach((p) => {
      worksheet.addRow({
        category: "Expense (Purchase)",
        desc: `Purchase from ${p.supplier?.name || "Supplier"}`,
        date: new Date(p.purchaseDate).toLocaleDateString(),
        amount: -p.totalAmount,
      });
    });

    // Other Expenses
    expenses.forEach((e) => {
      worksheet.addRow({
        category: "Expense (Other)",
        desc: e.title,
        date: new Date(e.date).toLocaleDateString(),
        amount: -e.amount,
      });
    });

    // Summary Row
    const totalSales = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const totalPurchases = purchases.reduce(
      (acc, p) => acc + (p.totalAmount || 0),
      0
    );
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = totalSales - totalPurchases - totalExpenses;

    worksheet.addRow({});
    worksheet.addRow({
      category: "NET PROFIT",
      amount: netProfit,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=pnl-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Excel Export Failed" });
  }
};
