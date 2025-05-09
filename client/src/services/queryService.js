import axios from 'axios';

/**
 * Process a legal query and generate response with citations
 * @param {string} query - The user's legal query
 * @returns {Promise<string>} - AI response with citation information
 */
export const processLegalQuery = async (query) => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll return a mock response with citation patterns
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on keywords in the query
    if (query.toLowerCase().includes('divorce')) {
      return "According to Section 13 of the Hindu Marriage Act, divorce can be granted on various grounds including adultery, cruelty, and desertion. The court typically requires a cooling period of 6 months after filing as per Section 13B of the Hindu Marriage Act.";
    } else if (query.toLowerCase().includes('property')) {
      return "Property disputes in India are governed by Section 54 of the Transfer of Property Act. Additionally, ancestral property rights are covered under Section 6 of the Hindu Succession Act, which grants equal rights to daughters in ancestral property.";
    } else {
      return "Your legal question may be covered under various Indian laws and precedents. For specific legal advice, you should consult Section 3 of the Legal Services Authorities Act which provides for free legal aid to eligible citizens.";
    }
  } catch (error) {
    console.error('Error processing legal query:', error);
    throw new Error('Failed to process legal query');
  }
};

/**
 * Get legal context for a specific topic
 * @param {string} topic - Legal topic
 * @returns {Promise<Array>} - List of relevant legal sections
 */
export const getLegalContext = async (topic) => {
  try {
    const response = await axios.get('/api/legal-context', {
      params: { topic }
    });
    return response.data.context;
  } catch (error) {
    console.error('Error fetching legal context:', error);
    return [];
  }
};

/**
 * Get popular legal topics
 * @returns {Promise<Array>} - List of popular legal topics
 */
export const getPopularLegalTopics = async () => {
  try {
    const response = await axios.get('/api/legal-topics/popular');
    return response.data.topics;
  } catch (error) {
    console.error('Error fetching popular legal topics:', error);
    return [
      'Criminal Law',
      'Family Law',
      'Property Law',
      'Constitutional Law',
      'Consumer Protection'
    ];
  }
};
