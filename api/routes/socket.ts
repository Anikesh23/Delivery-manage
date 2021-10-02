import express from 'express';
const checkAuth = require('../middleware/check-auth');
const SocketController = require('../controllers/socket');
const router = express.Router();
router.post('/oldMessages', checkAuth, SocketController.getOldMessages);
module.exports = router;
