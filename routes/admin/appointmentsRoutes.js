import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../../controllers/admin/appointmentsController.js";

const router = express.Router();

router.post("/", createAppointment); // الزائر يحجز موعد
router.get("/", getAllAppointments); // الادمن يشوف الكل
router.get("/:id", getAppointmentById); // تفاصيل موعد
router.put("/:id", updateAppointment); // تحديث الحالة
router.delete("/:id", deleteAppointment); // حذف

export default router;
