import axios from 'axios';

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle proxy/connection errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Connection to server failed:', error.message);
      // You could dispatch a notification here or handle it as needed
      return Promise.reject({
        response: {
          status: 503,
          data: { 
            message: 'Unable to connect to server. Please ensure the backend service is running.'
          }
        }
      });
    }
    return Promise.reject(error);
  }
);

// API endpoints
export default {
  // Auth-related routes
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Query-related routes
  processQuery: (queryData) => api.post('/queries/process', queryData),
  getSavedQueries: () => api.get('/queries/saved'),
  saveQuery: (queryData) => api.post('/queries/save', queryData),
  
  // Test endpoint to check connection
  testConnection: () => api.get('/test')
};
