const natural = require('natural');
const stringSimilarity = require('string-similarity');
const legalDatabase = require('../../data/legalDatabase');

class Retriever {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
    this.initialized = false;
    this.documents = [];
  }
  
  async init() {
    if (!this.initialized) {
      try {
        // Load documents and initialize TF-IDF
        this.documents = await this.loadDocuments();
        
        // Add documents to TF-IDF
        this.documents.forEach((doc, index) => {
          this.tfidf.addDocument(this.preprocessText(doc.content));
          // Store original index for retrieval
          this.tfidf.documents[index].originalIndex = index;
        });
        
        this.initialized = true;
        console.log('TF-IDF retriever initialized successfully with', this.documents.length, 'documents');
      } catch (error) {
        console.error('Failed to initialize retriever:', error);
        throw error;
      }
    }
  }
  
  async loadDocuments() {
    // This would normally load from a database
    // For now, we'll use placeholder documents if legalDatabase is not implemented yet
    try {
      return await legalDatabase.getAllDocuments();
    } catch (error) {
      console.warn('Legal database not available, using placeholder documents');
      return [
        { 
          id: '1', 
          title: 'Right to Information Act', 
          section: 'Section 1',
          content: 'An Act to provide for setting out the practical regime of right to information for citizens to secure access to information under the control of public authorities.',
          url: 'https://example.com/rti/1'
        },
        { 
          id: '2', 
          title: 'Indian Penal Code', 
          section: 'Section 302',
          content: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
          url: 'https://example.com/ipc/302'
        },
        // Add more placeholder documents as needed
      ];
    }
  }
  
  /**
   * Retrieve relevant legal documents based on query
   * 
   * @param {string} query - User's legal query
   * @param {string} topic - Identified legal topic
   * @returns {Array} Relevant legal documents
   */
  async retrieveDocuments(query, topic) {
    await this.init();
    
    try {
      // Preprocess query
      const processedQuery = this.preprocessText(query);
      
      // First, filter by topic if specified
      let candidateDocs = this.documents;
      if (topic) {
        candidateDocs = this.documents.filter(doc => 
          doc.title.toLowerCase().includes(topic.toLowerCase()) || 
          doc.content.toLowerCase().includes(topic.toLowerCase())
        );
      }
      
      // Combine TF-IDF scoring and string similarity for better results
      const scoredDocs = candidateDocs.map(doc => {
        // TF-IDF similarity
        const tfidfIndex = this.documents.findIndex(d => d.id === doc.id);
        const tfidfScore = this.getTfidfSimilarity(processedQuery, tfidfIndex);
        
        // String similarity as a backup
        const stringSimilarityScore = stringSimilarity.compareTwoStrings(
          processedQuery,
          this.preprocessText(doc.content)
        );
        
        // Combine scores with a weighted average
        const combinedScore = (tfidfScore * 0.7) + (stringSimilarityScore * 0.3);
        
        return {
          ...doc,
          similarity: combinedScore
        };
      });
      
      // Sort by combined similarity score and return top results
      const relevantDocs = scoredDocs
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);  // Get top 5 documents
      
      return relevantDocs;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw new Error('Failed to retrieve relevant legal information');
    }
  }
  
  preprocessText(text) {
    // Convert to lowercase
    const lowercased = text.toLowerCase();
    
    // Tokenize
    const tokens = this.tokenizer.tokenize(lowercased) || [];
    
    // Remove stopwords and stem
    const stopwords = natural.stopwords;
    const filteredTokens = tokens.filter(token => !stopwords.includes(token));
    const stemmedTokens = filteredTokens.map(token => this.stemmer.stem(token));
    
    return stemmedTokens.join(' ');
  }
  
  getTfidfSimilarity(query, docIndex) {
    if (docIndex < 0 || !this.tfidf.documents[docIndex]) {
      return 0;
    }
    
    let score = 0;
    const queryTokens = query.split(' ');
    
    // Calculate score based on query terms occurrence in document
    queryTokens.forEach(token => {
      this.tfidf.tfidfs(token, (i, measure) => {
        if (i === docIndex) {
          score += measure;
        }
      });
    });
    
    // Normalize score
    return score / (queryTokens.length || 1);
  }
}

module.exports = new Retriever();
