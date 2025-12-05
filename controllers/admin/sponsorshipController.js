import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =======================
// جلب جميع الحالات (Website + Admin)
// =======================
export const getAllCases = async (req, res) => {
  try {
    const cases = await prisma.sponsorshipCase.findMany({
      orderBy: { createdAt: "desc" },
      include: { donations: true },
    });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// جلب حالة واحدة
// =======================
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await prisma.sponsorshipCase.findUnique({
      where: { id },
      include: { donations: true },
    });

    if (!caseData) return res.status(404).json({ message: "Case not found" });

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// إنشاء حالة جديدة (Admin)
// =======================
export const createCase = async (req, res) => {
  try {
    const data = req.body;

    // تحويل الأنواع
    if (data.age) data.age = Number(data.age);
    if (data.estimatedCost) data.estimatedCost = Number(data.estimatedCost);
    if (data.targetAmount) data.targetAmount = Number(data.targetAmount);
    if (data.isFeatured) data.isFeatured = data.isFeatured === "true";

    // صور
    if (req.files?.caseImage)
      data.caseImage = "/uploads/" + req.files.caseImage[0].filename;

    // فيديو
    if (req.files?.videoUrl)
      data.videoUrl = "/uploads/" + req.files.videoUrl[0].filename;

    // تواريخ
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const newCase = await prisma.sponsorshipCase.create({ data });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// تحديث حالة (Admin)
// =======================
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // تحويل الأنواع
    if (data.age) data.age = Number(data.age);
    if (data.estimatedCost) data.estimatedCost = Number(data.estimatedCost);
    if (data.targetAmount) data.targetAmount = Number(data.targetAmount);
    if (data.isFeatured !== undefined)
      data.isFeatured = data.isFeatured === "true";

    // صور جديدة
    if (req.files?.caseImage)
      data.caseImage = "/uploads/" + req.files.caseImage[0].filename;

    if (req.files?.videoUrl)
      data.videoUrl = "/uploads/" + req.files.videoUrl[0].filename;

    // تواريخ
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updated = await prisma.sponsorshipCase.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// حذف حالة (Admin)
// =======================
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sponsorshipCase.delete({ where: { id } });

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// إضافة تبرع (Website)
// =======================
export const createDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // تحقق أن الحالة موجودة
    const exists = await prisma.sponsorshipCase.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "Case not found" });

    data.caseId = id;
    if (data.amount) data.amount = Number(data.amount);
    if (!data.paymentStatus) data.paymentStatus = "PENDING";

    // إنشاء تبرع
    const donation = await prisma.sponsorshipDonation.create({ data });

    // تحديث المبلغ ONLY إذا الدفع مكتمل
    if (data.paymentStatus === "COMPLETED") {
      await prisma.sponsorshipCase.update({
        where: { id },
        data: {
          raisedAmount: { increment: Number(data.amount) },
        },
      });
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateDonationStatus = async (req, res) => {
  try {
    const { id, donationId } = req.params; // id = caseId
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: "paymentStatus is required" });
    }

    // تأكد أن الحالة موجودة
    const sponsorCase = await prisma.sponsorshipCase.findUnique({
      where: { id },
    });

    if (!sponsorCase) {
      return res.status(404).json({ message: "Sponsorship case not found" });
    }

    // تأكد أن التبرع موجود
    const donation = await prisma.sponsorshipDonation.findUnique({
      where: { id: donationId },
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // تحديث حالة الدفع
    const updatedDonation = await prisma.sponsorshipDonation.update({
      where: { id: donationId },
      data: { paymentStatus },
    });

    // إذا الدفع صار مكتمل → ضيف المبلغ
    if (paymentStatus === "COMPLETED") {
      await prisma.sponsorshipCase.update({
        where: { id },
        data: {
          raisedAmount: { increment: Number(donation.amount) },
        },
      });
    }

    res.json({
      message: "Payment status updated",
      donation: updatedDonation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// جلب تبرعات حالة معينة (Admin)
// =======================
export const getCaseDonations = async (req, res) => {
  try {
    const { id } = req.params;

    const donations = await prisma.sponsorshipDonation.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
