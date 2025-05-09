const natural = require('natural');
const fs = require('fs').promises;
const path = require('path');

class TopicIdentifier {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
    this.initialized = false;
    this.legalTopics = [
      'Criminal Law',
      'Constitutional Law',
      'Civil Law',
      'Family Law',
      'Corporate Law',
      'Labor Law',
      'Tax Law',
      'Property Law',
      'Consumer Protection',
      'Right to Information'
    ];
    
    // Legal keywords mapping
    this.topicKeywords = {
      'Criminal Law': ['ipc', 'crime', 'punishment', 'offense', 'arrest', 'bail', 'murder', 'theft'],
      'Constitutional Law': ['constitution', 'fundamental rights', 'directive principles', 'amendment'],
      'Civil Law': ['contract', 'damages', 'civil', 'suit', 'liability', 'tort', 'compensation'],
      'Family Law': ['marriage', 'divorce', 'custody', 'maintenance', 'adoption', 'succession'],
      'Corporate Law': ['company', 'corporation', 'director', 'shareholder', 'llp', 'business'],
      'Labor Law': ['employee', 'worker', 'salary', 'wages', 'factory', 'industrial dispute'],
      'Tax Law': ['income tax', 'gst', 'tax evasion', 'tax return', 'assessment'],
      'Property Law': ['property', 'land', 'tenant', 'lease', 'ownership', 'sale deed', 'registration'],
      'Consumer Protection': ['consumer', 'product', 'service', 'defect', 'unfair practice'],
      'Right to Information': ['rti', 'information', 'public authority', 'disclosure']
    };
  }
  
  async init() {
    if (!this.initialized) {
      try {
        // Try to load trained classifier
        try {
          const classifierData = await fs.readFile(
            path.join(__dirname, '../../data/classifier.json'),
            'utf8'
          );
          this.classifier = natural.BayesClassifier.restore(JSON.parse(classifierData));
        } catch (loadError) {
          // Train classifier with sample data if file doesn't exist
          await this.trainClassifier();
        }
        
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize topic identifier:', error);
        throw error;
      }
    }
  }
  
  async trainClassifier() {
    // Training data for each legal topic
    for (const topic of this.legalTopics) {
      const keywords = this.topicKeywords[topic] || [];
      
      // Add variations of keywords as training examples
      keywords.forEach(keyword => {
        this.classifier.addDocument(`I need help with ${keyword}`, topic);
        this.classifier.addDocument(`What is the law regarding ${keyword}?`, topic);
        this.classifier.addDocument(`Tell me about ${keyword} laws in India`, topic);
      });
    }
    
    this.classifier.train();
    
    // Save trained classifier
    const classifierData = JSON.stringify(this.classifier);
    await fs.writeFile(
      path.join(__dirname, '../../data/classifier.json'),
      classifierData,
      'utf8'
    );
  }
  
  /**
   * Identify legal topic from user query
   * 
   * @param {string} query - User's legal query
   * @returns {string} Identified legal topic
   */
  async identifyTopic(query) {
    await this.init();
    
    // Use keyword-based approach first
    for (const [topic, keywords] of Object.entries(this.topicKeywords)) {
      for (const keyword of keywords) {
        if (query.toLowerCase().includes(keyword.toLowerCase())) {
          return topic;
        }
      }
    }
    
    // Fallback to classifier
    const classification = this.classifier.classify(query);
    return classification;
  }
}

module.exports = new TopicIdentifier();
