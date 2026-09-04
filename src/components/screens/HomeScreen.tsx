import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SlidersHorizontal, Compass, Layers, RotateCw, ChevronRight, Activity, Database } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money, OC_CLINICS } from '@/constants/owncuraData';

export const HomeScreen: React.FC = () => {
  const {
    theme,
    myPractice,
    myValuation,
    openSheet,
    pushScreen,
    setSelectedClinicId,
    showToast
  } = useOwnCura();
  const [refreshing, setRefreshing] = React.useState(false);

  const t = AppTheme[theme];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Updated just now');
    }, 600);
  }, []);

  const partnerOffer = myValuation.mid * 0.97;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.tint} />
      }>
      {/* VALUATION HERO CARD */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          setSelectedClinicId(myPractice.id);
          pushScreen('valuation');
        }}
        style={[styles.heroCard, { backgroundColor: t.card }, t.shadow]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.clinicName, { color: t.sec }]}>{myPractice.name}</Text>
          <Text style={[styles.confidenceBadge, { color: t.tint }]}>
            {myValuation.confidence}% confidence
          </Text>
        </View>

        <Text style={[styles.bigValuation, { color: t.label }]}>
          {money(myValuation.mid)}
        </Text>
        <Text style={[styles.valuationRange, { color: t.sec }]}>
          {money(myValuation.low)} – {money(myValuation.high)} estimated value
        </Text>

        {/* Confidence Band */}
        <View style={[styles.bandContainer, { backgroundColor: t.fill }]}>
          <View
            style={[
              styles.bandHighlight,
              {
                backgroundColor: t.tint,
                left: '18%',
                right: '18%'
              }
            ]}
          />
        </View>

        {/* Key metrics grid */}
        <View style={[styles.metricsGrid, { borderTopColor: t.sep }]}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: t.sec }]}>EBITDA</Text>
            <Text style={[styles.metricValue, { color: t.label }]}>
              {money(myValuation.ebitda)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: t.sec }]}>Multiple</Text>
            <Text style={[styles.metricValue, { color: t.label }]}>
              {myValuation.mult.toFixed(2)}×
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: t.sec }]}>Spread</Text>
            <Text style={[styles.metricValue, { color: t.label }]}>
              ±{Math.round(myValuation.spread * 100)}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: t.sec }]}>Inputs</Text>
            <Text style={[styles.metricValue, { color: t.label }]}>
              {myValuation.filled} of 5
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* PUBLIC DATA LINEAGE / METHODOLOGY BANNER */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openSheet('breakdown')}
        style={[styles.lineageBanner, { backgroundColor: t.card, borderColor: t.sep }, t.shadow]}>
        <View style={styles.lineageHeader}>
          <View style={[styles.lineageBadge, { backgroundColor: 'rgba(17,101,91,0.12)' }]}>
            <Database size={11} color={t.tint} />
            <Text style={[styles.lineageBadgeText, { color: t.tint }]}>HYBRID ENGINE</Text>
          </View>
          <Text style={[styles.lineageMathLink, { color: t.tint }]}>View Arithmetic →</Text>
        </View>
        <Text style={[styles.lineageBody, { color: t.sec }]}>
          Baseline computed from CMS Medicare Part B data (2024–2025) & Texas Medical Board records. Refined with owner EBITDA.
        </Text>
      </TouchableOpacity>

      {/* QUICK ACTIONS ROW */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openSheet('refine')}
          style={[styles.actionBtn, { backgroundColor: t.tint }]}>
          <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.actionBtnTextWhite}>Refine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => pushScreen('explore')}
          style={[styles.actionBtn, { backgroundColor: t.card }, t.shadow]}>
          <Compass size={20} color={t.tint} strokeWidth={2.2} />
          <Text style={[styles.actionBtnText, { color: t.label }]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => pushScreen('options')}
          style={[styles.actionBtn, { backgroundColor: t.card }, t.shadow]}>
          <Layers size={20} color={t.tint} strokeWidth={2.2} />
          <Text style={[styles.actionBtnText, { color: t.label }]}>Options</Text>
        </TouchableOpacity>
      </View>

      {/* ACTIVITY FEED */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>ACTIVITY</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {[
          {
            title: 'Revised offer received',
            sub: `Gulf Coast Pediatric Partners · ${money(partnerOffer)}`,
            when: '9:41',
            iconBg: '#FF9500',
            action: () => openSheet('offer')
          },
          {
            title: 'Two introductions requested',
            sub: 'Both cover pediatrics in Texas',
            when: '9:12',
            iconBg: '#0A84FF',
            action: () => openSheet('intros')
          },
          {
            title: 'Valuation re-evaluated',
            sub: `Mid-point moved to ${money(myValuation.mid)} on ${myValuation.filled} inputs`,
            when: 'Yesterday',
            iconBg: t.tint,
            action: () => {
              setSelectedClinicId(myPractice.id);
              pushScreen('valuation');
            }
          },
          {
            title: 'Memorial Pediatric Partners listed',
            sub: `4 miles away · Listed for sale`,
            when: 'Tue',
            iconBg: '#8E8E93',
            action: () => {
              setSelectedClinicId('memorial');
              pushScreen('valuation');
            }
          }
        ].map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          return (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.7}
              onPress={item.action}
              style={[
                styles.activityItem,
                !isLast && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth },
                isLast && { borderBottomWidth: 0 }
              ]}>
              <View style={[styles.activityDot, { backgroundColor: item.iconBg }]}>
                <Activity size={15} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: t.label }]}>{item.title}</Text>
                <Text style={[styles.activitySub, { color: t.sec }]}>{item.sub}</Text>
              </View>
              <Text style={[styles.activityWhen, { color: t.ter }]}>{item.when}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* AGENT STACK CARD */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>AGENT STACK</Text>
      </View>
      <View style={[styles.agentCard, { backgroundColor: t.card }, t.shadow]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.agentHeader, { color: t.label }]}>Live in our clinics Nov 15</Text>
          <Text style={[styles.agentStatus, { color: t.tint }]}>On track</Text>
        </View>
        <Text style={[styles.agentBody, { color: t.sec }]}>
          Deploying across the nine Roots Health practices first. External licensing opens once
          the thesis is proven on our own books.
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
    paddingTop: 10,
    paddingBottom: 40
  },
  heroCard: {
    borderRadius: 16,
    padding: 18
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clinicName: {
    fontSize: 13.5,
    fontWeight: '500'
  },
  confidenceBadge: {
    fontSize: 12.5,
    fontWeight: '600'
  },
  bigValuation: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    marginTop: 8
  },
  valuationRange: {
    fontSize: 14.5,
    marginTop: 2
  },
  bandContainer: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    position: 'relative',
    overflow: 'hidden'
  },
  bandHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  metricItem: {
    alignItems: 'flex-start'
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500'
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '500'
  },
  lineageBanner: {
    borderRadius: 13,
    padding: 13,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: StyleSheet.hairlineWidth
  },
  lineageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  lineageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  lineageBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  lineageMathLink: {
    fontSize: 12,
    fontWeight: '600'
  },
  lineageBody: {
    fontSize: 12.5,
    lineHeight: 17
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2
  },
  actionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 84
  },
  actionBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  cardGroup: {
    borderRadius: 14,
    overflow: 'hidden'
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12
  },
  activityDot: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500'
  },
  activitySub: {
    fontSize: 12.5,
    marginTop: 2
  },
  activityWhen: {
    fontSize: 12
  },
  agentCard: {
    borderRadius: 14,
    padding: 16
  },
  agentHeader: {
    fontSize: 15.5,
    fontWeight: '600'
  },
  agentStatus: {
    fontSize: 12.5,
    fontWeight: '600'
  },
  agentBody: {
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 8
  }
});
