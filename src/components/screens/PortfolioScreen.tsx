import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { OC_CLINICS, clinicValuation, money } from '@/constants/owncuraData';

export const PortfolioScreen: React.FC = () => {
  const { theme, setSelectedClinicId, pushScreen } = useOwnCura();
  const t = AppTheme[theme];

  const owned = OC_CLINICS.filter(c => c.status === 'portfolio' || c.status === 'mine');
  const totalVal = owned.reduce((sum, c) => sum + clinicValuation(c).mid, 0);
  const blendedMult = (
    owned.reduce((sum, c) => sum + clinicValuation(c).mult, 0) / owned.length
  ).toFixed(2);

  const barHeights = [0.52, 0.58, 0.61, 0.66, 0.7, 0.74, 0.79, 0.88, 1];
  const deltas = [4.2, 2.8, -1.1, 6.4, 3.3, 1.9, -0.4, 5.1, 2.2];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* ENTERPRISE VALUE CARD */}
      <View style={[styles.heroCard, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.cardSub, { color: t.sec }]}>Portfolio enterprise value</Text>
        <Text style={[styles.cardVal, { color: t.label }]}>{money(totalVal)}</Text>
        <Text style={[styles.cardChange, { color: t.tint }]}>
          +18.4% since January · 9 clinics
        </Text>

        {/* Growth Bar Chart */}
        <View style={styles.chartContainer}>
          {barHeights.map((h, i) => (
            <View
              key={i}
              style={[
                styles.chartBar,
                {
                  height: `${Math.round(h * 100)}%`,
                  backgroundColor: i === 8 ? t.tint : t.fill
                }
              ]}
            />
          ))}
        </View>
        <View style={styles.chartFooter}>
          <Text style={{ fontSize: 11, color: t.ter }}>Jan 2026</Text>
          <Text style={{ fontSize: 11, color: t.ter }}>Sep 2026</Text>
        </View>
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: t.card }, t.shadow]}>
          <Text style={[styles.statLabel, { color: t.sec }]}>Clinics</Text>
          <Text style={[styles.statValue, { color: t.label }]}>{owned.length}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: t.card }, t.shadow]}>
          <Text style={[styles.statLabel, { color: t.sec }]}>Blended multiple</Text>
          <Text style={[styles.statValue, { color: t.label }]}>{blendedMult}×</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: t.card }, t.shadow]}>
          <Text style={[styles.statLabel, { color: t.sec }]}>In diligence</Text>
          <Text style={[styles.statValue, { color: t.label }]}>11</Text>
        </View>
      </View>

      {/* CLINICS LIST */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>PORTFOLIO CLINICS</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {owned.map((c, idx) => {
          const val = clinicValuation(c);
          const d = deltas[idx % deltas.length];
          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedClinicId(c.id);
                pushScreen('clinicops');
              }}
              style={[
                styles.clinicRow,
                idx < owned.length - 1 && { borderBottomColor: t.sep }
              ]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.clinicName, { color: t.label }]}>{c.name}</Text>
                <Text style={[styles.clinicSub, { color: t.sec }]}>
                  {c.city}, {c.state} · {c.specialty}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', marginRight: 6 }}>
                <Text style={[styles.clinicVal, { color: t.label }]}>{money(val.mid)}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: d > 0 ? t.tint : '#FF3B30',
                    marginTop: 1
                  }}>
                  {d > 0 ? '+' : ''}
                  {d}%
                </Text>
              </View>
              <ChevronRight size={17} color={t.ter} />
            </TouchableOpacity>
          );
        })}
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
  cardSub: {
    fontSize: 13,
    fontWeight: '500'
  },
  cardVal: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 6
  },
  cardChange: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 2
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 64,
    gap: 6,
    marginTop: 18
  },
  chartBar: {
    flex: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 13
  },
  statLabel: {
    fontSize: 11.5
  },
  statValue: {
    fontSize: 19,
    fontWeight: '600',
    marginTop: 4
  },
  sectionHeader: {
    marginTop: 22,
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
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  clinicName: {
    fontSize: 15,
    fontWeight: '500'
  },
  clinicSub: {
    fontSize: 12.5,
    marginTop: 2
  },
  clinicVal: {
    fontSize: 15,
    fontWeight: '600'
  }
});
