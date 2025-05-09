const axios = require('axios');
const translateService = require('../nlp/translate');

class Generator {
  constructor() {
    this.apiEndpoint = process.env.LLM_API_ENDPOINT;
    this.apiKey = process.env.LLM_API_KEY;
  }
  
  /**
   * Generate a response using an LLM with retrieved context
   * 
   * @param {string} query - Original user query
   * @param {Array} documents - Retrieved legal documents
   * @param {string} language - Target language for response
   * @returns {Object} Generated response with citations
   */
  async generateResponse(query, documents, language) {
    try {
      // Prepare context from retrieved documents
      const context = this.prepareContext(documents);
      
      // Create prompt with instructions and context
      const prompt = this.createPrompt(query, context);
      
      // Call LLM API
      const response = await this.callLLM(prompt);
      
      // Extract answer and citations
      const { answer, citations } = this.parseResponse(response, documents);
      
      // Translate response if necessary
      const translatedAnswer = language !== 'en' 
        ? await translateService.translate(answer, 'en', language)
        : answer;
      
      return {
        answer: translatedAnswer,
        citations,
        sources: documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          section: doc.section,
          url: doc.url
        })),
        confidence: this.calculateConfidence(documents)
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate legal response');
    }
  }
  
  prepareContext(documents) {
    // Concatenate context from retrieved legal documents
    return documents
      .map(doc => `${doc.title} (${doc.section}): ${doc.content}`)
      .join('\n\n');
  }
  
  createPrompt(query, context) {
    return `
      You are an AI legal assistant specializing in Indian law. Answer the following legal question based on the provided legal context.
      
      LEGAL CONTEXT:
      ${context}
      
      QUESTION:
      ${query}
      
      INSTRUCTIONS:
      1. Answer the question based only on the provided legal context.
      2. If the context doesn't contain relevant information, say so.
      3. Include specific citations to legal codes or sections when applicable.
      4. Format your answer in simple language that's easy to understand.
      5. Structure your response in the following format:
         ANSWER: [your detailed answer]
         CITATIONS: [numbered list of citations with section numbers]
    `;
  }
  
  async callLLM(prompt) {
    try {
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'legal-assistant',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      return response.data.choices[0].text;
    } catch (error) {
      console.error('LLM API error:', error);
      throw new Error('Failed to generate response from language model');
    }
  }
  
  parseResponse(response, documents) {
    // Extract answer and citations from LLM response
    const answerMatch = response.match(/ANSWER:(.*?)(?=CITATIONS:|$)/s);
    const citationsMatch = response.match(/CITATIONS:(.*?)$/s);
    
    const answer = answerMatch ? answerMatch[1].trim() : response;
    const citationsText = citationsMatch ? citationsMatch[1].trim() : '';
    
    // Parse citations into structured format
    const citations = this.parseCitations(citationsText, documents);
    
    return { answer, citations };
  }
  
  parseCitations(citationsText, documents) {
    if (!citationsText) return [];
    
    // Pattern matching for citation formats like "Section 123 of Indian Penal Code"
    const citationRegex = /Section\s+(\d+(?:\w+)?)\s+of\s+([^,\.]+)/gi;
    const matches = [...citationsText.matchAll(citationRegex)];
    
    return matches.map(match => ({
      section: match[1],
      code: match[2].trim(),
      documentId: this.findDocumentIdForCitation(match[1], match[2], documents)
    }));
  }
  
  findDocumentIdForCitation(section, code, documents) {
    const doc = documents.find(d => 
      d.section.includes(section) && 
      d.title.toLowerCase().includes(code.toLowerCase())
    );
    return doc ? doc.id : null;
  }
  
  calculateConfidence(documents) {
    // Simple confidence calculation based on relevance scores
    if (documents.length === 0) return 0;
    
    const avgSimilarity = documents.reduce((sum, doc) => sum + (doc.similarity || 0), 0) / documents.length;
    return Math.min(avgSimilarity * 100, 100); // Convert to percentage, cap at 100
  }
}

module.exports = new Generator();
