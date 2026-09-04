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

export function canInstallPwa(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return !!(window as any).deferredPrompt && !isPwaStandalone();
}

export async function promptPwaInstall(): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const promptEvent = (window as any).deferredPrompt;
  if (!promptEvent) return false;

  try {
    await promptEvent.prompt();
    const choiceResult = await promptEvent.userChoice;
    trackEvent('pwa_install_choice', { outcome: choiceResult.outcome });
    (window as any).deferredPrompt = null;
    return choiceResult.outcome === 'accepted';
  } catch (err) {
    trackEvent('pwa_install_error', { error: String(err) });
    return false;
  }
}
