import React, { useState, useEffect } from "react";
import api from "../api";
import { GSTIN_REGEX } from "../constants";
import { toast } from "react-toastify";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaSave,
  FaUndo,
  FaTrash,
  FaEdit,
  FaPlus,
  FaBook,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLedger, setShowLedger] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Supplier fetch error:", err);
      toast.error("Failed to fetch suppliers");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning("Supplier name is required");
      return;
    }

    try {
      if (formData.gstNumber && !GSTIN_REGEX.test(formData.gstNumber)) {
        alert("Invalid GSTIN format. Please check and try again.");
        return;
      }

      if (editingId) {
        await api.put(`/suppliers/${editingId}`, formData);
        toast.success("Supplier updated successfully");
      } else {
        await api.post("/suppliers", formData);
        toast.success("Supplier added successfully");
      }
      resetForm();
      fetchSuppliers();
    } catch (err) {
      console.error("Add/update error:", err);
      toast.error("Operation failed");
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier._id);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      gstNumber: supplier.gstNumber,
      address: supplier.address,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await api.delete(`/suppliers/${id}`);
        toast.success("Deleted successfully");
        fetchSuppliers();
        if (editingId === id) resetForm();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Delete failed");
      }
    }
  };



  const handleViewLedger = async (supplier) => {
    try {
      const res = await api.get(`/suppliers/${supplier._id}/ledger`);
      setLedgerData(res.data);
      setSelectedSupplier(supplier);
      setShowLedger(true);
    } catch (err) {
      console.error("Ledger fetch error:", err);
      toast.error("Failed to load ledger");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstNumber: "",
      address: "",
    });
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Supplier Management
          </h2>
          <p className="text-brand-dark/70 text-sm mt-1">
            Manage your vendor relationships
          </p>
        </div>
        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-light rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative bg-brand-surface rounded-xl flex items-center shadow-sm">
            <FaUserTie className="absolute left-4 text-brand-primary/60" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl focus:outline-none text-brand-dark placeholder-brand-dark/40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 p-8"
          >
            <h3 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-brand-lightest rounded-xl text-brand-primary shadow-sm">
                <FaUserTie />
              </div>
              {editingId ? "Edit Supplier" : "Add New Supplier"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Supplier Name
                </label>
                <div className="relative">
                  <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter supplier name"
                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  GST Number
                </label>
                <div className="relative">
                  <FaFileInvoice className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="GSTIN"
                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-brand-dark/30" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Full address"
                    className="w-full pl-11 pr-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-none text-brand-dark placeholder-brand-dark/30"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-brand-light/20">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-white/50 border border-brand-light/30 text-brand-dark rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
              >
                <FaUndo className="text-sm" /> Reset
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FaSave /> {editingId ? "Update Supplier" : "Save Supplier"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-brand-light/20 bg-brand-lightest/30 flex justify-between items-center">
              <h3 className="font-extrabold text-brand-dark">Suppliers List</h3>
              <span className="bg-brand-primary/10 text-brand-primary text-xs px-3 py-1 rounded-full font-bold border border-brand-primary/20">
                {filteredSuppliers.length} Total
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredSuppliers.map((s) => (
                <div
                  key={s._id}
                  className="p-5 rounded-2xl border border-brand-light/20 bg-white/30 hover:bg-brand-lightest/50 hover:border-brand-primary/30 transition-all group relative shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-dark text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark text-lg leading-tight">
                          {s.name}
                        </h4>
                        <p className="text-xs text-brand-dark/50 font-mono mt-1 bg-brand-lightest/50 px-1.5 py-0.5 rounded inline-block">
                          {s.gstNumber || "No GSTIN"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 pl-1">
                    {s.phone && (
                      <div className="flex items-center gap-3 text-sm text-brand-dark/70">
                        <FaPhone className="text-brand-primary/60 text-xs" />{" "}
                        {s.phone}
                      </div>
                    )}
                    {s.email && (
                      <div className="flex items-center gap-3 text-sm text-brand-dark/70">
                        <FaEnvelope className="text-brand-primary/60 text-xs" />{" "}
                        {s.email}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewLedger(s)}
                      className="p-2 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors shadow-sm"
                      title="View Ledger"
                    >
                      <FaBook />
                    </button>
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors shadow-sm"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {filteredSuppliers.length === 0 && (
                <div className="text-center text-brand-dark/40 py-12">
                  <div className="w-16 h-16 bg-brand-lightest/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserTie className="text-3xl text-brand-light" />
                  </div>
                  <p className="font-medium">No suppliers found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Modal */}
      {showLedger && ledgerData && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-brand-light/20">
            <div className="px-8 py-6 border-b border-brand-light/20 bg-brand-lightest/30 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-lightest rounded-xl text-brand-primary shadow-sm">
                  <FaBook className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-brand-dark">
                    {selectedSupplier?.name}
                  </h3>
                  <p className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider">
                    Supplier Ledger
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLedger(false)}
                className="text-brand-dark/40 hover:text-brand-dark text-2xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-8 bg-brand-surface border-b border-brand-light/20">
              <div className="bg-gradient-to-r from-brand-lightest to-white rounded-2xl p-6 border border-brand-light/20 flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-sm text-brand-dark/70 font-bold uppercase tracking-wider">
                    Total Payable Balance
                  </p>
                  <p className="text-xs text-brand-dark/50 mt-1">
                    Net amount to be paid
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-extrabold text-brand-dark">
                    ₹{ledgerData.totalPending?.toFixed(2)}
                  </p>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 mt-2 inline-block">
                    Pending Payment
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-0 bg-white/30">
              <table className="w-full text-sm text-left divide-y divide-brand-light/20">
                <thead className="bg-brand-lightest/50 text-brand-dark sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs">
                      Date
                    </th>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs">
                      Description
                    </th>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-right text-rose-600">
                      Credit (Purchase)
                    </th>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-right text-emerald-600">
                      Debit (Paid)
                    </th>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-right">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/10">
                  {ledgerData.ledger?.map((entry, i) => (
                    <tr
                      key={i}
                      className="hover:bg-brand-lightest/30 transition-colors"
                    >
                      <td className="px-8 py-4 text-brand-dark/70 font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 font-bold text-brand-dark">
                        {entry.description}
                      </td>
                      <td className="px-8 py-4 text-right text-rose-600 font-bold">
                        {entry.credit > 0 ? `₹${entry.credit.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-8 py-4 text-right text-emerald-600 font-bold">
                        {entry.debit > 0 ? `₹${entry.debit.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-8 py-4 text-right font-extrabold text-brand-dark">
                        ₹{entry.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {ledgerData.ledger?.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-8 py-16 text-center text-brand-dark/40"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <FaBook className="text-3xl opacity-30" />
                          <p>No transactions found for this supplier.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-brand-light/20 bg-brand-lightest/30 text-right">
              <button
                onClick={() => window.print()}
                className="text-sm text-brand-primary hover:text-brand-dark font-bold flex items-center gap-2 justify-end transition-colors"
              >
                <FaFileInvoiceDollar /> Print Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
