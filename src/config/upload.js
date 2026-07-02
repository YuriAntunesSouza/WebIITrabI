const multer = require("multer");
const path = require("path");
const fs = require("fs");

const productUploadDir = path.resolve(__dirname, "../../uploads/products");

fs.mkdirSync(productUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, productUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Envie uma imagem JPG, PNG, WEBP ou GIF."));
  }
}

const productImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const commentUploadDir = path.resolve(__dirname, "../../uploads/comments");
fs.mkdirSync(commentUploadDir, { recursive: true });

const commentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, commentUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const commentImageUpload = multer({
  storage: commentStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { productImageUpload, commentImageUpload };