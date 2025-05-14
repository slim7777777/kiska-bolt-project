import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { 
  useFonts, 
  Rajdhani_300Light,
  Rajdhani_400Regular,
  Rajdhani_500Medium,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold
} from '@expo-google-fonts/rajdhani';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'Rajdhani-Light': Rajdhani_300Light,
    'Rajdhani-Regular': Rajdhani_400Regular,
    'Rajdhani-Medium': Rajdhani_500Medium,
    'Rajdhani-SemiBold': Rajdhani_600SemiBold,
    'Rajdhani-Bold': Rajdhani_700Bold,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Bold': Roboto_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Wait for fonts to load before rendering
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#000' }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}