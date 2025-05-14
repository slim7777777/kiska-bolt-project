import React from 'react';
import { Stack } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import BinaryBackground from '@/components/Animations/BinaryBackground';

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <BinaryBackground />
      <Stack screenOptions={{
        headerShown: false,
        animation: 'fade',
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});