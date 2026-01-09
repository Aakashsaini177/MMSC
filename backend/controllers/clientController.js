import Client from "../models/Client.js";
import Sale from "../models/Sale.js";

// @desc    Get all clients
// @route   GET /api/clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a client
// @route   POST /api/clients
export const createClient = async (req, res) => {
  const { name, email, gstNumber, phone, address, status } = req.body;
  try {
    const client = new Client({
      name,
      email,
      gstNumber,
      phone,
      address,
      status,
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    Object.assign(client, req.body);
    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    await client.deleteOne();
    res.json({ message: "Client removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get Client Ledger (Sales History)
// @route   GET /api/clients/:id/ledger
export const getClientLedger = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client) return res.status(404).json({ message: "Client not found" });

    // Find sales for this client (matching by name)
    // Optimization: Select only necessary fields and use lean()
    const sales = await Sale.find({ customerName: client.name })
      .select("saleDate totalAmount paidAmount pendingAmount")
      .sort({ saleDate: -1 })
      .lean();

    const ledger = sales.map((sale) => ({
      date: sale.saleDate,
      description: `Invoice #${sale._id.toString().slice(-6).toUpperCase()}`,
      debit: sale.totalAmount, // Amount to be paid by client
      credit: sale.paidAmount, // Amount paid by client
      balance: sale.pendingAmount,
    }));

    // Calculate total pending
    const totalPending = sales.reduce(
      (acc, s) => acc + (s.pendingAmount || 0),
      0
    );

    res.json({ client, ledger, totalPending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
