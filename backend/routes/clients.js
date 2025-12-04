import express from "express";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientLedger,
} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getClients);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.get("/:id/ledger", getClientLedger);

export default router;
