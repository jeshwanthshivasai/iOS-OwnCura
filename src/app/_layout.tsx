import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Analytics } from '@vercel/analytics/react';
import { trackEvent, isPwaStandalone, promptPwaInstall } from '@/constants/analytics';
import { Download, X } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();

    // Register PWA service worker and track launch mode on web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
      }

      const standalone = isPwaStandalone();
      trackEvent('app_init', {
        mode: standalone ? 'pwa_standalone' : 'browser',
        screen_width: window.innerWidth,
        user_agent: navigator.userAgent,
      });

      // Listen for PWA installability prompt
      const handleInstallable = () => {
        if (!standalone && !sessionStorage.getItem('dismissed_install_banner')) {
          setShowInstallBanner(true);
        }
      };

      if ((window as any).deferredPrompt && !standalone) {
        handleInstallable();
      }

      window.addEventListener('pwa-installable', handleInstallable);
      window.addEventListener('beforeinstallprompt', handleInstallable);

      return () => {
        window.removeEventListener('pwa-installable', handleInstallable);
        window.removeEventListener('beforeinstallprompt', handleInstallable);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    trackEvent('install_banner_clicked');
    const installed = await promptPwaInstall();
    if (installed) {
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      sessionStorage.setItem('dismissed_install_banner', 'true');
    }
    trackEvent('install_banner_dismissed');
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>

      {showInstallBanner && (
        <View style={styles.bannerContainer}>
          <View style={styles.bannerCard}>
            <Image
              source={require('../../assets/images/indoslogo.png')}
              style={styles.bannerLogo}
              resizeMode="contain"
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Install OwnCura App</Text>
              <Text style={styles.bannerSubtitle}>Add to Home Screen for full app experience</Text>
            </View>
            <TouchableOpacity
              style={styles.installButton}
              onPress={handleInstallClick}
              activeOpacity={0.8}
            >
              <Download size={14} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
              <Text style={styles.installButtonText}>Install</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={16} color="#7E8B87" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {Platform.OS === 'web' && <Analytics />}
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: 'center',
  },
  bannerCard: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151C1A',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#232E2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#9EABA7',
    marginTop: 1,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#11655B',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 10,
    marginLeft: 10,
  },
  installButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dismissButton: {
    padding: 6,
    marginLeft: 6,
  },
});

