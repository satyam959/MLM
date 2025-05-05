import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:8009';
const UPLOADS_FOLDER = 'Uploads';

const uploadDir = path.resolve(__dirname, '../../', UPLOADS_FOLDER);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const getUploadMiddleware = (fieldName = 'image', type = 'default') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      let filename;

      if (type === 'service') {
        // For service, use the original filename (without any changes)
        filename = file.originalname; // Retain the original file name
      } else {
        // For user registration or default, use timestamp as filename
        const timestamp = Date.now();
        filename = `${timestamp}${ext}`;
      }

      cb(null, filename);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) { // Expecting image files
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  });

  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) return next(err);

      if (req.file) {
        req.file.fullUrl = `${BASE_URL}/${UPLOADS_FOLDER}/${req.file.filename}`;
      }

      next();
    });
  };
};
