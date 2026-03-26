import { PrismaClient } from "@prisma/client";
import path from "path";
import { sendJobApplicationNotification } from "../../utils/emailService.js";
const prisma = new PrismaClient();

// Job Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { reviewedBy: true }, // لاحظ camelCase
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const {
      fullName, email, phone, specialization,
      yearsOfExperience, education, coverLetter, linkedinUrl,
      ref1Name, ref1Company, ref1JobTitle, ref1Phone,
      ref2Name, ref2Company, ref2JobTitle, ref2Phone,
    } = req.body;

    if (
      !fullName || !email || !phone || !specialization ||
      !yearsOfExperience || !education ||
      !ref1Name || !ref1Company || !ref1JobTitle || !ref1Phone ||
      !ref2Name || !ref2Company || !ref2JobTitle || !ref2Phone
    ) {
      return res.status(400).json({ message: "يرجى ملء كل الحقول المطلوبة" });
    }

    const cvFileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const application = await prisma.jobApplication.create({
      data: {
        fullName, email, phone, specialization,
        yearsOfExperience: parseInt(yearsOfExperience, 10),
        education, cvFileUrl,
        coverLetter: coverLetter || null,
        linkedinUrl: linkedinUrl || null,
        ref1Name, ref1Company, ref1JobTitle, ref1Phone,
        ref2Name, ref2Company, ref2JobTitle, ref2Phone,
        status: "PENDING",
      },
    });

    const cvFilePath = req.file ? path.resolve(req.file.path) : null;
    sendJobApplicationNotification({
      fullName, email, phone, specialization,
      yearsOfExperience, education, coverLetter, linkedinUrl,
      ref1Name, ref1Company, ref1JobTitle, ref1Phone,
      ref2Name, ref2Company, ref2JobTitle, ref2Phone,
      cvFilePath,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { reviewedBy: true },
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.jobApplication.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jobApplication.delete({ where: { id } });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
