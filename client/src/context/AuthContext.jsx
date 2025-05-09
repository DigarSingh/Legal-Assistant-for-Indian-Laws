import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Validate token with backend if needed
          // const response = await api.get('/auth/validate');
          
          // For now, just set the user from localStorage
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Auth validation error", err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with actual API call
      const response = await api.post('/auth/login', { email, password });
      
      // Store tokens and user data
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
      return { success: false, error: err.response?.data?.message || "Login failed" };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      // If auto-login after register
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      console.error("Registration error", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
      return { success: false, error: err.response?.data?.message || "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/users/profile', updatedData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      console.error("Profile update error", err);
      setError(err.response?.data?.message || "Profile update failed. Please try again.");
      setLoading(false);
      return { success: false, error: err.response?.data?.message || "Update failed" };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated,
        loading, 
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
