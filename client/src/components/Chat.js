import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  IconButton,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  InputAdornment,
  Tooltip,
  Fade,
  Collapse,
  Divider,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useLocation } from 'react-router-dom';
import { processLegalQuery } from '../services/queryService';
import { extractCitationReferences, enhanceTextWithCitations } from '../services/citationService';
import CitationDisplay from './CitationDisplay';
import { trackQuery } from '../services/analyticsService';

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAllQueries, setShowAllQueries] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const location = useLocation();
  
  // Enhanced and expanded queries by category
  const queriesByCategory = {
    'Family Law': [
      "What are the grounds for divorce in India?",
      "How can I apply for child custody in India?",
      "What is the procedure for legal adoption in India?",
      "Explain the Hindu Marriage Act provisions",
      "Muslim personal law on marriage and divorce",
      "How are maintenance and alimony calculated?",
      "What is the legal age for marriage in India?",
      "Process for divorce under Special Marriage Act",
      "What are the rights of second wife in Hindu marriage?",
      "Legal remedies for domestic violence victims"
    ],
    'Property Law': [
      "Explain property inheritance laws in India",
      "What are my tenant rights under Rent Control Act?",
      "How to transfer property ownership after death?",
      "Legal procedure for property registration in India",
      "What is RERA Act and how does it protect homebuyers?",
      "Rights of daughters in ancestral property",
      "Legal documentation required for land purchase",
      "How to verify property title before buying?",
      "Laws governing agricultural land ownership",
      "Legal process to challenge land encroachment"
    ],
    'Criminal Law': [
      "What is the process for filing an FIR?",
      "What are my rights if arrested in India?",
      "Explain the bail process in criminal cases",
      "What constitutes defamation under Indian law?",
      "Penalties for cybercrime in India",
      "How to file a criminal complaint for cheating?",
      "What is culpable homicide under IPC?",
      "Procedure for filing zero FIR in India",
      "Difference between cognizable and non-cognizable offenses",
      "Legal definition of criminal conspiracy"
    ],
    'Consumer Protection': [
      "Consumer rights under Consumer Protection Act",
      "How to file a consumer complaint against a company?",
      "What remedies are available for defective products?",
      "E-commerce return policy regulations in India",
      "Insurance claim rejection - legal remedies",
      "What are unfair trade practices under law?",
      "Maximum compensation in consumer cases",
      "Rights regarding misleading advertisements",
      "Banking services under Consumer Protection Act",
      "Time limit for filing consumer complaints"
    ],
    'Constitutional Rights': [
      "What are my fundamental rights under the Constitution?",
      "Right to Information (RTI) filing procedure",
      "Public Interest Litigation (PIL) guidelines",
      "Right to Education Act provisions",
      "Freedom of expression limitations",
      "Rights of arrested persons under Article 22",
      "Explain writ jurisdiction of High Courts",
      "Right to equality provisions explained",
      "Protection of minority rights under Constitution",
      "When can fundamental rights be suspended?"
    ],
    'Labor & Employment': [
      "Employee rights under Labor Laws in India",
      "Legal working hours and overtime regulations",
      "Maternity leave benefits under Indian law",
      "Sexual harassment at workplace - legal protections",
      "Termination notice period requirements",
      "PF withdrawal rules and procedure",
      "Gratuity calculation and eligibility criteria",
      "Employee provident fund contribution rates",
      "Trade union formation requirements",
      "Factory workers safety regulations"
    ],
    'Business & Corporate': [
      "How to register a startup in India?",
      "GST registration and compliance requirements",
      "Legal requirements for foreign investments in India",
      "Trademark registration process in India",
      "Company director liabilities under law",
      "Procedure for incorporation of LLP",
      "Legal requirements for online business",
      "Corporate tax rates and exemptions",
      "Intellectual property protection for software",
      "Statutory compliance for private limited companies"
    ],
    'Civil Procedure': [
      "How to file a civil suit in India?",
      "Limitation period for different types of cases",
      "Court fees for civil litigation in India",
      "Powers of civil courts in India",
      "Procedure for interim injunction",
      "How to file caveat petition?",
      "Execution of court decree procedure",
      "Appeal process in civil cases",
      "Difference between suit and petition",
      "Legal notice requirements before filing suit"
    ]
  };

  // Get featured categories to display when not showing all
  const featuredCategories = ['Family Law', 'Criminal Law', 'Consumer Protection', 'Property Law'];
  
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Process the query
  const processQuery = useCallback(async (text) => {
    try {
      return await processLegalQuery(text);
    } catch (error) {
      console.error("Error in process query:", error);
      throw error;
    }
  }, []);

  // Handle initial query from navigation state
  useEffect(() => {
    if (location.state?.initialQuery) {
      const initialQuery = location.state.initialQuery;
      // Set message instead of sending it immediately to give user control
      setMessage(initialQuery);
      // Clean up navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyChat = () => {
    const chatText = chat.map(msg => `${msg.sender === 'user' ? 'You' : 'Legal Assistant'}: ${msg.text}`).join('\n\n');
    navigator.clipboard.writeText(chatText);
    handleMenuClose();
  };

  const handleClearChat = () => {
    setChat([]);
    handleMenuClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // In a real app, you would send this to your backend for processing
        setMessage(`Analyzing document: ${file.name}...`);
      };
      reader.readAsText(file);
    }
  };

  const handleSuggestedQuery = (query) => {
    setMessage(query);
  };

  const toggleSaveMessage = (index) => {
    const updatedChat = [...chat];
    updatedChat[index].saved = !updatedChat[index].saved;
    setChat(updatedChat);
    
    // Update saved messages list
    if (updatedChat[index].saved) {
      setSavedMessages([...savedMessages, updatedChat[index]]);
    } else {
      setSavedMessages(savedMessages.filter(msg => msg !== chat[index]));
    }
  };

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { text: message, sender: 'user', timestamp: new Date() };
    setChat(prevChat => [...prevChat, userMessage]);
    const userInput = message;
    setMessage('');
    setIsLoading(true);
    
    // Track query start time
    const startTime = new Date();
    
    try {
      // Send to backend API
      const response = await processQuery(userInput);
      
      // Extract citation references from the response
      const citationRefs = extractCitationReferences(response);
      
      // Enhance text with citation markers
      const { enhancedText, citations } = enhanceTextWithCitations(response, citationRefs);
      
      // Add response to chat with citations
      setChat(prevChat => [...prevChat, { 
        text: enhancedText, 
        sender: 'bot',
        timestamps: new Date(),
        citations: citations,
        saved: false
      }]);
      
      // Track analytics data
      trackQuery({
        query: userInput,
        responseTime: new Date() - startTime,
        citationsCount: citations.length,
        citationsSources: citations.map(c => `${c.actName}, Section ${c.sectionNumber}`),
        timestamp: new Date().toISOString(),
        queryLength: userInput.length,
        category: detectQueryCategory(userInput)
      });
    } catch (error) {
      console.error('Error processing message:', error);
      setChat(prevChat => [...prevChat, { 
        text: 'Sorry, I encountered an error processing your request.', 
        sender: 'bot',
        error: true,
        timestamp: new Date()
      }]);
      
      // Track failed query
      trackQuery({
        query: userInput,
        error: true,
        timestamp: new Date().toISOString(),
        responseTime: new Date() - startTime
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple function to detect query category based on keywords
  const detectQueryCategory = (query) => {
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes('divorce') || lowercaseQuery.includes('marriage') || 
        lowercaseQuery.includes('custody') || lowercaseQuery.includes('alimony')) {
      return 'Family Law';
    } else if (lowercaseQuery.includes('property') || lowercaseQuery.includes('land') || 
               lowercaseQuery.includes('rent') || lowercaseQuery.includes('tenant')) {
      return 'Property Law';
    } else if (lowercaseQuery.includes('theft') || lowercaseQuery.includes('murder') || 
               lowercaseQuery.includes('bail') || lowercaseQuery.includes('police')) {
      return 'Criminal Law';
    } else if (lowercaseQuery.includes('constitution') || lowercaseQuery.includes('rights') || 
               lowercaseQuery.includes('fundamental')) {
      return 'Constitutional Law';
    } else if (lowercaseQuery.includes('company') || lowercaseQuery.includes('business') || 
               lowercaseQuery.includes('contract')) {
      return 'Corporate Law';
    } else if (lowercaseQuery.includes('refund') || lowercaseQuery.includes('product') || 
               lowercaseQuery.includes('service') || lowercaseQuery.includes('warranty')) {
      return 'Consumer Protection';
    }
    return 'General Legal';
  };
  
  // Recording functionality remains the same
  const startRecording = () => {
    console.log("Start recording");
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    console.log("Stop recording");
    setIsRecording(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 64px)',
      position: 'relative'
    }}>
      {/* Chat header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Legal Assistant Chat</Typography>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCopyChat}>
            <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
            Copy Chat
          </MenuItem>
          <MenuItem onClick={handleClearChat}>
            <Typography color="error">Clear Chat</Typography>
          </MenuItem>
        </Menu>
      </Box>
      
      {/* Suggested queries - always visible, not in Collapse */}
      <Box sx={{ 
        p: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">Suggested Legal Queries</Typography>
          <Button 
            size="small" 
            onClick={() => setShowAllQueries(!showAllQueries)}
            sx={{ minWidth: 'auto', py: 0 }}
          >
            {showAllQueries ? 'Show Less' : 'More Categories'}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {Object.keys(queriesByCategory)
            .filter(category => showAllQueries || featuredCategories.includes(category))
            .map((category) => (
              <Box key={category}>
                <Box 
                  onClick={() => toggleCategory(category)}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    p: 0.5,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">{category}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {expandedCategory === category ? '−' : '+'}
                  </Typography>
                </Box>
                
                <Collapse in={expandedCategory === category}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0.5, ml: 1 }}>
                    {queriesByCategory[category].map((query, index) => (
                      <Chip 
                        key={index} 
                        label={query} 
                        onClick={() => handleSuggestedQuery(query)} 
                        clickable 
                        variant="outlined"
                        size="small"
                        sx={{ m: 0.2 }}
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
          ))}
        </Box>
      </Box>

      {/* Chat messages display */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: 1, 
        overflow: 'auto',
        p: 2,
        gap: 2
      }}>
        {chat.map((msg, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              position: 'relative'
            }}
          >
            <Paper 
              elevation={msg.sender === 'user' ? 0 : 1}
              sx={{ 
                p: 2,
                borderRadius: 2,
                backgroundColor: msg.sender === 'user' 
                  ? theme.palette.primary.light 
                  : theme.palette.background.paper,
                color: msg.sender === 'user' ? theme.palette.primary.contrastText : 'inherit',
                border: msg.sender === 'user' ? 'none' : `1px solid ${theme.palette.divider}`
              }}
            >
              {/* Message header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <Typography variant="caption" color={msg.sender === 'user' ? 'inherit' : 'text.secondary'}>
                  {msg.sender === 'user' ? 'You' : 'Legal Assistant'}
                </Typography>
                {msg.timestamp && (
                  <Typography variant="caption" color={msg.sender === 'user' ? 'inherit' : 'text.secondary'}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="body1">{msg.text}</Typography>
              
              {msg.error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Please try reformulating your question.
                </Typography>
              )}
              
              {msg.citations && msg.citations.length > 0 && (
                <CitationDisplay citations={msg.citations} />
              )}
              
              {/* Message actions */}
              {msg.sender === 'bot' && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: 1,
                  opacity: 0.7,
                  '&:hover': { opacity: 1 }
                }}>
                  <Tooltip title="Copy response">
                    <IconButton 
                      size="small" 
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={msg.saved ? "Unsave message" : "Save message"}>
                    <IconButton 
                      size="small" 
                      onClick={() => toggleSaveMessage(index)}
                      color={msg.saved ? "primary" : "default"}
                    >
                      {msg.saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Paper>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, alignSelf: 'flex-start' }}>
            <Paper 
              elevation={1}
              sx={{ 
                p: 2,
                borderRadius: 2,
                display: 'flex', 
                alignItems: 'center', 
                gap: 2
              }}
            >
              <CircularProgress size={20} />
              <Typography>Processing your request...</Typography>
            </Paper>
          </Box>
        )}
        
        <div ref={chatEndRef} />
      </Box>
      
      {/* Input area */}
      <Box sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'divider', 
        backgroundColor: theme.palette.background.paper
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your legal question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Attach Document">
                    <IconButton 
                      edge="end" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </InputAdornment>
              )
            }}
          />
          <IconButton 
            color={isRecording ? "secondary" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <MicIcon />
          </IconButton>
          <Button 
            variant="contained" 
            endIcon={<SendIcon />} 
            onClick={handleSend}
            disabled={isLoading || message.trim() === ''}
          >
            Send
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
            Ask any legal question about Indian law
          </Typography>
          <Chip 
            label="AI Powered" 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ height: 24 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;