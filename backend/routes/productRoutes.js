import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All product routes are protected

router.route("/").get(getProducts).post(createProduct);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default router;
