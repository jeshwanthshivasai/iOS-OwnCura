import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import {
  OC_CLINICS,
  OC_METROS,
  clinicValuation,
  money
} from '@/constants/owncuraData';

export const ExploreScreen: React.FC = () => {
  const {
    theme,
    stateFilter,
    setStateFilter,
    selectedMetro,
    setSelectedMetro,
    setSelectedClinicId,
    openSheet,
    pushScreen
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
      {/* SEGMENT FILTER */}
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

      {/* MAP STYLIZED CANVAS */}
      <View style={[styles.mapPlaceholder, { backgroundColor: t.card }, t.shadow]}>
        <View style={styles.mapGrid}>
          {filteredMetros.map(m => {
            const isSelected = selectedMetro === m.id;
            const count = OC_CLINICS.filter(c => c.metro === m.id).length;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMetro(isSelected ? null : m.id)}
                style={[
                  styles.mapPinCluster,
                  {
                    backgroundColor: isSelected ? t.tint : t.fill,
                    borderColor: isSelected ? '#FFFFFF' : 'transparent'
                  }
                ]}>
                <MapPin
                  size={14}
                  color={isSelected ? '#FFFFFF' : t.label}
                />
                <Text
                  style={{
                    color: isSelected ? '#FFFFFF' : t.label,
                    fontSize: 11,
                    fontWeight: '600'
                  }}>
                  {m.name.split(' ')[0]} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.mapFooterText, { color: t.ter }]}>
          Interactive Coverage · Texas & California Metros
        </Text>
      </View>

      {/* LEGEND ROW */}
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
          <View style={[styles.dot, { backgroundColor: t.tint }]} />
          <Text style={[styles.legendText, { color: t.sec }]}>Roots Health</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#8E8E93' }]} />
          <Text style={[styles.legendText, { color: t.sec }]}>Not listed</Text>
        </View>
      </View>

      {/* LIST HEADER */}
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

      {/* LIST CONTENT */}
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {selectedMetro
          ? clinicsInMetro.map((c, idx) => {
              const val = clinicValuation(c);
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedClinicId(c.id);
                    openSheet('peek');
                  }}
                  style={[
                    styles.listItem,
                    idx < clinicsInMetro.length - 1 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                  ]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: t.label }]}>{c.name}</Text>
                    <Text style={[styles.itemSub, { color: t.sec }]}>
                      {c.city}, {c.state} · {c.specialty}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', marginRight: 6 }}>
                    <Text style={[styles.itemValue, { color: t.label }]}>
                      {money(val.mid)}
                    </Text>
                    <Text style={{ fontSize: 11, color: t.sec }}>mid est.</Text>
                  </View>
                  <ChevronRight size={17} color={t.ter} />
                </TouchableOpacity>
              );
            })
          : filteredMetros.map((m, idx) => {
              const count = OC_CLINICS.filter(c => c.metro === m.id).length;
              return (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMetro(m.id)}
                  style={[
                    styles.listItem,
                    idx < filteredMetros.length - 1 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                  ]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: t.label }]}>{m.name}</Text>
                    <Text style={[styles.itemSub, { color: t.sec }]}>
                      {count} practices · {m.state}
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
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2,
    marginBottom: 12
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  mapPlaceholder: {
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between'
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  mapPinCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1
  },
  mapFooterText: {
    fontSize: 11,
    marginTop: 18,
    textAlign: 'center'
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 14
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500'
  },
  itemSub: {
    fontSize: 12.5,
    marginTop: 2
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600'
  }
});
