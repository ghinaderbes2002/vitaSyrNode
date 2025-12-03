import express from "express";
import {
  getAllApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../../controllers/admin/jobsController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js"; // لو حطينا Multer هنا


const router = express.Router();

// طلبات التوظيف Job Applications
router.get("/job-applications", verifyToken, isAdmin, getAllApplications);
router.post("/job-applications", upload.single("cvFile"), createApplication);
router.get("/job-applications/:id", verifyToken, isAdmin, getApplicationById);
router.put("/job-applications/:id", verifyToken, isAdmin, updateApplication);
router.delete("/job-applications/:id", verifyToken, isAdmin, deleteApplication);

export default router;
