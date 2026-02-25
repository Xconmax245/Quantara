// ============================================================
// Insurance Module — Default Coverage & Vault Management
// ============================================================

import type { InsuranceVault } from '@/types';
import { generateId, getTimestamp } from '@/lib/utils';

export class InsuranceManager {
  private static instance: InsuranceManager;

  static getInstance(): InsuranceManager {
    if (!InsuranceManager.instance) {
      InsuranceManager.instance = new InsuranceManager();
    }
    return InsuranceManager.instance;
  }

  createVault(poolId: string, initialReserve: number, coverageRatio: number): InsuranceVault {
    return {
      id: generateId('INS'),
      poolId,
      totalReserve: initialReserve,
      coverageRatio,
      claimsPaid: 0,
      status: 'active',
      createdAt: getTimestamp(),
    };
  }

  processClaim(vault: InsuranceVault, claimAmount: number): InsuranceVault {
    if (claimAmount > vault.totalReserve) {
      return {
        ...vault,
        totalReserve: 0,
        claimsPaid: vault.claimsPaid + vault.totalReserve,
        status: 'depleted',
      };
    }

    return {
      ...vault,
      totalReserve: vault.totalReserve - claimAmount,
      claimsPaid: vault.claimsPaid + claimAmount,
    };
  }

  isHealthy(vault: InsuranceVault, requiredCoverageRatio: number = 0.1): boolean {
    return vault.coverageRatio >= requiredCoverageRatio && vault.status === 'active';
  }
}

export const insuranceManager = InsuranceManager.getInstance();
