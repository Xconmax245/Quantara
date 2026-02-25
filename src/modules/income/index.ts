// ============================================================
// Income Module — Revenue Stream Management
// ============================================================

import type { IncomeSource, IncomeAnalytics, MonthlyEarning } from '@/types';
import { calculateIncomeStabilityIndex, calculateVolatility } from '@/lib/risk-math';
import { generateId, getTimestamp } from '@/lib/utils';

export class IncomeManager {
  private static instance: IncomeManager;

  static getInstance(): IncomeManager {
    if (!IncomeManager.instance) {
      IncomeManager.instance = new IncomeManager();
    }
    return IncomeManager.instance;
  }

  addIncomeSource(params: {
    userId: string;
    type: IncomeSource['type'];
    name: string;
    amount: number;
    frequency: IncomeSource['frequency'];
  }): IncomeSource {
    const { userId, type, name, amount, frequency } = params;

    return {
      id: generateId('INC'),
      userId,
      type,
      name,
      amount,
      frequency,
      volatility: 0,
      stabilityIndex: 100,
      historicalEarnings: [],
      createdAt: getTimestamp(),
    };
  }

  addEarning(source: IncomeSource, month: string, amount: number, verified: boolean = false): IncomeSource {
    const earning: MonthlyEarning = { month, amount, verified };
    const earnings = [...source.historicalEarnings, earning];
    const amounts = earnings.map((e) => e.amount);

    return {
      ...source,
      historicalEarnings: earnings,
      volatility: calculateVolatility(amounts),
      stabilityIndex: calculateIncomeStabilityIndex(amounts),
    };
  }

  computeAnalytics(sources: IncomeSource[]): IncomeAnalytics {
    const allEarnings = sources.flatMap((s) => s.historicalEarnings);
    const amounts = allEarnings.map((e) => e.amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const avg = amounts.length > 0 ? total / amounts.length : 0;

    return {
      totalVerifiedIncome: allEarnings.filter((e) => e.verified).reduce((s, e) => s + e.amount, 0),
      averageMonthly: Math.round(avg * 100) / 100,
      variance: calculateVolatility(amounts),
      stabilityIndex: calculateIncomeStabilityIndex(amounts),
      depositFrequency: this.inferFrequency(sources),
      sourceVariation: sources.length > 1 ? this.computeSourceVariation(sources) : 0,
      ytdTotal: total,
    };
  }

  private inferFrequency(sources: IncomeSource[]): string {
    const freqs = sources.map((s) => s.frequency);
    if (freqs.includes('bi-weekly')) return 'Bi-Weekly';
    if (freqs.includes('monthly')) return 'Monthly';
    if (freqs.includes('weekly')) return 'Weekly';
    return 'Mixed';
  }

  private computeSourceVariation(sources: IncomeSource[]): number {
    const amounts = sources.map((s) => s.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    if (mean === 0) return 0;
    const maxDev = Math.max(...amounts.map((a) => Math.abs(a - mean)));
    return Math.round((maxDev / mean) * 10000) / 100;
  }
}

export const incomeManager = IncomeManager.getInstance();
