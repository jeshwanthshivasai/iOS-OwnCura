import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { OwnCuraProvider, useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { MainAppContainer } from '@/components/MainAppContainer';

function RootContent() {
  const { theme } = useOwnCura();
  const t = AppTheme[theme];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: t.nav }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <MainAppContainer />
    </SafeAreaView>
  );
}

export default function IndexPage() {
  return (
    <OwnCuraProvider>
      <RootContent />
    </OwnCuraProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
