import { create } from 'zustand';
import type { RiskProfile, RiskScoreEntry } from '@/types';
import { calculateRiskScore, calculateProbabilityOfDefault, calculateConfidenceBand, scoreToTier } from '@/lib/risk-math';

interface RiskStore {
  profiles: Record<string, RiskProfile>;
  activeProfileId: string | null;
  isCalculating: boolean;

  calculateRisk: (userId: string, inputs: RiskProfile['inputs']) => RiskProfile;
  getProfile: (userId: string) => RiskProfile | null;
  setActiveProfile: (id: string) => void;
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  profiles: {},
  activeProfileId: null,
  isCalculating: false,

  calculateRisk: (userId, inputs) => {
    set({ isCalculating: true });

    const score = calculateRiskScore(inputs);
    const pod = calculateProbabilityOfDefault(score);
    const band = calculateConfidenceBand(score);
    const tier = scoreToTier(score);

    const existing = get().profiles[userId];
    const history: RiskScoreEntry[] = existing?.history || [];
    history.push({
      date: new Date().toISOString(),
      score,
      probabilityOfDefault: pod,
    });

    const profile: RiskProfile = {
      id: `risk-${userId}`,
      userId,
      riskScore: score,
      probabilityOfDefault: pod,
      confidenceBand: band,
      tier,
      inputs,
      lastCalculated: new Date().toISOString(),
      history,
    };

    set((state) => ({
      profiles: { ...state.profiles, [userId]: profile },
      isCalculating: false,
    }));

    return profile;
  },

  getProfile: (userId) => {
    return get().profiles[userId] || null;
  },

  setActiveProfile: (id) => {
    set({ activeProfileId: id });
  },
}));
