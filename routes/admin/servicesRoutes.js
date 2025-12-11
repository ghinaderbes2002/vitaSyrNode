import express from "express";
import {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
  addFeature,
  updateFeature,
  deleteFeature,
  addBenefit,
  updateBenefit,
  deleteBenefit,
  addImage,
  deleteImage,
} from "../../controllers/admin/servicesController.js";
import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js"; // لو حطينا Multer هنا


const router = express.Router();

// الخدمات الأساسية
router.get("/",  getAllServices);
router.post("/", verifyToken, isAdmin, createService);
router.get("/:id", verifyToken, isAdmin, getServiceById);
router.put("/:id", verifyToken, isAdmin, updateService);
router.delete("/:id", verifyToken, isAdmin, deleteService);

// الميزات Features
router.post("/:id/features", verifyToken, isAdmin, addFeature);
router.put("/:id/features/:fid", verifyToken, isAdmin, updateFeature);
router.delete("/:id/features/:fid", verifyToken, isAdmin, deleteFeature);

// الفوائد Benefits
router.post("/:id/benefits", verifyToken, isAdmin, addBenefit);
router.put("/:id/benefits/:bid", verifyToken, isAdmin, updateBenefit);
router.delete("/:id/benefits/:bid", verifyToken, isAdmin, deleteBenefit);

// الصور Images
router.post(
  "/:id/images",
  verifyToken,
  isAdmin,
  upload.single("image"),
  addImage
);
router.delete("/:id/images/:imgid", verifyToken, isAdmin, deleteImage);

export default router;
