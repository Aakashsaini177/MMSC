// backend/routes/gstFilingRoutes.js
import express from "express";
import {
  calculateGSTLink,
  getFilings,
  markFilingAsFiled,
} from "../controllers/gstFilingController.js";

const router = express.Router();

// POST /api/gstfilings/calculate
// body: { month: <1..12>, year: <yyyy> }
router.post("/calculate", calculateGSTLink);

// GET /api/gstfilings  - list filings
router.get("/", getFilings);

// PUT /api/gstfilings/:id/mark-filed
router.put("/:id/mark-filed", markFilingAsFiled);

export default router;
