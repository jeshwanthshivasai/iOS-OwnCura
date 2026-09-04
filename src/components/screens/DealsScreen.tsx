import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FileText, Send } from 'lucide-react-native';
import { useOwnCura } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money } from '@/constants/owncuraData';

export const DealsScreen: React.FC = () => {
  const {
    theme,
    myValuation,
    dealTab,
    setDealTab,
    openSheet,
    showToast
  } = useOwnCura();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: 'We have reviewed the refined valuation and the claims history. Comfortable at the top of the range.',
      meta: 'Gulf Coast · Tue',
      own: false
    },
    {
      text: 'Good. My condition is the clinical commitment stays three years, not five.',
      meta: 'You · Tue',
      own: true
    },
    {
      text: 'Understood. Sending revised terms with the three-year commitment tonight.',
      meta: 'Gulf Coast · Wed',
      own: false
    },
    {
      text: 'Revised offer is in the Deal room for your review.',
      meta: 'Gulf Coast · Today',
      own: false
    }
  ]);

  const t = AppTheme[theme];
  const partnerOffer = myValuation.mid * 0.97;
  const rootsOffer = myValuation.mid * 0.88;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      { text: chatInput.trim(), meta: 'You · Just now', own: true }
    ]);
    setChatInput('');
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* SEGMENT TABS */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
        <View style={[styles.segmentContainer, { backgroundColor: t.segBg }]}>
          {[
            { id: 'offers', label: 'Offers' },
            { id: 'docs', label: 'Documents' },
            { id: 'messages', label: 'Messages' }
          ].map(tab => {
            const isSelected = dealTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setDealTab(tab.id as any)}
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
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {dealTab === 'messages' ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}>
            {/* Conversation Partner Banner */}
            <View style={[styles.chatPartnerHeader, { backgroundColor: t.card }, t.shadow]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.chatPartnerTitle, { color: t.label }]}>
                  Gulf Coast Pediatric Partners
                </Text>
                <Text style={[styles.chatPartnerSub, { color: t.sec }]}>
                  Dr. Marcus Vance · Direct acquirer thread
                </Text>
              </View>
              <View style={[styles.activePill, { backgroundColor: 'rgba(17,101,91,0.1)' }]}>
                <Text style={[styles.activePillText, { color: t.tint }]}>ACTIVE</Text>
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {messages.map((m, idx) => (
                <View
                  key={idx}
                  style={{
                    alignItems: m.own ? 'flex-end' : 'flex-start'
                  }}>
                  <View
                    style={[
                      styles.msgBubble,
                      {
                        backgroundColor: m.own ? t.tint : t.card
                      },
                      !m.own && t.shadow
                    ]}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: m.own ? '#FFFFFF' : t.label,
                        lineHeight: 20
                      }}>
                      {m.text}
                    </Text>
                  </View>
                  <Text style={[styles.msgMeta, { color: t.ter }]}>{m.meta}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* DOCKED BOTTOM INPUT BAR */}
          <View style={[styles.chatBottomBar, { backgroundColor: t.nav, borderTopColor: t.sep }]}>
            <View style={[styles.chatInputRow, { backgroundColor: t.fill }]}>
              <TextInput
                style={[styles.chatInput, { color: t.label }]}
                placeholder="Message Gulf Coast..."
                placeholderTextColor={t.ter}
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={sendMessage}
                activeOpacity={0.7}
                style={[styles.sendBtn, { backgroundColor: t.tint }]}>
                <Send size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          {/* OFFERS TAB */}
          {dealTab === 'offers' && (
            <View style={{ gap: 12 }}>
              {/* Offer 1 */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openSheet('offer')}
                style={[
                  styles.offerCard,
                  { backgroundColor: t.card, borderColor: t.tint, borderWidth: 1.5 },
                  t.shadow
                ]}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.offerFrom, { color: t.label }]}>
                      Gulf Coast Pediatric Partners
                    </Text>
                    <Text style={[styles.offerKind, { color: t.sec }]}>
                      Partner MSO · majority sale
                    </Text>
                  </View>
                  <View style={styles.awaitingBadge}>
                    <Text style={styles.awaitingBadgeText}>AWAITING YOU</Text>
                  </View>
                </View>

                <Text style={[styles.offerAmount, { color: t.label }]}>
                  {money(partnerOffer)}
                </Text>
                <Text style={[styles.offerDelta, { color: t.sec }]}>
                  Mid-range of your {money(myValuation.low)} – {money(myValuation.high)} estimate
                </Text>

                <View style={[styles.termsRow, { borderTopColor: t.sep }]}>
                  <Text style={{ fontSize: 13, color: t.sec }}>
                    80% equity · 3-year clinical commitment · close Q4
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Offer 2 */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => showToast('Roots Health withdrew after the refinement')}
                style={[styles.offerCard, { backgroundColor: t.card }, t.shadow]}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.offerFrom, { color: t.label }]}>Roots Health</Text>
                    <Text style={[styles.offerKind, { color: t.sec }]}>
                      Platform MSO · full acquisition
                    </Text>
                  </View>
                  <View style={[styles.awaitingBadge, { backgroundColor: t.fill }]}>
                    <Text style={[styles.awaitingBadgeText, { color: t.sec }]}>SUPERSEDED</Text>
                  </View>
                </View>

                <Text style={[styles.offerAmount, { color: t.label }]}>
                  {money(rootsOffer)}
                </Text>
                <Text style={[styles.offerDelta, { color: '#FF3B30' }]}>
                  Below your refined range
                </Text>

                <View style={[styles.termsRow, { borderTopColor: t.sep }]}>
                  <Text style={{ fontSize: 13, color: t.sec }}>
                    100% equity · stock purchase · close Q4
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Intro CTA */}
              <View style={[styles.card, { backgroundColor: t.card }, t.shadow]}>
                <Text style={{ fontSize: 13.5, color: t.sec, lineHeight: 19 }}>
                  Two more acquirers have asked to be introduced. You are named only to the ones you
                  approve.
                </Text>
                <TouchableOpacity onPress={() => openSheet('intros')}>
                  <Text style={{ color: t.tint, fontSize: 15, fontWeight: '600', marginTop: 10 }}>
                    Review introductions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* DOCUMENTS TAB */}
          {dealTab === 'docs' && (
            <View>
              <View style={[styles.cardGroup, { backgroundColor: t.card }, t.shadow]}>
                {[
                  { name: 'Payer contract summary.pdf', meta: '1.2 MB · shared with 1 acquirer', state: 'Released', color: t.tint },
                  { name: 'Claims history 2024–2026.xlsx', meta: '4.8 MB · shared with 1 acquirer', state: 'Released', color: t.tint },
                  { name: 'Staffing roster.pdf', meta: '312 KB · not shared', state: 'Held', color: t.ter },
                  { name: 'Lease and premises.pdf', meta: '890 KB · not shared', state: 'Held', color: t.ter },
                  { name: 'Malpractice history.pdf', meta: '204 KB · requested', state: 'Requested', color: '#FF9500' }
                ].map((doc, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                    <View
                      key={doc.name}
                      style={[
                        styles.docRow,
                        !isLast && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                      ]}>
                      <View style={[styles.docIconWrap, { backgroundColor: t.fill }]}>
                        <FileText size={16} color={t.sec} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.docName, { color: t.label }]}>{doc.name}</Text>
                        <Text style={[styles.docMeta, { color: t.sec }]}>{doc.meta}</Text>
                      </View>
                      <Text style={{ fontSize: 12.5, color: doc.color, fontWeight: '600' }}>
                        {doc.state}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={[styles.footerNote, { color: t.ter }]}>
                Documents are released per counterparty. Nothing here is visible on the public map.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40
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
  offerCard: {
    borderRadius: 16,
    padding: 18
  },
  card: {
    borderRadius: 14,
    padding: 16
  },
  cardGroup: {
    borderRadius: 14,
    overflow: 'hidden'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  offerFrom: {
    fontSize: 16,
    fontWeight: '600'
  },
  offerKind: {
    fontSize: 13,
    marginTop: 2
  },
  awaitingBadge: {
    backgroundColor: 'rgba(255,149,0,0.16)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  awaitingBadgeText: {
    color: '#C86A00',
    fontSize: 11,
    fontWeight: '700'
  },
  offerAmount: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: 12
  },
  offerDelta: {
    fontSize: 13,
    marginTop: 2
  },
  termsRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12
  },
  docIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  docName: {
    fontSize: 15,
    fontWeight: '500'
  },
  docMeta: {
    fontSize: 12.5,
    marginTop: 2
  },
  footerNote: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 10,
    paddingHorizontal: 4
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20
  },
  chatPartnerHeader: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chatPartnerTitle: {
    fontSize: 14.5,
    fontWeight: '600'
  },
  chatPartnerSub: {
    fontSize: 12,
    marginTop: 2
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  activePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  msgBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18
  },
  msgMeta: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 6
  },
  chatBottomBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 4
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
