const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const uploadPet = multer({ storage });

module.exports = { uploadPet };
