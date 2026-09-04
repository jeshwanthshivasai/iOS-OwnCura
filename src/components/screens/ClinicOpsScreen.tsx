import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';

export const ClinicOpsScreen: React.FC = () => {
  const { theme, selectedClinic } = useOwnCura();
  const t = AppTheme[theme];

  const kpis = [
    { label: 'Visits/day', value: '54', delta: '+7 vs Aug', color: t.tint },
    { label: 'Collections', value: '96.4%', delta: '+1.2 pts', color: t.tint },
    { label: 'Denials', value: '3.1%', delta: '−0.8 pts', color: t.tint },
    { label: 'No-shows', value: '8.2%', delta: '+0.4 pts', color: '#FF3B30' }
  ];

  const agents = [
    { name: 'Front-desk intake', detail: '412 conversations this month', state: 'Live', dot: t.tint },
    { name: 'Coding review', detail: '1,840 encounters checked', state: 'Live', dot: t.tint },
    { name: 'Claims follow-up', detail: 'Deploys Dec 2', state: 'Staged', dot: '#FF9500' },
    { name: 'Panel outreach', detail: 'Q1 2027', state: 'Planned', dot: t.ter }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* CLINIC HEADER */}
      <View style={{ marginBottom: 12 }}>
        <Text style={[styles.clinicTitle, { color: t.label }]}>{selectedClinic.name}</Text>
        <Text style={[styles.clinicCity, { color: t.sec }]}>
          {selectedClinic.city}, {selectedClinic.state} · Operational Dashboard
        </Text>
      </View>

      {/* KPIS GRID */}
      <View style={styles.kpisRow}>
        {kpis.map(k => (
          <View key={k.label} style={[styles.kpiCard, { backgroundColor: t.card }, t.shadow]}>
            <Text style={[styles.kpiLabel, { color: t.sec }]}>{k.label}</Text>
            <Text style={[styles.kpiVal, { color: t.label }]}>{k.value}</Text>
            <Text style={[styles.kpiDelta, { color: k.color }]}>{k.delta}</Text>
          </View>
        ))}
      </View>

      {/* AGENTS RUNNING HERE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>AGENTS RUNNING HERE</Text>
      </View>
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {agents.map((a, idx) => (
          <View
            key={a.name}
            style={[
              styles.agentRow,
              idx < agents.length - 1 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
            ]}>
            <View style={[styles.agentDot, { backgroundColor: a.dot }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.agentName, { color: t.label }]}>{a.name}</Text>
              <Text style={[styles.agentDetail, { color: t.sec }]}>{a.detail}</Text>
            </View>
            <Text style={[styles.agentState, { color: t.sec }]}>{a.state}</Text>
          </View>
        ))}
      </View>

      {/* OPERATIONAL NOTES */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>OPERATIONAL NOTES</Text>
      </View>
      <View style={[styles.notesCard, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.notesBody, { color: t.sec }]}>
          Collections improved after coding review went live in July. Denials are concentrated in
          two payer contracts renegotiating in November.
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
  clinicTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4
  },
  clinicCity: {
    fontSize: 13.5,
    marginTop: 2
  },
  kpisRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  kpiCard: {
    width: '48.5%',
    borderRadius: 12,
    padding: 13
  },
  kpiLabel: {
    fontSize: 11
  },
  kpiVal: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4
  },
  kpiDelta: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
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
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12
  },
  agentDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  agentName: {
    fontSize: 15,
    fontWeight: '500'
  },
  agentDetail: {
    fontSize: 12.5,
    marginTop: 2
  },
  agentState: {
    fontSize: 12.5,
    fontWeight: '500'
  },
  notesCard: {
    borderRadius: 14,
    padding: 16
  },
  notesBody: {
    fontSize: 14,
    lineHeight: 20
  }
});
