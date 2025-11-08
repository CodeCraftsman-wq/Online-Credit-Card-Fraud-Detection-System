'use server';
/**
 * @fileOverview Real-time fraud prediction flow using a pre-trained model.
 *
 * - predictFraud - A function that handles the real-time fraud prediction process.
 * - FraudPredictionInput - The input type for the predictFraud function.
 * - FraudPredictionOutput - The return type for the predictFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudPredictionInputSchema = z.object({
  amount: z.number().describe('The transaction amount in INR.'),
  time: z.string().describe('The transaction time as a string.'),
  location: z.string().describe('The transaction location.'),
  merchantDetails: z.string().describe('Details of the merchant.'),
});
export type FraudPredictionInput = z.infer<typeof FraudPredictionInputSchema>;

const FraudPredictionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is predicted as fraudulent.'),
  confidenceScore: z.number().describe('The confidence score of the fraud prediction.'),
});
export type FraudPredictionOutput = z.infer<typeof FraudPredictionOutputSchema>;

export async function predictFraud(input: FraudPredictionInput): Promise<FraudPredictionOutput> {
  return predictFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudPredictionPrompt',
  input: {schema: FraudPredictionInputSchema},
  output: {schema: FraudPredictionOutputSchema},
  prompt: `You are a fraud detection expert. Given the transaction details, predict if it is fraudulent.

Transaction Amount: {{{amount}}}
Transaction Time: {{{time}}}
Transaction Location: {{{location}}}
Merchant Details: {{{merchantDetails}}}

Based on these details, determine if the transaction is fraudulent and provide a confidence score between 0 and 1.
`,
});

const predictFraudFlow = ai.defineFlow(
  {
    name: 'predictFraudFlow',
    inputSchema: FraudPredictionInputSchema,
    outputSchema: FraudPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
