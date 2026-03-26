import express from "express";
import { verifyApiKey } from "../../middlewares/apiKeyMiddleware.js";
import {
  getApplicationsExternal,
  getApplicationByIdExternal,
  updateApplicationExternal,
  getApplicationsStats,
} from "../../controllers/admin/externalJobsController.js";

const router = express.Router();

router.use(verifyApiKey);

router.get("/job-applications", getApplicationsExternal);
router.get("/job-applications/stats", getApplicationsStats);
router.get("/job-applications/:id", getApplicationByIdExternal);
router.put("/job-applications/:id", updateApplicationExternal);

export default router;
