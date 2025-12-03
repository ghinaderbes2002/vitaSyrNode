import multer from "multer";
import path from "path";

// تخزين محلي
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // مجلد الرفع
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد للملف
  },
});

export const upload = multer({ storage });
