import { create } from 'zustand';
import type { User, UserRole, AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const mockUsers: Record<string, User> = {
  'borrower@quantara.io': {
    id: 'usr-001',
    email: 'borrower@quantara.io',
    role: 'borrower',
    displayName: 'J. Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'lender@quantara.io': {
    id: 'usr-002',
    email: 'lender@quantara.io',
    role: 'lender',
    displayName: 'Capital Partners',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'operator@quantara.io': {
    id: 'usr-003',
    email: 'operator@quantara.io',
    role: 'operator',
    displayName: 'System Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string) => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 800));

    const user = mockUsers[email];
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      // Auto-create for demo
      set({
        user: {
          id: `usr-${Date.now()}`,
          email,
          role: 'borrower',
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  loginWithWallet: async (walletAddress: string) => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 1200));
    set({
      user: {
        id: `usr-${Date.now()}`,
        email: '',
        walletAddress,
        role: 'lender',
        displayName: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  setRole: (role: UserRole) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    }));
  },
}));
