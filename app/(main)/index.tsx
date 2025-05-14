import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';

import Header from '@/components/Home/Header';
import Orb from '@/components/Home/Orb';
import ChatBox from '@/components/Home/ChatBox';
import VoiceListener from '@/components/Home/VoiceListener';
import NotificationIcons from '@/components/Home/NotificationIcons';
import { speakText } from '@/utils/speech';

export default function HomeScreen() {
  const [username, setUsername] = useState('User');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'kiska'}[]>([]);
  const [weatherData, setWeatherData] = useState({ temp: '72°', condition: 'Clear' });

  useEffect(() => {
    loadUserData();
    
    // Greet user on first load
    setTimeout(() => {
      const greeting = `Welcome back, ${username || 'Trent'}.`;
      handleKiskaMessage(greeting);
    }, 1500);
  }, []);

  const loadUserData = async () => {
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername('Trent'); // Default username if none is stored
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleVoiceInput = (text: string) => {
    if (text) {
      // Add user message to chat
      setMessages(prev => [...prev, { text, sender: 'user' }]);
      
      // Process the input and generate a response
      setTimeout(() => {
        const response = generateResponse(text);
        handleKiskaMessage(response);
      }, 1000);
    }
  };

  const handleKiskaMessage = (text: string) => {
    setIsSpeaking(true);
    // Add KISKA message to chat
    setMessages(prev => [...prev, { text, sender: 'kiska' }]);
    
    // Text to speech
    speakText(text, () => {
      setIsSpeaking(false);
    });
  };

  const generateResponse = (input: string) => {
    // This is a simple mock response generator
    // In a real app, this would connect to an AI service
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('weather')) {
      return `The current temperature is ${weatherData.temp} and conditions are ${weatherData.condition}.`;
    } else if (inputLower.includes('time')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    } else if (inputLower.includes('hello') || inputLower.includes('hi')) {
      return `Hello ${username}. How can I assist you today?`;
    } else if (inputLower.includes('name')) {
      return `I am KISKA, your personal AI assistant.`;
    } else if (inputLower.includes('help')) {
      return `I can help you with checking the weather, time, or setting reminders. What would you like to do?`;
    } else {
      return `I processed your request: "${input}". How can I assist you further?`;
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header weatherData={weatherData} />
      
      <View style={styles.orbContainer}>
        <NotificationIcons position="left" />
        <Orb 
          isListening={isListening} 
          isSpeaking={isSpeaking} 
          onPress={toggleListening} 
        />
        <NotificationIcons position="right" />
      </View>
      
      <ChatBox messages={messages} />
      
      <VoiceListener 
        isListening={isListening} 
        onSpeechResult={handleVoiceInput}
        onSpeechEnd={() => setIsListening(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  orbContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});