import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Analytics } from '@vercel/analytics/react';
import { trackEvent, isPwaStandalone } from '@/constants/analytics';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    // Register PWA service worker and track launch mode on web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }

      const standalone = isPwaStandalone();
      trackEvent('app_init', {
        mode: standalone ? 'pwa_standalone' : 'browser',
        screen_width: window.innerWidth,
        user_agent: navigator.userAgent
      });
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      {Platform.OS === 'web' && <Analytics />}
    </>
  );
}
