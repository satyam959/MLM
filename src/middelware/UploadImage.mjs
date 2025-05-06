// middleware/UploadImage.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom server configuration
// const BASE_URL = process.env.BASE_URL || 'http://localhost:8009'; // Use environment variable or default
const UPLOADS_FOLDER = 'Uploads'; // Folder name for uploads

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, '../../', UPLOADS_FOLDER);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`; // e.g., 1698765432123.jpg
    cb(null, filename);
  },
});

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Middleware to upload and attach full URL
export const getUploadMiddleware = (fieldName = 'image') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) return next(err);
      if (req.file) {
        req.file.fullUrl = `/${UPLOADS_FOLDER}/${req.file.filename}`; 
      }
      next();
    });
  };
};
