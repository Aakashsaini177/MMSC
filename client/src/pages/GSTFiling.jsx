import { useEffect, useState } from "react";

import api from "../api";
import {
  FaCalculator,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const GSTFiling = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFilings = async () => {
    try {
      const res = await api.get(`/gstfilings`);
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
      const res = await api.post(`/gstfilings/calculate`, {
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
      await api.put(`/gstfilings/${id}/mark-filed`);
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
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            GST Filing
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Calculate and track your GST returns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calculation Card */}
        <div
          className="rounded-xl shadow-sm border p-6 lg:col-span-1 transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--bg-accent)",
          }}
        >
          <h3
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <FaCalculator style={{ color: "var(--brand-primary)" }} /> Calculate
            GST
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Select Month
              </label>
              <div className="relative">
                <FaCalendarAlt
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                  style={{ color: "var(--text-primary)" }}
                />
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all appearance-none"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--bg-accent)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--brand-primary)",
                  }}
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
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Select Year
              </label>
              <div className="relative">
                <FaCalendarAlt
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                  style={{ color: "var(--text-primary)" }}
                />
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--bg-accent)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--brand-primary)",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2 text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--brand-primary)",
                boxShadow: "0 4px 6px -1px var(--brand-shimmer)",
              }}
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

        {/* Summary Stats */}
        <div
          className="lg:col-span-2 rounded-xl shadow-lg text-white p-6 flex flex-col justify-between relative overflow-hidden"
          style={{
            background:
              "linear-gradient(to right, var(--brand-primary), var(--brand-hover))",
          }}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">GST Overview</h3>
            <p className="max-w-lg opacity-90">
              Ensure timely filing of your GST returns to avoid penalties. The
              system automatically calculates your liability based on sales and
              purchases.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex gap-6">
            <div>
              <p className="text-sm opacity-80">Total Filings</p>
              <p className="text-3xl font-bold">{filings.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Pending</p>
              <p className="text-3xl font-bold">
                {filings.filter((f) => f.status === "Pending").length}
              </p>
            </div>
          </div>
          <FaFileInvoiceDollar className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10" />
        </div>
      </div>

      <div
        className="rounded-xl shadow-sm border overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--bg-accent)",
        }}
      >
        <div
          className="p-4 border-b"
          style={{
            borderColor: "var(--bg-accent)",
            backgroundColor: "var(--bg-accent)",
          }}
        >
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
            Filing History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead
              className="font-medium border-b"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--bg-accent)",
                color: "var(--text-secondary)",
              }}
            >
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
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--bg-accent)" }}
            >
              {filings.map((f) => (
                <tr
                  key={f._id}
                  className="transition-colors group"
                  style={{ borderBottomColor: "var(--bg-accent)" }}
                >
                  <td
                    className="px-6 py-4 font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.period}
                  </td>
                  <td
                    className="px-6 py-4 text-right"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ₹{f.totalSales?.toLocaleString()}
                  </td>
                  <td
                    className="px-6 py-4 text-right"
                    style={{ color: "var(--text-secondary)" }}
                  >
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
                  <td
                    className="px-6 py-4 text-right font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
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
                        className="text-xs text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                        style={{ backgroundColor: "var(--brand-primary)" }}
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
                    className="px-6 py-12 text-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaFileInvoiceDollar className="text-4xl opacity-30" />
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
