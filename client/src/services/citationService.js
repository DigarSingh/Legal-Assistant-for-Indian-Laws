import axios from 'axios';

// Base URL for India Code API
const INDIA_CODE_API_BASE = 'https://api.indiacode.nic.in/api/v1';

/**
 * Fetch citation details for a specific law section
 * @param {string} actId - The ID of the act/law
 * @param {string} sectionId - The section number
 * @returns {Promise<Object>} - Citation details
 */
export const fetchCitation = async (actId, sectionId) => {
  // In a real implementation, this would fetch from an API
  // For now, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  return {
    id: `${actId}-${sectionId}`,
    title: `Section ${sectionId}`,
    actName: decodeURIComponent(actId),
    sectionNumber: sectionId,
    year: "2023",
    text: `This is a mock legal text for ${decodeURIComponent(actId)}, Section ${sectionId}. In a real implementation, this would contain the actual legal text from the Indian legal database or India Code API.`,
    url: `https://www.indiacode.nic.in/acts/${actId}/sections/${sectionId}`
  };
};

/**
 * Search for relevant legal sections based on keywords
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of relevant legal sections
 */
export const searchLegalSections = async (query) => {
  try {
    const response = await axios.get(`${INDIA_CODE_API_BASE}/search`, {
      params: { q: query, limit: 5 }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching legal sections:', error);
    return [];
  }
};

/**
 * Format a citation for display
 * @param {Object} citation - Citation data
 * @returns {Object} - Formatted citation for display
 */
export const formatCitation = (citation) => {
  if (!citation) return null;
  
  return {
    id: citation.id,
    title: citation.title || 'Unknown Title',
    actName: citation.actName || citation.act?.name || 'Unknown Act',
    sectionNumber: citation.sectionNumber || citation.number || 'N/A',
    year: citation.year || citation.act?.year || 'N/A',
    url: citation.url || `${INDIA_CODE_API_BASE}/acts/${citation.actId}/sections/${citation.id}`,
    text: citation.text || citation.content || 'No content available',
    formattedCitation: `${citation.actName || 'Act'} (${citation.year || 'N/A'}), Section ${citation.sectionNumber || 'N/A'}`
  };
};

/**
 * Extract citation references from AI response
 * @param {string} text - AI generated response text
 * @returns {Array<Object>} - List of citation references
 */
export const extractCitationReferences = (text) => {
  // Basic regex to find citation patterns like "Section X of Act Y"
  const sectionRegex = /Section\s+(\d+[A-Z]?(?:-\d+)?)\s+of\s+(?:the\s+)?([^,.]+)/gi;
  
  // Find all matches
  const matches = [...text.matchAll(sectionRegex)];
  
  // Format matches into citation objects
  return matches.map((match, index) => {
    return {
      id: `ref-${index}`,
      referenceId: `citation-${index}`,
      sectionNumber: match[1],
      actName: match[2].trim(),
      fullMatch: match[0]
    };
  });
};

/**
 * Enhance text with citation links
 * @param {string} text - Original text
 * @param {Array<Object>} citations - List of citations
 * @returns {Object} - Text with citation markers and citation objects
 */
export const enhanceTextWithCitations = (text, citations) => {
  let enhancedText = text;
  const citationObjects = [];

  if (citations && citations.length > 0) {
    // Replace citation references with markers
    citations.forEach((citation, index) => {
      const marker = `[${index + 1}]`;
      enhancedText = enhancedText.replace(
        citation.fullMatch,
        `${citation.fullMatch} ${marker}`
      );
      
      citationObjects.push({
        ...citation,
        markerText: marker
      });
    });
  }
  
  return {
    enhancedText,
    citations: citationObjects
  };
};
