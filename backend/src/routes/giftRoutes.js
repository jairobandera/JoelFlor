const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', giftController.getAllGifts);
router.get('/:id', giftController.getGiftById);
router.post('/', authenticateToken, giftController.createGift);
router.put('/:id', authenticateToken, giftController.updateGift);
router.delete('/:id', authenticateToken, giftController.deleteGift);
router.post('/fetch-image', authenticateToken, giftController.fetchProductImage);

module.exports = router;
