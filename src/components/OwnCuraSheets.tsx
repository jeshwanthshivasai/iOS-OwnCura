import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { Check, ArrowUpRight } from 'lucide-react-native';
import { useOwnCura, RoleType } from '@/constants/OwnCuraContext';
import { AppTheme } from '@/constants/themeTokens';
import { money } from '@/constants/owncuraData';

export const OwnCuraSheets: React.FC = () => {
  const {
    sheet,
    closeSheet,
    theme,
    toggleTheme,
    role,
    setRole,
    myValuation,
    inputs,
    updateInput,
    resetInputs,
    showToast,
    pushScreen,
    selectedClinic,
    selectedValuation,
    approveCounterparty,
    approvedCounterparties
  } = useOwnCura();

  const t = AppTheme[theme];
  if (!sheet) return null;

  return (
    <Modal
      visible={!!sheet}
      transparent
      animationType="slide"
      onRequestClose={closeSheet}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheetContainer, { backgroundColor: t.sheet }]}>
        <View style={styles.grabberContainer}>
          <View style={[styles.grabber, { backgroundColor: t.grabber }]} />
        </View>

        {/* Header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={closeSheet} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: t.tint }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.sheetTitle, { color: t.label }]}>
            {sheet === 'refine'
              ? 'Refine valuation'
              : sheet === 'profile'
              ? 'Profile'
              : sheet === 'offer'
              ? 'Offer detail'
              : sheet === 'peek'
              ? 'Practice'
              : 'Introductions'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (sheet === 'refine') {
                showToast(`Valuation updated · ${money(myValuation.mid)}`);
              }
              closeSheet();
            }}
            style={styles.doneBtn}>
            <Text style={[styles.doneText, { color: t.tint }]}>
              {sheet === 'refine' ? 'Save' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.sheetContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          {/* REFINE SHEET */}
          {sheet === 'refine' && (
            <View>
              {/* Live Card */}
              <View style={[styles.card, { backgroundColor: t.card }, t.shadow]}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.subText, { color: t.sec }]}>Live estimate</Text>
                  <Text style={[styles.subText, { color: t.tint }]}>
                    {myValuation.filled === 0 ? 'Public data only' : `${myValuation.filled} of 5 inputs`}
                  </Text>
                </View>
                <Text style={[styles.bigValText, { color: t.label }]}>
                  {money(myValuation.mid)}
                </Text>
                <Text style={[styles.subRange, { color: t.sec }]}>
                  {money(myValuation.low)} – {money(myValuation.high)} estimated range
                </Text>

                <View style={[styles.barBg, { backgroundColor: t.fill }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: t.tint,
                        left: '12%',
                        right: '12%'
                      }
                    ]}
                  />
                </View>

                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                  <Text style={[styles.noteText, { color: t.sec }]}>
                    Confidence {myValuation.confidence}%
                  </Text>
                  <Text style={[styles.noteText, { color: t.sec }]}>
                    ±{Math.round(myValuation.spread * 100)}% spread
                  </Text>
                </View>
              </View>

              {/* Form fields */}
              <View style={[styles.cardGroup, { backgroundColor: t.card, marginTop: 16 }]}>
                <View style={[styles.inputRow, { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                  <Text style={[styles.inputLabel, { color: t.label }]}>EBITDA</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={{ color: t.sec, fontSize: 16 }}>$</Text>
                    <TextInput
                      style={[styles.textInput, { color: t.label }]}
                      keyboardType="numeric"
                      value={inputs.ebitda}
                      placeholder="612000"
                      placeholderTextColor={t.ter}
                      onChangeText={val => updateInput('ebitda', val.replace(/[^0-9]/g, ''))}
                    />
                  </View>
                </View>

                <View style={[styles.inputRow, { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                  <Text style={[styles.inputLabel, { color: t.label }]}>Providers</Text>
                  <TextInput
                    style={[styles.textInput, { color: t.label }]}
                    keyboardType="numeric"
                    value={inputs.providers}
                    placeholder="4"
                    placeholderTextColor={t.ter}
                    onChangeText={val => updateInput('providers', val.replace(/[^0-9]/g, ''))}
                  />
                </View>

                <View style={styles.inputRow}>
                  <Text style={[styles.inputLabel, { color: t.label }]}>Patient panel</Text>
                  <TextInput
                    style={[styles.textInput, { color: t.label }]}
                    keyboardType="numeric"
                    value={inputs.panel}
                    placeholder="5400"
                    placeholderTextColor={t.ter}
                    onChangeText={val => updateInput('panel', val.replace(/[^0-9]/g, ''))}
                  />
                </View>
              </View>

              <View style={[styles.cardGroup, { backgroundColor: t.card, marginTop: 16, padding: 16 }]}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.inputLabel, { color: t.label }]}>Commercial payer share</Text>
                  <Text style={{ color: t.sec, fontSize: 16, fontWeight: '500' }}>
                    {inputs.commercial}%
                  </Text>
                </View>
                <View style={[styles.stepperRow, { marginTop: 10 }]}>
                  {[50, 60, 70, 80].map(pct => (
                    <TouchableOpacity
                      key={pct}
                      onPress={() => updateInput('commercial', pct)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: Number(inputs.commercial) === pct ? t.tint : t.fill
                        }
                      ]}>
                      <Text
                        style={{
                          color: Number(inputs.commercial) === pct ? '#FFF' : t.label,
                          fontWeight: '600'
                        }}>
                        {pct}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={[styles.rowBetween, { marginTop: 18 }]}>
                  <Text style={[styles.inputLabel, { color: t.label }]}>Visits per day</Text>
                  <Text style={{ color: t.sec, fontSize: 16, fontWeight: '500' }}>
                    {inputs.visits}/day
                  </Text>
                </View>
                <View style={[styles.stepperRow, { marginTop: 10 }]}>
                  {[35, 42, 52, 65].map(v => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => updateInput('visits', v)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: Number(inputs.visits) === v ? t.tint : t.fill
                        }
                      ]}>
                      <Text
                        style={{
                          color: Number(inputs.visits) === v ? '#FFF' : t.label,
                          fontWeight: '600'
                        }}>
                        {v}/day
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Factors */}
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.sectionTitle, { color: t.sec }]}>WHAT EACH NUMBER MOVED</Text>
                <View style={[styles.cardGroup, { backgroundColor: t.card }]}>
                  {myValuation.factors?.map((f, i) => (
                    <View
                      key={f.label}
                      style={[
                        styles.factorRow,
                        i < (myValuation.factors?.length || 0) - 1 && {
                          borderBottomColor: t.sep,
                          borderBottomWidth: StyleSheet.hairlineWidth
                        }
                      ]}>
                      <View style={styles.rowBetween}>
                        <Text style={[styles.inputLabel, { color: t.label }]}>{f.label}</Text>
                        <Text
                          style={{
                            color: f.effect > 0 ? t.tint : f.effect < 0 ? '#FF3B30' : t.ter,
                            fontWeight: '600',
                            fontSize: 14
                          }}>
                          {Math.abs(f.effect) < 1000
                            ? '—'
                            : (f.effect > 0 ? '+' : '−') + money(Math.abs(f.effect))}
                        </Text>
                      </View>
                      <Text style={[styles.noteText, { color: t.sec, marginTop: 2 }]}>{f.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity onPress={resetInputs} style={styles.resetBtn}>
                <Text style={{ color: '#FF3B30', fontSize: 16, fontWeight: '500' }}>
                  Clear all inputs
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PROFILE SHEET */}
          {sheet === 'profile' && (
            <View>
              <View style={[styles.card, { backgroundColor: t.card, flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.avatarLg, { backgroundColor: t.avatarBg }]}>
                  <Text style={[styles.avatarLgText, { color: t.avatarInk }]}>
                    {role === 'owner' ? 'RS' : role === 'team' ? 'RH' : 'LS'}
                  </Text>
                </View>
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={[styles.profileName, { color: t.label }]}>
                    {role === 'owner'
                      ? 'Dr. Reyes'
                      : role === 'team'
                      ? 'Roots Health deal team'
                      : 'Lone Star Pediatric MSO'}
                  </Text>
                  <Text style={[styles.profileSub, { color: t.sec }]}>
                    {role === 'owner'
                      ? 'Owner · Bellaire Pediatric Associates'
                      : role === 'team'
                      ? 'Internal · 9 clinics, 11 in diligence'
                      : 'Acquirer · TX, peds and family practice'}
                  </Text>
                </View>
              </View>

              {/* Account Switcher */}
              <Text style={[styles.sectionTitle, { color: t.sec, marginTop: 24 }]}>ACCOUNTS & ROLES</Text>
              <View style={[styles.cardGroup, { backgroundColor: t.card }]}>
                {[
                  { id: 'owner', name: 'Dr. Reyes', sub: 'Clinic Owner · Houston, TX' },
                  { id: 'team', name: 'Roots Health deal team', sub: 'Internal MSO platform' },
                  { id: 'acquirer', name: 'Lone Star Pediatric MSO', sub: 'External acquirer' }
                ].map((r, i) => {
                  const isSelected = role === r.id;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => {
                        setRole(r.id as RoleType);
                        showToast(`Switched to ${r.name}`);
                      }}
                      style={[
                        styles.roleRow,
                        i < 2 && { borderBottomColor: t.sep, borderBottomWidth: StyleSheet.hairlineWidth }
                      ]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.inputLabel, { color: t.label }]}>{r.name}</Text>
                        <Text style={[styles.noteText, { color: t.sec }]}>{r.sub}</Text>
                      </View>
                      {isSelected && <Check size={19} color={t.tint} strokeWidth={2.5} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Theme Switcher */}
              <Text style={[styles.sectionTitle, { color: t.sec, marginTop: 24 }]}>APPEARANCE</Text>
              <View style={[styles.cardGroup, { backgroundColor: t.card, padding: 8 }]}>
                <View style={[styles.themeRow, { backgroundColor: t.segBg }]}>
                  <TouchableOpacity
                    onPress={() => theme !== 'light' && toggleTheme()}
                    style={[
                      styles.themeTab,
                      theme === 'light' && { backgroundColor: t.segOn, ...t.shadow }
                    ]}>
                    <Text style={{ color: t.label, fontWeight: theme === 'light' ? '600' : '400' }}>
                      Light
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => theme !== 'dark' && toggleTheme()}
                    style={[
                      styles.themeTab,
                      theme === 'dark' && { backgroundColor: t.segOn }
                    ]}>
                    <Text style={{ color: t.label, fontWeight: theme === 'dark' ? '600' : '400' }}>
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginTop: 20, paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 12, color: t.ter, lineHeight: 16 }}>
                  OwnCura iOS · An Independence OS product. Valuations from an illustrative model,
                  not the production engine.
                </Text>
              </View>
            </View>
          )}

          {/* OFFER SHEET */}
          {sheet === 'offer' && (
            <View>
              <View style={[styles.card, { backgroundColor: t.card }]}>
                <Text style={[styles.subText, { color: t.sec }]}>
                  Gulf Coast Pediatric Partners · Partner MSO
                </Text>
                <Text style={[styles.bigValText, { color: t.label }]}>
                  {money(myValuation.mid * 0.97)}
                </Text>
                <Text style={[styles.subRange, { color: t.sec }]}>
                  Mid-range of your {money(myValuation.low)} – {money(myValuation.high)} estimate
                </Text>
              </View>

              <View style={[styles.cardGroup, { backgroundColor: t.card, marginTop: 16 }]}>
                {[
                  ['Structure', '80% equity purchase'],
                  ['Clinical commitment', '3 years'],
                  ['Earn-out', `Up to ${money(myValuation.mid * 0.12)}`],
                  ['Diligence period', '45 days'],
                  ['Expected close', 'Q4 2026']
                ].map(([lbl, val], idx) => (
                  <View
                    key={lbl}
                    style={[
                      styles.inputRow,
                      idx < 4 && { borderBottomColor: t.sep }
                    ]}>
                    <Text style={[styles.inputLabel, { color: t.label }]}>{lbl}</Text>
                    <Text style={{ color: t.sec, fontSize: 15 }}>{val}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.card, { backgroundColor: t.card, marginTop: 14 }]}>
                <Text style={{ color: t.sec, fontSize: 13.5, lineHeight: 19 }}>
                  Non-binding. Roots Health is not party to this offer — you were introduced
                  through OwnCura's acquirer network.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  closeSheet();
                  showToast('Opened in Deal room');
                }}
                style={[styles.primaryBtn, { backgroundColor: t.tint, marginTop: 18 }]}>
                <Text style={styles.primaryBtnText}>Review in Deal Room</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CLINIC PEEK SHEET */}
          {sheet === 'peek' && (
            <View>
              <View style={[styles.card, { backgroundColor: t.card }]}>
                <View
                  style={[
                    styles.badgeChip,
                    {
                      backgroundColor:
                        selectedClinic.status === 'mine'
                          ? 'rgba(10,132,255,0.14)'
                          : selectedClinic.status === 'listed'
                          ? 'rgba(255,149,0,0.16)'
                          : selectedClinic.status === 'portfolio'
                          ? 'rgba(15,122,87,0.14)'
                          : t.fill
                    }
                  ]}>
                  <Text
                    style={{
                      color:
                        selectedClinic.status === 'mine'
                          ? '#0A84FF'
                          : selectedClinic.status === 'listed'
                          ? '#C86A00'
                          : selectedClinic.status === 'portfolio'
                          ? t.tint
                          : t.sec,
                      fontSize: 11,
                      fontWeight: '700'
                    }}>
                    {selectedClinic.status === 'mine'
                      ? 'YOUR PRACTICE'
                      : selectedClinic.status === 'listed'
                      ? 'LISTED FOR SALE'
                      : selectedClinic.status === 'portfolio'
                      ? 'ROOTS HEALTH'
                      : 'NOT LISTED'}
                  </Text>
                </View>

                <Text style={[styles.peekTitle, { color: t.label }]}>{selectedClinic.name}</Text>
                <Text style={[styles.subRange, { color: t.sec, marginTop: 4 }]}>
                  {selectedClinic.city}, {selectedClinic.state} · {selectedClinic.specialty} ·{' '}
                  {selectedClinic.providers} providers
                </Text>

                <Text style={[styles.bigValText, { color: t.label, marginTop: 14 }]}>
                  {money(selectedValuation.low)} – {money(selectedValuation.high)}
                </Text>
                <Text style={[styles.subRange, { color: t.sec }]}>
                  {selectedValuation.confidence}% confidence · {selectedValuation.mult.toFixed(2)}×
                  multiple
                </Text>
              </View>

              <View style={[styles.card, { backgroundColor: t.card, marginTop: 12, flexDirection: 'row' }]}>
                <View
                  style={{
                    width: 3,
                    borderRadius: 2,
                    backgroundColor: t.tint,
                    marginRight: 10
                  }}
                />
                <Text style={{ flex: 1, fontSize: 13.5, color: t.sec, lineHeight: 18 }}>
                  {selectedClinic.note}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  closeSheet();
                  pushScreen('valuation');
                }}
                style={[styles.primaryBtn, { backgroundColor: t.tint, marginTop: 18 }]}>
                <Text style={styles.primaryBtnText}>View Full Valuation</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* INTROS SHEET */}
          {sheet === 'intros' && (
            <View>
              <Text style={{ fontSize: 14, color: t.sec, lineHeight: 20, marginBottom: 14 }}>
                Two vetted acquirers have asked to be introduced. Approving one releases your practice
                name to that acquirer only.
              </Text>

              {[
                {
                  id: 'gulf',
                  name: 'Gulf Coast Pediatric Partners',
                  detail: '12 clinics · Houston and Beaumont · offer on the table'
                },
                {
                  id: 'alamo',
                  name: 'Alamo Health Group',
                  detail: '7 clinics · San Antonio and Austin · reviewing your metro'
                }
              ].map(intro => {
                const isApproved = approvedCounterparties.includes(intro.id);
                return (
                  <View key={intro.id} style={[styles.card, { backgroundColor: t.card, marginBottom: 12 }]}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: t.label }}>
                      {intro.name}
                    </Text>
                    <Text style={{ fontSize: 13, color: t.sec, marginTop: 3 }}>
                      {intro.detail}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                      <TouchableOpacity
                        onPress={() => {
                          approveCounterparty(intro.id);
                          showToast(`Name released to ${intro.name}`);
                        }}
                        style={[
                          styles.introBtn,
                          {
                            backgroundColor: isApproved ? t.fill : t.tint
                          }
                        ]}>
                        <Text
                          style={{
                            color: isApproved ? t.sec : '#FFFFFF',
                            fontWeight: '600'
                          }}>
                          {isApproved ? 'Approved' : 'Approve'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => showToast('Declined introduction')}
                        style={[styles.introBtn, { backgroundColor: t.fill }]}>
                        <Text style={{ color: t.sec }}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '88%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20
  },
  grabberContainer: {
    alignItems: 'center',
    paddingVertical: 6
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginBottom: 8
  },
  cancelBtn: {
    width: 60
  },
  cancelText: {
    fontSize: 17
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '600'
  },
  doneBtn: {
    width: 60,
    alignItems: 'flex-end'
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600'
  },
  sheetContent: {
    paddingTop: 8
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
    alignItems: 'center'
  },
  subText: {
    fontSize: 13,
    fontWeight: '500'
  },
  bigValText: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: 6
  },
  subRange: {
    fontSize: 13.5,
    marginTop: 2
  },
  barBg: {
    height: 7,
    borderRadius: 4,
    marginTop: 14,
    position: 'relative',
    overflow: 'hidden'
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 4
  },
  noteText: {
    fontSize: 12.5
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  textInput: {
    fontSize: 16,
    textAlign: 'right',
    minWidth: 90,
    padding: 0
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 8
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4
  },
  factorRow: {
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  resetBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 10
  },
  avatarLg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarLgText: {
    fontSize: 20,
    fontWeight: '700'
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700'
  },
  profileSub: {
    fontSize: 13,
    marginTop: 2
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  themeRow: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2
  },
  themeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 7
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600'
  },
  badgeChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  peekTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10
  },
  introBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
