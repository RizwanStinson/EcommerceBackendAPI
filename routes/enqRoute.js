const express = require('express');
const router = express.Router();
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getallEnquiry } = require('../controller/enqCtrl');
const { authMiddleware, isAdmin } = require('../middlewears/authMiddleware');

router.post('/', createEnquiry);
router.put('/:id', authMiddleware, isAdmin, updateEnquiry);
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry);
router.get('/:id', getEnquiry);
router.get('/', getallEnquiry);

module.exports = router;