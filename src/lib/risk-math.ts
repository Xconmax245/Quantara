// ============================================================
// Quantara Risk Engine — Deterministic Scoring
// ============================================================

import type { RiskInputs, RiskTier } from '@/types';

/**
 * Quantara Risk Engine
 * 
 * Deterministic scoring model based on:
 * - Income Stability (0-100)
 * - Repayment History (0-100) 
 * - Sector Coefficient (0.5-1.5)
 * - Liquidity Buffer (0-100)
 * 
 * Output:
 * - riskScore (0-100)
 * - probabilityOfDefault (0-1)
 * - confidenceBand [lower, upper]
 */

const WEIGHTS = {
  incomeStability: 0.35,
  repaymentHistory: 0.30,
  sectorCoefficient: 0.15,
  liquidityBuffer: 0.20,
};

export function calculateRiskScore(inputs: RiskInputs): number {
  const normalizedSector = ((inputs.sectorCoefficient - 0.5) / 1.0) * 100;

  const weighted =
    inputs.incomeStability * WEIGHTS.incomeStability +
    inputs.repaymentHistory * WEIGHTS.repaymentHistory +
    normalizedSector * WEIGHTS.sectorCoefficient +
    inputs.liquidityBuffer * WEIGHTS.liquidityBuffer;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function calculateProbabilityOfDefault(riskScore: number): number {
  // Logistic decay: higher score = lower PoD
  const k = -0.08;
  const midpoint = 50;
  const pod = 1 / (1 + Math.exp(-k * (midpoint - riskScore))) * 0.3;
  return Math.round(pod * 10000) / 10000;
}

export function calculateConfidenceBand(
  riskScore: number,
  volatility: number = 0.05
): [number, number] {
  const halfWidth = riskScore * volatility;
  return [
    Math.max(0, Math.round(riskScore - halfWidth)),
    Math.min(100, Math.round(riskScore + halfWidth)),
  ];
}

export function scoreToTier(score: number): RiskTier {
  if (score >= 90) return 'AAA';
  if (score >= 80) return 'AA';
  if (score >= 70) return 'A';
  if (score >= 60) return 'BBB';
  if (score >= 50) return 'BB';
  if (score >= 40) return 'B';
  if (score >= 25) return 'CCC';
  return 'D';
}

export function tierToLabel(tier: RiskTier): string {
  const labels: Record<RiskTier, string> = {
    AAA: 'Prime',
    AA: 'High Grade',
    A: 'Upper Medium',
    BBB: 'Lower Medium',
    BB: 'Speculative',
    B: 'Highly Speculative',
    CCC: 'Substantial Risk',
    D: 'Default',
  };
  return labels[tier];
}

export function calculateIncomeStabilityIndex(earnings: number[]): number {
  if (earnings.length < 2) return 100;

  const mean = earnings.reduce((a, b) => a + b, 0) / earnings.length;
  if (mean === 0) return 0;

  const variance = earnings.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / earnings.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  // Lower coefficient of variation = higher stability
  return Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));
}

export function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function calculateCoverageRatio(income: number, obligations: number): number {
  if (obligations === 0) return 0;
  return Math.round((income / obligations) * 100) / 100;
}

export function calculateDTI(totalDebt: number, totalIncome: number): number {
  if (totalIncome === 0) return 100;
  return Math.round((totalDebt / totalIncome) * 10000) / 100;
}
