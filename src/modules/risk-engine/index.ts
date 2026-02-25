// ============================================================
// Risk Engine Module — Isolated Domain Logic
// ============================================================

import type { RiskInputs, RiskProfile, RiskTier } from '@/types';
import {
  calculateRiskScore,
  calculateProbabilityOfDefault,
  calculateConfidenceBand,
  scoreToTier,
  tierToLabel,
  calculateIncomeStabilityIndex,
  calculateVolatility,
  calculateCoverageRatio,
  calculateDTI,
} from '@/lib/risk-math';
import { generateId, getTimestamp } from '@/lib/utils';

export class RiskEngine {
  private static instance: RiskEngine;

  static getInstance(): RiskEngine {
    if (!RiskEngine.instance) {
      RiskEngine.instance = new RiskEngine();
    }
    return RiskEngine.instance;
  }

  assess(userId: string, inputs: RiskInputs): RiskProfile {
    const score = calculateRiskScore(inputs);
    const pod = calculateProbabilityOfDefault(score);
    const band = calculateConfidenceBand(score);
    const tier = scoreToTier(score);

    return {
      id: generateId('RISK'),
      userId,
      riskScore: score,
      probabilityOfDefault: pod,
      confidenceBand: band,
      tier,
      inputs,
      lastCalculated: getTimestamp(),
      history: [
        {
          date: getTimestamp(),
          score,
          probabilityOfDefault: pod,
        },
      ],
    };
  }

  reassess(existing: RiskProfile, newInputs: RiskInputs): RiskProfile {
    const score = calculateRiskScore(newInputs);
    const pod = calculateProbabilityOfDefault(score);
    const band = calculateConfidenceBand(score);
    const tier = scoreToTier(score);

    return {
      ...existing,
      riskScore: score,
      probabilityOfDefault: pod,
      confidenceBand: band,
      tier,
      inputs: newInputs,
      lastCalculated: getTimestamp(),
      history: [
        ...existing.history,
        { date: getTimestamp(), score, probabilityOfDefault: pod },
      ],
    };
  }

  computeIncomeStability(earnings: number[]): number {
    return calculateIncomeStabilityIndex(earnings);
  }

  computeVolatility(values: number[]): number {
    return calculateVolatility(values);
  }

  computeCoverageRatio(income: number, obligations: number): number {
    return calculateCoverageRatio(income, obligations);
  }

  computeDTI(totalDebt: number, totalIncome: number): number {
    return calculateDTI(totalDebt, totalIncome);
  }

  getTierLabel(tier: RiskTier): string {
    return tierToLabel(tier);
  }

  isEligible(score: number, minScore: number = 40): boolean {
    return score >= minScore;
  }

  getRecommendedLimit(score: number, income: number): number {
    // Higher score = higher limit multiplier
    const multiplier = (score / 100) * 0.5 + 0.1;
    return Math.round(income * multiplier);
  }
}

export const riskEngine = RiskEngine.getInstance();
