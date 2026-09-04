import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Home,
  Briefcase,
  Bell,
  LineChart,
  Building2,
  FileText
} from 'lucide-react-native';
import { useOwnCura, ActiveTabType } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';

export const OwnCuraTabBar: React.FC = () => {
  const { theme, role, activeTab, setActiveTab } = useOwnCura();
  const t = AppTheme[theme];

  let tabs: { id: ActiveTabType; label: string; icon: any; badge?: number }[] = [];

  if (role === 'owner') {
    tabs = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'deals', label: 'Deals', icon: Briefcase },
      { id: 'inbox', label: 'Inbox', icon: Bell, badge: 2 }
    ];
  } else if (role === 'team') {
    tabs = [
      { id: 'portfolio', label: 'Portfolio', icon: LineChart },
      { id: 'clinicops', label: 'Clinics', icon: Building2 },
      { id: 'inbox', label: 'Inbox', icon: Bell, badge: 1 }
    ];
  } else {
    tabs = [
      { id: 'digest', label: 'Digest', icon: FileText },
      { id: 'practice', label: 'Practices', icon: Building2 },
      { id: 'inbox', label: 'Inbox', icon: Bell }
    ];
  }

  return (
    <View style={[styles.container, { backgroundColor: t.nav, borderTopColor: t.navSep }]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const color = isActive ? t.tint : t.ter;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <Icon size={25} color={color} strokeWidth={isActive ? 2.3 : 1.7} />
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: -0.1
  }
});
