import React, { useState, useEffect } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen } from "react-icons/fa";
import { PREDEFINED_ITEMS } from "../constants";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    hsn: "",
    price: "",
    stock: "",
    unit: "pcs",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerTerm) ||
        (p.sku && p.sku.toLowerCase().includes(lowerTerm)) ||
        (p.hsn && p.hsn.toLowerCase().includes(lowerTerm))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to fetch products");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", formData);
        toast.success("Product added successfully");
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Save product error:", err);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      hsn: product.hsn,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      description: product.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.error("Delete product error:", err);
        toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      hsn: "",
      price: "",
      stock: "",
      unit: "pcs",
      description: "",
    });
  };

  const openModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Product Inventory
          </h2>
          <p className="text-brand-dark/70 text-sm mt-1">
            Manage your products and stock levels
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-light rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-brand-surface rounded-xl flex items-center shadow-sm">
              <FaSearch className="absolute left-4 text-brand-primary/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl focus:outline-none text-brand-dark placeholder-brand-dark/40"
              />
            </div>
          </div>
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-primary/30 transition-all font-bold active:scale-95"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left divide-y divide-brand-light/20">
            <thead className="bg-brand-lightest/50">
              <tr>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  SKU / HSN
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light/20 bg-transparent">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-brand-lightest/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-dark text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <FaBoxOpen className="text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark text-base">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-xs text-brand-dark/60 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-brand-dark/80">
                        <p className="font-mono text-xs bg-brand-lightest/50 px-2 py-0.5 rounded inline-block mb-1">
                          {product.sku || "N/A"}
                        </p>
                        <p className="text-xs text-brand-dark/50">
                          HSN: {product.hsn || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {product.stock}{" "}
                        {product.stock === 0 ? "Out of Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-dark/70 capitalize font-medium">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-brand-dark/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-brand-lightest/50 rounded-full flex items-center justify-center">
                        <FaBoxOpen className="text-4xl text-brand-light" />
                      </div>
                      <p className="font-medium">
                        No products found matching your search.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-brand-light/20">
            <div className="px-8 py-6 border-b border-brand-light/20 bg-brand-lightest/30 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-brand-dark">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-brand-dark/40 hover:text-brand-dark text-2xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  list="predefined-items"
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  placeholder="e.g. LED Monitor"
                />
                <datalist id="predefined-items">
                  {PREDEFINED_ITEMS.map((item, index) => (
                    <option key={index} value={item} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    SKU{" "}
                    <span className="text-brand-dark/40 font-normal text-xs">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    placeholder="Stock Keeping Unit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    HSN Code{" "}
                    <span className="text-brand-dark/40 font-normal text-xs">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="hsn"
                    value={formData.hsn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    placeholder="HSN Code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark"
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="ltr">ltr</option>
                    <option value="box">box</option>
                    <option value="mtr">mtr</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-none text-brand-dark placeholder-brand-dark/30"
                  placeholder="Add product details..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-brand-light/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-brand-dark bg-white/50 border border-brand-light/30 hover:bg-white rounded-xl transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/30 transition-all font-bold"
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
