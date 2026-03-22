import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadsDir = path.resolve('uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
    return;
  }

  callback(new Error('Only image uploads are allowed'));
};

export const upload = multer({ storage, fileFilter });
