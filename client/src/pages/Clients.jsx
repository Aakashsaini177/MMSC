import { useEffect, useState } from "react";
import { GSTIN_REGEX } from "../constants";

import api from "../api";
import {
  FaEdit,
  FaTrash,
  FaBook,
  FaPlus,
  FaSearch,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gstNumber: "",
    phone: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to load clients");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.gstNumber && !GSTIN_REGEX.test(formData.gstNumber)) {
        alert("Invalid GSTIN format. Please check and try again.");
        return;
      }

      if (selectedClient && !showLedger) {
        await api.put(`/clients/${selectedClient._id}`, formData);
      } else {
        await api.post("/clients", formData);
      }
      setShowModal(false);
      fetchClients();
      resetForm();
    } catch (err) {
      alert("Failed to save client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await api.delete(`/clients/${id}`);
      fetchClients();
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const handleViewLedger = async (client) => {
    try {
      const res = await api.get(`/clients/${client._id}/ledger`);
      setLedgerData(res.data);
      setSelectedClient(client);
      setShowLedger(true);
    } catch (err) {
      alert("Failed to load ledger");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      gstNumber: "",
      phone: "",
      address: "",
      status: "Active",
    });
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
            Client Management
          </h2>
          <p className="text-brand-dark/70 text-sm mt-1">
            Manage your customer database and ledgers
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-light rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-brand-surface rounded-xl flex items-center shadow-sm">
              <FaSearch className="absolute left-4 text-brand-primary/60" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl focus:outline-none text-brand-dark placeholder-brand-dark/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-brand-primary to-brand-dark hover:from-brand-dark hover:to-brand-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-primary/30 transition-all font-bold active:scale-95"
          >
            <FaPlus /> Add Client
          </button>
        </div>
      </div>

      <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left divide-y divide-brand-light/20">
            <thead className="bg-brand-lightest/50">
              <tr>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  GST Number
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-brand-primary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light/20 bg-transparent">
              {filteredClients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-brand-lightest/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-dark text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-base">
                          {client.name}
                        </p>
                        <p className="text-xs text-brand-dark/60">
                          {client.address || "No address"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-brand-dark/80">
                      <p className="font-medium">{client.email || "-"}</p>
                      <p className="text-xs text-brand-dark/50">
                        {client.phone || "-"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-brand-lightest/50 px-2 py-1 rounded text-brand-dark/80">
                      {client.gstNumber || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        client.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleViewLedger(client)}
                        className="p-2.5 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors"
                        title="View Ledger"
                      >
                        <FaBook />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setFormData(client);
                          setShowModal(true);
                        }}
                        className="p-2.5 text-brand-primary bg-brand-lightest/50 hover:bg-brand-lightest rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-brand-dark/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-brand-lightest/50 rounded-full flex items-center justify-center">
                        <FaSearch className="text-2xl text-brand-light" />
                      </div>
                      <p className="font-medium">
                        No clients found matching your search.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-brand-light/20">
            <div className="px-8 py-6 border-b border-brand-light/20 bg-brand-lightest/30 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-brand-dark">
                {selectedClient ? "Edit Client" : "Add New Client"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-brand-dark/40 hover:text-brand-dark text-2xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter client name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-brand-dark placeholder-brand-dark/30"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, gstNumber: e.target.value })
                  }
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white/50 border border-brand-light/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-none text-brand-dark placeholder-brand-dark/30"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows="3"
                  placeholder="Full address"
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    {selectedClient?.name}
                  </h3>
                  <p className="text-xs text-brand-dark/60 font-bold uppercase tracking-wider">
                    Transaction Ledger
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
                    Total Outstanding Balance
                  </p>
                  <p className="text-xs text-brand-dark/50 mt-1">
                    Net amount to be received
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
                      Debit (Sale)
                    </th>
                    <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-right text-emerald-600">
                      Credit (Paid)
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
                        {entry.debit > 0 ? `₹${entry.debit.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-8 py-4 text-right text-emerald-600 font-bold">
                        {entry.credit > 0 ? `₹${entry.credit.toFixed(2)}` : "-"}
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
                          <p>No transactions found for this client.</p>
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

export default Clients;
