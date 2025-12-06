import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//
// =======================
// الفئات Categories
// =======================
//

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { orderIndex: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, orderIndex, isActive } = req.body;

    const category = await prisma.blogCategory.create({
      data: { name, slug, description, orderIndex, isActive },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.blogCategory.update({
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

    await prisma.blogCategory.delete({ where: { id } });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// =======================
// المقالات Posts
// =======================
//

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      categoryId,
      authorId,
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
      isFeatured,
      tags,
    } = req.body;

    const featuredImage = req.file ? req.file.filename : null;

    const post = await prisma.blogPost.create({
      data: {
        categoryId,
        authorId,
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        status,
        publishedAt,
        isFeatured: isFeatured === "true" || isFeatured === true,
        tags: tags
          ? {
              connect: JSON.parse(tags).map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoryId,
      authorId,
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
      isFeatured,
      tags,
    } = req.body;

    const featuredImage = req.file ? req.file.filename : undefined;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        categoryId,
        authorId,
        title,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        status,
        publishedAt,
        isFeatured: isFeatured === "true" || isFeatured === true,
        featuredImage,
        tags: tags
          ? {
              set: [],
              connect: JSON.parse(tags).map((id) => ({ id })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blogPost.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// =======================
// الوسوم Tags
// =======================
//

export const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.blogTag.findMany({
      orderBy: { name: "asc" },
    });

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const tag = await prisma.blogTag.create({
      data: { name, slug },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blogTag.delete({
      where: { id },
    });

    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
