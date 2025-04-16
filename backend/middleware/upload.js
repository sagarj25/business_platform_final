const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper to sanitize file names
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
};

// Helper to choose folder based on route and user ID
const getUploadFolder = (req) => {
  if (req.path.includes("campaign")) return "uploads/campaigns/";

  // Handle business upload with user-specific folder
  if (req.path.includes("business")) {
    const userId = req.body.user || req.query.user || "unknown";
    return `uploads/users/${userId}/`;
  }

  return "uploads/others/";
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getUploadFolder(req);

    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + sanitizeFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
