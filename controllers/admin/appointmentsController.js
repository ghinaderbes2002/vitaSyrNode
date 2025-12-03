import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ======================================
// إنشاء موعد جديد (Visitor)
// POST /appointments
// ======================================
export const createAppointment = async (req, res) => {
  try {
    const {
      caseId,
      patientName,
      phone,
      email,
      appointmentType,
      appointmentDate,
      appointmentTime,
      notes,
    } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        caseId,
        patientName,
        phone,
        email,
        appointmentType,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        notes,
        status: "PENDING",
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
  console.error("CREATE APPOINTMENT ERROR:", error);
  res.status(500).json({ message: error.message });
}

};

// ======================================
// جلب جميع المواعيد (Admin)
// GET /appointments
// ======================================
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        case: true,
        assignedTo: true,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================
// جلب تفاصيل موعد محدد
// GET /appointments/:id
// ======================================
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        case: true,
        assignedTo: true,
      },
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================
// تحديث حالة الموعد (Admin)
// PUT /appointments/:id
// ======================================
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedToId, notes } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        assignedToId: assignedToId || null,
        notes,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================
// حذف موعد
// DELETE /appointments/:id
// ======================================
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.appointment.delete({
      where: { id },
    });

    res.json({
      message: "Appointment deleted successfully",
      deleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
