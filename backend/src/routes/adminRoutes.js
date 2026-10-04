const express = require('express');
const router = express.Router();
const { login, verify, getStats } = require('../controllers/adminController');
const { seedProducts } = require('../controllers/productController');

router.post('/login', login);
router.get('/verify', verify);
router.get('/stats', getStats);
router.post('/seed-catalog', seedProducts);

module.exports = router;
