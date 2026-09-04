import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { OC_CLINICS, OC_METROS, clinicValuation, money, Clinic } from '@/constants/owncuraData';

interface OwnCuraMapProps {
  stateFilter: 'all' | 'TX' | 'CA';
  onSelectState?: (s: 'all' | 'TX' | 'CA') => void;
  selectedMetro: string | null;
  onSelectMetro: (metroId: string | null) => void;
  onSelectClinic: (clinicId: string) => void;
}

export const OwnCuraMap: React.FC<OwnCuraMapProps> = ({
  stateFilter,
  onSelectState,
  selectedMetro,
  onSelectMetro,
  onSelectClinic
}) => {
  const { theme, selectedClinicId, openSheet } = useOwnCura();
  const t = AppTheme[theme];

  const activeClinic = OC_CLINICS.find(c => c.id === selectedClinicId) || OC_CLINICS[0];
  const activeVal = clinicValuation(activeClinic);

  const getPinColor = (status: Clinic['status']) => {
    switch (status) {
      case 'mine':
        return '#0A84FF'; // Blue (Owner's Practice)
      case 'listed':
        return '#FF9500'; // Orange (For Sale)
      case 'portfolio':
        return '#0F7A57'; // Roots Health Green
      default:
        return '#8E8E93'; // Not Listed Gray
    }
  };

  // Select base map image asset based on filter & theme
  const mapImage =
    stateFilter === 'TX'
      ? theme === 'dark'
        ? require('@/assets/images/maps/map_tx_dark.png')
        : require('@/assets/images/maps/map_tx.png')
      : stateFilter === 'CA'
      ? theme === 'dark'
        ? require('@/assets/images/maps/map_ca_dark.png')
        : require('@/assets/images/maps/map_ca.png')
      : theme === 'dark'
      ? require('@/assets/images/maps/map_all_dark.png')
      : require('@/assets/images/maps/map_all.png');

  // Metro bubbles data
  const txMetros = [
    { id: 'dallas', name: 'Dallas–Fort Worth', count: 3, top: '28%', left: '60%', color: '#0F7A57' },
    { id: 'austin', name: 'Austin', count: 2, top: '56%', left: '52%', color: '#0F7A57' },
    { id: 'houston', name: 'Houston', count: 5, top: '68%', left: '72%', color: '#0A84FF' } // Blue because Dr. Reyes is in Houston
  ];

  const caMetros = [
    { id: 'bayarea', name: 'Bay Area', count: 3, top: '32%', left: '28%', color: '#0F7A57' },
    { id: 'la', name: 'Los Angeles', count: 3, top: '68%', left: '62%', color: '#0F7A57' },
    { id: 'sandiego', name: 'San Diego', count: 2, top: '84%', left: '76%', color: '#0F7A57' }
  ];

  // Specific clinic pin positions when a metro is selected
  const houstonPins: Record<string, { top: string; left: string }> = {
    bellaire: { top: '68%', left: '72%' },
    heights: { top: '64%', left: '73%' },
    pasadena: { top: '72%', left: '76%' },
    memorial: { top: '67%', left: '69%' },
    katy: { top: '68%', left: '65%' }
  };

  const dallasPins: Record<string, { top: string; left: string }> = {
    plano: { top: '25%', left: '60%' },
    frisco: { top: '22%', left: '59%' },
    fortworth: { top: '31%', left: '55%' }
  };

  const austinPins: Record<string, { top: string; left: string }> = {
    roundrock: { top: '53%', left: '52%' },
    southaustin: { top: '58%', left: '53%' }
  };

  const bayAreaPins: Record<string, { top: string; left: string }> = {
    berkeley: { top: '30%', left: '27%' },
    oakland: { top: '32%', left: '29%' },
    paloalto: { top: '35%', left: '30%' }
  };

  const laPins: Record<string, { top: string; left: string }> = {
    pasadena_ca: { top: '66%', left: '62%' },
    burbank: { top: '65%', left: '60%' },
    longbeach: { top: '72%', left: '64%' }
  };

  const clinicPositions =
    selectedMetro === 'houston'
      ? houstonPins
      : selectedMetro === 'dallas'
      ? dallasPins
      : selectedMetro === 'austin'
      ? austinPins
      : selectedMetro === 'bayarea'
      ? bayAreaPins
      : selectedMetro === 'la'
      ? laPins
      : null;

  const visibleClinics = selectedMetro
    ? OC_CLINICS.filter(c => c.metro === selectedMetro)
    : [];

  return (
    <View style={styles.container}>
      {/* REAL TILE BASEMAP IMAGE */}
      <Image
        source={mapImage}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* 1. STATE CLUSTER TAGS (VIEW: ALL) */}
      {stateFilter === 'all' && (
        <>
          {/* CALIFORNIA CLUSTER (8 CA) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelectState?.('CA')}
            style={[
              styles.stateClusterTag,
              {
                top: '46%',
                left: '22%',
                backgroundColor: '#0F7A57',
                borderColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF'
              }
            ]}>
            <Text style={styles.clusterCount}>8</Text>
            <Text style={styles.clusterLabel}>CA</Text>
          </TouchableOpacity>

          {/* TEXAS CLUSTER (10 TX) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelectState?.('TX')}
            style={[
              styles.stateClusterTag,
              {
                top: '64%',
                left: '83%',
                backgroundColor: '#0A84FF',
                borderColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF'
              }
            ]}>
            <Text style={styles.clusterCount}>10</Text>
            <Text style={styles.clusterLabel}>TX</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 2. TEXAS METRO CLUSTERS (VIEW: TX) */}
      {stateFilter === 'TX' && !selectedMetro && (
        <>
          {txMetros.map(m => (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => onSelectMetro(m.id)}
              style={[
                styles.metroClusterTag,
                {
                  top: m.top as any,
                  left: m.left as any,
                  backgroundColor: m.color,
                  borderColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF'
                }
              ]}>
              <Text style={styles.metroClusterCount}>{m.count}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* 3. CALIFORNIA METRO CLUSTERS (VIEW: CA) */}
      {stateFilter === 'CA' && !selectedMetro && (
        <>
          {caMetros.map(m => (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => onSelectMetro(m.id)}
              style={[
                styles.metroClusterTag,
                {
                  top: m.top as any,
                  left: m.left as any,
                  backgroundColor: m.color,
                  borderColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF'
                }
              ]}>
              <Text style={styles.metroClusterCount}>{m.count}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* 4. INDIVIDUAL CLINIC DOT PINS (WHEN METRO IS SELECTED) */}
      {selectedMetro && clinicPositions && (
        <>
          {visibleClinics.map(c => {
            const pos = clinicPositions[c.id];
            if (!pos) return null;
            const isSelected = selectedClinicId === c.id;
            const pinColor = getPinColor(c.status);

            return (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.8}
                onPress={() => onSelectClinic(c.id)}
                style={[
                  styles.clinicPinWrap,
                  {
                    top: pos.top as any,
                    left: pos.left as any
                  }
                ]}>
                {isSelected && (
                  <View
                    style={[
                      styles.clinicSelectionHalo,
                      {
                        backgroundColor: pinColor,
                        borderColor: pinColor
                      }
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.clinicPinDot,
                    {
                      backgroundColor: pinColor,
                      borderColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF',
                      width: isSelected ? 22 : 18,
                      height: isSelected ? 22 : 18,
                      borderRadius: isSelected ? 11 : 9
                    }
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F1EFEA'
  },
  mapImage: {
    width: '100%',
    height: '100%'
  },
  stateClusterTag: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -27 }, { translateY: -27 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 8
  },
  clusterCount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 18
  },
  clusterLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
    lineHeight: 11
  },
  metroClusterTag: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 6
  },
  metroClusterCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3
  },
  clinicPinWrap: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }]
  },
  clinicSelectionHalo: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.25,
    borderWidth: 1.5
  },
  clinicPinDot: {
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 5
  }
});
