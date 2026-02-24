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

// فلتر لأنواع الملفات المسموح بها
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const allowedVideoTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // التحقق من الصور
  if (mimetype.startsWith('image/') && allowedImageTypes.test(extname.slice(1))) {
    return cb(null, true);
  }

  // التحقق من الفيديوهات
  if (mimetype.startsWith('video/') && allowedVideoTypes.test(extname.slice(1))) {
    return cb(null, true);
  }

  // التحقق من ملفات PDF (للسير الذاتية)
  if (mimetype === 'application/pdf' && extname === '.pdf') {
    return cb(null, true);
  }

  cb(new Error('Only image, video, and PDF files are allowed!'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  }
});
