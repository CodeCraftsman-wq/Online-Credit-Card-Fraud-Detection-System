import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';

export interface TransactionInput {
  amount: number;
  time: string;
  location: string;
  merchantDetails: string;
}

export interface Transaction extends TransactionInput {
  id: string;
  prediction: FraudPredictionOutput;
}
