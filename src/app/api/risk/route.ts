import { NextResponse } from 'next/server';
import {
  calculateRiskScore,
  calculateProbabilityOfDefault,
  calculateConfidenceBand,
  scoreToTier,
} from '@/lib/risk-math';
import type { RiskInputs } from '@/types';
import { z } from 'zod';

const riskInputSchema = z.object({
  userId: z.string(),
  incomeStability: z.number().min(0).max(100),
  repaymentHistory: z.number().min(0).max(100),
  sectorCoefficient: z.number().min(0.5).max(1.5),
  liquidityBuffer: z.number().min(0).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = riskInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { userId, ...inputValues } = parsed.data;
    const inputs: RiskInputs = inputValues;

    const riskScore = calculateRiskScore(inputs);
    const probabilityOfDefault = calculateProbabilityOfDefault(riskScore);
    const confidenceBand = calculateConfidenceBand(riskScore);
    const tier = scoreToTier(riskScore);

    const result = {
      userId,
      riskScore,
      probabilityOfDefault,
      confidenceBand,
      tier,
      inputs,
      calculatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return risk engine metadata
  return NextResponse.json({
    engine: 'QNT-RISK-V2',
    version: '2.0.4',
    weights: {
      incomeStability: 0.35,
      repaymentHistory: 0.30,
      sectorCoefficient: 0.15,
      liquidityBuffer: 0.20,
    },
    tiers: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'],
    status: 'online',
  });
}
