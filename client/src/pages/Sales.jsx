import React, { useEffect, useState, useRef } from "react";
import api from "../api";

import SalesInvoicePrint from "../components/SalesInvoicePrint";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { PREDEFINED_ITEMS } from "../constants";
import {
  FaTrash,
  FaPlus,
  FaPrint,
  FaFilePdf,
  FaSave,
  FaUndo,
  FaCalculator,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const initialItem = () => ({
  productId: "",
  itemName: "",
  manualName: "",
  description: "",
  quantity: "",
  rate: "",
  taxPercent: "",
  isManual: false, // Controls visibility of manual input box
});

import { useLocation, useNavigate } from "react-router-dom";

// ... (imports)

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]); // New state for filtered list
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [downloadSale, setDownloadSale] = useState(null); // For hidden PDF generation

  const [formData, setFormData] = useState({
    customerName: "",
    saleDate: new Date().toISOString().split("T")[0],
    paidAmount: "",
    discount: "",
    items: [initialItem()],
    isEMI: false,
    emiDetails: {
      installments: "",
      startDate: "",
      installmentAmount: "",
    },
  });

  const printRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get("filter");

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (filterType === "pending") {
      setFilteredSales(sales.filter((s) => (s.pendingAmount || 0) > 0));
    } else {
      setFilteredSales(sales);
    }
  }, [sales, filterType]);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
      // Initial filter application handled by useEffect
    } catch (err) {
      console.error("Fetch sales error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const calculateTotals = (items) => {
    return items.reduce((acc, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const tax = parseFloat(item.taxPercent) || 0;
      const sub = qty * rate;
      const taxAmt = parseFloat(sub * tax) / 100;
      return acc + sub + taxAmt;
    }, 0);
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const items = prev.items.map((it, i) => ({ ...it }));
      const item = items[index];

      if (field === "productId") {
        if (value === "manual") {
          // Custom Manual Item -> Show Input
          item.productId = "";
          item.itemName = "manual";
          item.manualName = "";
          item.isManual = true;
        } else {
          const product = products.find((p) => p._id === value);
          if (product) {
            // DB Product -> Hide Input
            item.productId = product._id;
            item.itemName = product.name;
            item.isManual = false;
          } else {
            // Predefined Item -> Hide Input (Treat as selected)
            item.productId = "";
            item.itemName = value;
            item.manualName = ""; // Clear manual name as we use itemName
            item.isManual = false;
          }
        }
      } else if (field === "manualName") {
        item.manualName = value;
      } else if (field === "description") {
        item.description = value;
      } else if (field === "quantity") {
        item.quantity = value;
      } else if (field === "rate") {
        item.rate = value;
      } else if (field === "taxPercent") {
        item.taxPercent = value;
      }

      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, initialItem()] }));
  };

  const removeItem = (index) => {
    setFormData((prev) => {
      const items = prev.items.slice();
      items.splice(index, 1);
      return { ...prev, items };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("emiDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emiDetails: { ...prev.emiDetails, [key]: value },
      }));
    } else if (name === "isEMI") {
      setFormData((prev) => ({ ...prev, isEMI: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsForSave = formData.items.map((it) => {
      const finalName =
        it.itemName === "manual" ? it.manualName || "Manual Item" : it.itemName;
      return {
        productId: it.productId || null,
        itemName: finalName,
        description: it.description || "",
        quantity: Number(it.quantity) || 0,
        rate: Number(it.rate) || 0,
        taxPercent: Number(it.taxPercent) || 0,
      };
    });

    const totalAmount = calculateTotals(itemsForSave);
    const pendingAmount =
      totalAmount -
      (parseFloat(formData.paidAmount) || 0) -
      (parseFloat(formData.discount) || 0);

    const payload = {
      customerName: formData.customerName,
      saleDate: formData.saleDate,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      discount: parseFloat(formData.discount) || 0,
      items: itemsForSave,
      isEMI: !!formData.isEMI,
      emiDetails: formData.isEMI ? formData.emiDetails : null,
      totalAmount,
      pendingAmount,
    };

    try {
      let responseData;
      if (editingId) {
        const { data } = await api.put(`/sales/${editingId}`, payload);
        responseData = data;
      } else {
        const { data } = await api.post("/sales", payload);
        responseData = data;
      }

      await fetchSales();
      await fetchProducts();

      // Auto-preview the invoice
      // Use the response data which contains the full sale object including _id and populated fields if any
      const saleToPreview = responseData;

      setSelectedSale(saleToPreview);
      setShowPrint(true);

      resetForm();
    } catch (err) {
      console.error("Save sale error:", err);
      alert("Failed to save sale. Check console.");
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      saleDate: new Date().toISOString().split("T")[0],
      paidAmount: "",
      discount: "",
      items: [initialItem()],
      isEMI: false,
      emiDetails: {
        installments: "",
        startDate: "",
        installmentAmount: "",
      },
    });
    setEditingId(null);
    setSelectedSale(null);
    navigate("/sales"); // Clear any filters
  };

  const handleEdit = (sale) => {
    const items = (sale.items || []).map((i) => ({
      ...initialItem(),
      productId: i.productId || "",
      itemName: i.productId ? i.itemName : "manual",
      manualName: i.productId ? "" : i.itemName,
      description: i.description || "",
      quantity: i.quantity,
      rate: i.rate,
      taxPercent: i.taxPercent,
    }));

    setFormData({
      customerName: sale.customerName || "",
      saleDate: (sale.saleDate || "").split("T")[0] || "",
      paidAmount: sale.paidAmount || 0,
      discount: sale.discount || 0,
      items: items.length ? items : [initialItem()],
      isEMI: sale.isEMI || false,
      emiDetails: sale.emiDetails || {
        installments: "",
        startDate: "",
        installmentAmount: "",
      },
    });

    setEditingId(sale._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;
    try {
      await api.delete(`/sales/${id}`);
      await fetchSales();
      await fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const handleDownloadInvoice = async (sale) => {
    // Set the sale to be downloaded, which triggers the hidden component to render
    setDownloadSale(sale);

    // Wait for render
    setTimeout(() => {
      const element = document.getElementById("hidden-invoice-content");
      if (element) {
        const opt = {
          margin: 0,
          filename: `invoice-${sale._id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            setDownloadSale(null); // Cleanup after download
          });
      }
    }, 500);
  };

  const displayedTotal = calculateTotals(
    formData.items.map((it) => ({
      itemName:
        it.itemName === "manual" ? it.manualName || "Manual Item" : it.itemName,
      quantity: it.quantity,
      rate: it.rate,
      taxPercent: it.taxPercent,
    }))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Sales Management
          </h2>
          <p className="text-brand-dark/70 text-sm mt-1">
            Create invoices and track sales
          </p>
        </div>
        <div className="flex gap-3">
          {filterType === "pending" && (
            <button
              onClick={() => navigate("/sales")}
              className="px-4 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-sm"
            >
              Show All Sales
            </button>
          )}
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-white/50 border border-brand-light/30 text-brand-dark rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
          >
            <FaUndo className="text-sm" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl shadow-lg border p-8 transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--bg-accent)",
            }}
          >
            <h3
              className="text-xl font-extrabold mb-8 flex items-center gap-3"
              style={{ color: "var(--text-primary)" }}
            >
              <div
                className="p-2.5 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--brand-primary)",
                }}
              >
                <FaCalculator />
              </div>
              Invoice Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder-opacity-50"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--bg-accent)",
                    color: "var(--text-primary)",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Sale Date
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--bg-accent)",
                    color: "var(--text-primary)",
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label
                className="block text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Items
              </label>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border relative group transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "var(--bg-accent)",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label
                        className="text-xs font-bold uppercase tracking-wider mb-1 block"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Product
                      </label>
                      <select
                        className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--bg-accent)",
                          color: "var(--text-primary)",
                        }}
                        value={
                          item.productId ||
                          (item.isManual ? "manual" : item.itemName)
                        }
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                      >
                        <option value="">Select Product</option>
                        <optgroup label="In Stock">
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Quick Select">
                          {PREDEFINED_ITEMS.map((name, i) => (
                            <option key={`pre-${i}`} value={name}>
                              {name}
                            </option>
                          ))}
                        </optgroup>
                        <option value="manual">-- Custom Item --</option>
                      </select>
                      {item.isManual && (
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={item.manualName || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "manualName",
                              e.target.value
                            )
                          }
                          className="w-full mt-2 px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--bg-accent)",
                            color: "var(--text-primary)",
                          }}
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className="text-xs font-bold uppercase tracking-wider mb-1 block"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Qty
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--bg-accent)",
                          color: "var(--text-primary)",
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label
                        className="text-xs font-bold uppercase tracking-wider mb-1 block"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--bg-accent)",
                          color: "var(--text-primary)",
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className="text-xs font-bold uppercase tracking-wider mb-1 block"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        value={item.taxPercent}
                        onChange={(e) =>
                          handleItemChange(index, "taxPercent", e.target.value)
                        }
                        className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--bg-accent)",
                          color: "var(--text-primary)",
                        }}
                        placeholder="5% or 18%"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-rose-500 hover:text-rose-700 p-2.5 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Remove Item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="Add description (optional)"
                      className="w-full px-3 py-1.5 bg-transparent border-b text-xs focus:border-brand-primary outline-none"
                      style={{
                        borderColor: "var(--bg-accent)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="w-full py-3 border-2 border-dashed border-brand-light/30 rounded-2xl text-brand-dark/60 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <FaPlus /> Add Another Item
              </button>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8"
              style={{ borderColor: "var(--bg-accent)" }}
            >
              <div className="space-y-6">
                <label
                  className="flex items-center gap-3 text-sm font-bold cursor-pointer p-3 rounded-xl border transition-colors"
                  style={{
                    borderColor: "var(--bg-accent)",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isEMI"
                    checked={formData.isEMI}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary"
                    style={{ borderColor: "var(--bg-accent)" }}
                  />
                  Enable EMI / Installments
                </label>
                {formData.isEMI && (
                  <div
                    className="p-5 rounded-2xl space-y-4 border animate-in fade-in slide-in-from-top-2"
                    style={{
                      borderColor: "var(--bg-accent)",
                      backgroundColor: "var(--bg-primary)",
                    }}
                  >
                    <input
                      type="number"
                      name="emiDetails.installments"
                      value={formData.emiDetails.installments}
                      onChange={handleChange}
                      placeholder="No. of Installments"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--bg-accent)",
                      }}
                    />
                    <input
                      type="number"
                      name="emiDetails.installmentAmount"
                      value={formData.emiDetails.installmentAmount}
                      onChange={handleChange}
                      placeholder="Amount per Installment"
                      className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--bg-accent)",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{displayedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Discount
                  </span>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-28 text-right px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--bg-accent)",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Paid Amount
                  </span>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-28 text-right px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      borderColor: "var(--bg-accent)",
                    }}
                  />
                </div>
                <div
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: "var(--bg-accent)" }}
                >
                  <span
                    className="text-xl font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Total Payable
                  </span>
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    ₹
                    {(displayedTotal - Number(formData.discount || 0)).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FaSave /> {editingId ? "Update Invoice" : "Generate Invoice"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const itemsForPreview = formData.items.map((it) => ({
                    ...it,
                    itemName:
                      it.itemName === "manual"
                        ? it.manualName || "Manual Item"
                        : it.itemName,
                    quantity: Number(it.quantity) || 0,
                    rate: Number(it.rate) || 0,
                    taxPercent: Number(it.taxPercent) || 0,
                  }));

                  const totalAmount = calculateTotals(itemsForPreview);
                  const pendingAmount =
                    totalAmount -
                    (parseFloat(formData.paidAmount) || 0) -
                    (parseFloat(formData.discount) || 0);

                  setSelectedSale({
                    ...formData,
                    _id: editingId || "DRAFT-001",
                    items: itemsForPreview,
                    totalAmount,
                    pendingAmount,
                  });
                  setShowPrint(true);
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <FaPrint /> Preview
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Recent Sales List */}
        <div className="lg:col-span-1">
          <div
            className="rounded-3xl shadow-lg border overflow-hidden h-full flex flex-col"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--bg-accent)",
            }}
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--bg-accent)" }}
            >
              <h3
                className="font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                Recent Invoices
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredSales.map((s) => (
                <div
                  key={s._id}
                  className="p-4 rounded-2xl border border-brand-light/20 bg-white/30 hover:bg-brand-lightest/50 hover:border-brand-primary/30 transition-all group relative shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-brand-dark text-lg">
                        {s.customerName}
                      </p>
                      <p className="text-xs text-brand-dark/50 font-medium">
                        {new Date(s.saleDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-base font-extrabold text-brand-primary">
                      ₹{s.totalAmount}
                    </span>
                  </div>
                  <div className="text-xs text-brand-dark/60 mb-3 line-clamp-1 font-medium bg-white/50 px-2 py-1 rounded-lg inline-block">
                    {s.items.map((i) => i.itemName).join(", ")}
                  </div>
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedSale(s);
                        setShowPrint(true);
                      }}
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors shadow-sm"
                      title="View / Print"
                    >
                      <FaEye className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(s)}
                      className="text-purple-600 bg-purple-50 hover:bg-purple-100 p-2 rounded-lg transition-colors shadow-sm"
                      title="Download PDF"
                    >
                      <FaDownload className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest p-2 rounded-lg transition-colors shadow-sm"
                      title="Edit"
                    >
                      <FaUndo className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-rose-600 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors shadow-sm"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredSales.length === 0 && (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FaCalculator className="text-6xl mx-auto mb-4 opacity-20" />
                  <p>No recent sales found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Modal Header */}
            <div
              className="p-4 border-b flex justify-between items-center"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--bg-accent)",
              }}
            >
              <h2
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <FaFileInvoice className="text-brand-primary" />
                Invoice Preview
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all"
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold hover:bg-opacity-10 transition-all"
                  style={{
                    borderColor: "var(--bg-accent)",
                    color: "var(--text-primary)",
                  }}
                >
                  <FaTimes /> Close
                </button>
              </div>
            </div>

            {/* Invoice Content - Scrollable */}
            <div className="flex-1 overflow-auto p-8 bg-gray-100/50">
              <div
                ref={invoiceRef}
                className="shadow-xl mx-auto max-w-[210mm] min-h-[297mm] transition-transform hover:scale-[1.01] duration-300"
                style={{ backgroundColor: "white", color: "black" }}
              >
                {/* 
                  NOTE: Keeping Invoice background WHITE ensuring print compatibility.
                  Invoices usually need to be white for printing.
                  Text colors inside invoice should also remain standard black/dark for print.
                */}
                <Invoice sale={selectedSale} />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="p-6 border-t flex justify-end gap-4"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--bg-accent)",
              }}
            >
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-3 rounded-xl font-bold border hover:bg-opacity-50 transition-colors"
                style={{
                  borderColor: "var(--bg-accent)",
                  color: "var(--text-primary)",
                }}
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <FaPrint /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Invoice for PDF Generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none overflow-hidden h-0 w-0">
        {downloadSale && (
          <div id="hidden-invoice-content">
            <SalesInvoicePrint sale={downloadSale} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
