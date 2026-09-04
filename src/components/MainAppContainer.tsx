import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { OwnCuraNavBar } from '@/components/OwnCuraNavBar';
import { OwnCuraTabBar } from '@/components/OwnCuraTabBar';
import { OwnCuraSheets } from '@/components/OwnCuraSheets';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { ValuationScreen } from '@/components/screens/ValuationScreen';
import { ExploreScreen } from '@/components/screens/ExploreScreen';
import { OptionsScreen } from '@/components/screens/OptionsScreen';
import { DealsScreen } from '@/components/screens/DealsScreen';
import { InboxScreen } from '@/components/screens/InboxScreen';
import { PortfolioScreen } from '@/components/screens/PortfolioScreen';
import { ClinicOpsScreen } from '@/components/screens/ClinicOpsScreen';
import { DigestScreen } from '@/components/screens/DigestScreen';
import { PracticeDetailScreen } from '@/components/screens/PracticeDetailScreen';
import { ToastBanner } from '@/components/ToastBanner';

export const MainAppContainer: React.FC = () => {
  const { theme, role, activeTab, stack, popScreen, openSheet } = useOwnCura();
  const t = AppTheme[theme];

  // Active view is topmost in stack or the current activeTab
  const currentView = stack.length > 0 ? stack[stack.length - 1] : activeTab;
  const isRoot = stack.length === 0;

  let title = 'Home';
  if (currentView === 'home') title = 'Home';
  else if (currentView === 'valuation') title = 'Valuation';
  else if (currentView === 'explore') title = 'Explore';
  else if (currentView === 'options') title = 'Growth Options';
  else if (currentView === 'deals') title = 'Deal Room';
  else if (currentView === 'inbox') title = 'Inbox';
  else if (currentView === 'portfolio') title = 'Portfolio';
  else if (currentView === 'clinicops') title = 'Clinic Operations';
  else if (currentView === 'digest') title = 'Digest';
  else if (currentView === 'practice') title = 'Practice Detail';

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'valuation':
        return <ValuationScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'options':
        return <OptionsScreen />;
      case 'deals':
        return <DealsScreen />;
      case 'inbox':
        return <InboxScreen />;
      case 'portfolio':
        return <PortfolioScreen />;
      case 'clinicops':
        return <ClinicOpsScreen />;
      case 'digest':
        return <DigestScreen />;
      case 'practice':
        return <PracticeDetailScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <OwnCuraNavBar
        title={title}
        showBack={!isRoot}
        backLabel={stack.length > 1 ? 'Back' : 'Home'}
        onBack={popScreen}
        onOpenProfile={() => openSheet('profile')}
        largeTitle={isRoot}
      />

      <View style={styles.screenWrapper}>{renderContent()}</View>

      <OwnCuraTabBar />
      <OwnCuraSheets />
      <ToastBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screenWrapper: {
    flex: 1
  }
});
