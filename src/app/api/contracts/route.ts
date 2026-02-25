import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateId, generateNFTId } from '@/lib/utils';

const createContractSchema = z.object({
  borrowerId: z.string(),
  principal: z.number().positive(),
  interestRate: z.number().positive(),
  term: z.number().int().positive(),
  riskTier: z.string(),
  riskScore: z.number(),
});

// In-memory contract store (would be database in production)
const contracts: Record<string, unknown>[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { borrowerId, principal, interestRate, term, riskTier, riskScore } = parsed.data;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);

    const contract = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contracts.push(contract);

    return NextResponse.json(contract, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    contracts,
    total: contracts.length,
  });
}
