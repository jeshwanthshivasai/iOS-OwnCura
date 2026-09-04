import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Zap, Settings, Building, Handshake } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money } from '@/constants/owncuraData';

export const OptionsScreen: React.FC = () => {
  const { theme, myValuation, setActiveTab, showToast } = useOwnCura();
  const t = AppTheme[theme];

  const tracks = [
    {
      id: 'independent',
      title: 'Grow independently',
      tag: 'Nov 15 Cohort · 100% Equity',
      icon: Zap,
      iconBg: t.tint,
      body: "Keep 100% equity. License the verified AI agent stack (intake, coding review, claims) deploying across Roots Health's 9 clinics on November 15.",
      cta: 'Join the Nov 15 cohort waitlist',
      status: 'November 15 cohort · waitlisted'
    },
    {
      id: 'operational',
      title: 'Bring in operational help',
      tag: 'MSO Services · Keep Ownership',
      icon: Settings,
      iconBg: t.tint,
      body: 'Roots Health takes on billing, staffing, payer contracting, and compliance under an MSO agreement. You retain clinical sovereignty.',
      cta: 'See the MSO scope of work',
      status: 'Scope of work drafting'
    },
    {
      id: 'acquisition',
      title: 'Sell to Roots Health',
      tag: 'Platform MSO · Zero Broker Fees',
      icon: Building,
      iconBg: '#FF9500',
      body: 'Direct acquisition offer from the platform MSO that operates 9 clinics in Texas and California. No broker commissions, transparent valuation.',
      cta: 'Review indicative offer',
      status: 'Indicative offer received'
    },
    {
      id: 'partners',
      title: 'Meet partner MSOs',
      tag: 'Plural Bidders · Closed Bids',
      icon: Handshake,
      iconBg: '#FF9500',
      body: 'Confidential introductions to vetted acquirers, including Roots Health competitors across TX & CA. You are named only to parties you approve.',
      cta: 'Review vetted acquirers',
      status: '3 acquirers matched'
    }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.introText, { color: t.sec }]}>
        Your practice is valued at {money(myValuation.low)} – {money(myValuation.high)}. Choosing a
        track does not list it.
      </Text>

      <View style={{ gap: 12 }}>
        {tracks.map(k => {
          const Icon = k.icon;
          return (
            <TouchableOpacity
              key={k.id}
              activeOpacity={0.8}
              onPress={() => {
                showToast(k.status);
                setActiveTab('deals');
              }}
              style={[styles.trackCard, { backgroundColor: t.card }, t.shadow]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: k.iconBg }]}>
                  <Icon size={16} color="#FFFFFF" />
                </View>
                <Text style={[styles.trackTitle, { color: t.label }]}>{k.title}</Text>
                <Text style={[styles.trackTag, { color: t.ter }]}>{k.tag}</Text>
              </View>

              <Text style={[styles.trackBody, { color: t.sec }]}>{k.body}</Text>
              <Text style={[styles.trackCta, { color: t.tint }]}>{k.cta}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.laterCard, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.laterTag, { color: t.ter }]}>LATER</Text>
        <Text style={[styles.laterBody, { color: t.sec }]}>
          Teaching and recruitment — students finding practices that train them, retiring
          physicians finding independents to take over — comes after the valuation engine and the
          acquirer network.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40
  },
  introText: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 16
  },
  trackCard: {
    borderRadius: 16,
    padding: 18
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3
  },
  trackTag: {
    fontSize: 12
  },
  trackBody: {
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 10
  },
  trackCta: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12
  },
  laterCard: {
    borderRadius: 14,
    padding: 16,
    marginTop: 16
  },
  laterTag: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  laterBody: {
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 6
  }
});
