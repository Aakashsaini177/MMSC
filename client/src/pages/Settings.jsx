import { useState, useEffect } from "react";
import {
  FaSave,
  FaBuilding,
  FaUniversity,
  FaFileContract,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    gstin: "",
    pan: "",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifsc: "",
      branch: "",
    },
    termsAndConditions: [],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load settings");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...formData.termsAndConditions];
    newTerms[index] = value;
    setFormData((prev) => ({ ...prev, termsAndConditions: newTerms }));
  };

  const addTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, ""],
    }));
  };

  const removeTerm = (index) => {
    const newTerms = formData.termsAndConditions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, termsAndConditions: newTerms }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">
            Company Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your company details, address, and invoice preferences.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-dark shadow-lg shadow-brand-primary/30 flex items-center gap-2 font-bold transition-all active:scale-95"
        >
          <FaSave /> Save Changes
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Company Details */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
            <FaBuilding className="text-brand-primary" /> Company Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="e.g. MMSC Enterprises"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                placeholder="Street Address"
              ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Bank Details */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
              <FaUniversity className="text-brand-primary" /> Bank Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifsc"
                    value={formData.bankDetails.ifsc}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="bankDetails.branch"
                    value={formData.bankDetails.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-4">
              <FaFileContract className="text-brand-primary" /> Terms &
              Conditions
            </h2>
            <div className="space-y-3">
              {formData.termsAndConditions.map((term, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleTermChange(index, e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeTerm(index)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTerm}
                className="text-sm text-brand-primary font-bold hover:underline"
              >
                + Add Term
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
