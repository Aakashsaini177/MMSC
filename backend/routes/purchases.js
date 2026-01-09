// backend/routes/purchases.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController.js";

const router = express.Router();

router.use(protect);

router.post("/", createPurchase);
router.get("/", getPurchases);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
