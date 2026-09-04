import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';

export const ToastBanner: React.FC = () => {
  const { toastText, theme } = useOwnCura();
  const t = AppTheme[theme];

  if (!toastText) return null;

  return (
    <View pointerEvents="none" style={styles.toastContainer}>
      <View style={[styles.toastBubble, { backgroundColor: t.toastBg }]}>
        <Text style={[styles.toastText, { color: t.toastInk }]}>{toastText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99
  },
  toastBubble: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
