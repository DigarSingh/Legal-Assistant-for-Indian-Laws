import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Chip,
  Stack,
  Rating,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import GavelIcon from '@mui/icons-material/Gavel';
import TranslateIcon from '@mui/icons-material/Translate';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
      observer.observe(card);
    });

    const additionalAnimations = [
      { element: heroRef.current, className: 'animate-hero' },
      { element: stepsRef.current, className: 'animate-steps' },
      { element: ctaRef.current, className: 'animate-cta' }
    ];
    
    const additionalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(entry.target.dataset.animationClass);
          additionalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    additionalAnimations.forEach(({element, className}) => {
      if (element) {
        element.dataset.animationClass = className;
        additionalObserver.observe(element);
      }
    });
    
    const heroElement = document.querySelector('.hero-section');
    if (heroElement) {
      createBubbles(heroElement);
    }
    
    return () => {
      cards.forEach(card => {
        observer.unobserve(card);
      });
      additionalObserver.disconnect();
    };
  }, []);
  
  const createBubbles = (parent) => {
    const bubbleCount = 6;
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.setProperty('--size', `${Math.random() * 80 + 40}px`);
      bubble.style.setProperty('--left', `${Math.random() * 100}%`);
      bubble.style.setProperty('--delay', `${Math.random() * 4}s`);
      bubble.style.setProperty('--duration', `${Math.random() * 10 + 10}s`);
      bubble.style.setProperty('--opacity', `${Math.random() * 0.3 + 0.1}`);
      
      bubbleContainer.appendChild(bubble);
    }
    
    parent.appendChild(bubbleContainer);
  };
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        className="hero-section"
        sx={{
          background: 'linear-gradient(45deg, #3a0ca3 0%, #4361ee 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          pb: { xs: 10, md: 15 },
          borderRadius: { xs: '0 0 30px 30px', md: '0 0 50px 50px' },
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} className="hero-text">
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label="POWERED BY AI & LEGAL EXPERTS" 
                  color="secondary" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: '#3a0ca3',
                    fontWeight: 'bold',
                    mb: 2
                  }}
                />
              </Box>
              <Typography 
                variant="h2" 
                fontWeight="bold"
                className="hero-title"
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.8rem' }
                }}
              >
                Indian Legal Knowledge<br />At Your Fingertips
              </Typography>
              <Typography 
                variant="h4" 
                gutterBottom
                className="hero-subtitle"
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '1.2rem', md: '1.6rem' }
                }}
              >
                Get Expert Legal Assistance in Seconds
              </Typography>
              <Typography variant="body1" paragraph className="hero-description" sx={{ mb: 4, fontSize: '1rem', maxWidth: '90%' }}>
                Navigate complex Indian legal codes with our AI-powered assistant using 
                Retrieval-Augmented Generation (RAG) technology. Get accurate information 
                from IPC, CPC, and other acts with proper citations and multilingual support.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUserIcon fontSize="small" />
                  <Typography variant="body2">Verified Sources</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon fontSize="small" />
                  <Typography variant="body2">Instant Answers</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TranslateIcon fontSize="small" />
                  <Typography variant="body2">10+ Indian Languages</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }} className="hero-buttons">
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={Link}
                  to="/chat"
                  startIcon={<ChatIcon />}
                  className="pulse-button"
                  sx={{ 
                    borderRadius: '50px', 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 'bold',
                    background: 'white',
                    color: '#3a0ca3',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Legal Assistant
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => window.open('https://wa.me/919012345678?text=Hi%20RAGify%20India!%20I%20need%20legal%20assistance.', '_blank')}
                  sx={{ 
                    borderRadius: '50px', 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 'bold',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Connect via WhatsApp
                </Button>
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Rating value={4.8} precision={0.1} readOnly size="small" />
                  <Typography variant="caption" sx={{ mt: 0.5 }}>4.8/5 Rating</Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Box>
                  <Typography variant="body2">Trusted by <strong>15,000+</strong> users</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} className="hero-image">
              <Box 
                component="img"
                src="/images/001.jpg"
                alt="Legal Assistant Illustration"
                sx={{ 
                  width: '100%',
                  maxHeight: '450px',
                  objectFit: 'contain',
                  borderRadius: '20px',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                }}
              />
              
              <Box sx={{
                position: 'absolute',
                top: '15%',
                right: '5%',
                maxWidth: '220px',
                bgcolor: 'white',
                p: 2,
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                animation: 'float 6s infinite ease-in-out',
                display: { xs: 'none', lg: 'block' },
                zIndex: 2
              }}>
                <Typography variant="body2" color="text.primary">
                  <strong>Q: What are grounds for divorce in India?</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Legal assistance in seconds
                </Typography>
              </Box>
              
              <Box sx={{
                position: 'absolute',
                bottom: '25%',
                right: '12%',
                maxWidth: '180px',
                bgcolor: 'white',
                p: 2,
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                animation: 'float 6s infinite ease-in-out 1s',
                display: { xs: 'none', lg: 'block' },
                zIndex: 2
              }}>
                <Rating value={5} size="small" readOnly />
                <Typography variant="caption" color="text.secondary">
                  "Very helpful for my property dispute case!"
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Grid container sx={{ mt: { xs: -4, md: -5 }, mb: 6, position: 'relative' }}>
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ 
              borderRadius: '16px', 
              py: 3, 
              px: { xs: 2, md: 4 },
              position: 'relative',
              zIndex: 10
            }}>
              <Grid container spacing={2} textAlign="center" justifyContent="space-around">
                {[
                  { value: "500", label: "Legal Queries Answered" },
                  { value: "15+", label: "Acts & Laws Covered" },
                  { value: "99.2%", label: "Accuracy Rate" },
                  { value: "10+", label: "Indian Languages" }
                ].map((stat, index) => (
                  <Grid item xs={6} md={3} key={index} sx={{ py: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {stat.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ 
        py: 6, 
        mt: 4, 
        position: 'relative',
        zIndex: 1
      }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1}>
            COMPREHENSIVE LEGAL FEATURES
          </Typography>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                bottom: '-12px',
                left: 'calc(50% - 30px)',
                borderRadius: '2px'
              }
            }}
          >
            Your AI-Powered Legal Companion
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 4, fontSize: '1.05rem' }}>
            Our AI assistant combines cutting-edge NLP technology with comprehensive Indian legal data 
            to provide you with reliable, contextual legal information
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            { 
              icon: <GavelIcon fontSize="large" />, 
              color: '#4361ee',
              title: 'Comprehensive Legal Coverage', 
              description: 'Access detailed information on IPC, Constitution of India, CPC, Consumer Protection Act, RTI, Family law, and more from official legal sources.',
              useCase: 'Perfect for law students preparing for exams and professionals researching multiple acts.' 
            },
            { 
              icon: <SearchIcon fontSize="large" />, 
              color: '#3a0ca3',
              title: 'AI-Powered Legal Search', 
              description: 'Our BERT-based retrieval system identifies and fetches the most relevant legal provisions for your specific query with cited references.',
              useCase: 'Helps lawyers quickly find relevant precedents and provisions across multiple acts.' 
            },
            { 
              icon: <TranslateIcon fontSize="large" />, 
              color: '#4895ef',
              title: 'Multilingual Legal Assistance', 
              description: 'Get legal assistance in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and more Indian languages.',
              useCase: 'Makes legal information accessible to all citizens regardless of language preference.' 
            },
            { 
              icon: <VerifiedUserIcon fontSize="large" />, 
              color: '#560bad',
              title: 'Verified Legal Information', 
              description: 'All responses include proper citations to official legal sources like acts, sections, and case laws that can be independently verified.',
              useCase: 'Build stronger legal arguments with accurately cited information from authoritative sources.' 
            },
            { 
              icon: <WhatsAppIcon fontSize="large" />, 
              color: '#38b000',
              title: 'WhatsApp Integration', 
              description: 'Access legal assistance directly through WhatsApp for on-the-go advice, document analysis and quick reference during court proceedings.',
              useCase: 'Perfect for busy professionals who need immediate answers during client meetings.' 
            },
            { 
              icon: <SchoolIcon fontSize="large" />, 
              color: '#f72585',
              title: 'Legal Education Tools', 
              description: 'Access explanations of complex legal concepts, comparative analyses between laws, and hypothetical examples to deepen understanding.',
              useCase: 'Ideal for law students and citizens wanting to understand their rights and obligations.' 
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                className="feature-card"
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  '&.animate-in': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: feature.color,
                    zIndex: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      backgroundColor: `${feature.color}15`, 
                      color: feature.color,
                      mb: 3,
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease',
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.2rem'
                      },
                      '.feature-card:hover &': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ mb: 1.5, fontSize: '1.05rem' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 2, fontSize: '0.85rem' }}
                  >
                    {feature.description}
                  </Typography>
                  
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1, 
                    border: '1px dashed', 
                    borderColor: 'divider' 
                  }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      <strong>Use Case:</strong> {feature.useCase}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ 
        bgcolor: 'rgba(67, 97, 238, 0.05)', 
        py: 10,
        position: 'relative',
        zIndex: 1,
        mt: 2
      }} ref={stepsRef}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1}>
              SIMPLIFIED PROCESS
            </Typography>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}
            >
              How Our Legal Assistant Works
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 2, mb: 2, fontSize: '1.05rem' }}>
              Powered by Retrieval-Augmented Generation (RAG) Technology
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontSize: '0.85rem' }}>
              Our system combines the power of large language models with specialized retrieval 
              mechanisms that access verified legal databases to ensure you receive accurate,
              contextually appropriate legal information.
            </Typography>
          </Box>
          
          <Box sx={{ px: { md: 5 } }}>
            <Grid container spacing={3}>
              {[
                { 
                  step: 1, 
                  title: 'Ask Your Legal Query', 
                  description: 'Enter your question in natural language through our chat interface or WhatsApp. We support both English and Indian regional languages.',
                  icon: <ChatIcon />,
                  example: '"What are the grounds for divorce under Hindu Marriage Act?"'
                },
                { 
                  step: 2, 
                  title: 'Query Analysis & Classification', 
                  description: 'Our AI analyzes your question to identify intent, extract legal entities, and classify it into the relevant domains of Indian law.',
                  icon: <SearchIcon />,
                  example: 'System identifies Hindu Marriage Act and grounds for dissolution as key aspects'
                },
                { 
                  step: 3, 
                  title: 'Specialized Legal Knowledge Retrieval', 
                  description: 'Our BERT-based retriever searches through our database of Indian legal texts to find the most relevant sections, precedents and legal provisions.',
                  icon: <GavelIcon />,
                  example: 'Retrieves Section 13 of Hindu Marriage Act and relevant Supreme Court judgments'
                },
                { 
                  step: 4, 
                  title: 'Generation of Accurate Response', 
                  description: 'The language model generates a comprehensive answer based on the retrieved legal information, ensuring accuracy and relevance.',
                  icon: <LocalLibraryIcon />,
                  example: 'Creates response with explanation of grounds like cruelty, desertion, and conversion'
                },
                { 
                  step: 5, 
                  title: 'Citation & Source Verification', 
                  description: 'All responses include proper citations to relevant sections, acts, and case laws that you can independently verify for complete confidence.',
                  icon: <VerifiedUserIcon />,
                  example: 'Cites "Section 13(1)(ia) of Hindu Marriage Act, 1955" with reference to precedents'
                },
              ].map((step, index) => (
                <Grid item xs={12} key={index}>
                  <Paper 
                    elevation={0} 
                    className="step-item"
                    sx={{ 
                      p: 3,
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 3,
                      position: 'relative',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <Avatar
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                        boxShadow: '0 8px 16px rgba(67, 97, 238, 0.2)'
                      }}
                    >
                      {step.icon}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          right: -10, 
                          width: 25,
                          height: 25,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'secondary.main',
                          color: 'white',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {step.step}
                      </Typography>
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.05rem' }}>{step.title}</Typography>
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '0.9rem' }}>
                        {step.description}
                      </Typography>
                      
                      <Box sx={{ 
                        p: 1.5, 
                        bgcolor: 'rgba(67, 97, 238, 0.05)', 
                        borderRadius: 1,
                        border: '1px dashed rgba(67, 97, 238, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <AccessTimeIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontStyle="italic">
                          <strong>Example:</strong> {step.example}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  {index < 4 && (
                    <Box 
                      className="connector"
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        py: 1
                      }}
                    >
                      <Box sx={{ 
                        height: 40, 
                        width: 2, 
                        bgcolor: 'primary.light',
                        opacity: 0.5
                      }} />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ 
        py: 8, 
        position: 'relative',
        zIndex: 1,
        mt: 2
      }}>
        <Box textAlign="center" mb={5}>
          <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1}>
            SUCCESS STORIES
          </Typography>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            What Our Users Say
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: '0.9rem' }}>
            Discover how our legal assistant is helping people across India make informed legal decisions
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {[
            {
              name: "Rajesh Kumar",
              location: "Delhi",
              role: "Small Business Owner",
              quote: "The legal assistant helped me understand GST compliance for my new business. The citations to specific sections made it easy to verify the information with my CA.",
              rating: 5
            },
            {
              name: "Priya Subramaniam",
              location: "Chennai",
              role: "IT Professional",
              quote: "Being able to ask questions in Tamil made a huge difference. I was able to understand property inheritance laws relevant to my family situation without dealing with complicated legal jargon.",
              rating: 5
            },
            {
              name: "Arjun Mehta",
              location: "Mumbai",
              role: "Law Student",
              quote: "As a law student, this tool has been invaluable for research. It quickly points me to relevant sections and cases that would have taken hours to find manually.",
              rating: 4
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Rating value={testimonial.rating} readOnly />
                  </Box>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      position: 'relative',
                      fontStyle: 'italic',
                      mb: 3,
                      '&::before': {
                        content: '""', // Corrected to avoid unwanted text
                        fontSize: '3rem',
                        position: 'absolute',
                        top: -20,
                        left: -10,
                        opacity: 0.2,
                        color: 'primary.main'
                      }
                    }}
                  >
                    {testimonial.quote}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `hsl(${index * 40}, 70%, 50%)`, 
                        width: 50, 
                        height: 50 
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}, {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box 
        ref={ctaRef}
        sx={{ 
          py: { xs: 6, md: 10 },
          position: 'relative',
          zIndex: 1,
          mt: 2,
          background: 'linear-gradient(45deg, #3a0ca3 0%, #4361ee 100%)',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden'
        }}
        className="cta-section"
      >
        <Box className="animated-bg-elements">
          {[...Array(8)].map((_, i) => (
            <Box 
              key={i}
              className="floating-shape"
              sx={{
                position: 'absolute',
                width: `${30 + Math.random() * 40}px`,
                height: `${30 + Math.random() * 40}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '8px',
                background: 'rgba(255,255,255,0.1)',
                opacity: 0.2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
              }}
            />
          ))}
        </Box>
        
        <Container maxWidth="md">
          <Box className="cta-content">
            <Typography variant="overline" fontWeight="bold" sx={{ letterSpacing: 2, mb: 2, display: 'block' }}>
              GET STARTED TODAY
            </Typography>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              className="cta-title"
              sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}
            >
              Make Informed Legal Decisions With Confidence
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, fontSize: '1.05rem' }} className="cta-subtitle">
              Whether you're a lawyer, law student, or citizen - get reliable legal information in seconds
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }} className="cta-buttons">
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/chat"
                startIcon={<ChatIcon />}
                sx={{ 
                  borderRadius: '50px', 
                  px: 4, 
                  py: 1.5,
                  fontWeight: 'bold',
                  background: 'white',
                  color: '#3a0ca3',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start For Free
              </Button>
              {/* Browse Resources button removed */}
            </Box>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(0,0,0,0.2)', 
              borderRadius: 3,
              maxWidth: '600px',
              mx: 'auto'
            }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Join thousands of users including:
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {['Law Students', 'Advocates', 'Legal Researchers', 'Paralegals', 'Citizens'].map((user, i) => (
                  <Grid item key={i}>
                    <Chip 
                      label={user} 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontWeight: 'medium',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ 
        py: 5, 
        bgcolor: 'background.paper',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                RAGify India
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: '300px' }}>
                AI-Powered Legal Assistant for Navigating Indian Laws, combining advanced AI with verified legal knowledge.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[
                  <FacebookIcon />,
                  <TwitterIcon />,
                  <LinkedInIcon />,
                  <InstagramIcon />
                ].map((icon, i) => (
                  <IconButton key={i} size="small" color="primary" sx={{ 
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    {icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Legal Topics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/topics/ipc" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Indian Penal Code</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/topics/cpc" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Civil Procedure</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/topics/family-law" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Family Law</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/topics/property-law" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Property Law</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/topics/all" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>View All</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/blog" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Legal Blog</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/templates" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Legal Templates</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/faq" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>FAQ</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/glossary" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Legal Glossary</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/about" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>About Us</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/careers" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Careers</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/contact" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Contact</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph component={Link} to="/privacy" sx={{ display: 'block', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} RAGify India Legal Assistant. All rights reserved.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Not a substitute for professional legal advice
            </Typography>
          </Box>
        </Container>
      </Box>

      <style jsx="true">{`
        .pulse-button {
          animation: pulse-animation 2s infinite;
        }
        
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @media (max-width: 600px) {
          .feature-card {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;
