import multer from 'multer';

const fileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
    return;
  }

  callback(new Error('Only image uploads are allowed'));
};

export const upload = multer({ storage: multer.memoryStorage(), fileFilter });
