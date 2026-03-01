import express from "express";
import {
  getAllPartners,
  createPartner,
  getPartnerById,
  updatePartner,
  deletePartner,
} from "../../controllers/admin/partnersController.js";
import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload, compressImage } from "../../middlewares/upload.js"; // لو حطينا Multer هنا

const router = express.Router();

// عرض جميع الشركاء للزائر
router.get("/", getAllPartners);

// CRUD للادمن
router.post("/", verifyToken, isAdmin, upload.single("logo"), compressImage, createPartner);
router.get("/:id", getPartnerById);
router.put("/:id", verifyToken, isAdmin, upload.single("logo"), compressImage, updatePartner);
router.delete("/:id", verifyToken, isAdmin, deletePartner);

export default router;
