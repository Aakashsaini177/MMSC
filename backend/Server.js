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
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Validate Environment Variables
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mmsc.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
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

app.get("/", (req, res) => {
  res.send(" FinTaxPro API Running");
});

// Error Handler Middleware
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
