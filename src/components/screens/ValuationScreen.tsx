import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money } from '@/constants/owncuraData';

export const ValuationScreen: React.FC = () => {
  const {
    theme,
    selectedClinic,
    selectedValuation,
    myPractice,
    openSheet,
    pushScreen
  } = useOwnCura();
  const t = AppTheme[theme];

  const isMine = selectedClinic.id === myPractice.id;

  const publicInputs = [
    { label: 'Active patient panel', value: selectedClinic.panel.toLocaleString() },
    { label: 'Providers on record', value: String(selectedClinic.providers) },
    { label: 'Commercial payer share', value: `${Math.round(selectedClinic.commercial * 100)}%` },
    { label: 'Revenue per patient', value: `$${selectedClinic.revPerPatient}` },
    { label: 'Specialty margin norm', value: `${(Math.round(selectedClinic.marginPub * 1000) / 10)}%` },
    { label: 'Regional adjustment', value: `+${selectedClinic.metroAdj.toFixed(2)}×` }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* RANGE HERO */}
      <View style={[styles.card, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.headerSub, { color: t.sec }]}>
          {selectedClinic.name} · {selectedClinic.city}
        </Text>
        <Text style={[styles.rangeVal, { color: t.label }]}>
          {money(selectedValuation.low)} – {money(selectedValuation.high)}
        </Text>

        <View style={[styles.barContainer, { backgroundColor: t.fill }]}>
          <View
            style={[
              styles.barActive,
              {
                backgroundColor: t.tint,
                left: '20%',
                right: '20%'
              }
            ]}
          />
        </View>

        <View style={styles.legendRow}>
          <Text style={[styles.legendText, { color: t.sec }]}>
            {money(selectedValuation.low)}
          </Text>
          <Text style={[styles.legendText, { color: t.label, fontWeight: '600' }]}>
            Mid {money(selectedValuation.mid)}
          </Text>
          <Text style={[styles.legendText, { color: t.sec }]}>
            {money(selectedValuation.high)}
          </Text>
        </View>
      </View>

      {/* CONFIDENCE & METRICS */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>CONFIDENCE</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {[
          { label: 'Confidence', value: `${selectedValuation.confidence}%` },
          { label: 'Spread', value: `±${Math.round(selectedValuation.spread * 100)}%` },
          { label: 'Implied multiple', value: `${selectedValuation.mult.toFixed(2)}×` },
          { label: 'Estimated EBITDA', value: money(selectedValuation.ebitda) }
        ].map((item, idx, arr) => (
          <View
            key={item.label}
            style={[
              styles.infoRow,
              idx < arr.length - 1 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
            ]}>
            <Text style={[styles.rowLabel, { color: t.label }]}>{item.label}</Text>
            <Text style={[styles.rowVal, { color: t.sec }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* WHAT THE ESTIMATE USED */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>WHAT THE ESTIMATE USED</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {publicInputs.map((item, idx, arr) => (
          <View
            key={item.label}
            style={[
              styles.infoRow,
              idx < arr.length - 1 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
            ]}>
            <Text style={[styles.rowLabel, { color: t.label }]}>{item.label}</Text>
            <Text style={[styles.rowVal, { color: t.sec }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sourcesText, { color: t.ter }]}>
        Sources: {selectedClinic.sources.join(', ')}
      </Text>

      {/* ACTIONS */}
      {isMine ? (
        <View style={{ marginTop: 22, gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openSheet('refine')}
            style={[styles.primaryBtn, { backgroundColor: t.tint }]}>
            <Text style={styles.primaryBtnText}>Refine this valuation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => pushScreen('options')}
            style={styles.secondaryBtn}>
            <Text style={[styles.secondaryBtnText, { color: t.tint }]}>
              See growth options
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.noteCard, { backgroundColor: t.card }, t.shadow]}>
          <View style={[styles.notePill, { backgroundColor: t.tint }]} />
          <Text style={[styles.noteText, { color: t.sec }]}>{selectedClinic.note}</Text>
        </View>
      )}
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
  card: {
    borderRadius: 16,
    padding: 20
  },
  headerSub: {
    fontSize: 13.5,
    fontWeight: '500'
  },
  rangeVal: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 6
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    marginTop: 18,
    position: 'relative',
    overflow: 'hidden'
  },
  barActive: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 4
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  legendText: {
    fontSize: 12.5
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500'
  },
  rowVal: {
    fontSize: 15
  },
  sourcesText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 4
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600'
  },
  secondaryBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '500'
  },
  noteCard: {
    marginTop: 20,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  notePill: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 2
  },
  noteText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19
  }
});
