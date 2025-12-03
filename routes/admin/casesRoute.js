import express from "express";
import {
  createCase,
  getAllCases,
  updateCase,
  addCaseImage,
  addCaseNote,
  deleteCase,
  getCaseById,
} from "../../controllers/admin/casesController.js";
import { upload } from "../../middlewares/upload.js"; // لو حطينا Multer هنا
import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";



const router = express.Router();

// الزائر يسجل حالة
router.post("/", createCase);

// الأدمن يشوف كل الحالات
router.get("/", getAllCases);

router.get("/:id", getCaseById);


// تحديث حالة (status, assignedTo)
router.put("/:id",verifyToken, isAdmin, updateCase);


// رفع صور
router.post("/:id/images", upload.single("image"), addCaseImage);

// إضافة ملاحظة
router.post("/:id/notes", addCaseNote);
// حذف حالة
router.delete("/:id",verifyToken, isAdmin, deleteCase);


export default router;
