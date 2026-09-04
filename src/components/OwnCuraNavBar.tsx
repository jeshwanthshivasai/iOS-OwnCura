import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';

interface OwnCuraNavBarProps {
  title: string;
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  showAvatar?: boolean;
  onOpenProfile?: () => void;
  largeTitle?: boolean;
}

export const OwnCuraNavBar: React.FC<OwnCuraNavBarProps> = ({
  title,
  showBack,
  backLabel,
  onBack,
  showAvatar = true,
  onOpenProfile,
  largeTitle = true
}) => {
  const { theme, role } = useOwnCura();
  const t = AppTheme[theme];

  const initials = role === 'owner' ? 'RS' : role === 'team' ? 'RH' : 'LS';

  return (
    <View style={[styles.container, { backgroundColor: t.nav, borderBottomColor: t.navSep }]}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.6}>
            <ChevronLeft size={22} color={t.tint} strokeWidth={2.5} />
            <Text style={[styles.backText, { color: t.tint }]}>{backLabel || 'Back'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.centerTitleContainer}>
          {!largeTitle && <Text style={[styles.inlineTitle, { color: t.label }]}>{title}</Text>}
        </View>

        {showAvatar ? (
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={onOpenProfile}
            activeOpacity={0.7}>
            <View style={[styles.avatarCircle, { backgroundColor: t.avatarBg }]}>
              <Text style={[styles.avatarText, { color: t.avatarInk }]}>{initials}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {largeTitle && (
        <View style={styles.largeTitleContainer}>
          <Text style={[styles.largeTitleText, { color: t.label }]}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10
  },
  topRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 8
  },
  backText: {
    fontSize: 17,
    letterSpacing: -0.3,
    marginLeft: -2
  },
  placeholder: {
    width: 44,
    height: 44
  },
  centerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inlineTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3
  },
  avatarBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700'
  },
  largeTitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 4
  },
  largeTitleText: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 41
  }
});
