import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Alert,
  Card,
  Avatar,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Demo data - replace with actual API calls in production
const generateDemoData = () => {
  const topics = ['Criminal Law', 'Civil Law', 'Family Law', 'Labor Law', 'Constitutional Law', 'Property Law'];
  const questions = [
    'What are the penalties for Section 302 of IPC?',
    'How to file an RTI application?',
    'What are my rights if I\'m arrested?',
    'What is the procedure for divorce in India?',
    'How to file a complaint against workplace harassment?',
    'What are the property inheritance laws in India?',
    'How to get a bail?',
    'What are the consumer protection laws in India?',
    'What is the process for filing a PIL?',
    'How to register property in India?',
  ];
  
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    query: questions[Math.floor(Math.random() * questions.length)],
    topic: topics[Math.floor(Math.random() * topics.length)],
    confidence: Math.floor(Math.random() * 30) + 70,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const demoData = generateDemoData();

const QueryHistory = () => {
  const theme = useTheme() || { palette: { primary: { main: '#4361ee', dark: '#3a0ca3' } } };
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (!storedToken || !storedUser) {
        navigate('/login', { state: { from: { pathname: '/history' } } });
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
          setQueries(demoData);
          setLoading(false);
        } catch (err) {
          console.error("Error loading query history data", err);
          setError("Failed to load query history. Please try again.");
          setLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error in QueryHistory useEffect:", err);
      setRenderError("An error occurred while loading the page. Please try again.");
      setLoading(false);
    }
  }, [navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (renderError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {renderError}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reload Page
        </Button>
      </Container>
    );
  }

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography>Loading query history...</Typography>
        </Box>
      </Container>
    );
  }

  const filteredQueries = queries.filter(
    (query) =>
      query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ 
      pt: 4, 
      pb: 8,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.04)' : 'rgba(67, 97, 238, 0.03)'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48,
              mr: 2,
              display: { xs: 'none', sm: 'flex' }
            }}>
              <HistoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent' 
              }}>
                Query History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage your past legal queries
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/chat')}
            sx={{ 
              borderRadius: 8,
              mt: { xs: 2, sm: 0 },
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: '0 8px 16px rgba(67, 97, 238, 0.2)',
            }}
          >
            New Query
          </Button>
        </Box>

        <Card sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          mb: 2
        }}>
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <TextField
              variant="outlined"
              placeholder="Search queries..."
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              sx={{ width: { xs: '100%', sm: 300 } }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              size="medium"
              sx={{ borderRadius: 2 }}
            >
              Filter
            </Button>
          </Box>

          {filteredQueries.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography color="text.secondary">No queries found</Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/chat')}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Start a new query
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Query</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Topic</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredQueries
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((query) => (
                        <TableRow
                          key={query.id}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' },
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
                            <Typography noWrap>{query.query}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={query.topic} 
                              size="small"
                              sx={{ 
                                borderRadius: '4px',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(query.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${query.confidence}%`} 
                              size="small" 
                              color={query.confidence > 80 ? "success" : "warning"}
                              sx={{ borderRadius: '4px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewQuery(query)}
                              sx={{ 
                                bgcolor: 'rgba(67, 97, 238, 0.1)',
                                mr: 1,
                                '&:hover': {
                                  bgcolor: 'rgba(67, 97, 238, 0.2)',
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              sx={{ 
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredQueries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Container>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        {selectedQuery && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Query Details
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3, mt: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  QUERY
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedQuery.query}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ANSWER
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(67, 97, 238, 0.05)', borderRadius: 2 }}>
                  <Typography variant="body1">
                    According to the Indian legal code, this query would be addressed by relevant sections and precedents. 
                    The specific details would vary based on the jurisdiction and recent amendments to the law.
                    (This is demo data - actual responses would contain the full answer from the AI assistant)
                  </Typography>
                </Paper>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  TOPIC
                </Typography>
                <Chip 
                  label={selectedQuery.topic} 
                  size="small" 
                  sx={{ mt: 0.5, borderRadius: '4px' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    DATE
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedQuery.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    CONFIDENCE
                  </Typography>
                  <Chip 
                    label={`${selectedQuery.confidence}%`} 
                    size="small" 
                    color={selectedQuery.confidence > 80 ? "success" : "warning"}
                    sx={{ mt: 0.5, borderRadius: '4px' }}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
                Close
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 4px 12px rgba(67, 97, 238, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default QueryHistory;
