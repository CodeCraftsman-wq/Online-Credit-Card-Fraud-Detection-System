'use server';

/**
 * @fileOverview Performs data analysis on transaction data to identify potential fraud patterns.
 *
 * - analyzeTransactionData - Analyzes transaction data and identifies potential fraud patterns.
 * - AnalyzeTransactionDataInput - The input type for the analyzeTransactionData function.
 * - AnalyzeTransactionDataOutput - The return type for the analyzeTransactionData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTransactionDataInputSchema = z.string().describe('A JSON string containing an array of transaction objects, each with fields like amount, time, location, and merchant details. Currency should be in INR (Rupees).');
export type AnalyzeTransactionDataInput = z.infer<typeof AnalyzeTransactionDataInputSchema>;

const AnalyzeTransactionDataOutputSchema = z.string().describe('A summary of the analysis of the transaction data, highlighting any trends, patterns, or anomalies that could indicate fraudulent activity.');
export type AnalyzeTransactionDataOutput = z.infer<typeof AnalyzeTransactionDataOutputSchema>;

export async function analyzeTransactionData(input: AnalyzeTransactionDataInput): Promise<AnalyzeTransactionDataOutput> {
  return analyzeTransactionDataFlow(input);
}

const analyzeTransactionDataPrompt = ai.definePrompt({
  name: 'analyzeTransactionDataPrompt',
  input: {schema: AnalyzeTransactionDataInputSchema},
  output: {schema: AnalyzeTransactionDataOutputSchema},
  prompt: `You are a fraud analyst examining transaction data to identify potential fraudulent activity.

Analyze the following transaction data and provide a summary of your findings, including any trends, patterns, or anomalies that could indicate fraud.

Transaction Data:
{{{input}}}

Respond in markdown format.
`,
});

const analyzeTransactionDataFlow = ai.defineFlow(
  {
    name: 'analyzeTransactionDataFlow',
    inputSchema: AnalyzeTransactionDataInputSchema,
    outputSchema: AnalyzeTransactionDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeTransactionDataPrompt(input);
    return output!;
  }
);
