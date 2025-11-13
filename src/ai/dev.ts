import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-transaction-data.ts';
import '@/ai/flows/real-time-fraud-prediction.ts';
import '@/ai/flows/fraud-prediction.ts';
import '@/ai/flows/generate-synthetic-transactions.ts';
import '@/ai/flows/generate-card-details.ts';
