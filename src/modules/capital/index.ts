// ============================================================
// Capital Module — Pool & Allocation Management
// ============================================================

import type { CapitalPool, InvestmentPosition } from '@/types';
import { generateId, getTimestamp } from '@/lib/utils';

export class CapitalManager {
  private static instance: CapitalManager;

  static getInstance(): CapitalManager {
    if (!CapitalManager.instance) {
      CapitalManager.instance = new CapitalManager();
    }
    return CapitalManager.instance;
  }

  allocateToPool(pool: CapitalPool, amount: number, investorId: string): {
    pool: CapitalPool;
    position: InvestmentPosition;
  } {
    if (amount > pool.availableCapital) {
      throw new Error('Insufficient pool capacity');
    }

    const position: InvestmentPosition = {
      id: generateId('POS'),
      investorId,
      poolId: pool.id,
      amount,
      entryDate: getTimestamp(),
      currentValue: amount,
      yield: 0,
      status: 'active',
    };

    const updatedPool: CapitalPool = {
      ...pool,
      deployedCapital: pool.deployedCapital + amount,
      availableCapital: pool.availableCapital - amount,
      investorCount: pool.investorCount + 1,
    };

    return { pool: updatedPool, position };
  }

  calculateYield(position: InvestmentPosition, annualRate: number): InvestmentPosition {
    const entryDate = new Date(position.entryDate);
    const now = new Date();
    const daysDiff = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
    const dailyRate = annualRate / 100 / 365;
    const earnedYield = position.amount * dailyRate * daysDiff;

    return {
      ...position,
      currentValue: position.amount + earnedYield,
      yield: Math.round(earnedYield * 100) / 100,
    };
  }

  getPoolUtilization(pool: CapitalPool): number {
    if (pool.totalCapital === 0) return 0;
    return Math.round((pool.deployedCapital / pool.totalCapital) * 10000) / 100;
  }
}

export const capitalManager = CapitalManager.getInstance();
