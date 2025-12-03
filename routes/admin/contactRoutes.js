import express from "express";
import {
  getAllMessages,
  createMessage,
  replyMessage,
  closeMessage,
} from "../../controllers/admin/contactController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// --- الزائر يرسل رسالة ---
router.post("/", createMessage);

// --- الادمن يشوف كل الرسائل ---
router.get("/", verifyToken, isAdmin, getAllMessages);

// --- الادمن يرد على رسالة ---
router.put("/reply/:id", verifyToken, isAdmin, replyMessage);

// --- الادمن يغلق الرسالة ---
router.put("/close/:id", verifyToken, isAdmin, closeMessage);

export default router;
