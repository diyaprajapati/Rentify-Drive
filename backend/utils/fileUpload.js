const multer = require("multer");
const path = require("path");

// storage in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  // checks file extension
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // check MIME type like
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
  fileFilter: fileFilter,
});

module.exports = {
  single: upload.single("image"),
  multiple: upload.array("images", 5), // Allow up to 5 images
};
