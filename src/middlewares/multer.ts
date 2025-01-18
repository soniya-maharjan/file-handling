import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./temp";
    // Create 'uploads' directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer instance
const uploadFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});


export {uploadFile};