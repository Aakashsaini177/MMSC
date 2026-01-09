// backend/routes/sales.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSale,
  getSales,
  updateSale,
  deleteSale,
  generateInvoice,
} from "../controllers/salesController.js";

const router = express.Router();

router.use(protect);

router.post("/", createSale);
router.get("/", getSales);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);
router.get("/:id/invoice", generateInvoice);

export default router;
