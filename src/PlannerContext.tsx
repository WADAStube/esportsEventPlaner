import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SECTIONS } from "./data";

type Assignments  = Record<string, string[]>;
type SelectedOpts = Record<string, string[]>;
type SelectedSubs = Record<string, string[]>;
type CustomTexts  = Record<string, string>;
type SectionNotes = Record<string, string>;

export interface AIGeneratedCard {
  label: string; badge: string; short: string;
  details: string[]; teamSize: string; icon: string; color: string;
}

interface PlannerState {
  assignments:          Assignments;
  setAssignment:        (memberId: string, roleId: string) => void;
  clearAllAssignments:  () => void;
  selectedOptions:      SelectedOpts;
  selectedSubs:         SelectedSubs;
  setOption:            (sectionId: string, optionId: string) => void;
  toggleSub:            (sectionId: string, subId: string) => void;
  customText:           CustomTexts;
  setCustomText:        (sectionId: string, text: string) => void;
  aiGeneratedOptions:   Record<string, AIGeneratedCard>;
  setAIGeneratedOption: (sectionId: string, card: AIGeneratedCard) => void;
  activeSectionId:      string;
  setActiveSectionId:   (id: string) => void;
  sectionNotes:         SectionNotes;
  setSectionNote:       (sectionId: string, note: string) => void;
}

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  get<T>(key: string, fallback: T): T {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key: string, value: unknown) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

const PlannerContext = createContext<PlannerState | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [assignments,        setAssignments]        = useState<Assignments>       (() => LS.get("esports_assignments",  {}));
  const [selectedOptions,    setSelectedOptions]    = useState<SelectedOpts>      (() => LS.get("esports_selectedOpts", {}));
  const [selectedSubs,       setSelectedSubs]       = useState<SelectedSubs>      (() => LS.get("esports_selectedSubs", {}));
  const [customText,         setCustomTextMap]      = useState<CustomTexts>       (() => LS.get("esports_customText",   {}));
  const [aiGeneratedOptions, setAIGeneratedOptionsMap] = useState<Record<string, AIGeneratedCard>>(() => LS.get("esports_aiCards", {}));
  const [activeSectionId,    setActiveSectionId]    = useState<string>            (() => LS.get("esports_activeSection", SECTIONS[0].id));
  const [sectionNotes,       setSectionNotesMap]    = useState<SectionNotes>      (() => LS.get("esports_notes",        {}));

  // Persist every change automatically
  useEffect(() => { LS.set("esports_assignments",  assignments);       }, [assignments]);
  useEffect(() => { LS.set("esports_selectedOpts", selectedOptions);   }, [selectedOptions]);
  useEffect(() => { LS.set("esports_selectedSubs", selectedSubs);      }, [selectedSubs]);
  useEffect(() => { LS.set("esports_customText",   customText);        }, [customText]);
  useEffect(() => { LS.set("esports_aiCards",      aiGeneratedOptions);}, [aiGeneratedOptions]);
  useEffect(() => { LS.set("esports_activeSection",activeSectionId);   }, [activeSectionId]);
  useEffect(() => { LS.set("esports_notes",        sectionNotes);      }, [sectionNotes]);

  const setAssignment = (memberId: string, roleId: string) => {
    setAssignments(prev => {
      const current = prev[memberId] || [];
      if (current.includes(roleId)) {
        const next = current.filter(id => id !== roleId);
        return next.length === 0
          ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== memberId))
          : { ...prev, [memberId]: next };
      }
      return { ...prev, [memberId]: [...current, roleId] };
    });
  };

  const clearAllAssignments = () => setAssignments({});

  const setOption = (sectionId: string, optionId: string) => {
    setSelectedOptions(prev => {
      const current = prev[sectionId] || [];
      if (current.includes(optionId)) {
        const next = current.filter(id => id !== optionId);
        return next.length === 0
          ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== sectionId))
          : { ...prev, [sectionId]: next };
      }
      return { ...prev, [sectionId]: [...current, optionId] };
    });
  };

  const toggleSub = (sectionId: string, subId: string) => {
    setSelectedSubs(prev => {
      const current = prev[sectionId] || [];
      return { ...prev, [sectionId]: current.includes(subId) ? current.filter(id => id !== subId) : [...current, subId] };
    });
  };

  const setCustomText        = (sectionId: string, text: string) => setCustomTextMap(prev => ({ ...prev, [sectionId]: text }));
  const setAIGeneratedOption = (sectionId: string, card: AIGeneratedCard) => setAIGeneratedOptionsMap(prev => ({ ...prev, [sectionId]: card }));
  const setSectionNote       = (sectionId: string, note: string) => setSectionNotesMap(prev => ({ ...prev, [sectionId]: note }));

  return (
    <PlannerContext.Provider value={{
      assignments, setAssignment, clearAllAssignments,
      selectedOptions, selectedSubs, setOption, toggleSub,
      customText, setCustomText,
      aiGeneratedOptions, setAIGeneratedOption,
      activeSectionId, setActiveSectionId,
      sectionNotes, setSectionNote,
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within a PlannerProvider");
  return ctx;
}
