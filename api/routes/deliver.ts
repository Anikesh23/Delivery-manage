import express from 'express';
const checkAuth = require('../middleware/check-auth');
const DeliverController = require('../controllers/deliver');
const router = express.Router();
router.post('/deliveryStatus', checkAuth, DeliverController.setDelievryStatus);

module.exports = router;
