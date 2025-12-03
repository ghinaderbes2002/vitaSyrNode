import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Partnership Inquiries

export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.partnershipInquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedTo: true },
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const data = { ...req.body };

    // تحويل assignedToId إذا موجود
    if (data.assignedToId === "") data.assignedToId = null;

    // تحويل status لتكون من enum إذا جاي نص
    if (!data.status) data.status = "NEW";

    const inquiry = await prisma.partnershipInquiry.create({ data });
    res.status(201).json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await prisma.partnershipInquiry.findUnique({
      where: { id },
      include: { assignedTo: true },
    });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.assignedToId === "") data.assignedToId = null;

    const updated = await prisma.partnershipInquiry.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.partnershipInquiry.delete({ where: { id } });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
