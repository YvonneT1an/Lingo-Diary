import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Phrase {
  id: string;
  english: string;
  chinese?: string;
  explanation?: string;
  context?: string;
  examples?: string;
  dateAdded: string;
}

interface PhraseContextType {
  phrases: Phrase[];
  addPhrase: (phrase: Omit<Phrase, 'id' | 'dateAdded'>) => void;
  updatePhrase: (id: string, phrase: Partial<Phrase>) => void;
  deletePhrase: (id: string) => void;
}

const PhraseContext = createContext<PhraseContextType | undefined>(undefined);

const mockInitialPhrases: Phrase[] = [
  {
    id: "1",
    english: "hit it off",
    chinese: "一拍即合",
    explanation: "To quickly become good friends with someone.",
    context: "We really hit it off at the meeting today.",
    examples: "I introduced them and they hit it off immediately.",
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    english: "call it a day",
    chinese: "今天就到此为止",
    explanation: "To stop what you are doing because you think you have done enough or do not want to do any more.",
    context: "Let's call it a day and go grab some dinner.",
    examples: "After 10 hours of working, I decided to call it a day.",
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    english: "get the hang of it",
    chinese: "掌握诀窍",
    explanation: "To learn how to do something, especially when it is not obvious or simple.",
    context: "It's tricky at first, but you'll get the hang of it.",
    examples: "I've never played this game before, but I think I'm getting the hang of it.",
    dateAdded: new Date().toISOString(),
  }
];

export function PhraseProvider({ children }: { children: React.ReactNode }) {
  const [phrases, setPhrases] = useState<Phrase[]>(mockInitialPhrases);

  const addPhrase = (phraseData: Omit<Phrase, 'id' | 'dateAdded'>) => {
    const newPhrase: Phrase = {
      ...phraseData,
      id: Math.random().toString(36).substring(2, 9),
      dateAdded: new Date().toISOString(),
    };
    setPhrases((prev) => [newPhrase, ...prev]);
  };

  const updatePhrase = (id: string, updates: Partial<Phrase>) => {
    setPhrases((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePhrase = (id: string) => {
    setPhrases((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <PhraseContext.Provider value={{ phrases, addPhrase, updatePhrase, deletePhrase }}>
      {children}
    </PhraseContext.Provider>
  );
}

export function usePhrases() {
  const context = useContext(PhraseContext);
  if (context === undefined) {
    throw new Error('usePhrases must be used within a PhraseProvider');
  }
  return context;
}
