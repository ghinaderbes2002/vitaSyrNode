import express from "express";
import {
  getAllStories,
  createStory,
  getStoryById,
  updateStory,
  deleteStory,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../controllers/admin/successStoriesController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

// =======================
// قصص النجاح Success Stories
// =======================
router.get("/success-stories", getAllStories);

router.post(
  "/success-stories",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 }, // رفع فيديو
  ]),
  createStory
);

router.get("/success-stories/:id",  getStoryById);

router.put(
  "/success-stories/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  updateStory
);

router.delete("/success-stories/:id", verifyToken, isAdmin, deleteStory);

// =======================
// المراحل Milestones
// =======================
router.post(
  "/success-stories/:id/milestones",
  verifyToken,
  isAdmin,
  upload.single("imageUrl"),
  createMilestone
);

router.put(
  "/success-stories/:id/milestones/:mid",
  verifyToken,
  isAdmin,
  upload.single("imageUrl"),
  updateMilestone
);

router.delete(
  "/success-stories/:id/milestones/:mid",
  verifyToken,
  isAdmin,
  deleteMilestone
);

export default router;
