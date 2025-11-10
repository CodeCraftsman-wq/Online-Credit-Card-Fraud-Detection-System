import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';

export interface TransactionInput {
  id: string;
  amount: number;
  time: string;
  location: string;
  merchantDetails: string;
}

export interface Transaction extends TransactionInput {
  userId: string; // Keep track of the owner
  prediction: FraudPredictionOutput;
}
