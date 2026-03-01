import express from "express";
import {
  getAllCases,
  createCase,
  getCaseById,
  updateCase,
  deleteCase,
  createDonation,
  getCaseDonations,
  updateDonationStatus,
} from "../../controllers/admin/sponsorshipController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload, compressImage } from "../../middlewares/upload.js";

const router = express.Router();


// حالات الرعاية Sponsorship Cases



// جلب الجميع (Website + Admin)
router.get("/sponsorship-cases", getAllCases);

// إنشاء حالة (Admin)
router.post(
  "/sponsorship-cases",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "caseImage", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  compressImage,
  createCase
);

// جلب حالة واحدة
router.get("/sponsorship-cases/:id", getCaseById);

// تعديل حالة (Admin)
router.put(
  "/sponsorship-cases/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "caseImage", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  compressImage,
  updateCase
);

// حذف حالة (Admin)
router.delete("/sponsorship-cases/:id", verifyToken, isAdmin, deleteCase);

// =======================
// التبرعات Donations
// =======================

// إضافة تبرع (Website)
router.post("/sponsorship-cases/:id/donations", createDonation);

// جلب تبرعات حالة (Admin)
router.get(
  "/sponsorship-cases/:id/donations",
  verifyToken,
  isAdmin,
  getCaseDonations
);


router.put(
  "/sponsorship-cases/:id/donations/:donationId/status",
  updateDonationStatus
);

export default router;
