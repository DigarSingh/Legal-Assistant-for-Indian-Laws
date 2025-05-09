const axios = require('axios');
const User = require('../../models/User');
const ragService = require('../rag/ragService');
const topicIdentifier = require('../nlp/topicIdentification');
const Query = require('../../models/Query');

class WhatsAppService {
  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v17.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }
  
  /**
   * Handle incoming WhatsApp messages
   * 
   * @param {Object} webhookPayload - Webhook data from WhatsApp
   */
  async handleIncomingMessage(webhookPayload) {
    try {
      if (
        webhookPayload.object === 'whatsapp_business_account' &&
        webhookPayload.entry &&
        webhookPayload.entry.length > 0 &&
        webhookPayload.entry[0].changes &&
        webhookPayload.entry[0].changes.length > 0 &&
        webhookPayload.entry[0].changes[0].value.messages &&
        webhookPayload.entry[0].changes[0].value.messages.length > 0
      ) {
        const message = webhookPayload.entry[0].changes[0].value.messages[0];
        const sender = message.from;
        
        // Get message text
        let messageText = '';
        if (message.type === 'text') {
          messageText = message.text.body;
        } else {
          // For now, only handle text messages
          await this.sendMessage(sender, "I can only process text messages for legal queries.");
          return;
        }
        
        // Process legal query
        await this.processLegalQuery(sender, messageText);
      }
    } catch (error) {
      console.error('Error handling incoming WhatsApp message:', error);
    }
  }
  
  /**
   * Process a legal query from WhatsApp
   * 
   * @param {string} sender - WhatsApp sender ID
   * @param {string} query - Legal query text
   */
  async processLegalQuery(sender, query) {
    try {
      // Find or create user
      let user = await User.findByPhone(sender);
      if (!user) {
        user = await User.create({
          phone: sender,
          platform: 'whatsapp',
        });
      }
      
      // Send acknowledgment
      await this.sendMessage(sender, "I'm processing your legal query. Please wait a moment...");
      
      // Identify topic
      const topic = await topicIdentifier.identifyTopic(query);
      
      // Store query in database
      await Query.create(user.id, query, topic, 'en');
      
      // Generate response using RAG
      const response = await ragService.processQuery(query, topic);
      
      // Send the response
      await this.sendMessage(sender, response.answer);
      
      // If there are citations, send them separately
      if (response.citations && response.citations.length > 0) {
        const citationsText = "Sources:\n" + response.citations
          .map((cite, i) => `${i+1}. ${cite.code} Section ${cite.section}`)
          .join("\n");
        
        await this.sendMessage(sender, citationsText);
      }
    } catch (error) {
      console.error('Error processing legal query:', error);
      await this.sendMessage(sender, "Sorry, I encountered an error while processing your legal query. Please try again later.");
    }
  }
  
  /**
   * Send message to WhatsApp user
   * 
   * @param {string} recipient - WhatsApp recipient ID
   * @param {string} message - Message to send
   */
  async sendMessage(recipient, message) {
    try {
      await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
