// ============================================================
// Quantara Type System — Core Domain Models
// ============================================================

// ======================== AUTH ========================

export type UserRole = 'borrower' | 'lender' | 'operator';

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ======================== INCOME ========================

export interface IncomeSource {
  id: string;
  userId: string;
  type: 'salary' | 'freelance' | 'business' | 'investment' | 'rental' | 'other';
  name: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  verifiedAt?: string;
  volatility: number;
  stabilityIndex: number;
  historicalEarnings: MonthlyEarning[];
  createdAt: string;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
  verified: boolean;
}

export interface IncomeAnalytics {
  totalVerifiedIncome: number;
  averageMonthly: number;
  variance: number;
  stabilityIndex: number;
  depositFrequency: string;
  sourceVariation: number;
  ytdTotal: number;
}

// ======================== RISK ENGINE ========================

export interface RiskInputs {
  incomeStability: number;
  repaymentHistory: number;
  sectorCoefficient: number;
  liquidityBuffer: number;
}

export interface RiskProfile {
  id: string;
  userId: string;
  riskScore: number;
  probabilityOfDefault: number;
  confidenceBand: [number, number];
  tier: RiskTier;
  inputs: RiskInputs;
  lastCalculated: string;
  history: RiskScoreEntry[];
}

export interface RiskScoreEntry {
  date: string;
  score: number;
  probabilityOfDefault: number;
}

export type RiskTier = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';

// ======================== CONTRACTS ========================

export type ContractStatus = 'CREATED' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';

export interface StructuredContract {
  id: string;
  borrowerId: string;
  nftId: string;
  principal: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  status: ContractStatus;
  riskTier: RiskTier;
  riskScore: number;
  fundedAmount: number;
  repaymentSchedule: RepaymentEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface RepaymentEntry {
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'late' | 'missed';
  paidAt?: string;
}

// ======================== CAPITAL ========================

export interface CapitalPool {
  id: string;
  name: string;
  totalCapital: number;
  deployedCapital: number;
  availableCapital: number;
  targetYield: number;
  actualYield: number;
  riskTierFilter: RiskTier[];
  investorCount: number;
  contracts: string[];
  createdAt: string;
}

export interface InvestmentPosition {
  id: string;
  investorId: string;
  poolId: string;
  amount: number;
  entryDate: string;
  currentValue: number;
  yield: number;
  status: 'active' | 'matured' | 'withdrawn';
}

// ======================== INSURANCE ========================

export interface InsuranceVault {
  id: string;
  poolId: string;
  totalReserve: number;
  coverageRatio: number;
  claimsPaid: number;
  status: 'active' | 'depleted' | 'suspended';
  createdAt: string;
}

// ======================== COMPLIANCE ========================

export type FlagSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ComplianceFlag {
  id: string;
  contractId?: string;
  userId?: string;
  type: 'fraud_alert' | 'kyc_issue' | 'volatility_flag' | 'rate_limit' | 'blacklist';
  severity: FlagSeverity;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

// ======================== OBSERVABILITY ========================

export interface ProtocolMetrics {
  tvl: number;
  activeContracts: number;
  defaultRate: number;
  liquidityBuffer: number;
  yieldDistribution: YieldBucket[];
  transactionVolume24h: number;
  activeOperators: number;
  pendingAudits: number;
  systemHealth: number;
  blockFinalityTime: number;
  activeValidators: number;
  totalValidators: number;
  gasPrice: number;
  networkLoad: number;
}

export interface YieldBucket {
  range: string;
  count: number;
  percentage: number;
}

export interface TransactionEvent {
  id: string;
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: string;
  blockNumber?: number;
  txHash?: string;
}

export type EventType =
  | 'ContractCreated'
  | 'CapitalAllocated'
  | 'RepaymentReceived'
  | 'DefaultTriggered'
  | 'RiskUpdated'
  | 'ComplianceFlagged'
  | 'InsuranceTriggered'
  | 'PoolRebalanced';

// ======================== TERMINAL ========================

export interface MarketplaceContract {
  id: string;
  borrower: string;
  sector: string;
  tier: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B';
  tranche: 'Senior' | 'Mezzanine' | 'Junior';
  principal: number;
  yield: string;
  term: string;
  coverage: string;
  riskScore: number;
  status: 'OPEN' | 'FUNDED' | 'ACTIVE' | 'PENDING';
  incomeStability: number;
}

export interface TerminalState {
  contracts: MarketplaceContract[];
  selectedContract: MarketplaceContract | null;
  filters: {
    riskTier: RiskTier[];
    tranche: ('Senior' | 'Mezzanine' | 'Junior')[];
    search: string;
  };
  totalDeployed: number;
  weightedYield: number;
  defaultExposure: number;
  insuranceCoverage: number;
}

// ======================== UI STATE ========================

export type PageState = 'loading' | 'error' | 'empty' | 'ready' | 'updating' | 'transaction-pending';

export interface PageMeta {
  state: PageState;
  error?: string;
  lastUpdated?: string;
}
