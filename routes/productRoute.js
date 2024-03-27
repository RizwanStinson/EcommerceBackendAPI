const express = require('express');
const { createProduct, getaProduct, getallProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewears/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewears/uploadImages');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);

router.get('/:id', getaProduct);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating);

router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/', getallProducts);


module.exports = router;