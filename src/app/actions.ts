'use server';

import { predictFraud } from '@/ai/flows/real-time-fraud-prediction';
import { analyzeTransactionData } from '@/ai/flows/analyze-transaction-data';
import type { Transaction, TransactionInput } from '@/lib/types';
import { z } from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import {getApps, initializeApp} from 'firebase-admin/app';
import { doc, setDoc } from 'firebase/firestore';
import { getSdks, initializeFirebase } from '@/firebase';

// Helper to get the firestore instance on the server
function getserverFirestore() {
  const apps = getApps();
  if (!apps.length) {
    // This will only be initialized once
    initializeApp();
  }
  return getFirestore();
}

// Re-usable non-blocking firestore write
function setDocumentNonBlocking(path: string, data: any) {
  const { firestore } = initializeFirebase();
  const docRef = doc(firestore, path);
  
  // This is a non-blocking call. We don't await it.
  // The client will see the update via its real-time listener.
  // We'll add error handling here as per the architecture.
  setDoc(docRef, data).catch(err => {
    // In a real app, you would emit this to a logging service.
    // For now, we just log it on the server.
    console.error(`Failed to write to Firestore at path: ${path}`, err);
  });
}


const transactionSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required.'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  merchantDetails: z.string().min(1, 'Merchant details are required.'),
});

export async function simulateAndPredictTransaction(
  input: TransactionInput,
  userId: string
): Promise<{ data: Transaction | null; error: string | null }> {
  const validation = transactionSchema.safeParse(input);
  if (!validation.success) {
    return { data: null, error: validation.error.errors.map(e => e.message).join(', ') };
  }
  if (!userId) {
    return { data: null, error: 'User is not authenticated.' };
  }

  try {
    const { id, ...predictionInput } = validation.data;
    const prediction = await predictFraud(predictionInput);
    const newTransaction: Transaction = {
      ...validation.data,
      userId,
      prediction,
    };
    
    // Save the new transaction to Firestore in a non-blocking way
    const transactionPath = `users/${userId}/transactions/${id}`;
    setDocumentNonBlocking(transactionPath, newTransaction);
    
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
