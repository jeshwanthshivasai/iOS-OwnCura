import React, { createContext, useContext, useState } from 'react';
import {
  Clinic,
  OC_CLINICS,
  OC_METROS,
  Metro,
  ValuationInputs,
  ValuationResult,
  clinicValuation,
  refinedValuation,
  baselineValuation,
  money
} from './owncuraData';

export type RoleType = 'owner' | 'team' | 'acquirer';
export type ActiveTabType = 'home' | 'deals' | 'inbox' | 'portfolio' | 'clinicops' | 'digest' | 'practice';
export type ScreenType = 'home' | 'valuation' | 'explore' | 'options' | 'deals' | 'inbox' | 'portfolio' | 'clinicops' | 'digest' | 'practice';
export type SheetType = 'refine' | 'profile' | 'offer' | 'peek' | 'intros' | null;

interface OwnCuraContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  role: RoleType;
  setRole: (r: RoleType) => void;
  activeTab: ActiveTabType;
  setActiveTab: (t: ActiveTabType) => void;
  stack: string[];
  pushScreen: (s: string) => void;
  popScreen: () => void;
  sheet: SheetType;
  openSheet: (s: SheetType) => void;
  closeSheet: () => void;
  selectedClinicId: string;
  setSelectedClinicId: (id: string) => void;
  inputs: ValuationInputs;
  updateInput: (key: keyof ValuationInputs, val: string | number) => void;
  resetInputs: () => void;
  toastText: string | null;
  showToast: (msg: string) => void;
  approvedCounterparties: string[];
  approveCounterparty: (id: string) => void;
  dealTab: 'offers' | 'docs' | 'messages';
  setDealTab: (t: 'offers' | 'docs' | 'messages') => void;
  stateFilter: 'all' | 'TX' | 'CA';
  setStateFilter: (s: 'all' | 'TX' | 'CA') => void;
  selectedMetro: string | null;
  setSelectedMetro: (m: string | null) => void;
  // Computed values
  myPractice: Clinic;
  selectedClinic: Clinic;
  myValuation: ValuationResult;
  selectedValuation: ValuationResult;
}

const defaultInputs: ValuationInputs = {
  ebitda: '612000',
  providers: '4',
  panel: '5400',
  commercial: 70,
  visits: 52
};

const OwnCuraContext = createContext<OwnCuraContextType | undefined>(undefined);

export const OwnCuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [role, setRoleState] = useState<RoleType>('owner');
  const [activeTab, setActiveTabState] = useState<ActiveTabType>('home');
  const [stack, setStack] = useState<string[]>([]);
  const [sheet, setSheet] = useState<SheetType>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('memorial');
  const [inputs, setInputs] = useState<ValuationInputs>(defaultInputs);
  const [toastText, setToastText] = useState<string | null>(null);
  const [approvedCounterparties, setApprovedCounterparties] = useState<string[]>([]);
  const [dealTab, setDealTab] = useState<'offers' | 'docs' | 'messages'>('offers');
  const [stateFilter, setStateFilter] = useState<'all' | 'TX' | 'CA'>('all');
  const [selectedMetro, setSelectedMetro] = useState<string | null>(null);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    setStack([]);
    setSheet(null);
    if (newRole === 'owner') setActiveTabState('home');
    else if (newRole === 'team') setActiveTabState('portfolio');
    else if (newRole === 'acquirer') setActiveTabState('digest');
  };

  const setActiveTab = (tab: ActiveTabType) => {
    setActiveTabState(tab);
    setStack([]);
    setSheet(null);
  };

  const pushScreen = (s: string) => {
    setSheet(null);
    setStack(prev => [...prev, s]);
  };

  const popScreen = () => {
    setStack(prev => prev.slice(0, -1));
  };

  const openSheet = (s: SheetType) => setSheet(s);
  const closeSheet = () => setSheet(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(prev => (prev === msg ? null : prev));
    }, 2500);
  };

  const updateInput = (key: keyof ValuationInputs, val: string | number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const resetInputs = () => {
    setInputs({ ebitda: '', providers: '', panel: '', commercial: 62, visits: 42 });
  };

  const approveCounterparty = (id: string) => {
    setApprovedCounterparties(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const myPractice = OC_CLINICS.find(c => c.status === 'mine') || OC_CLINICS[0];
  const selectedClinic = OC_CLINICS.find(c => c.id === selectedClinicId) || OC_CLINICS[0];

  const myValuation = refinedValuation(myPractice, inputs);
  const selectedValuation = clinicValuation(selectedClinic);

  return (
    <OwnCuraContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        activeTab,
        setActiveTab,
        stack,
        pushScreen,
        popScreen,
        sheet,
        openSheet,
        closeSheet,
        selectedClinicId,
        setSelectedClinicId,
        inputs,
        updateInput,
        resetInputs,
        toastText,
        showToast,
        approvedCounterparties,
        approveCounterparty,
        dealTab,
        setDealTab,
        stateFilter,
        setStateFilter,
        selectedMetro,
        setSelectedMetro,
        myPractice,
        selectedClinic,
        myValuation,
        selectedValuation
      }}>
      {children}
    </OwnCuraContext.Provider>
  );
};

export const useOwnCura = () => {
  const context = useContext(OwnCuraContext);
  if (!context) throw new Error('useOwnCura must be used within OwnCuraProvider');
  return context;
};
