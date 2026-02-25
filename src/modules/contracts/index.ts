// ============================================================
// Contracts Module — Structured Contract Lifecycle
// ============================================================

import type { StructuredContract, ContractStatus, RepaymentEntry, RiskTier } from '@/types';
import { generateId, generateNFTId, getTimestamp } from '@/lib/utils';

const VALID_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  CREATED: ['FUNDED'],
  FUNDED: ['ACTIVE'],
  ACTIVE: ['COMPLETED', 'DEFAULTED'],
  COMPLETED: [],
  DEFAULTED: [],
};

export class ContractManager {
  private static instance: ContractManager;

  static getInstance(): ContractManager {
    if (!ContractManager.instance) {
      ContractManager.instance = new ContractManager();
    }
    return ContractManager.instance;
  }

  createContract(params: {
    borrowerId: string;
    principal: number;
    interestRate: number;
    term: number;
    riskTier: RiskTier;
    riskScore: number;
  }): StructuredContract {
    const { borrowerId, principal, interestRate, term, riskTier, riskScore } = params;

    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);

    const repaymentSchedule = this.generateRepaymentSchedule(monthlyPayment, term);

    return {
      id: generateId('CTR'),
      borrowerId,
      nftId: generateNFTId(),
      principal,
      interestRate,
      term,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      status: 'CREATED',
      riskTier,
      riskScore,
      fundedAmount: 0,
      repaymentSchedule,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
  }

  canTransition(current: ContractStatus, target: ContractStatus): boolean {
    return VALID_TRANSITIONS[current]?.includes(target) ?? false;
  }

  transition(contract: StructuredContract, target: ContractStatus): StructuredContract {
    if (!this.canTransition(contract.status, target)) {
      throw new Error(`Invalid transition: ${contract.status} → ${target}`);
    }

    return {
      ...contract,
      status: target,
      updatedAt: getTimestamp(),
    };
  }

  fundContract(contract: StructuredContract, amount: number): StructuredContract {
    const updated = {
      ...contract,
      fundedAmount: contract.fundedAmount + amount,
      updatedAt: getTimestamp(),
    };

    if (updated.fundedAmount >= updated.principal) {
      return this.transition(updated, 'FUNDED');
    }

    return updated;
  }

  private generateRepaymentSchedule(monthlyPayment: number, term: number): RepaymentEntry[] {
    const schedule: RepaymentEntry[] = [];
    const now = new Date();

    for (let i = 1; i <= term; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        dueDate: dueDate.toISOString(),
        amount: Math.round(monthlyPayment * 100) / 100,
        status: 'pending',
      });
    }

    return schedule;
  }
}

export const contractManager = ContractManager.getInstance();
