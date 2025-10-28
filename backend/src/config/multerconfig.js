const multer = require("multer");
const path  = require("path");


// storage engine
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    // file ko public/uploads folder me save karna
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    // unique filename => Date.now + original extension
    const ext = path.extname(file.originalname); // e.g. .jpg, .png
    cb(null, Date.now() + "-" + file.fieldname + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video allowed"), false);
  }
};

const upload = multer({storage, fileFilter });

module.exports = upload;
