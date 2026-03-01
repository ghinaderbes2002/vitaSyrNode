import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

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

const ONE_MB = 1024 * 1024;

const compressFile = async (file) => {
  if (!file.mimetype.startsWith("image/") || file.size <= ONE_MB) return;

  const ext = path.extname(file.path).toLowerCase();
  const compressedPath = file.path.replace(ext, `_c${ext}`);

  let sharpInstance = sharp(file.path);
  if (ext === ".png") sharpInstance = sharpInstance.png({ quality: 80 });
  else if (ext === ".webp") sharpInstance = sharpInstance.webp({ quality: 80 });
  else sharpInstance = sharpInstance.jpeg({ quality: 80 });

  await sharpInstance.toFile(compressedPath);
  fs.unlinkSync(file.path);
  fs.renameSync(compressedPath, file.path);
  file.size = fs.statSync(file.path).size;
};

// middleware لضغط الصور تلقائياً إذا كانت أكبر من 1MB (يدعم single و fields)
export const compressImage = async (req, res, next) => {
  try {
    const promises = [];

    if (req.file) promises.push(compressFile(req.file));

    if (req.files) {
      const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
      files.forEach((file) => promises.push(compressFile(file)));
    }

    await Promise.all(promises);
    next();
  } catch (err) {
    next(err);
  }
};
