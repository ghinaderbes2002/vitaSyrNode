import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// تسجيل حالة جديدة (زائر)

export const createCase = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      email,
      address,
      amputationType,
      amputationLevel,
      amputationDate,
      currentCondition,
      previousProsthetics,
      additionalNotes,
      priority,
    } = req.body;

    const newCase = await prisma.caseRegistration.create({
      data: {
        fullName,
        age: Number(age),
        gender,
        phone,
        email,
        address,
        amputationType,
        amputationLevel,
        amputationDate: new Date(amputationDate),
        currentCondition,
        previousProsthetics: previousProsthetics === "true",
        additionalNotes,
        status: "NEW",
        priority,
      },
    });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// عرض كل الحالات (Admin)
export const getAllCases = async (req, res) => {
  try {
    const cases = await prisma.caseRegistration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        notes: true,
        assignedTo: true,
      },
    });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// جلب تفاصيل حالة معينة (مع الصور والملاحظات والشخص المعيّن)
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await prisma.caseRegistration.findUnique({
      where: { id },
      include: {
        images: true,
        notes: {
          include: {
            user: true, // إذا بدك تجيب معلومات الشخص يلي كتب الملاحظة
          },
        },
        assignedTo: true,
      },
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// تحديث حالة معينة
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      age,
      gender,
      phone,
      email,
      address,
      amputationType,
      amputationLevel,
      amputationDate,
      currentCondition,
      previousProsthetics,
      additionalNotes,
      status,
      priority,
      assignedToId,
    } = req.body;

    const updated = await prisma.caseRegistration.update({
      where: { id },
      data: {
        fullName,
        age: age ? Number(age) : undefined,
        gender,
        phone,
        email,
        address,
        amputationType,
        amputationLevel,
        amputationDate: amputationDate ? new Date(amputationDate) : undefined,
        currentCondition,
        previousProsthetics:
          previousProsthetics === "true"
            ? true
            : previousProsthetics === "false"
            ? false
            : undefined,
        additionalNotes,
        status,
        priority,
        assignedToId: assignedToId || null,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// إضافة صورة للحالة
export const addCaseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageType } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image file required" });

    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await prisma.caseImage.create({
      data: {
        caseId: id,
        imageUrl,
        imageType,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إضافة ملاحظة للحالة

export const addCaseNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, noteText, noteType } = req.body;

    const note = await prisma.caseNote.create({
      data: {
        caseId: id,
        userId,
        noteText,
        noteType,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// حذف حالة بشكل كامل
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    // حذف الصور التابعة للحالة
    await prisma.caseImage.deleteMany({
      where: { caseId: id },
    });

    // حذف الملاحظات التابعة للحالة
    await prisma.caseNote.deleteMany({
      where: { caseId: id },
    });

    // حذف الحالة نفسها
    const deletedCase = await prisma.caseRegistration.delete({
      where: { id },
    });

    res.json({
      message: "Case deleted successfully",
      deletedCase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
