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

export const DigestScreen: React.FC = () => {
  const { theme, setSelectedClinicId, pushScreen } = useOwnCura();
  const t = AppTheme[theme];

  const forSale = OC_CLINICS.filter(c => c.status === 'listed');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* DIGEST INTRO CARD */}
      <View style={[styles.introCard, { backgroundColor: t.card }, t.shadow]}>
        <Text style={[styles.introDate, { color: t.sec }]}>
          September 2026 · Lone Star Pediatric MSO
        </Text>
        <Text style={[styles.introBody, { color: t.label }]}>
          Four owners in your coverage area opted into introductions this month. Names are released
          when you express interest and the owner approves.
        </Text>
      </View>

      {/* AVAILABLE PRACTICES LIST */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: t.sec }]}>AVAILABLE PRACTICES</Text>
      </View>

      <View style={{ gap: 12 }}>
        {forSale.map(c => {
          const val = clinicValuation(c);
          const own = c.ownerInputs;
          const providers = own?.providers || String(c.providers);
          const panel = own?.panel ? parseInt(own.panel, 10).toLocaleString() : c.panel.toLocaleString();
          const comm = own?.commercial || Math.round(c.commercial * 100);

          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedClinicId(c.id);
                pushScreen('practice');
              }}
              style={[styles.practiceCard, { backgroundColor: t.card }, t.shadow]}>
              <View style={styles.rowBetween}>
                <Text style={[styles.maskedTitle, { color: t.label }]}>
                  {c.specialty} · {c.metro.toUpperCase().slice(0, 3)} metro · {providers} providers
                </Text>
                <Text style={[styles.confBadge, { color: t.tint }]}>
                  {val.confidence}% conf.
                </Text>
              </View>

              <Text style={[styles.rangeText, { color: t.label }]}>
                {money(val.low)} – {money(val.high)}
              </Text>

              <View style={[styles.statsGrid, { borderTopColor: t.sep }]}>
                <View style={styles.statCol}>
                  <Text style={[styles.statColLabel, { color: t.sec }]}>Panel</Text>
                  <Text style={[styles.statColVal, { color: t.label }]}>{panel}</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statColLabel, { color: t.sec }]}>Providers</Text>
                  <Text style={[styles.statColVal, { color: t.label }]}>{providers}</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statColLabel, { color: t.sec }]}>Commercial</Text>
                  <Text style={[styles.statColVal, { color: t.label }]}>{comm}%</Text>
                </View>
              </View>
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
  introCard: {
    borderRadius: 14,
    padding: 16
  },
  introDate: {
    fontSize: 13,
    fontWeight: '500'
  },
  introBody: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8
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
  practiceCard: {
    borderRadius: 16,
    padding: 18
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8
  },
  maskedTitle: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  confBadge: {
    fontSize: 12,
    fontWeight: '600'
  },
  rangeText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: 8
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  statCol: {},
  statColLabel: {
    fontSize: 11
  },
  statColVal: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2
  }
});
