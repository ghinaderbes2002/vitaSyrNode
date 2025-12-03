import express from "express";
import {
  getAllInquiries,
  createInquiry,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from "../../controllers/admin/partnershipController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// استفسارات الشراكات Partnership Inquiries

router.get("/partnership-inquiries", verifyToken, isAdmin, getAllInquiries);
router.post("/partnership-inquiries", verifyToken, isAdmin, createInquiry);
router.get("/partnership-inquiries/:id", verifyToken, isAdmin, getInquiryById);
router.put("/partnership-inquiries/:id", verifyToken, isAdmin, updateInquiry);
router.delete(
  "/partnership-inquiries/:id",
  verifyToken,
  isAdmin,
  deleteInquiry
);

export default router;
