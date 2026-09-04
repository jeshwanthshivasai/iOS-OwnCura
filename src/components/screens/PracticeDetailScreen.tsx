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
import {
  OC_CLINICS,
  OC_METROS,
  clinicValuation,
  money
} from '@/constants/owncuraData';

export const PracticeDetailScreen: React.FC = () => {
  const {
    theme,
    selectedClinic,
    selectedValuation,
    approvedCounterparties,
    approveCounterparty,
    showToast
  } = useOwnCura();
  const t = AppTheme[theme];

  const targetClinic =
    selectedClinic.status === 'listed'
      ? selectedClinic
      : OC_CLINICS.find(c => c.status === 'listed') || selectedClinic;

  const val = clinicValuation(targetClinic);
  const own = targetClinic.ownerInputs;
  const isInterestSent = approvedCounterparties.includes(targetClinic.id);
  const metroName = OC_METROS.find(m => m.id === targetClinic.metro)?.name || 'Texas';

  const rows = [
    { label: 'Specialty', value: targetClinic.specialty },
    { label: 'Metro', value: metroName },
    { label: 'Providers', value: String(own ? own.providers : targetClinic.providers) },
    {
      label: 'Patient panel',
      value: parseInt(own?.panel || String(targetClinic.panel), 10).toLocaleString()
    },
    {
      label: 'Commercial mix',
      value: `${own?.commercial ?? Math.round(targetClinic.commercial * 100)}%`
    },
    {
      label: 'Reported EBITDA',
      value: own?.ebitda ? money(parseFloat(own.ebitda)) : 'Not disclosed'
    },
    { label: 'Implied multiple', value: `${val.mult.toFixed(2)}×` }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* RANGE CARD */}
      <View style={[styles.card, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.cardMasked, { color: t.sec }]}>
          {targetClinic.specialty} practice · {targetClinic.metro.toUpperCase().slice(0, 3)} metro
        </Text>
        <Text style={[styles.cardRange, { color: t.label }]}>
          {money(val.low)} – {money(val.high)}
        </Text>
        <Text style={[styles.cardSub, { color: t.sec }]}>
          Refined with owner-supplied EBITDA · {val.confidence}% confidence
        </Text>
      </View>

      {/* DISCLOSED FIELDS */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>DISCLOSED</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {rows.map((r, idx) => (
          <View
            key={r.label}
            style={[
              styles.infoRow,
              idx < rows.length - 1 && { borderBottomColor: t.sep }
            ]}>
            <Text style={[styles.infoLabel, { color: t.label }]}>{r.label}</Text>
            <Text style={[styles.infoVal, { color: t.sec }]}>{r.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.footerNote, { color: t.ter }]}>
        Name, address and staff roster are withheld until the owner approves an introduction.
      </Text>

      {/* CTA */}
      <View style={{ marginTop: 24, gap: 10 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            approveCounterparty(targetClinic.id);
            showToast('Interest sent · owner notified');
          }}
          style={[
            styles.primaryBtn,
            { backgroundColor: isInterestSent ? t.fill : t.tint }
          ]}>
          <Text
            style={[
              styles.primaryBtnText,
              { color: isInterestSent ? t.sec : '#FFFFFF' }
            ]}>
            {isInterestSent ? 'Interest sent' : 'Express interest'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => showToast('Criteria filters updated')}
          style={styles.secondaryBtn}>
          <Text style={[styles.secondaryBtnText, { color: t.tint }]}>Adjust my criteria</Text>
        </TouchableOpacity>
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
  card: {
    borderRadius: 16,
    padding: 18
  },
  cardMasked: {
    fontSize: 13,
    fontWeight: '500'
  },
  cardRange: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: 6
  },
  cardSub: {
    fontSize: 13,
    marginTop: 3
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
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500'
  },
  infoVal: {
    fontSize: 15
  },
  footerNote: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 9,
    paddingHorizontal: 4
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnText: {
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
  }
});
