import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getApplicationsExternal = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.jobApplication.count({ where }),
    ]);

    res.json({
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationByIdExternal = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.jobApplication.findUnique({ where: { id } });
    if (!application) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationExternal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionNote, rating, reviewNotes } = req.body;

    const validStatuses = ["PENDING", "INTERVIEW_READY", "ACCEPTED", "REJECTED", "HIRED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "حالة غير صالحة", validStatuses });
    }

    if (status === "REJECTED" && !rejectionNote) {
      return res.status(400).json({ message: "يجب إضافة ملاحظة الرفض" });
    }

    if (status === "ACCEPTED" && (rating === undefined || rating === null)) {
      return res.status(400).json({ message: "يجب إضافة درجة التقييم" });
    }

    if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "درجة التقييم يجب أن تكون بين 1 و 5" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (rejectionNote !== undefined) updateData.rejectionNote = rejectionNote;
    if (rating !== undefined) updateData.rating = rating;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;

    const updated = await prisma.jobApplication.update({ where: { id }, data: updateData });
    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsStats = async (req, res) => {
  try {
    const [total, pending, interviewReady, accepted, rejected, hired] = await Promise.all([
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: "PENDING" } }),
      prisma.jobApplication.count({ where: { status: "INTERVIEW_READY" } }),
      prisma.jobApplication.count({ where: { status: "ACCEPTED" } }),
      prisma.jobApplication.count({ where: { status: "REJECTED" } }),
      prisma.jobApplication.count({ where: { status: "HIRED" } }),
    ]);

    res.json({ total, pending, interviewReady, accepted, rejected, hired });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
