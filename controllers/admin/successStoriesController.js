import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =======================
// جلب جميع القصص
// =======================
export const getAllStories = async (req, res) => {
  try {
    const stories = await prisma.successStory.findMany({
      include: { milestones: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// إنشاء قصة جديدة
// =======================
export const createStory = async (req, res) => {
  try {
    const data = req.body;

    // تحويل الأنواع
    if (data.age) data.age = Number(data.age);
    if (data.orderIndex) data.orderIndex = Number(data.orderIndex);
    if (data.isFeatured) data.isFeatured = data.isFeatured === "true";
    if (data.isActive) data.isActive = data.isActive === "true";

    // صور قبل وبعد
    if (req.files?.beforeImage)
      data.beforeImage = "/uploads/" + req.files.beforeImage[0].filename;

    if (req.files?.afterImage)
      data.afterImage = "/uploads/" + req.files.afterImage[0].filename;

    // فيديو
    if (req.files?.videoUrl)
      data.videoUrl = "/uploads/" + req.files.videoUrl[0].filename;

    const story = await prisma.successStory.create({ data });

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// جلب قصة واحدة
// =======================
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.successStory.findUnique({
      where: { id },
      include: { milestones: true },
    });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// تحديث قصة
// =======================
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // تحويل الأنواع
    if (data.age) data.age = Number(data.age);
    if (data.orderIndex) data.orderIndex = Number(data.orderIndex);
    if (data.isFeatured) data.isFeatured = data.isFeatured === "true";
    if (data.isActive) data.isActive = data.isActive === "true";

    // صور قبل وبعد
    if (req.files?.beforeImage)
      data.beforeImage = "/uploads/" + req.files.beforeImage[0].filename;

    if (req.files?.afterImage)
      data.afterImage = "/uploads/" + req.files.afterImage[0].filename;

    if (req.files?.videoUrl)
      data.videoUrl = "/uploads/" + req.files.videoUrl[0].filename;

    const updated = await prisma.successStory.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// حذف قصة
// =======================
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.successStory.delete({ where: { id } });

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// إضافة مرحلة Milestone
// =======================
export const createMilestone = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      ...req.body,
      storyId: id,
    };

    // تحويل الأنواع
    if (data.orderIndex) data.orderIndex = Number(data.orderIndex);
    if (data.date) data.date = new Date(data.date); // إذا كانت Date String

    // الصورة
    if (req.file) data.imageUrl = "/uploads/" + req.file.filename;

    const milestone = await prisma.storyMilestone.create({ data });

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// تحديث Milestone
// =======================
export const updateMilestone = async (req, res) => {
  try {
    const { mid } = req.params;
    const data = req.body;

    // تحويل الأنواع
    if (data.orderIndex) data.orderIndex = Number(data.orderIndex);
    if (data.date) data.date = new Date(data.date);

    // إذا تم رفع صورة جديدة
    if (req.file) {
      data.imageUrl = "/uploads/" + req.file.filename;
    } else {
      // إذا المستخدم أرسل imageUrl = "" لازم نمسحه من الـ data
      if (data.imageUrl === "") delete data.imageUrl;
    }

    const updated = await prisma.storyMilestone.update({
      where: { id: mid },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// حذف Milestone
// =======================
export const deleteMilestone = async (req, res) => {
  try {
    const { mid } = req.params;

    await prisma.storyMilestone.delete({
      where: { id: mid },
    });

    res.json({ message: "Milestone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
