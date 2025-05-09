import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);
  
  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For development - using sample data
      // In production, uncomment the API call
      
      // const response = await api.get('/notifications');
      // setNotifications(response.data);
      
      // Sample data for development
      setNotifications([
        { id: 1, text: "New legal update: Changes to RTI Act", read: false, time: "2 hours ago" },
        { id: 2, text: "Your query about IPC Section 302 has been answered", read: false, time: "1 day ago" },
        { id: 3, text: "Welcome to Legal Assistant! Learn how to use our platform", read: true, time: "3 days ago" },
      ]);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("Failed to fetch notifications");
      setLoading(false);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      // In production, call API to mark as read
      // await api.put(`/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In production, call API to mark all as read
      // await api.put('/notifications/read-all');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
