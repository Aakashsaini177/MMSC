import { useEffect, useState } from "react";

import axios from "axios";
import {
  FaCalculator,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

const GSTFiling = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFilings = async () => {
    try {
      const res = await axios.get(`${API_URL}/gstfilings`);
      setFilings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load filings");
    }
  };

  useEffect(() => {
    fetchFilings();
  }, []);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/gstfilings/calculate`, {
        month,
        year,
      });
      toast.success("GST calculated for period: " + res.data.filing.period);
      fetchFilings();
    } catch (err) {
      console.error(err);
      toast.error("Error calculating GST");
    } finally {
      setLoading(false);
    }
  };

  const markFiled = async (id) => {
    try {
      await axios.put(`${API_URL}/gstfilings/${id}/mark-filed`);
      toast.success("Marked as filed successfully");
      fetchFilings();
    } catch {
      toast.error("Failed to mark filed");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">GST Filing</h2>
          <p className="text-gray-500 text-sm">
            Calculate and track your GST returns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calculation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalculator className="text-blue-600" /> Calculate GST
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
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
                Select Year
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCalculator />
              )}
              {loading ? "Calculating..." : "Calculate & Save"}
            </button>
          </div>
        </div>

        {/* Summary Stats (Placeholder for future expansion) */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">GST Overview</h3>
            <p className="text-blue-100 max-w-lg">
              Ensure timely filing of your GST returns to avoid penalties. The
              system automatically calculates your liability based on sales and
              purchases.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex gap-6">
            <div>
              <p className="text-blue-200 text-sm">Total Filings</p>
              <p className="text-3xl font-bold">{filings.length}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Pending</p>
              <p className="text-3xl font-bold">
                {filings.filter((f) => f.status === "Pending").length}
              </p>
            </div>
          </div>
          <FaFileInvoiceDollar className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Filing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4 text-right">Sales</th>
                <th className="px-6 py-4 text-right">Purchases</th>
                <th className="px-6 py-4 text-right">Tax Collected</th>
                <th className="px-6 py-4 text-right">Tax Paid</th>
                <th className="px-6 py-4 text-right">Net Payable</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filings.map((f) => (
                <tr
                  key={f._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {f.period}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ₹{f.totalSales?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ₹{f.totalPurchases?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                    ₹
                    {(
                      (f.cgstCollected || 0) +
                      (f.sgstCollected || 0) +
                      (f.igstCollected || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-amber-600 font-medium">
                    ₹
                    {(
                      (f.cgstPaid || 0) +
                      (f.sgstPaid || 0) +
                      (f.igstPaid || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">
                    ₹{f.gstPayable?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        f.status === "Filed"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-yellow-50 text-yellow-700 border-yellow-100"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {f.status === "Pending" && (
                      <button
                        onClick={() => markFiled(f._id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <FaCheckCircle /> Mark Filed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filings.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaFileInvoiceDollar className="text-4xl text-gray-200" />
                      <p>No filings found. Calculate GST to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GSTFiling;
