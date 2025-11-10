'use server';
/**
 * @fileOverview Flow to generate synthetic transaction data.
 *
 * - generateSyntheticTransactions - Generates a list of synthetic transactions.
 * - GenerateTransactionsInput - Input schema for the flow.
 * - GenerateTransactionsOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the shape of a single transaction for generation purposes.
// It excludes fields that will be added later (like id, userId, prediction).
const TransactionSchema = z.object({
  amount: z.coerce.number(),
  time: z.string(),
  location: z.string(),
  merchantDetails: z.string(),
});

const GenerateTransactionsInputSchema = z.object({
  count: z
    .number()
    .min(1)
    .max(20)
    .describe('The number of synthetic transactions to generate.'),
});
export type GenerateTransactionsInput = z.infer<
  typeof GenerateTransactionsInputSchema
>;

const GenerateTransactionsOutputSchema = z.array(TransactionSchema);
export type GenerateTransactionsOutput = z.infer<
  typeof GenerateTransactionsOutputSchema
>;

export async function generateSyntheticTransactions(
  input: GenerateTransactionsInput
): Promise<GenerateTransactionsOutput> {
  return generateTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTransactionsPrompt',
  input: { schema: GenerateTransactionsInputSchema },
  output: { schema: GenerateTransactionsOutputSchema },
  prompt: `You are a data scientist creating a test dataset for a fraud detection system.
Your task is to generate a list of {{{count}}} synthetic transactions.

The data should be realistic and include a mix of both clearly legitimate transactions and transactions with suspicious characteristics.
Suspicious characteristics can include:
- Very high amounts (e.g., > 80000 INR).
- Transactions at odd hours (e.g., between 1 AM and 5 AM).
- Vague merchant details (e.g., "Cash Withdrawal", "Gift Card Purchase").
- International locations.
- Multiple transactions in different cities in a short period.

Generate a diverse set of transactions. For the time, use a realistic ISO 8601 format string.
`,
});

const generateTransactionsFlow = ai.defineFlow(
  {
    name: 'generateTransactionsFlow',
    inputSchema: GenerateTransactionsInputSchema,
    outputSchema: GenerateTransactionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || [];
  }
);
