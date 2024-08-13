const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/userImages");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const imageUpload = multer({ storage: imageStorage });

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "uploads/");
    if (file.fieldname === "userImage") {
      uploadPath = path.join(uploadPath, "userImages");
    } else if (file.fieldname === "portfolioImages") {
      uploadPath = path.join(uploadPath, "portfolioImages");
    } else if (file.fieldname === "certificationImage") {
      uploadPath = path.join(uploadPath, "certificationImages");
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileUpload = multer({ storage: fileStorage });

module.exports = {
  upload,
  imageUpload,
  fileUpload,
};
