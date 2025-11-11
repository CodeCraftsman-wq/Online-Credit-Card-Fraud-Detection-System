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

// This is a simplified schema of the Transaction object that the AI will see.
// We only include the data relevant for analysis.
const TransactionForAnalysisSchema = z.object({
  amount: z.number(),
  time: z.string(),
  location: z.string(),
  merchantDetails: z.string(),
  prediction: z.object({
    isFraudulent: z.boolean(),
    confidenceScore: z.number(),
    reasoning: z.string(),
  }),
});

const AnalyzeTransactionDataInputSchema = z.array(TransactionForAnalysisSchema).describe('An array of transaction objects, each with fields like amount, time, location, merchant details, and the initial fraud prediction.');
export type AnalyzeTransactionDataInput = z.infer<typeof AnalyzeTransactionDataInputSchema>;

const AnalyzeTransactionDataOutputSchema = z.string().describe('A summary of the analysis of the transaction data, highlighting any trends, patterns, or anomalies that could indicate fraudulent activity. The output should be formatted as markdown.');
export type AnalyzeTransactionDataOutput = z.infer<typeof AnalyzeTransactionDataOutputSchema>;

export async function analyzeTransactionData(input: AnalyzeTransactionDataInput): Promise<AnalyzeTransactionDataOutput> {
  return analyzeTransactionDataFlow(input);
}

const analyzeTransactionDataPrompt = ai.definePrompt({
  name: 'analyzeTransactionDataPrompt',
  input: {schema: z.object({ transactionsJson: z.string() })},
  output: {schema: AnalyzeTransactionDataOutputSchema},
  prompt: `You are a senior fraud analyst providing a high-level summary for a team meeting.
You have been given a list of recent transactions, each already flagged by a real-time system.
Your task is not to re-evaluate each transaction, but to identify and summarize broader patterns and trends from the dataset as a whole.

Focus on insights that would be valuable for a strategic review. Consider the following:
- **Concentration Risk:** Are fraudulent transactions clustered around specific merchants, locations, or times of day?
- **Behavioral Patterns:** Do you see any sequences of events that are suspicious (e.g., small test transactions followed by a large one)?
- **Anomaly Detection:** Are there any outliers that don't fit the typical fraud profile but are still flagged?
- **High-Value vs. Low-Value Fraud:** Is there a trend in the amounts being targeted?

Based on the provided transaction data, generate a concise, well-structured report in Markdown format.
Start with a high-level summary, then use headings and bullet points to detail specific patterns you've observed.

Transaction Data:
{{{transactionsJson}}}
`,
});

const analyzeTransactionDataFlow = ai.defineFlow(
  {
    name: 'analyzeTransactionDataFlow',
    inputSchema: AnalyzeTransactionDataInputSchema,
    outputSchema: AnalyzeTransactionDataOutputSchema,
  },
  async input => {
    // Convert the array of transactions into a JSON string before passing it to the prompt.
    const transactionsJson = JSON.stringify(input, null, 2);
    const {output} = await analyzeTransactionDataPrompt({ transactionsJson });
    return output!;
  }
);
