import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import clientRoutes from "./routes/clients.js";
import gstFilingRoutes from "./routes/gstFilingRoutes.js";
import salesRoute from "./routes/sales.js";
import supplierRoutes from "./routes/suppliers.js";
import purchaseRoutes from "./routes/purchases.js";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import gstRoutes from "./routes/gstRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mmsc.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/clients", clientRoutes);
app.use("/api/gstfilings", gstFilingRoutes);
app.use("/api/gst", gstRoutes);
app.use("/api/tax", taxRoutes); // New Income Tax module
app.use("/api/sales", salesRoute);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settings", settingsRoutes); // New Settings module
app.use("/api/inventory", inventoryRoutes); // New Inventory module
app.use("/api", reportRoutes); // Prefix is /api, so /api/dashboard/stats etc.
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/FinTaxPro")
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send(" FinTaxPro API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
