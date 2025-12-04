import express from "express";
import {
  getGSTR1,
  getGSTR2,
  getGSTR3B,
  getHSNSummary,
} from "../controllers/gstController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/gstr1", getGSTR1);
router.get("/gstr2", getGSTR2);
router.get("/gstr3b", getGSTR3B);
router.get("/hsn", getHSNSummary);

export default router;
