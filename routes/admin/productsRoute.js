import express from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addFeature,
  updateFeature,
  deleteFeature,
  addImage,
  deleteImage,
  addVideo,
  deleteVideo,
} from "../../controllers/admin/productsController.js";
import { upload } from "../../middlewares/upload.js"; // لو حطينا Multer هنا

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// الفئات Categories
// =======================
router.get("/product-categories", getAllCategories);
router.post("/product-categories", verifyToken, isAdmin, createCategory);
router.get("/product-categories/:id", getCategoryById);
router.put("/product-categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/product-categories/:id", verifyToken, isAdmin, deleteCategory);

// =======================
// المنتجات Products
// =======================
router.get("/products", getAllProducts);
router.post("/products", verifyToken, isAdmin, createProduct);
router.get("/products/:id",  getProductById);
router.put("/products/:id", verifyToken, isAdmin, updateProduct);
router.delete("/products/:id", verifyToken, isAdmin, deleteProduct);

// =======================
// الميزات Features
// =======================
router.post("/products/:id/features", verifyToken, isAdmin, addFeature);
router.put("/products/:id/features/:fid", verifyToken, isAdmin, updateFeature);
router.delete(
  "/products/:id/features/:fid",
  verifyToken,
  isAdmin,
  deleteFeature
);

// =======================
// الصور Images
// =======================
router.post(
  "/products/:id/images",
  verifyToken,
  isAdmin,
  upload.single("image"),
  addImage
);
router.delete("/products/:id/images/:imgid", verifyToken, isAdmin, deleteImage);

// =======================
// الفيديوهات Videos
// =======================
router.post(
  "/products/:id/videos",
  verifyToken,
  isAdmin,
  upload.single("video"),
  addVideo
);
router.delete("/products/:id/videos/:vid", verifyToken, isAdmin, deleteVideo);

export default router;
