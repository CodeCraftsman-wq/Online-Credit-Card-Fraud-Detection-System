'use server';

import { predictFraud } from '@/ai/flows/real-time-fraud-prediction';
import { analyzeTransactionData } from '@/ai/flows/analyze-transaction-data';
import type { Transaction, TransactionInput } from '@/lib/types';
import { z } from 'zod';


// This schema is now only for validating the input for the prediction.
// The userId is no longer needed here as it's a client-side concern.
const transactionInputSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  merchantDetails: z.string().min(1, 'Merchant details are required.'),
});

// The server action now ONLY performs the prediction and returns the result.
// It no longer interacts with Firestore.
export async function simulateAndPredictTransaction(
  input: Omit<TransactionInput, 'id'>
): Promise<{ data: Transaction['prediction'] | null; error: string | null }> {
  const validation = transactionInputSchema.safeParse(input);
  if (!validation.success) {
    return { data: null, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const prediction = await predictFraud(validation.data);
    return { data: prediction, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'Failed to get fraud prediction.' };
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
