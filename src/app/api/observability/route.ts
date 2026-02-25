import { NextResponse } from 'next/server';

// Simulated protocol metrics (would normally come from database/Redis cache)
const metrics = {
  tvl: 4_200_000_000,
  activeContracts: 12_500,
  defaultRate: 0.42,
  liquidityBuffer: 850_000_000,
  transactionVolume24h: 4_200_000_000,
  activeOperators: 142,
  pendingAudits: 12,
  systemHealth: 99.9,
  blockFinalityTime: 1.2,
  activeValidators: 842,
  totalValidators: 850,
  gasPrice: 14,
  networkLoad: 75,
  yieldDistribution: [
    { range: '0-5%', count: 2100, percentage: 16.8 },
    { range: '5-10%', count: 4800, percentage: 38.4 },
    { range: '10-15%', count: 3900, percentage: 31.2 },
    { range: '15-20%', count: 1200, percentage: 9.6 },
    { range: '20%+', count: 500, percentage: 4.0 },
  ],
};

export async function GET() {
  // Add slight variation to simulate live data
  const liveMetrics = {
    ...metrics,
    activeContracts: metrics.activeContracts + Math.floor(Math.random() * 10 - 5),
    systemHealth: +(metrics.systemHealth + (Math.random() * 0.2 - 0.1)).toFixed(1),
    networkLoad: Math.floor(metrics.networkLoad + Math.random() * 10 - 5),
    gasPrice: Math.floor(metrics.gasPrice + Math.random() * 4 - 2),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(liveMetrics);
}
