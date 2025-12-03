import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import path from "path";

// عرض كل الشركاء للزائر
export const getAllPartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إضافة شريك جديد مع رفع الصورة
export const createPartner = async (req, res) => {
  try {
    const { name, website, isActive } = req.body;

    // تحويل isActive إلى Boolean
    const isActiveBool =
      isActive === "true" || isActive === true ? true : false;

    // التحقق من وجود صورة
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!logoUrl) {
      return res.status(400).json({ message: "Logo image is required" });
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        website,
        isActive: isActiveBool,
      },
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// عرض شريك محدد
export const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({ where: { id } });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل شريك مع رفع صورة جديدة
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;

    let data = { ...req.body };

    // تحويل isActive إلى Boolean إذا موجود
    if (data.isActive !== undefined) {
      data.isActive =
        data.isActive === "true" || data.isActive === true ? true : false;
    }

    // إذا في صورة جديدة
    if (req.file) {
      data.logoUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.partner.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// حذف شريك
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.partner.delete({ where: { id } });
    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
