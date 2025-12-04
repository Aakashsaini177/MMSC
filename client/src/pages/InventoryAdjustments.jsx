
import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSearch,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const InventoryAdjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [selectedProduct, setSelectedProduct] = useState("");
  const [type, setType] = useState("increase");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adjRes, prodRes] = await Promise.all([
        api.get("/inventory"),
        api.get("/products"),
      ]);
      setAdjustments(adjRes.data);
      setProducts(prodRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !reason) {
      return toast.error("Please fill all fields");
    }

    try {
      const { data } = await api.post("/inventory", {
        productId: selectedProduct,
        type,
        quantity,
        reason,
      });
      setAdjustments([data, ...adjustments]);
      toast.success("Adjustment added successfully");
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add adjustment");
    }
  };

  const resetForm = () => {
    setSelectedProduct("");
    setType("increase");
    setQuantity("");
    setReason("");
  };

  const filteredAdjustments = adjustments.filter(
    (adj) =>
      adj.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-surface/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Inventory Adjustments
          </h1>
          <p className="text-brand-dark/60 mt-1 font-medium">
            Manage stock corrections and updates
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30 active:scale-95"
        >
          <FaPlus /> New Adjustment
        </button>
      </div>

      {/* Search & List */}
      <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-brand-dark/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-primary/5">
              <tr className="text-left">
                <th className="px-6 py-4 font-bold text-brand-dark">Date</th>
                <th className="px-6 py-4 font-bold text-brand-dark">Product</th>
                <th className="px-6 py-4 font-bold text-brand-dark">Type</th>
                <th className="px-6 py-4 font-bold text-brand-dark">
                  Quantity
                </th>
                <th className="px-6 py-4 font-bold text-brand-dark">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredAdjustments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-brand-dark/50"
                  >
                    No adjustments found
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((adj) => (
                  <tr
                    key={adj._id}
                    className="hover:bg-white/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-brand-dark/80 font-medium">
                      {new Date(adj.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      {adj.product?.name || "Unknown Product"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          adj.type === "increase"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {adj.type === "increase" ? (
                          <FaArrowUp size={10} />
                        ) : (
                          <FaArrowDown size={10} />
                        )}
                        {adj.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      {adj.quantity}
                    </td>
                    <td className="px-6 py-4 text-brand-dark/70">
                      {adj.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-brand-dark">
                New Adjustment
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Current Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  >
                    <option value="increase">Increase Stock (+)</option>
                    <option value="decrease">Decrease Stock (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Damaged, Found, Theft"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-white px-4 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30 active:scale-95"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAdjustments;
