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
  getAllTags,
  createTag,
  deleteTag,
} from "../../controllers/admin/blogController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";


const router = express.Router();

// =======================
// الفئات Categories
// =======================
router.get("/blog-categories", verifyToken, isAdmin, getAllCategories);
router.post("/blog-categories", verifyToken, isAdmin, createCategory);
router.put("/blog-categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/blog-categories/:id", verifyToken, isAdmin, deleteCategory);

// =======================
// المقالات Posts
// =======================
router.get("/blog-posts", verifyToken, isAdmin, getAllPosts);
router.post("/blog-posts", verifyToken, isAdmin, createPost);
router.get("/blog-posts/:id", verifyToken, isAdmin, getPostById);
router.put("/blog-posts/:id", verifyToken, isAdmin, updatePost);
router.delete("/blog-posts/:id", verifyToken, isAdmin, deletePost);

// =======================
// الوسوم Tags
// =======================
router.get("/blog-tags", verifyToken, isAdmin, getAllTags);
router.post("/blog-tags", verifyToken, isAdmin, createTag);
router.delete("/blog-tags/:id", verifyToken, isAdmin, deleteTag);

export default router;
