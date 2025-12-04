import React, { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { PREDEFINED_ITEMS } from "../constants";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaFilter,
  FaSearch,
  FaUndo,
} from "react-icons/fa";

const Purchases = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]); // Store real products
  const [editingId, setEditingId] = useState(null);
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    supplier: "",
    status: "Pending",
    paidAmount: 0,
    purchaseDate: new Date().toISOString().split("T")[0],
    items: [
      {
        productId: null,
        itemName: "",
        quantity: 1,
        rate: 0,
        taxPercent: 18,
        description: "",
        isManual: false,
      },
    ],
  });

  useEffect(() => {
    fetchSuppliers();
    fetchPurchases();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const query = [];
      if (filterSupplier) query.push(`supplier=${filterSupplier}`);
      if (filterStartDate) query.push(`startDate=${filterStartDate}`);
      if (filterEndDate) query.push(`endDate=${filterEndDate}`);
      const url = `/purchases${query.length ? "?" + query.join("&") : ""}`;
      const res = await api.get(url);
      setPurchases(res.data);
    } catch (err) {
      console.error("Failed to fetch purchases", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const calculateTotal = (items) => {
    return items
      .reduce((acc, item) => {
        const gst = (item.rate * item.quantity * item.taxPercent) / 100;
        return acc + item.rate * item.quantity + gst;
      }, 0)
      .toFixed(2);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const item = newItems[index];

    if (field === "productId") {
      if (value === "manual") {
        item.productId = null;
        item.isManual = true;
        item.itemName = "";
      } else {
        const product = products.find((p) => p._id === value);
        if (product) {
          item.productId = product._id;
          item.itemName = product.name;
          item.isManual = false;
        } else {
          // Predefined item selected (treated as selected, so hide manual input)
          item.productId = null;
          item.isManual = false;
          item.itemName = value;
        }
      }
    } else {
      item[field] =
        field === "quantity" || field === "rate" || field === "taxPercent"
          ? parseFloat(value) || 0
          : value;
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productId: "",
          itemName: "",
          quantity: 1,
          rate: 0,
          taxPercent: 18,
          description: "",
          isManual: false,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(calculateTotal(formData.items));
    const pendingAmount = totalAmount - parseFloat(formData.paidAmount || 0);

    const payload = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        productId: item.productId || null, // Ensure null if empty string
      })),
      totalAmount,
      pendingAmount,
    };

    try {
      if (editingId) {
        await api.put(`/purchases/${editingId}`, payload);
      } else {
        await api.post("/purchases", payload);
      }

      fetchPurchases();
      fetchProducts(); // Refresh stock
      resetForm();
    } catch (err) {
      alert("Failed to save purchase");
    }
  };

  const resetForm = () => {
    setFormData({
      supplier: "",
      status: "Pending",
      paidAmount: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
      items: [
        {
          productId: "",
          itemName: "",
          quantity: 1,
          rate: 0,
          taxPercent: 18,
          description: "",
          isManual: false,
        },
      ],
    });
    setEditingId(null);
  };

  const handleEdit = (purchase) => {
    setFormData({
      supplier: purchase.supplier?._id || "",
      status: purchase.status,
      paidAmount: purchase.paidAmount,
      purchaseDate: purchase.purchaseDate.split("T")[0],
      items: purchase.items.map((i) => ({
        ...i,
        productId: i.productId || null,
        description: i.description || "",
        isManual: !i.productId,
      })),
    });
    setEditingId(purchase._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      await api.delete(`/purchases/${id}`);
      fetchPurchases();
      fetchProducts(); // Refresh stock
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Purchase Management
          </h2>
          <p className="text-brand-dark/70 text-sm mt-1">
            Track and manage your purchases
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-xl border flex items-center gap-2 transition-all font-bold shadow-sm ${
            showFilters
              ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/30"
              : "bg-white/50 border-brand-light/30 text-brand-dark hover:bg-white"
          }`}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="bg-brand-surface/80 backdrop-blur-xl p-6 mb-8 rounded-3xl shadow-lg border border-brand-light/20 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark appearance-none"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-brand-dark/50">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark"
              />
            </div>
            <button
              onClick={fetchPurchases}
              className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <FaSearch /> Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 p-8"
          >
            <h3 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-brand-lightest rounded-xl text-brand-primary shadow-sm">
                <FaPlus />
              </div>
              {editingId ? "Edit Purchase" : "New Purchase"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Supplier
                </label>
                <div className="relative">
                  <select
                    name="supplier"
                    required
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark appearance-none"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-brand-dark/50">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark"
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-bold text-brand-dark">
                Items
              </label>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/40 p-6 rounded-2xl border border-brand-light/20 relative group transition-all hover:shadow-md hover:bg-white/60"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider mb-1 block">
                        Item
                      </label>
                      <select
                        value={
                          item.productId ||
                          (item.isManual ? "manual" : item.itemName)
                        }
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-white/70 border border-brand-light/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-brand-dark"
                      >
                        <option value="">Select Item</option>
                        <optgroup label="In Stock">
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} (Stock: {p.stock})
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
                        <option value="manual">-- Enter manually --</option>
                      </select>
                      {item.isManual && (
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(index, "itemName", e.target.value)
                          }
                          className="w-full mt-2 px-3 py-2.5 bg-white/70 border border-brand-light/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-brand-dark"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider mb-1 block">
                        Qty
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-white/70 border border-brand-light/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-brand-dark"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider mb-1 block">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-white/70 border border-brand-light/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-brand-dark"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider mb-1 block">
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        placeholder="18"
                        value={item.taxPercent}
                        onChange={(e) =>
                          handleItemChange(index, "taxPercent", e.target.value)
                        }
                        className="w-full px-3 py-2.5 bg-white/70 border border-brand-light/30 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-brand-dark"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-light/20 pt-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark appearance-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-brand-dark/50">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-end">
                <div className="flex justify-between items-center pt-4 border-t border-brand-light/20">
                  <span className="text-xl font-extrabold text-brand-dark">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-brand-primary">
                    ₹{calculateTotal(formData.items)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-white/50 border border-brand-light/30 text-brand-dark rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
              >
                <FaUndo className="text-sm" /> Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FaSave /> {editingId ? "Update Purchase" : "Save Purchase"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Recent Purchases List */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-brand-light/20 bg-brand-lightest/30">
              <h3 className="font-extrabold text-brand-dark">
                Recent Purchases
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {purchases.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-2xl border border-brand-light/20 bg-white/30 hover:bg-brand-lightest/50 hover:border-brand-primary/30 transition-all group relative shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-brand-dark text-lg">
                        {p.supplier?.name}
                      </p>
                      <p className="text-xs text-brand-dark/50 font-medium">
                        {new Date(p.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-base font-extrabold text-brand-primary">
                      ₹{p.totalAmount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                        p.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-brand-dark/40 font-medium">
                      {p.items.length} items
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors shadow-sm"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
              {purchases.length === 0 && (
                <div className="text-center text-brand-dark/40 py-12">
                  <p className="font-medium">No purchases found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
