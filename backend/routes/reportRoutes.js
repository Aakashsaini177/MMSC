import express from "express";
import {
  getDashboardStats,
  getChartData,
} from "../controllers/dashboardController.js";
import {
  getGSTReport,
  getPnLReport,
  exportGSTReportToExcel,
  exportPnLReportToExcel,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts", getChartData);

// Reports
router.get("/reports/gst", getGSTReport);
router.get("/reports/gst/excel", exportGSTReportToExcel);
router.get("/reports/pnl", getPnLReport);
router.get("/reports/pnl/excel", exportPnLReportToExcel);

export default router;
