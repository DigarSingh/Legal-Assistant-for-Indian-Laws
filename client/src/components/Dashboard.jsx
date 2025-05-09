import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  useTheme,
  Container,
  Alert,
  Avatar,
  IconButton,
  LinearProgress,
  Tooltip,
  Chip,
  alpha
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '../services/api';

const recentQueries = [
  { id: 1, text: "What are the penalties for Section 302 of IPC?", timestamp: "2023-10-25T14:30:00" },
  { id: 2, text: "How to file an RTI application?", timestamp: "2023-10-24T11:15:00" },
  { id: 3, text: "What are my rights if I'm arrested?", timestamp: "2023-10-23T09:45:00" },
];

const popularTopics = [
  { id: 1, name: "Criminal Law", count: 245 },
  { id: 2, name: "Right to Information", count: 187 },
  { id: 3, name: "Labor Laws", count: 156 },
  { id: 4, name: "Family Law", count: 134 },
  { id: 5, name: "Property Law", count: 112 },
];

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalQueries: 0,
    answeredQueries: 0,
    averageConfidence: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedToken || !storedUser) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to parse user data", err);
      setError("Session data is corrupted. Please log in again.");
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      try {
        setStats({
          totalQueries: 32,
          answeredQueries: 28,
          averageConfidence: 86.5,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%', // Full width without sidebar
      pt: 4, 
      pb: 8,
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.4,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23${theme.palette.primary.main.slice(1)}\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
      }}/>

      {/* Main Content - Full width */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header section with welcome and new query button */}
        <Box sx={{ 
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' }
        }}>
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ 
              fontWeight: 500,
              mb: { xs: 3, md: 0 } 
            }}>
              {user ? `Welcome back, ${user.name || 'User'} 👋` : 'Your legal insights overview'}
            </Typography>
          </Box>

          {/* Quick action buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined"
              component={Link}
              to="/history"
              startIcon={<HistoryIcon />}
              sx={{ 
                borderRadius: '12px',
                fontWeight: 600,
              }}
            >
              History
            </Button>
            <Button 
              variant="contained" 
              component={Link}
              to="/chat"
              startIcon={<ChatIcon />}
              sx={{ 
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              New Legal Query
            </Button>
          </Box>
        </Box>

        {/* Main dashboard content - remains the same */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">Loading your dashboard...</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Stats Cards - Enhanced with glassmorphism and better visuals */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.8)})`,
                boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.35)}`
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 56, 
                      height: 56,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      mr: 2
                    }}>
                      <AssessmentIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        Total Queries
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="white">
                        {stats.totalQueries}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    py: 1.5, 
                    px: 2, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      <Box component="span" sx={{ fontWeight: 'bold' }}>32% </Box>
                      increase from last month
                    </Typography>
                    <TrendingUpIcon sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.dark, 0.8)})`,
                boxShadow: `0 10px 25px ${alpha(theme.palette.secondary.main, 0.25)}`,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 15px 30px ${alpha(theme.palette.secondary.main, 0.35)}`
                }
              }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 56, 
                      height: 56,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      mr: 2
                    }}>
                      <QuestionAnswerIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        Answered Queries
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="white">
                        {stats.answeredQueries}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>Completion</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {Math.round((stats.answeredQueries / stats.totalQueries) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stats.answeredQueries / stats.totalQueries) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(33, 203, 243, 0.8))',
                boxShadow: '0 10px 25px rgba(33, 150, 243, 0.25)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(33, 150, 243, 0.35)'
                }
              }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 56, 
                      height: 56,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      mr: 2
                    }}>
                      <VerifiedIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        Average Confidence
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="white">
                        {stats.averageConfidence}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    mt: 'auto',
                    py: 1.5, 
                    px: 2, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: stats.averageConfidence > 80 ? '#4caf50' : '#ff9800'
                    }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {stats.averageConfidence > 80 ? 'Excellent accuracy' : 'Good accuracy'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Queries - Enhanced card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '16px',
                overflow: 'hidden',
                background: theme.palette.background.paper,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
              }}>
                <Box sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                  background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.8)}, ${theme.palette.background.paper})`,
                  backdropFilter: 'blur(8px)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
                      width: 42,
                      height: 42,
                      mr: 2
                    }}>
                      <HistoryIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Recent Queries
                    </Typography>
                  </Box>
                  <Button 
                    component={Link} 
                    to="/history" 
                    variant="outlined"
                    size="small"
                    endIcon={<HistoryIcon fontSize="small" />}
                    sx={{ 
                      borderRadius: 10, 
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      px: 2,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.04)
                      }
                    }}
                  >
                    View All
                  </Button>
                </Box>
                <List sx={{ px: 1 }}>
                  {recentQueries.map((query, index) => (
                    <React.Fragment key={query.id}>
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ 
                          px: 2, 
                          py: 2,
                          transition: 'all 0.2s ease',
                          borderRadius: '12px',
                          mx: 1,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            transform: 'translateX(5px)'
                          }
                        }}
                        button
                        component={Link}
                        to={`/chat/${query.id}`}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                              {query.text}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.primary.main,
                                  mr: 1
                                }}
                              />
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {new Date(query.timestamp).toLocaleDateString()} at {new Date(query.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentQueries.length - 1 && <Divider variant="inset" component="li" sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))}
                </List>
                {recentQueries.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box 
                      component="img"
                      src="/images/empty-state.svg"
                      alt="No queries"
                      sx={{ width: 120, height: 120, opacity: 0.7 }}
                    />
                    <Box>
                      <Typography color="text.secondary" variant="body1" sx={{ mb: 1 }}>No recent queries found</Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        component={Link}
                        to="/chat"
                        startIcon={<ChatIcon />}
                      >
                        Start a new query
                      </Button>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Popular Legal Topics - Enhanced card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '16px',
                overflow: 'hidden',
                background: theme.palette.background.paper,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
              }}>
                <Box sx={{ 
                  p: 3, 
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                  background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.8)}, ${theme.palette.background.paper})`,
                  backdropFilter: 'blur(8px)',
                  display: 'flex', 
                  alignItems: 'center'
                }}>
                  <Avatar sx={{ 
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.secondary.main, 0.25)}`,
                    width: 42,
                    height: 42,
                    mr: 2
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Popular Legal Topics
                  </Typography>
                </Box>
                <List sx={{ px: 1 }}>
                  {popularTopics.map((topic, index) => (
                    <React.Fragment key={topic.id}>
                      <ListItem 
                        sx={{ 
                          px: 2,
                          py: 2,
                          transition: 'all 0.2s ease',
                          mx: 1,
                          borderRadius: '12px',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.secondary.main, 0.04)
                          }
                        }}
                        button
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  fontSize: '0.875rem', 
                                  fontWeight: 'bold',
                                  bgcolor: `hsl(${(index * 40) % 360}, 70%, 60%)`
                                }}
                              >
                                {topic.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body1" fontWeight={500}>{topic.name}</Typography>
                            </Box>
                            <Chip 
                              label={`${topic.count}`} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderColor: index % 2 === 0 
                                  ? alpha(theme.palette.primary.main, 0.5) 
                                  : alpha(theme.palette.secondary.main, 0.5)
                              }}
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(topic.count / 245) * 100}
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.divider, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: index % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < popularTopics.length - 1 && <Divider sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Grid>

            {/* Quick Actions - Enhanced with modern design */}
            <Grid item xs={12}>
              <Card sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: '16px',
                background: theme.palette.background.paper,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { 
                      icon: <ChatIcon fontSize="large" />, 
                      label: "New Legal Query", 
                      description: "Ask a question about Indian law",
                      color: theme.palette.primary.main,
                      link: "/chat",
                      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    },
                    { 
                      icon: <HistoryIcon fontSize="large" />, 
                      label: "View History", 
                      description: "See your past legal queries",
                      color: theme.palette.secondary.main,
                      link: "/history", 
                      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    },
                    { 
                      icon: <TrendingUpIcon fontSize="large" />, 
                      label: "Analytics", 
                      description: "Track your legal research",
                      color: "#2196f3",
                      gradient: "linear-gradient(135deg, #2196f3, #0d47a1)",
                    },
                    { 
                      icon: <FeedbackIcon fontSize="large" />, 
                      label: "Send Feedback", 
                      description: "Help us improve our service",
                      color: "#9c27b0",
                      gradient: "linear-gradient(135deg, #9c27b0, #6a0080)",
                    },
                  ].map((action, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        component={action.link ? Link : 'div'}
                        to={action.link}
                        sx={{ 
                          height: '100%',
                          p: 3,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          border: `1px solid ${alpha(action.color, 0.2)}`,
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 10px 20px ${alpha(action.color, 0.15)}`,
                            bgcolor: alpha(action.color, 0.03)
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 65,
                            height: 65,
                            mb: 2,
                            background: action.gradient,
                            boxShadow: `0 8px 16px ${alpha(action.color, 0.25)}`,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                          {action.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
