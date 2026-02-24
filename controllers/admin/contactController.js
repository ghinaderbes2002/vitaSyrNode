import { PrismaClient } from "@prisma/client";
import { sendContactNotification } from "../../utils/emailService.js";
const prisma = new PrismaClient();

// --- جلب كل الرسائل ---
export const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: { repliedBy: true },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- إرسال رسالة جديدة ---
export const createMessage = async (req, res) => {
  try {
    const data = req.body;
    data.status = "NEW";
    const message = await prisma.contactMessage.create({ data });

    // إرسال إشعار بالإيميل (في الخلفية - ما يأثر على الرد)
    sendContactNotification({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- الرد على رسالة ---
export const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, repliedById } = req.body;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        replyMessage,
        repliedById,
        status: "REPLIED",
        repliedAt: new Date(),
      },
      include: { repliedBy: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- إغلاق الرسالة ---
export const closeMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: "CLOSED" },
      include: { repliedBy: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
