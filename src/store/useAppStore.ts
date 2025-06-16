import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // États de l'application
  language: 'fr' | 'en';
  user: { username: string; token: string } | null;
  mvpHistory: Array<{ id: string; prompt: string; result: string; createdAt: string }>;
  
  // Actions
  setLanguage: (language: 'fr' | 'en') => void;
  setUser: (user: { username: string; token: string } | null) => void;
  addMvpToHistory: (mvp: { prompt: string; result: string }) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // États initiaux
      language: 'fr',
      user: null,
      mvpHistory: [],
      
      // Actions
      setLanguage: (language) => set({ language }),
      setUser: (user) => set({ user }),
      addMvpToHistory: (mvp) => {
        const newMvp = {
          id: Date.now().toString(),
          ...mvp,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          mvpHistory: [newMvp, ...state.mvpHistory].slice(0, 50), // Limite à 50 entrées
        }));
      },
      clearHistory: () => set({ mvpHistory: [] }),
    }),
    {
      name: 'mvpforge-storage',
      partialize: (state) => ({ 
        language: state.language, 
        mvpHistory: state.mvpHistory 
      }),
    }
  )
);
