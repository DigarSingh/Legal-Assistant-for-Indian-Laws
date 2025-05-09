import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Container,
  useTheme,
  Card,
  Badge,
  Fade,
  Tooltip,
  Snackbar
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredLanguage: 'en',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    saveHistory: true,
    darkMode: false,
  });

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedToken || !storedUser) {
      // If not logged in, redirect to login
      navigate('/login', { state: { from: { pathname: '/settings' } } });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Pre-populate the form with user data
      setProfileForm({
        name: parsedUser.name || 'User',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        preferredLanguage: parsedUser.preferredLanguage || 'en',
      });
      
    } catch (err) {
      console.error("Failed to parse user data", err);
      setError("Session data is corrupted. Please log in again.");
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: checked,
    });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Simulate API call
      setTimeout(() => {
        console.log('Profile update with:', profileForm);
        
        // Update local storage with new user info
        const updatedUser = {
          ...user,
          ...profileForm
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        if (avatarFile) {
          console.log('Avatar file:', avatarFile);
          // In a real implementation, you would upload this file to your server
        }
        
        setLoading(false);
        setSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Simulate API call
      setTimeout(() => {
        console.log('Password update');
        setLoading(false);
        setSuccess(true);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please try again.');
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Simulate API call
      setTimeout(() => {
        console.log('Preferences update with:', preferences);
        
        // Update local storage with preferences
        const updatedUser = {
          ...user,
          preferences
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setLoading(false);
        setSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent' 
          }}>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your profile, security, and preferences
          </Typography>
        </Box>
      </Box>

      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(67, 97, 238, 0.05)',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              fontWeight: 'bold',
            },
          }}
          TabIndicatorProps={{
            style: {
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }
          }}
        >
          <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
          <Tab icon={<TuneIcon />} label="Preferences" iconPosition="start" />
        </Tabs>
        
        <Snackbar 
          open={error !== null} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
        
        {success && (
          <Fade in={success}>
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ 
                mt: 2, 
                mx: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Changes saved successfully!
            </Alert>
          </Fade>
        )}

        {tab === 0 && (
          <Fade in={tab === 0}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <form onSubmit={handleProfileSubmit}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 4,
                  position: 'relative' 
                }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <label>
                        <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          sx={{ 
                            bgcolor: 'background.paper',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                            '&:hover': {
                              bgcolor: 'background.paper',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                      </label>
                    }
                  >
                    <Avatar 
                      src={avatarPreview || (user?.avatarUrl || '')} 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '3rem',
                        mb: 2,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        border: '4px solid white'
                      }}
                    >
                      {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </Badge>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    {profileForm.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileForm.email}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      <InputLabel>Preferred Language</InputLabel>
                      <Select
                        name="preferredLanguage"
                        value={profileForm.preferredLanguage}
                        onChange={handleProfileChange}
                        label="Preferred Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="hi">Hindi</MenuItem>
                        <MenuItem value="ta">Tamil</MenuItem>
                        <MenuItem value="te">Telugu</MenuItem>
                        <MenuItem value="bn">Bengali</MenuItem>
                        <MenuItem value="mr">Marathi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? null : <SaveIcon />}
                        disabled={loading}
                        sx={{ 
                          px: 4, 
                          py: 1.2, 
                          borderRadius: 2,
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          background: loading ? undefined : 
                            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>
        )}

        {tab === 1 && (
          <Fade in={tab === 1}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Box sx={{ 
                mb: 4, 
                p: 3, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(25, 118, 210, 0.05)', 
                borderRadius: 2 
              }}>
                <Typography variant="h6" gutterBottom>
                  🔒 Password Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  It's a good practice to use a strong password and change it periodically. Your password should contain a mix of letters, numbers, and symbols.
                </Typography>
              </Box>
            
              <form onSubmit={handlePasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      variant="outlined"
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="New Password"
                      variant="outlined"
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                      helperText={
                        passwordForm.newPassword && passwordForm.newPassword.length < 6 
                          ? "Password must be at least 6 characters" 
                          : " "
                      }
                      error={passwordForm.newPassword && passwordForm.newPassword.length < 6}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Confirm New Password"
                      variant="outlined"
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                      error={passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''}
                      helperText={
                        passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== '' 
                          ? "Passwords don't match" 
                          : " "
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? null : <LockIcon />}
                        disabled={loading || passwordForm.newPassword !== passwordForm.confirmPassword || passwordForm.newPassword.length < 6}
                        sx={{ 
                          px: 4, 
                          py: 1.2, 
                          borderRadius: 2,
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          background: loading ? undefined : 
                            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Update Password'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>
        )}

        {tab === 2 && (
          <Fade in={tab === 2}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <form onSubmit={handlePreferencesSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      p: 3, 
                      height: '100%', 
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1.5 }}>
                          <NotificationsIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          Notifications
                        </Typography>
                      </Box>
                        
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.emailNotifications} 
                              onChange={handlePreferenceChange}
                              name="emailNotifications"
                              color="primary"
                            />
                          }
                          label="Email Notifications"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
                          Receive important updates and information via email
                        </Typography>
                        
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.whatsappNotifications} 
                              onChange={handlePreferenceChange}
                              name="whatsappNotifications"
                              color="primary"
                            />
                          }
                          label="WhatsApp Notifications"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                          Get instant notifications through WhatsApp
                        </Typography>
                      </FormGroup>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      p: 3, 
                      height: '100%', 
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1.5 }}>
                          <TuneIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          App Settings
                        </Typography>
                      </Box>
                      
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.saveHistory} 
                              onChange={handlePreferenceChange}
                              name="saveHistory"
                              color="primary"
                            />
                          }
                          label="Save Query History"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
                          Store your conversation history for future reference
                        </Typography>
                        
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={preferences.darkMode} 
                              onChange={handlePreferenceChange}
                              name="darkMode"
                              color="primary"
                            />
                          }
                          label="Dark Mode"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                          Switch between light and dark theme
                        </Typography>
                      </FormGroup>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? null : <SaveIcon />}
                    disabled={loading}
                    sx={{ 
                      px: 4, 
                      py: 1.2, 
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      background: loading ? undefined : 
                        `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Fade>
        )}
      </Card>
    </Container>
  );
};

export default Settings;
