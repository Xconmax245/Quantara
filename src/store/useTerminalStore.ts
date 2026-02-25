import { create } from 'zustand';

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

interface TerminalStore {
  contracts: MarketplaceContract[];
  selectedContract: MarketplaceContract | null;
  searchQuery: string;
  filterTranche: string[];

  setSearch: (query: string) => void;
  selectContract: (contract: MarketplaceContract | null) => void;
  setFilterTranche: (tranches: string[]) => void;
  getFilteredContracts: () => MarketplaceContract[];
}

const initialContracts: MarketplaceContract[] = [
  { id: 'QNT-4201', borrower: 'B-7892', sector: 'Technology', tier: 'AA', tranche: 'Senior', principal: 250000, yield: '5.4%', term: '24mo', coverage: '2.3x', riskScore: 82, status: 'OPEN', incomeStability: 91 },
  { id: 'QNT-4202', borrower: 'B-3341', sector: 'Healthcare', tier: 'A', tranche: 'Mezzanine', principal: 180000, yield: '9.1%', term: '18mo', coverage: '1.7x', riskScore: 74, status: 'ACTIVE', incomeStability: 85 },
  { id: 'QNT-4203', borrower: 'B-5510', sector: 'Real Estate', tier: 'BBB', tranche: 'Junior', principal: 120000, yield: '14.2%', term: '12mo', coverage: '1.3x', riskScore: 62, status: 'OPEN', incomeStability: 72 },
  { id: 'QNT-4204', borrower: 'B-9988', sector: 'Finance', tier: 'AAA', tranche: 'Senior', principal: 500000, yield: '4.1%', term: '36mo', coverage: '2.8x', riskScore: 91, status: 'FUNDED', incomeStability: 96 },
  { id: 'QNT-4205', borrower: 'B-2204', sector: 'Manufacturing', tier: 'AA', tranche: 'Senior', principal: 340000, yield: '5.8%', term: '24mo', coverage: '2.1x', riskScore: 79, status: 'ACTIVE', incomeStability: 88 },
  { id: 'QNT-4206', borrower: 'B-6617', sector: 'Energy', tier: 'BB', tranche: 'Junior', principal: 95000, yield: '16.5%', term: '12mo', coverage: '1.2x', riskScore: 55, status: 'PENDING', incomeStability: 64 },
  { id: 'QNT-4207', borrower: 'B-1180', sector: 'Services', tier: 'A', tranche: 'Mezzanine', principal: 210000, yield: '8.7%', term: '18mo', coverage: '1.6x', riskScore: 71, status: 'OPEN', incomeStability: 82 },
];

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  contracts: initialContracts,
  selectedContract: null,
  searchQuery: '',
  filterTranche: [],

  setSearch: (query) => set({ searchQuery: query }),

  selectContract: (contract) => set({ selectedContract: contract }),

  setFilterTranche: (tranches) => set({ filterTranche: tranches }),

  getFilteredContracts: () => {
    const { contracts, searchQuery, filterTranche } = get();
    return contracts.filter(c => {
      const matchesSearch = !searchQuery || c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.sector.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTranche = filterTranche.length === 0 || filterTranche.includes(c.tranche);
      return matchesSearch && matchesTranche;
    });
  },
}));
