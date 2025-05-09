const express = require('express');
const queryController = require('../controllers/queryController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Legal query endpoints
router.post('/query', authMiddleware, queryController.handleQuery);
router.get('/queries', authMiddleware, queryController.getUserQueries);
router.get('/query/:id', authMiddleware, queryController.getQueryById);

// WhatsApp webhook for incoming messages
router.post('/whatsapp/webhook', queryController.handleWhatsAppWebhook);
router.get('/whatsapp/webhook', queryController.verifyWhatsAppWebhook);

module.exports = router;
