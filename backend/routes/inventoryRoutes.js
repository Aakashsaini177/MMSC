import express from "express";
import {
  addAdjustment,
  getAdjustments,
} from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addAdjustment).get(protect, getAdjustments);

export default router;
