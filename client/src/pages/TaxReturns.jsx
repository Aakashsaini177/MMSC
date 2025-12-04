import React, { useState, useEffect } from "react";

import api from "../api";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaDownload,
  FaCalendarAlt,
  FaSpinner,
  FaBalanceScale,
} from "react-icons/fa";
import { toast } from "react-toastify";

const TaxReturns = () => {
  const [activeTab, setActiveTab] = useState("GST"); // 'GST' or 'INCOME'
  const [loading, setLoading] = useState(false);

  // GST State
  const [gstMonth, setGstMonth] = useState(new Date().getMonth() + 1);
  const [gstYear, setGstYear] = useState(new Date().getFullYear());
  const [gstData, setGstData] = useState(null);

  // Income Tax State
  const [itYear, setItYear] = useState(new Date().getFullYear());
  const [itData, setItData] = useState(null);

  useEffect(() => {
    if (activeTab === "GST") {
      fetchGstData();
    } else {
      fetchIncomeTaxData();
    }
  }, [activeTab, gstMonth, gstYear, itYear]);

  const fetchGstData = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/gst/gstr3b?month=${gstMonth}&year=${gstYear}`
      );
      setGstData(res.data);
    } catch (err) {
      console.error("Failed to fetch GST data", err);
      toast.error("Failed to fetch GST data");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomeTaxData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tax/income-tax?year=${itYear}`);
      setItData(res.data);
    } catch (err) {
      console.error("Failed to fetch IT data", err);
      toast.error("Failed to fetch Income Tax data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (type) => {
    if (type === "GST_EXCEL") {
      window.open(
        `http://localhost:5000/api/reports/gst/excel?startDate=${gstYear}-${gstMonth}-01&endDate=${gstYear}-${gstMonth}-30`,
        "_blank"
      );
    } else if (type === "PNL_EXCEL") {
      const start = `${itYear - 1}-04-01`;
      const end = `${itYear}-03-31`;
      window.open(
        `http://localhost:5000/api/reports/pnl/excel?startDate=${start}&endDate=${end}`,
        "_blank"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tax Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Monitor your tax liabilities and reports
          </p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-gray-200 flex shadow-sm">
          <button
            onClick={() => setActiveTab("GST")}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === "GST"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            GST Returns
          </button>
          <button
            onClick={() => setActiveTab("INCOME")}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === "INCOME"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Income Tax
          </button>
        </div>
      </div>

      {activeTab === "GST" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* GST Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={gstMonth}
                    onChange={(e) => setGstMonth(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={gstYear}
                    onChange={(e) => setGstYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDownloadReport("GST_EXCEL")}
              className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <FaDownload /> Download Report
            </button>
          </div>

          {/* GST Summary Cards */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : gstData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Outward Supplies */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FaChartLine className="text-6xl text-blue-600" />
                </div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                  Outward Tax (Sales)
                </h3>
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-gray-800 mb-1">
                    ₹
                    {(
                      gstData.outwardTax.cgst +
                      gstData.outwardTax.sgst +
                      gstData.outwardTax.igst
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                    Taxable: ₹{gstData.outwardTax.taxable.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Input Tax Credit */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FaFileInvoiceDollar className="text-6xl text-emerald-600" />
                </div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                  Input Tax Credit
                </h3>
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-gray-800 mb-1">
                    ₹
                    {(
                      gstData.itc.cgst +
                      gstData.itc.sgst +
                      gstData.itc.igst
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">
                    Taxable: ₹{gstData.itc.taxable.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Net Payable */}
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <FaMoneyBillWave className="text-6xl text-white" />
                </div>
                <h3 className="text-rose-100 text-sm font-bold uppercase tracking-wider mb-2">
                  Net GST Payable
                </h3>
                <div className="relative z-10">
                  <p className="text-3xl font-bold text-white mb-1">
                    ₹
                    {(
                      gstData.payable.cgst +
                      gstData.payable.sgst +
                      gstData.payable.igst
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-rose-100 mt-1">
                    (Output Tax - Input Tax)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-400">
                No GST data available for this period
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "INCOME" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Income Tax Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Year Ending (March)
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={itYear}
                  onChange={(e) => setItYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => handleDownloadReport("PNL_EXCEL")}
              className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <FaDownload /> Download P&L Excel
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : itData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* P&L Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" /> Profit & Loss
                  Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Total Revenue
                    </span>
                    <span className="font-bold text-emerald-600">
                      ₹{itData.profitAndLoss.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Total Purchases
                    </span>
                    <span className="font-bold text-rose-500">
                      -₹{itData.profitAndLoss.purchases.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Total Expenses
                    </span>
                    <span className="font-bold text-rose-500">
                      -₹{itData.profitAndLoss.expenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Net Profit
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        itData.profitAndLoss.netProfit >= 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      ₹{itData.profitAndLoss.netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Calculation */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaMoneyBillWave className="text-blue-600" /> Tax Estimates
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-1">
                      Presumptive Tax (44AD)
                    </h4>
                    <p className="text-xs text-blue-600 mb-3">
                      Deemed Income @ 6% of Turnover
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      ₹
                      {itData.presumptiveTax.section44AD.taxableIncome6Percent.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-800 mb-1">
                      Normal Tax (New Regime)
                    </h4>
                    <p className="text-xs text-indigo-600 mb-3">
                      Tax Payable on Net Profit
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                      ₹{itData.normalTax.taxPayable.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaBalanceScale className="text-blue-600" /> Provisional
                  Balance Sheet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Liabilities */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                      Liabilities
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capital Account</span>
                        <span className="font-medium">
                          ₹
                          {itData.balanceSheet.liabilities.capital.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sundry Creditors</span>
                        <span className="font-medium">
                          ₹
                          {itData.balanceSheet.liabilities.creditors.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between font-bold text-gray-800">
                        <span>Total Liabilities</span>
                        <span>
                          ₹
                          {itData.balanceSheet.liabilities.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assets */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                      Assets
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Closing Stock</span>
                        <span className="font-medium">
                          ₹
                          {itData.balanceSheet.assets.closingStock.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sundry Debtors</span>
                        <span className="font-medium">
                          ₹{itData.balanceSheet.assets.debtors.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cash & Bank</span>
                        <span className="font-medium">
                          ₹
                          {itData.balanceSheet.assets.cashBank.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between font-bold text-gray-800">
                        <span>Total Assets</span>
                        <span>
                          ₹{itData.balanceSheet.assets.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-400">
                No Income Tax data available for this year
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaxReturns;
