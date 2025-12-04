import express from "express";
import { getIncomeTaxSummary } from "../controllers/taxController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/income-tax", getIncomeTaxSummary);

export default router;
