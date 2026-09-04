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
import {
  OC_CLINICS,
  OC_METROS,
  clinicValuation,
  money
} from '@/constants/owncuraData';
import { OwnCuraMap } from '@/components/OwnCuraMap';

export const ExploreScreen: React.FC = () => {
  const {
    theme,
    stateFilter,
    setStateFilter,
    selectedMetro,
    setSelectedMetro,
    setSelectedClinicId,
    openSheet
  } = useOwnCura();
  const t = AppTheme[theme];

  const filteredMetros = OC_METROS.filter(
    m => stateFilter === 'all' || m.state === stateFilter
  );

  const activeMetro = OC_METROS.find(m => m.id === selectedMetro);

  const clinicsInMetro = selectedMetro
    ? OC_CLINICS.filter(c => c.metro === selectedMetro)
    : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* 1. TOP SEGMENT FILTER */}
      <View style={styles.segmentWrapper}>
        <View style={[styles.segmentContainer, { backgroundColor: t.segBg }]}>
          {[
            { id: 'all', label: 'All' },
            { id: 'TX', label: 'Texas' },
            { id: 'CA', label: 'California' }
          ].map(seg => {
            const isSelected = stateFilter === seg.id;
            return (
              <TouchableOpacity
                key={seg.id}
                onPress={() => {
                  setStateFilter(seg.id as any);
                  setSelectedMetro(null);
                }}
                style={[
                  styles.segmentItem,
                  isSelected && { backgroundColor: t.segOn, ...t.shadow }
                ]}>
                <Text
                  style={{
                    color: t.label,
                    fontWeight: isSelected ? '600' : '400',
                    fontSize: 13
                  }}>
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 2. REAL MAP (EDGE-TO-EDGE) WITH CLEAN VISUAL CLUSTERS */}
      <OwnCuraMap
        stateFilter={stateFilter}
        onSelectState={s => {
          setStateFilter(s);
          setSelectedMetro(null);
        }}
        selectedMetro={selectedMetro}
        onSelectMetro={setSelectedMetro}
        onSelectClinic={id => {
          setSelectedClinicId(id);
          openSheet('peek');
        }}
      />

      {/* 3. LEGEND ROW */}
      <View style={styles.legendWrapper}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#0A84FF' }]} />
            <Text style={[styles.legendText, { color: t.sec }]}>Yours</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FF9500' }]} />
            <Text style={[styles.legendText, { color: t.sec }]}>For sale</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#0F7A57' }]} />
            <Text style={[styles.legendText, { color: t.sec }]}>Roots Health</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#8E8E93' }]} />
            <Text style={[styles.legendText, { color: t.sec }]}>Not listed</Text>
          </View>
        </View>
      </View>

      {/* 4. METROS / PRACTICES LIST SECTION */}
      <View style={styles.listSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.sec }]}>
            {selectedMetro ? `${activeMetro?.name.toUpperCase()} PRACTICES` : 'METROS'}
          </Text>
          {selectedMetro && (
            <TouchableOpacity onPress={() => setSelectedMetro(null)}>
              <Text style={{ color: t.tint, fontSize: 13, fontWeight: '500' }}>Show all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.groupedCard, { backgroundColor: t.card }, t.shadow]}>
          {selectedMetro
            ? clinicsInMetro.map((c, idx) => {
                const val = clinicValuation(c);
                const isLast = idx === clinicsInMetro.length - 1;
                return (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.6}
                    onPress={() => {
                      setSelectedClinicId(c.id);
                      openSheet('peek');
                    }}
                    style={[
                      styles.rowItem,
                      !isLast && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                    ]}>
                    <View style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                      <Text style={[styles.rowName, { color: t.label }]} numberOfLines={1}>
                        {c.name}
                      </Text>
                      <Text style={[styles.rowSub, { color: t.sec }]} numberOfLines={1}>
                        {c.city}, {c.state} · {c.specialty} · {c.providers} providers{c.status === 'mine' ? ' · You' : ''}
                      </Text>
                    </View>
                    <Text style={[styles.rowValue, { color: t.sec }]}>
                      {money(val.mid)}
                    </Text>
                    <ChevronRight size={16} color={t.ter} />
                  </TouchableOpacity>
                );
              })
            : filteredMetros.map((m, idx) => {
                const set = OC_CLINICS.filter(c => c.metro === m.id);
                const vals = set.map(c => clinicValuation(c).mid).sort((a, b) => a - b);
                const medianVal = vals[Math.floor(vals.length / 2)] || 2200000;
                const isLast = idx === filteredMetros.length - 1;

                return (
                  <TouchableOpacity
                    key={m.id}
                    activeOpacity={0.6}
                    onPress={() => setSelectedMetro(m.id)}
                    style={[
                      styles.rowItem,
                      !isLast && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                    ]}>
                    <View style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                      <Text style={[styles.rowName, { color: t.label }]}>{m.name}</Text>
                      <Text style={[styles.rowSub, { color: t.sec }]}>
                        {set.length} practices · {m.state}
                      </Text>
                    </View>
                    <Text style={[styles.rowValue, { color: t.sec }]}>
                      {money(medianVal)}
                    </Text>
                    <ChevronRight size={16} color={t.ter} />
                  </TouchableOpacity>
                );
              })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingTop: 4,
    paddingBottom: 40
  },
  segmentWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  legendWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
    paddingHorizontal: 4
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  legendText: {
    fontSize: 12
  },
  listSection: {
    paddingHorizontal: 16,
    paddingTop: 18
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  groupedCard: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8
  },
  rowName: {
    fontSize: 15,
    fontWeight: '500'
  },
  rowSub: {
    fontSize: 12.5,
    marginTop: 2
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    fontVariant: ['tabular-nums']
  }
});
