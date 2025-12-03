import express from "express";

import {
  login,
  getProfile,
  updateProfile,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
} from "../../../controllers/admin/auth/authController.js";

import { verifyToken, isAdmin } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// تسجيل الدخول
router.post("/login", login);

// بيانات الـ Admin الحالي
router.get("/profile", verifyToken, isAdmin, getProfile);

// تعديل بيانات الـ Admin
router.put("/profile", verifyToken, isAdmin, updateProfile);

// عرض جميع الـ Admins
router.get("/users", verifyToken, isAdmin, getAllAdmins);

// إضافة Admin جديد
router.post("/users", createAdmin);

// حذف Admin
router.delete("/users/:id", verifyToken, isAdmin, deleteAdmin);

export default router;
