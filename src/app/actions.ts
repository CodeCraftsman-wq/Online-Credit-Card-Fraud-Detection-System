'use server';

import { predictFraud } from '@/ai/flows/real-time-fraud-prediction';
import { analyzeTransactionData } from '@/ai/flows/analyze-transaction-data';
import type { Transaction, TransactionInput } from '@/lib/types';
import { z } from 'zod';

const transactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required.'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  merchantDetails: z.string().min(1, 'Merchant details are required.'),
});

export async function simulateAndPredictTransaction(
  input: TransactionInput
): Promise<{ data: Transaction | null; error: string | null }> {
  const validation = transactionSchema.safeParse(input);
  if (!validation.success) {
    return { data: null, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const { id, ...predictionInput } = validation.data;
    const prediction = await predictFraud(predictionInput);
    const newTransaction: Transaction = {
      ...validation.data,
      // userId is removed as we are not using authentication now
      prediction,
    };
    
    return { data: newTransaction, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Failed to get fraud prediction.' };
  }
}

export async function analyzeTransactions(
  transactions: Transaction[]
): Promise<{ data: string | null; error: string | null }> {
    if (transactions.length === 0) {
        return { data: 'There are no transactions to analyze.', error: null };
    }
  try {
    const analysis = await analyzeTransactionData(JSON.stringify(transactions, null, 2));
    return { data: analysis, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Failed to analyze transaction data.' };
  }
}
