import { create } from 'zustand';
import type { CapitalPool, InvestmentPosition, StructuredContract } from '@/types';

interface CapitalStore {
  pools: CapitalPool[];
  positions: InvestmentPosition[];
  selectedPool: string | null;

  nlv: number;
  excessLiquidity: number;
  dailyPnl: number;
  marginUtilization: number;

  allocateCapital: (poolId: string, amount: number, investorId: string) => void;
  selectPool: (poolId: string | null) => void;
}

const initialPools: CapitalPool[] = [
  {
    id: 'pool-001',
    name: 'Yield Gen A — Prime',
    totalCapital: 2_100_000_000,
    deployedCapital: 1_680_000_000,
    availableCapital: 420_000_000,
    targetYield: 12.4,
    actualYield: 11.8,
    riskTierFilter: ['AAA', 'AA'],
    investorCount: 42,
    contracts: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pool-002',
    name: 'Yield Gen B — Growth',
    totalCapital: 800_000_000,
    deployedCapital: 520_000_000,
    availableCapital: 280_000_000,
    targetYield: 4.1,
    actualYield: 3.9,
    riskTierFilter: ['A', 'BBB'],
    investorCount: 28,
    contracts: [],
    createdAt: new Date().toISOString(),
  },
];

export const useCapitalStore = create<CapitalStore>((set, get) => ({
  pools: initialPools,
  positions: [],
  selectedPool: null,

  nlv: 4_285_192.44,
  excessLiquidity: 1_892_301.12,
  dailyPnl: 24_105.80,
  marginUtilization: 42.8,

  allocateCapital: (poolId, amount, investorId) => {
    const position: InvestmentPosition = {
      id: `pos-${Date.now()}`,
      investorId,
      poolId,
      amount,
      entryDate: new Date().toISOString(),
      currentValue: amount,
      yield: 0,
      status: 'active',
    };

    set((state) => ({
      positions: [...state.positions, position],
      pools: state.pools.map(p =>
        p.id === poolId
          ? {
              ...p,
              deployedCapital: p.deployedCapital + amount,
              availableCapital: p.availableCapital - amount,
              investorCount: p.investorCount + 1,
            }
          : p
      ),
    }));
  },

  selectPool: (poolId) => {
    set({ selectedPool: poolId });
  },
}));
