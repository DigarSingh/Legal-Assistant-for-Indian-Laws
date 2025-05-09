import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fallback responses for offline mode
const FALLBACK_RESPONSES = {
  divorce: {
    answer: "Under the Hindu Marriage Act, grounds for divorce include cruelty, desertion, conversion, mental disorder, communicable disease, renunciation, and presumption of death. Mutual consent divorce is also available.",
    citations: [
      { code: "Hindu Marriage Act, 1955", section: "13" }
    ],
    confidence: 90
  },
  // more fallback responses here...
  default: {
    answer: "I'm currently in offline mode due to connection issues with the server. I can provide general information, but for specific legal queries, please try again when the connection is restored.",
    citations: [],
    confidence: 70
  }
};

export default {
  generateResponse: async (query) => {
    try {
      const response = await axios.post(`${API_URL}/queries/generate`, { query });
      return response.data;
    } catch (error) {
      console.error('Error connecting to API server:', error.message);
      
      // If we can't connect to the server, provide a fallback response
      console.log('Using fallback response mechanism');
      
      // Check for some common query topics to provide more useful fallbacks
      const lowercaseQuery = query.toLowerCase();
      
      if (lowercaseQuery.includes('divorce')) {
        return { ...FALLBACK_RESPONSES.divorce, isFallback: true };
      }
      // Add more fallback topic checks as needed
      
      // Default fallback response
      return { ...FALLBACK_RESPONSES.default, isFallback: true };
    }
  }
};
