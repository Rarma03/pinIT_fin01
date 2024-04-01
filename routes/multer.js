const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//to get extension for the file we have uploaded
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        const uniquename = uuidv4();
        cb(null, uniquename + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

module.exports = upload;