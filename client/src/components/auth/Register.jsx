import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  useTheme
} from '@mui/material';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GavelIcon from '@mui/icons-material/Gavel';
import api from '../../services/api';

const Register = ({ onLogin = () => {}, isAuthenticated }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = ['Personal Information', 'Create Account'];

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep === 0) {
      handleNext();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // For demonstration, using a timeout to simulate API call
      // In production, replace with actual API call
      setTimeout(() => {
        console.log('Registration attempt with:', formData);
        
        // Store authentication data in localStorage
        localStorage.setItem('token', 'dummy-token-12345');
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: formData.name
        }));
        
        // Use onLogin if it's a function
        if (typeof onLogin === 'function') {
          onLogin('dummy-token-12345');
        }
        
        setLoading(false);
        navigate('/dashboard');
      }, 1500);

      // Actual API implementation would be:
      /*
      const response = await api.register(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (typeof onLogin === 'function') {
        onLogin(response.token);
      }
      navigate('/dashboard');
      */
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Decorative elements */}
      <Box sx={{ 
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        zIndex: 0
      }} />
      <Box sx={{ 
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        zIndex: 0
      }} />

      <Container maxWidth="lg">
        <Card 
          elevation={24} 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
          }}
        >
          {/* Left side - Brand/Info */}
          <Box 
            sx={{ 
              flex: { xs: '0 0 100%', md: '0 0 45%' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: 'white',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 4,
                  '& .MuiSvgIcon-root': { fontSize: '2rem', mr: 1.5 }
                }}
              >
                <GavelIcon />
                <Typography variant="h5" fontWeight="bold">RAGify India</Typography>
              </Box>
              
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1.5 }}>
                Join us today!
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, fontSize: '0.95rem' }}>
                Create your account to access personalized legal information powered by AI. Navigate Indian laws with confidence.
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                  "Law is the embodiment of the moral sentiment of the people."
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                  — William Blackstone
                </Typography>
              </Box>
            </Box>
            
            {/* Decorative circles */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: -100, 
              right: -100, 
              width: 300, 
              height: 300, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              zIndex: 1
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: -30, 
              left: -30, 
              width: 150, 
              height: 150, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              zIndex: 1
            }} />
          </Box>
          
          {/* Right side - Registration Form */}
          <Box 
            sx={{ 
              flex: { xs: '0 0 100%', md: '0 0 55%' },
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ maxWidth: 480, width: '100%', mx: 'auto' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Create your account
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block', fontSize: '0.85rem' }}>
                Join RAGify India for legal assistance
              </Typography>
              
              <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ '& .MuiStepLabel-labelContainer': { fontSize: '0.8rem' } }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {activeStep === 0 ? (
                  <>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="medium"
                        sx={{ 
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(67, 97, 238, 0.3)',
                          fontSize: '0.9rem'
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      size="small"
                      sx={{ 
                        mb: 1.5,
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        onClick={handleBack}
                        size="medium"
                        sx={{ 
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          fontSize: '0.9rem'
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        size="medium"
                        sx={{ 
                          px: 3,
                          py: 0.8,
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(67, 97, 238, 0.3)',
                          fontSize: '0.9rem'
                        }}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Sign Up'}
                      </Button>
                    </Box>
                  </>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold" color="primary" sx={{ fontSize: '0.8rem' }}>
                      Log in
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
