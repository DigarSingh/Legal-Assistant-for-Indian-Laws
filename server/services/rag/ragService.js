const retriever = require('./retriever');
const generator = require('./generator');

/**
 * Main RAG service that processes legal queries
 */
class RagService {
  /**
   * Process a user query through the RAG pipeline
   * 
   * @param {string} query - The user's legal query
   * @param {string} topic - Identified legal topic
   * @param {string} language - Query language (default: 'en')
   * @returns {Object} Response with generated answer and citations
   */
  async processQuery(query, topic, language = 'en') {
    try {
      // Retrieve relevant legal documents using BERT
      const relevantDocs = await retriever.retrieveDocuments(query, topic);
      
      // Generate response using retrieved context
      const response = await generator.generateResponse(query, relevantDocs, language);
      
      return {
        answer: response.answer,
        citations: response.citations,
        sources: response.sources,
        confidence: response.confidence,
      };
    } catch (error) {
      console.error('Error in RAG processing:', error);
      throw new Error('Failed to process legal query');
    }
  }
}

module.exports = new RagService();
