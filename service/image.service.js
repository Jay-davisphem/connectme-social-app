const multer = require("multer");
const crypto = require("node:crypto");
exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + "-" + file.originalname);
  },
});
exports.fileFilter = (res, file, cb) => {
  const mimetypes = new Set(["image/png", "image/jpg", "image/jpeg"]);
  if (mimetypes.has(file.mimetype)) cb(null, true);
  else cb(null, false);
};
