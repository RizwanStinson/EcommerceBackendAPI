const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

//where uploaded files should be stored and how their filenames should be generated
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// to filter out unsupported file formats
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
           .resize(300, 300)
           .toFormat('jpeg')
           .jpeg({ quality: 90 })
           .toFile(path.join(__dirname, `../public/images/products/${file.filename}`));
        fs.unlinkSync(path.join(__dirname, `../public/images/products/${file.filename}`)); // delete the original image from local storage (unresized)
    }));
    next();
};

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
           .resize(300, 300)
           .toFormat('jpeg')
           .jpeg({ quality: 90 })
           .toFile(path.join(__dirname, `../public/images/blogs/${file.filename}`));
        fs.unlinkSync(path.join(__dirname, `../public/images/blogs/${file.filename}`));
    }));
    next();
};

module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize,
}