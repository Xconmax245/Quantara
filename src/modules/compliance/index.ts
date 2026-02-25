// ============================================================  
// Compliance Module — Regulatory Checks & Flag Management
// ============================================================

import type { ComplianceFlag } from '@/types';
import { generateId, getTimestamp } from '@/lib/utils';

export class ComplianceEngine {
  private static instance: ComplianceEngine;

  static getInstance(): ComplianceEngine {
    if (!ComplianceEngine.instance) {
      ComplianceEngine.instance = new ComplianceEngine();
    }
    return ComplianceEngine.instance;
  }

  createFlag(params: {
    type: ComplianceFlag['type'];
    severity: ComplianceFlag['severity'];
    title: string;
    description: string;
    contractId?: string;
    userId?: string;
  }): ComplianceFlag {
    return {
      id: generateId('FLG'),
      ...params,
      status: 'open',
      createdAt: getTimestamp(),
    };
  }

  resolveFlag(flag: ComplianceFlag): ComplianceFlag {
    return {
      ...flag,
      status: 'resolved',
      resolvedAt: getTimestamp(),
    };
  }

  runAutomatedChecks(transactionAmount: number, frequency: number): ComplianceFlag[] {
    const flags: ComplianceFlag[] = [];

    // Velocity check
    if (frequency > 100) {
      flags.push(
        this.createFlag({
          type: 'fraud_alert',
          severity: 'critical',
          title: 'High-velocity transaction pattern detected',
          description: `Transaction frequency of ${frequency}/min exceeds threshold of 100/min`,
        })
      );
    }

    // Large transaction check
    if (transactionAmount > 1_000_000) {
      flags.push(
        this.createFlag({
          type: 'fraud_alert',
          severity: 'high',
          title: 'Large transaction flagged for review',
          description: `Transaction of $${transactionAmount.toLocaleString()} requires manual approval`,
        })
      );
    }

    return flags;
  }
}

export const complianceEngine = ComplianceEngine.getInstance();
