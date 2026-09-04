import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money } from '@/constants/owncuraData';

export const InboxScreen: React.FC = () => {
  const {
    theme,
    myValuation,
    openSheet,
    pushScreen,
    setSelectedClinicId,
    showToast
  } = useOwnCura();
  const [query, setQuery] = useState('');

  const t = AppTheme[theme];
  const partnerOffer = myValuation.mid * 0.97;

  const inboxItems = [
    {
      id: '1',
      title: 'Revised offer from Gulf Coast',
      body: `Partner MSO · ${money(partnerOffer)} with a three-year clinical commitment.`,
      when: '9:41',
      unread: true,
      action: () => openSheet('offer')
    },
    {
      id: '2',
      title: 'Two acquirers want an introduction',
      body: 'Both cover pediatrics in Texas. You choose who learns your name.',
      when: '9:12',
      unread: true,
      action: () => openSheet('intros')
    },
    {
      id: '3',
      title: 'Your valuation changed',
      body: `Refining with EBITDA and visit volume moved the mid-point to ${money(myValuation.mid)}.`,
      when: 'Yesterday',
      unread: false,
      action: () => pushScreen('valuation')
    },
    {
      id: '4',
      title: 'Memorial Pediatric Partners listed',
      body: 'A practice 4 miles away came to market at $4.2M.',
      when: 'Tue',
      unread: false,
      action: () => {
        setSelectedClinicId('memorial');
        pushScreen('valuation');
      }
    },
    {
      id: '5',
      title: 'Agent stack deployment schedule',
      body: 'Front-desk intake and coding review go live Nov 15 across nine clinics.',
      when: 'Mon',
      unread: false,
      action: () => showToast('Agent deployment documentation staged')
    }
  ];

  const filtered = query
    ? inboxItems.filter(
        i =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.body.toLowerCase().includes(query.toLowerCase())
      )
    : inboxItems;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* SEARCH BAR */}
      <View style={[styles.searchBox, { backgroundColor: t.segBg }]}>
        <Search size={16} color={t.ter} />
        <TextInput
          style={[styles.searchInput, { color: t.label }]}
          placeholder="Search notifications & messages"
          placeholderTextColor={t.ter}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* NOTIFICATIONS LIST */}
      <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
        {filtered.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={item.action}
            style={[
              styles.itemRow,
              idx < filtered.length - 1 && { borderBottomColor: t.sep }
            ]}>
            <View style={styles.dotContainer}>
              {item.unread && (
                <View style={[styles.unreadDot, { backgroundColor: t.tint }]} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: t.label, fontWeight: item.unread ? '600' : '400' }
                  ]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemWhen, { color: t.ter }]}>{item.when}</Text>
              </View>
              <Text style={[styles.itemBody, { color: t.sec }]}>{item.body}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 14
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0
  },
  cardGroup: {
    borderRadius: 14,
    overflow: 'hidden'
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10
  },
  dotContainer: {
    width: 10,
    paddingTop: 5,
    alignItems: 'center'
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10
  },
  itemTitle: {
    fontSize: 15,
    flex: 1
  },
  itemWhen: {
    fontSize: 12
  },
  itemBody: {
    fontSize: 13.5,
    lineHeight: 18.5,
    marginTop: 3
  }
});
