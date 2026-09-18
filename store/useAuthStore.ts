import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/lib/dal/users';

export type AuthView = 'login' | 'register' | 'account';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authView: AuthView;

  // Actions
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  setAuthView: (view: AuthView) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authView: 'login',

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          authView: user ? 'account' : 'login'
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          authView: 'login',
          isAuthModalOpen: false
        }),

      openAuthModal: (view) =>
        set((state) => ({
          isAuthModalOpen: true,
          authView: view || (state.isAuthenticated ? 'account' : 'login')
        })),

      closeAuthModal: () => set({ isAuthModalOpen: false }),

      setAuthView: (view) => set({ authView: view })
    }),
    {
      name: 'lakshmi_user_auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

