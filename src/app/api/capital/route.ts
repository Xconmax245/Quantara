import { NextResponse } from 'next/server';

// Simulated capital pools
const pools = [
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
  },
];

export async function GET() {
  return NextResponse.json({
    pools,
    totalCapital: pools.reduce((sum, p) => sum + p.totalCapital, 0),
    totalDeployed: pools.reduce((sum, p) => sum + p.deployedCapital, 0),
  });
}
