import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { ChevronRight, Mail, ShieldCheck } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { OC_CLINICS, clinicValuation, money } from '@/constants/owncuraData';

export const DigestScreen: React.FC = () => {
  const { theme, setSelectedClinicId, pushScreen, showToast } = useOwnCura();
  const t = AppTheme[theme];

  const forSale = OC_CLINICS.filter(c => c.status === 'listed');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* CONFIDENTIAL EMAIL BRIEFING HEADER */}
      <View style={[styles.emailBriefingCard, { backgroundColor: t.card, borderColor: t.sep }, t.shadow]}>
        <View style={styles.emailHeaderRow}>
          <View style={[styles.mailIconWrap, { backgroundColor: 'rgba(17,101,91,0.12)' }]}>
            <Mail size={14} color={t.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.emailMeta, { color: t.sec }]}>
              To: Dr. Marcus Vance · Lone Star Pediatric MSO
            </Text>
            <Text style={[styles.emailSubject, { color: t.label }]}>
              September 2026 Confidential Briefing
            </Text>
          </View>
          <View style={[styles.ndaBadge, { backgroundColor: t.fill }]}>
            <ShieldCheck size={11} color={t.tint} />
            <Text style={[styles.ndaBadgeText, { color: t.tint }]}>MUTUAL NDA</Text>
          </View>
        </View>

        <Text style={[styles.introBody, { color: t.sec }]}>
          Four verified owners in Texas and California authorized introductions this month. Practice identities remain confidential until the owner approves your introduction request.
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

              {/* Request Intro CTA */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  showToast(`Confidential intro requested for ${c.city} practice. Owner notified.`);
                }}
                style={[styles.introReqBtn, { backgroundColor: t.fill }]}>
                <Text style={[styles.introReqText, { color: t.tint }]}>Request Confidential Introduction</Text>
                <ChevronRight size={14} color={t.tint} />
              </TouchableOpacity>
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
  emailBriefingCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth
  },
  emailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  mailIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emailMeta: {
    fontSize: 11,
    fontWeight: '500'
  },
  emailSubject: {
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 1
  },
  ndaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  ndaBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  introBody: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  sectionHeader: {
    marginTop: 20,
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
  },
  introReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14
  },
  introReqText: {
    fontSize: 13,
    fontWeight: '600'
  }
});
