import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
// تسجيل الدخول
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash); // camelCase
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, full_name: user.fullName }, // map fullName → full_name للـ response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// عرض بيانات Admin الحالي
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تعديل بيانات Admin
export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, password } = req.body;
    const data = {};

    if (full_name) data.fullName = full_name;       // map full_name → fullName
    if (phone) data.phone = phone;
    if (password) data.passwordHash = await bcrypt.hash(password, 10); // password → passwordHash

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// عرض جميع الـ Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إنشاء Admin جديد
export const createAdmin = async (req, res) => {
  try {
    const { email, full_name, phone, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        fullName: full_name,       // map full_name → fullName
        phone,
        passwordHash: hashed,      // map password → passwordHash
        role: "ADMIN",
        isActive: true             // map is_active → isActive
      },
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف Admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
