import { Platform } from 'react-native';
import { track } from '@vercel/analytics';

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      track(name, properties);
    } catch {
      // safe fallback
    }
  }
}

export function isPwaStandalone(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}
