import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "../../controllers/admin/blogController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

// =======================
// الفئات
// =======================
router.get("/blog-categories", verifyToken, isAdmin, getAllCategories);
router.post("/blog-categories", verifyToken, isAdmin, createCategory);
router.put("/blog-categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/blog-categories/:id", verifyToken, isAdmin, deleteCategory);

// =======================
// المقالات
// =======================
router.get("/blog-posts",  getAllPosts);

router.post(
  "/blog-posts",
  verifyToken,
  isAdmin,
  upload.single("featuredImage"),
  createPost
);

router.get("/blog-posts/:id", verifyToken, isAdmin, getPostById);

router.put(
  "/blog-posts/:id",
  verifyToken,
  isAdmin,
  upload.single("featuredImage"),
  updatePost
);

router.delete("/blog-posts/:id", verifyToken, isAdmin, deletePost);

export default router;
