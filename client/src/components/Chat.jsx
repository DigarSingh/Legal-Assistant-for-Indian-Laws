import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  Divider,
  Avatar,
  CircularProgress,
  useTheme,
  Container,
  IconButton,
  Fade,
  Zoom,
  Tooltip,
  Snackbar,
  Alert,
  Collapse,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '../services/api';
import geminiService from '../services/geminiService';

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const queriesByCategory = {
    'Family Law': [
      "What are the grounds for divorce in India?",
      "How can I apply for child custody in India?",
      "What is the procedure for legal adoption in India?",
      "Explain the Hindu Marriage Act provisions",
      "Muslim personal law on marriage and divorce",
      "How are maintenance and alimony calculated?",
      "How to register marriage under Special Marriage Act?",
      "What are rights of a divorced Muslim woman?",
      "Legal process for inter-faith marriages in India",
      "How to get mutual consent divorce in India?"
    ],
    'Property Law': [
      "Explain property inheritance laws in India",
      "What are my tenant rights under Rent Control Act?",
      "How to transfer property ownership after death?",
      "Legal procedure for property registration in India",
      "What is RERA Act and how does it protect homebuyers?",
      "Process for evicting a tenant legally in India",
      "Rights in ancestral property under Hindu law",
      "Legal validity of Will made on plain paper",
      "How to challenge unauthorized construction?",
      "Legal recourse for boundary disputes with neighbors"
    ],
    'Criminal Law': [
      "What is the process for filing an FIR?",
      "What are my rights if arrested in India?",
      "Explain the bail process in criminal cases",
      "What constitutes defamation under Indian law?",
      "Penalties for cybercrime in India",
      "Difference between bailable and non-bailable offenses",
      "What is anticipatory bail and how to apply?",
      "Punishment for sexual harassment under IPC",
      "How to file domestic violence complaint?",
      "Legal remedies for victims of online fraud"
    ],
    'Consumer Rights': [
      "Consumer rights under Consumer Protection Act",
      "How to file a consumer complaint against a company?",
      "What remedies are available for defective products?",
      "E-commerce return policy regulations in India",
      "How to get compensation for delayed flight?",
      "Legal recourse for insurance claim rejection",
      "Consumer rights for faulty automobile purchases",
      "Rights when a builder delays possession",
      "Process to file complaint against misleading advertisements",
      "Maximum time limit for filing consumer complaints"
    ],
    'Constitutional Rights': [
      "What are my fundamental rights under the Constitution?",
      "Right to Information (RTI) filing procedure",
      "Public Interest Litigation (PIL) guidelines",
      "Freedom of speech limitations in India",
      "Right to privacy under Indian Constitution",
      "Religious freedom protections in India",
      "Rights of minorities under Constitution",
      "How to challenge violation of fundamental rights?",
      "What are directive principles of state policy?",
      "Explain Article 21 and right to life"
    ],
    'Employment Law': [
      "What are my rights as an employee in India?",
      "Legal working hours and overtime regulations",
      "Maternity leave benefits under Indian law",
      "How to address workplace discrimination?",
      "Legal remedies for wrongful termination",
      "ESI and PF rules for employers and employees",
      "Sexual harassment prevention laws at workplace",
      "Gratuity eligibility and calculation",
      "Rights of contract workers vs permanent employees",
      "Minimum wage regulations across Indian states"
    ]
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleSuggestedQuery = (query) => {
    setInput(query);
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
    
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(id);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Use Gemini API service with fallback mechanism
      const response = await geminiService.generateResponse(input);
      
      // Check if we're using a fallback response
      const isFallback = response.isFallback;
      
      const botMessage = { 
        text: response.answer, 
        sender: 'bot', 
        timestamp: new Date(),
        citations: response.citations,
        confidence: response.confidence,
        isFallback: isFallback
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Show a notification if using fallback mode
      if (isFallback) {
        setErrorMsg("Using offline mode due to API limitations. Responses may be less specific.");
      }
    } catch (error) {
      console.error('Error processing response:', error);
      
      // Show error message as a snackbar
      setErrorMsg(`Error: ${error.message || 'Failed to get response'}`);
      
      // Add error message to chat
      const errorMessage = { 
        text: `Sorry, I encountered an error while processing your query. Please try again in a moment.`, 
        sender: 'bot', 
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const TypingIndicator = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Box sx={{ 
        width: 10, 
        height: 10, 
        borderRadius: '50%', 
        bgcolor: theme.palette.primary.main,
        animation: 'pulse 1s infinite',
        animationDelay: '0s',
        mx: 0.5,
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.5, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
        }
      }} />
      <Box sx={{ 
        width: 10, 
        height: 10, 
        borderRadius: '50%', 
        bgcolor: theme.palette.primary.main,
        animation: 'pulse 1s infinite',
        animationDelay: '0.2s',
        mx: 0.5
      }} />
      <Box sx={{ 
        width: 10, 
        height: 10, 
        borderRadius: '50%', 
        bgcolor: theme.palette.primary.main,
        animation: 'pulse 1s infinite',
        animationDelay: '0.4s',
        mx: 0.5
      }} />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ height: '100%', py: 3 }}>
      <Snackbar 
        open={Boolean(errorMsg)} 
        autoHideDuration={6000} 
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Paper 
        elevation={3} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100vh - 100px)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.primary.main,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                mr: 1,
                width: 40,
                height: 40
              }}
            >
              <GavelIcon />
            </Avatar>
            <Typography variant="h6">
              Legal Assistant
            </Typography>
          </Box>
          
          <Tooltip title="Clear chat">
            <IconButton 
              color="inherit" 
              onClick={handleClearChat}
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Suggested Legal Queries Section - Always visible */}
        <Box 
          sx={{ 
            p: 1.5, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.03)' : 'rgba(67, 97, 238, 0.03)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Suggested Legal Queries
            </Typography>
            <Button 
              size="small" 
              color="primary" 
              onClick={() => setShowAllCategories(!showAllCategories)}
              sx={{ minWidth: 'unset', fontWeight: 'medium', fontSize: '0.75rem' }}
            >
              {showAllCategories ? 'Show Less' : 'More Topics'}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {Object.keys(queriesByCategory)
              .filter(category => showAllCategories || ['Family Law', 'Criminal Law', 'Property Law'].includes(category))
              .map((category) => (
                <Box key={category} sx={{ mb: 0.5 }}>
                  <Box 
                    onClick={() => toggleCategory(category)}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      bgcolor: expandedCategory === category ? 'rgba(67, 97, 238, 0.08)' : 'transparent',
                      p: 0.75,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'rgba(67, 97, 238, 0.08)' }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {expandedCategory === category ? '−' : '+'}
                    </Typography>
                  </Box>
                  
                  <Collapse in={expandedCategory === category}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5, 
                      p: 0.5, 
                      ml: 1,
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {queriesByCategory[category].map((query, idx) => (
                        <Chip
                          key={idx}
                          label={query}
                          size="small"
                          onClick={() => handleSuggestedQuery(query)}
                          clickable
                          sx={{
                            borderRadius: '16px',
                            fontSize: '0.7rem',
                            height: 24,
                            m: 0.2
                          }}
                        />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))
            }
          </Box>
        </Box>

        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflowY: 'auto',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.03)' : 'rgba(67, 97, 238, 0.03)'
          }}
        >
          {messages.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                textAlign: 'center',
                opacity: 0.7
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(67, 97, 238, 0.2)'
                }}
              >
                <SmartToyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Legal Assistant for Indian Laws
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                Ask any question about Indian laws, sections, or legal procedures. 
                I'm here to provide accurate and helpful information.
              </Typography>
            </Box>
          ) : (
            <List sx={{ px: { xs: 0, sm: 2 } }}>
              {messages.map((message, index) => (
                <Zoom 
                  in={true} 
                  key={index} 
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transformOrigin: message.sender === 'user' ? 'right' : 'left'
                  }}
                >
                  <ListItem 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                      px: 0
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', mb: 0.5 }}>
                      {message.sender !== 'user' && (
                        <Avatar 
                          sx={{ 
                            bgcolor: message.isError ? 'error.main' : theme.palette.primary.main,
                            width: 32,
                            height: 32,
                            mr: 1,
                            mt: 0.5
                          }}
                        >
                          <SmartToyIcon fontSize="small" />
                        </Avatar>
                      )}
                      
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: { xs: 1.5, sm: 2 }, 
                          maxWidth: { xs: '90%', sm: '75%' },
                          bgcolor: message.sender === 'user' 
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                            : message.isError
                              ? 'rgba(244, 67, 54, 0.08)'
                              : 'background.paper',
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          borderRadius: message.sender === 'user' 
                            ? '20px 20px 5px 20px' 
                            : '20px 20px 20px 5px',
                          boxShadow: message.sender === 'user'
                            ? '0 5px 15px rgba(67, 97, 238, 0.2)'
                            : '0 2px 10px rgba(0, 0, 0, 0.05)',
                          ml: message.sender === 'user' ? 'auto' : 0,
                          position: 'relative',
                          '&:hover .message-actions': {
                            opacity: 1,
                          }
                        }}
                      >
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                          {message.text}
                        </Typography>
                        
                        {message.citations && message.citations.length > 0 && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                              Citations:
                            </Typography>
                            {message.citations.map((cite, i) => (
                              <Typography 
                                key={i} 
                                variant="body2" 
                                sx={{ 
                                  ml: 1, 
                                  fontSize: '0.8rem',
                                  borderLeft: `2px solid ${theme.palette.primary.main}`,
                                  pl: 1,
                                  mb: 0.5
                                }}
                              >
                                {cite.code} Section {cite.section}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        
                        {message.confidence && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 1, 
                              opacity: 0.7,
                              fontSize: '0.75rem'
                            }}
                          >
                            Confidence: {message.confidence.toFixed(1)}%
                          </Typography>
                        )}
                        
                        {message.sender !== 'user' && (
                          <Box 
                            className="message-actions"
                            sx={{ 
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              opacity: 0,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            <Tooltip title={copiedMessage === index ? "Copied!" : "Copy"}>
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(message.text, index)}
                                sx={{ 
                                  p: 0.5,
                                  bgcolor: 'background.paper',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                              >
                                <ContentCopyIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Paper>
                      
                      {message.sender === 'user' && (
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            width: 32,
                            height: 32,
                            ml: 1,
                            mt: 0.5
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.6, 
                        fontSize: '0.7rem',
                        mr: message.sender === 'user' ? 4 : 0,
                        ml: message.sender === 'user' ? 0 : 4,
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </ListItem>
                </Zoom>
              ))}
              
              {isLoading && (
                <ListItem sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 32,
                      height: 32,
                      mr: 1
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      borderRadius: '20px 20px 20px 5px',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <TypingIndicator />
                  </Paper>
                </ListItem>
              )}
              
              <Box ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Box 
          sx={{ 
            p: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            bgcolor: theme.palette.background.paper
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              position: 'relative'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about Indian laws..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={4}
              sx={{ 
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  pr: 5,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                }
              }}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              sx={{ 
                position: 'absolute',
                right: 8,
                bottom: 8,
                minWidth: 'unset',
                width: 40,
                height: 40,
                borderRadius: '50%',
                p: 0
              }}
            >
              {isLoading ? 
                <CircularProgress size={20} color="inherit" /> : 
                <SendIcon fontSize="small" />
              }
            </Button>
          </Box>
          
          <Typography 
            variant="caption" 
            align="center" 
            sx={{ 
              display: 'block', 
              mt: 1, 
              opacity: 0.5,
              fontSize: '0.7rem'
            }}
          >
            Ask any legal question. This assistant provides informational guidance only, not legal advice.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;
