import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Phrase } from '@shared/schema';

export type { Phrase } from '@shared/schema';

interface PhraseContextType {
  phrases: Phrase[];
  isLoading: boolean;
  addPhrase: (phrase: { english: string; chinese?: string; explanation?: string; context?: string; examples?: string }) => Promise<Phrase>;
  updatePhrase: (id: number, phrase: Partial<Phrase>) => Promise<Phrase>;
  deletePhrase: (id: number) => Promise<void>;
}

const PhraseContext = createContext<PhraseContextType | undefined>(undefined);

export function PhraseProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: phrases = [], isLoading } = useQuery<Phrase[]>({
    queryKey: ['/api/phrases'],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { english: string; chinese?: string; explanation?: string; context?: string; examples?: string }) => {
      const res = await apiRequest('POST', '/api/phrases', data);
      return res.json() as Promise<Phrase>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/phrases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Phrase> }) => {
      const res = await apiRequest('PATCH', `/api/phrases/${id}`, updates);
      return res.json() as Promise<Phrase>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/phrases'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/phrases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/phrases'] });
    },
  });

  const addPhrase = async (data: { english: string; chinese?: string; explanation?: string; context?: string; examples?: string }) => {
    return addMutation.mutateAsync(data);
  };

  const updatePhrase = async (id: number, updates: Partial<Phrase>) => {
    return updateMutation.mutateAsync({ id, updates });
  };

  const deletePhrase = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  return (
    <PhraseContext.Provider value={{ phrases, isLoading, addPhrase, updatePhrase, deletePhrase }}>
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
