import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from '@/components/Login/LoginScreen';
import BinaryBackground from '@/components/Animations/BinaryBackground';
import { authenticate } from '@/utils/auth';

// Helper functions for cross-platform storage
const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Check if user is already logged in
      const token = await getStorageItem('userToken');
      
      if (token) {
        // If token exists, navigate to main screen
        setTimeout(() => {
          router.replace('/(main)');
        }, 500);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    
    try {
      // Authenticate user (in a real app, this would call an API)
      const success = await authenticate(username, password);
      
      if (success) {
        // Store credentials securely (for demo purposes)
        await setStorageItem('userToken', 'demo-token');
        await setStorageItem('username', username);
        
        // Navigate to main screen
        router.replace('/(main)');
      } else {
        setLoading(false);
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, message: 'An error occurred' };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <BinaryBackground />
      <LoginScreen onLogin={handleLogin} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});