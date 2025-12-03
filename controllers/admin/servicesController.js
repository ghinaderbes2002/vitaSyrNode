import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =======================
// الخدمات الأساسية
// =======================

// عرض جميع الخدمات
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        features: true,
        benefits: true,
        images: true,
      },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إضافة خدمة جديدة
export const createService = async (req, res) => {
  try {
    const {
      slug,
      title,
      serviceType,
      shortDescription,
      fullDescription,
      mainImage,
      metaTitle,
      metaDescription,
      isActive,
    } = req.body;

    const newService = await prisma.service.create({
      data: {
        slug,
        title,
        serviceType,
        shortDescription,
        fullDescription,
        mainImage,
        metaTitle,
        metaDescription,
        isActive,
      },
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// عرض خدمة محددة
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        features: true,
        benefits: true,
        images: true,
      },
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل خدمة
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف خدمة
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// الميزات Features
// =======================

export const addFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, orderIndex } = req.body;

    const feature = await prisma.serviceFeature.create({
      data: { serviceId: id, title, description, orderIndex },
    });

    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { fid } = req.params;
    const data = req.body;

    const updated = await prisma.serviceFeature.update({
      where: { id: fid },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const { fid } = req.params;

    await prisma.serviceFeature.delete({
      where: { id: fid },
    });

    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// الفوائد Benefits
// =======================

export const addBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { benefitText, orderIndex } = req.body;

    const benefit = await prisma.serviceBenefit.create({
      data: { serviceId: id, benefitText, orderIndex },
    });

    res.status(201).json(benefit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBenefit = async (req, res) => {
  try {
    const { bid } = req.params;
    const data = req.body;

    const updated = await prisma.serviceBenefit.update({
      where: { id: bid },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBenefit = async (req, res) => {
  try {
    const { bid } = req.params;

    await prisma.serviceBenefit.delete({
      where: { id: bid },
    });

    res.json({ message: "Benefit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// الصور Images
// =======================

export const addImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { altText } = req.body;
    const orderIndex = req.body.orderIndex ? parseInt(req.body.orderIndex) : 0; // تحويل النص لعدد
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl)
      return res.status(400).json({ message: "Image file is required" });

    const image = await prisma.serviceImage.create({
      data: { serviceId: id, imageUrl, altText, orderIndex },
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteImage = async (req, res) => {
  try {
    const { imgid } = req.params;

    await prisma.serviceImage.delete({
      where: { id: imgid },
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
