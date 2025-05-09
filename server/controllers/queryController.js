const Query = require('../models/Query');
const ragService = require('../services/rag/ragService');
const topicIdentifier = require('../services/nlp/topicIdentification');
const whatsappService = require('../services/whatsapp/whatsappService');

exports.handleQuery = async (req, res, next) => {
  try {
    const { text, language = 'en' } = req.body;
    const userId = req.user.id;
    
    // Identify legal topic from the query
    const topic = await topicIdentifier.identifyTopic(text);
    
    // Store the query in database
    const queryRecord = await Query.create(userId, text, topic, language);
    
    // Process with RAG
    const response = await ragService.processQuery(text, topic, language);
    
    return res.status(200).json({
      success: true,
      query: queryRecord,
      response,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserQueries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const queries = await Query.getUserQueries(userId, limit, offset);
    
    return res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    next(error);
  }
};

exports.getQueryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Query.getById(id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      query,
    });
  } catch (error) {
    next(error);
  }
};

exports.handleWhatsAppWebhook = async (req, res) => {
  try {
    const { body } = req;
    await whatsappService.handleIncomingMessage(body);
    return res.status(200).send('OK');
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return res.status(500).send('Error');
  }
};

exports.verifyWhatsAppWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token && mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  
  return res.sendStatus(403);
};
