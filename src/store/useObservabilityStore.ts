import { create } from 'zustand';
import type { ProtocolMetrics, ComplianceFlag, TransactionEvent } from '@/types';

interface ObservabilityStore {
  metrics: ProtocolMetrics;
  complianceFlags: ComplianceFlag[];
  recentEvents: TransactionEvent[];
  systemLogs: { time: string; message: string; highlight?: boolean }[];
  isLive: boolean;

  updateMetrics: (partial: Partial<ProtocolMetrics>) => void;
  addEvent: (event: TransactionEvent) => void;
  addFlag: (flag: ComplianceFlag) => void;
  resolveFlag: (flagId: string) => void;
  toggleLive: () => void;
}

const initialMetrics: ProtocolMetrics = {
  tvl: 4_200_000_000,
  activeContracts: 12_500,
  defaultRate: 0.42,
  liquidityBuffer: 850_000_000,
  yieldDistribution: [
    { range: '0-5%', count: 2100, percentage: 16.8 },
    { range: '5-10%', count: 4800, percentage: 38.4 },
    { range: '10-15%', count: 3900, percentage: 31.2 },
    { range: '15-20%', count: 1200, percentage: 9.6 },
    { range: '20%+', count: 500, percentage: 4.0 },
  ],
  transactionVolume24h: 4_200_000_000,
  activeOperators: 142,
  pendingAudits: 12,
  systemHealth: 99.9,
  blockFinalityTime: 1.2,
  activeValidators: 842,
  totalValidators: 850,
  gasPrice: 14,
  networkLoad: 75,
};

const initialFlags: ComplianceFlag[] = [
  {
    id: 'flag-001',
    type: 'fraud_alert',
    severity: 'critical',
    title: 'Pattern Mismatch: Velocity Spike',
    description: 'Wallet 0x7...9a initiated 400 micro-transactions in <1s.',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'flag-002',
    type: 'kyc_issue',
    severity: 'high',
    title: 'KyC Verification Lag',
    description: 'Institutional ID verification timeout on node US-EAST-4.',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
];

const initialLogs = [
  { time: '14:02:55', message: 'Risk parameter updated by Admin_01' },
  { time: '14:01:20', message: 'Batch settlement #9921 confirmed' },
  { time: '13:58:44', message: 'New compliance rule set deployed', highlight: true },
  { time: '13:55:12', message: 'API Rate limit adjusted for client_x' },
];

export const useObservabilityStore = create<ObservabilityStore>((set) => ({
  metrics: initialMetrics,
  complianceFlags: initialFlags,
  recentEvents: [],
  systemLogs: initialLogs,
  isLive: true,

  updateMetrics: (partial) => {
    set((state) => ({
      metrics: { ...state.metrics, ...partial },
    }));
  },

  addEvent: (event) => {
    set((state) => ({
      recentEvents: [event, ...state.recentEvents].slice(0, 100),
    }));
  },

  addFlag: (flag) => {
    set((state) => ({
      complianceFlags: [flag, ...state.complianceFlags],
    }));
  },

  resolveFlag: (flagId) => {
    set((state) => ({
      complianceFlags: state.complianceFlags.map(f =>
        f.id === flagId ? { ...f, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : f
      ),
    }));
  },

  toggleLive: () => {
    set((state) => ({ isLive: !state.isLive }));
  },
}));
