import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =======================
// الفئات Categories
// =======================

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.productCategory.findMany({
      include: {
        subCategories: true,
        products: true,
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parentCategoryId, orderIndex, isActive } =
      req.body;

    const category = await prisma.productCategory.create({
      data: {
        name,
        slug,
        description,
        parentCategoryId,
        orderIndex: Number(orderIndex),
        isActive: isActive ?? true,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        subCategories: true,
        parentCategory: true,
        products: true,
      },
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.productCategory.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productCategory.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// المنتجات Products
// =======================

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        features: true,
        category: true,
        videos: true,
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      productType,
      description,
      specifications,
      price,
      isPriceVisible,
      metaTitle,
      metaDescription,
      isActive,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        slug,
        productType,
        description,
        specifications,
        price: Number(price),
        isPriceVisible: isPriceVisible ?? true,
        metaTitle,
        metaDescription,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        features: true,
        category: true,
        videos: true,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    // ملاحظة: لا نتعامل مع req.file لأن mainImage محذوف من السكيمة

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
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
    const { featureText, orderIndex } = req.body;

    const feature = await prisma.productFeature.create({
      data: {
        productId: id,
        featureText,
        orderIndex: Number(orderIndex),
      },
    });

    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { fid } = req.params;

    const updated = await prisma.productFeature.update({
      where: { id: fid },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const { fid } = req.params;

    await prisma.productFeature.delete({
      where: { id: fid },
    });

    res.json({ message: "Feature deleted successfully" });
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
    const { altText, orderIndex, isPrimary } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // إذا تم إرسال isPrimary = true لازم نلغي الباقي
    if (isPrimary === "true" || isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productId: id,
        imageUrl,
        altText,
        orderIndex: orderIndex ? Number(orderIndex) : 0,
        isPrimary: isPrimary === "true" || isPrimary === true,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { imgid } = req.params;

    await prisma.productImage.delete({
      where: { id: imgid },
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// الفيديوهات Videos
// =======================

export const addVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPrimary } = req.body;

    // التحقق من وجود ملف الفيديو
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // إذا تم إرسال isPrimary = true لازم نلغي الباقي
    if (isPrimary === "true" || isPrimary === true) {
      await prisma.productVideo.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      });
    }

    const video = await prisma.productVideo.create({
      data: {
        productId: id,
        videoUrl,
        isPrimary: isPrimary === "true" || isPrimary === true,
      },
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { vid } = req.params;

    await prisma.productVideo.delete({
      where: { id: vid },
    });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
