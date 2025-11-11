'use server';

import { predictFraud } from '@/ai/flows/real-time-fraud-prediction';
import { generateSyntheticTransactions } from '@/ai/flows/generate-synthetic-transactions';
import type { Transaction, TransactionInput } from '@/lib/types';
import { z } from 'zod';

const transactionInputSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  merchantDetails: z.string().min(1, 'Merchant details are required.'),
});

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

export async function generateAndPredictTransactions(
  count: number
): Promise<{ data: Omit<Transaction, 'userId'>[] | null; error: string | null }> {
  try {
    // 1. Generate synthetic transaction inputs
    const generatedTransactions = await generateSyntheticTransactions({ count });
    if (!generatedTransactions || generatedTransactions.length === 0) {
      return { data: null, error: 'Failed to generate transactions.' };
    }

    // 2. Run fraud prediction on each generated transaction
    const transactionsWithPredictions: Omit<Transaction, 'userId'>[] = [];

    for (const txInput of generatedTransactions) {
      try {
        const prediction = await predictFraud(txInput);
        transactionsWithPredictions.push({
          id: `txn-${crypto.randomUUID().slice(0, 8)}`,
          ...txInput,
          prediction,
        });
      } catch (e) {
        console.error('Skipping a transaction due to prediction error:', e);
        // Skip this transaction if prediction fails, but continue with others
      }
    }
    
    return { data: transactionsWithPredictions, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'Failed to generate synthetic data.' };
  }
}

const emailSchema = z.string().email('Please enter a valid email address.');

export async function sendFraudAlertEmail(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    // In a real application, you would integrate an email service like SendGrid,
    // Nodemailer, or a Firebase Extension (e.g., Trigger Email).
    // For this demo, we will just log to the console to simulate the action.
    console.log(`[SIMULATION] Sending fraud alert email to: ${validation.data}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, error: null };
  } catch (e: any) {
    console.error('Failed to send alert email:', e);
    return { success: false, error: e.message || 'An unknown error occurred.' };
  }
}
