const express = require('express');
const router = express.Router();
const { createBrand, updateBrand, deleteBrand, getBrand, getallBrand } = require('../controller/brandCtrl');
const { authMiddleware, isAdmin } = require('../middlewears/authMiddleware');

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', getBrand);
router.get('/', getallBrand);

module.exports = router;