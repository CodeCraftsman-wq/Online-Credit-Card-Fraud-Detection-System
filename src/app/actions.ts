'use server';

import { predictFraud } from '@/ai/flows/real-time-fraud-prediction';
import { analyzeTransactionData } from '@/ai/flows/analyze-transaction-data';
import type { Transaction, TransactionInput } from '@/lib/types';
import { z } from 'zod';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';
import { getAuth } from 'firebase/auth';

const transactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required.'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  merchantDetails: z.string().min(1, 'Merchant details are required.'),
  userId: z.string().min(1, 'User ID is required.'),
});

export async function simulateAndPredictTransaction(
  input: TransactionInput & { userId: string }
): Promise<{ data: Transaction | null; error: string | null }> {
  const validation = transactionSchema.safeParse(input);
  if (!validation.success) {
    return { data: null, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const { id, userId, ...predictionInput } = validation.data;
    const prediction = await predictFraud(predictionInput);
    
    const newTransaction: Transaction = {
      ...validation.data,
      prediction,
    };

    // Save to Firestore
    const { firestore } = initializeFirebase();
    const transactionRef = doc(firestore, `users/${userId}/transactions/${id}`);
    
    // We are not using the non-blocking version here because we want to ensure
    // the data is saved before returning the success response.
    // This is a server action, so blocking is acceptable.
    await setDoc(transactionRef, newTransaction);
    
    return { data: newTransaction, error: null };
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
