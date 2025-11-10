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
  reasoning: z.string().describe('A brief explanation of why the transaction is or is not considered fraudulent, based on the provided data.'),
});
export type FraudPredictionOutput = z.infer<typeof FraudPredictionOutputSchema>;

export async function predictFraud(input: FraudPredictionInput): Promise<FraudPredictionOutput> {
  return predictFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudPredictionPrompt',
  input: {schema: FraudPredictionInputSchema},
  output: {schema: FraudPredictionOutputSchema},
  prompt: `You are a sophisticated fraud detection expert for a financial services company. Your task is to analyze transaction data in real-time and provide a fraud assessment.

Analyze the following transaction details based on common fraud indicators:
- High transaction amounts (e.g., > 50,000 INR is high risk).
- Unusual transaction times (e.g., 1 AM - 6 AM is higher risk).
- High-risk locations (e.g., international or known high-fraud regions).
- Vague or suspicious merchant details (e.g., "Unknown Vendor", "Quick Cash").

Transaction Amount: {{{amount}}} INR
Transaction Time: {{{time}}}
Transaction Location: {{{location}}}
Merchant Details: {{{merchantDetails}}}

Based on these details, determine if the transaction is fraudulent, provide a confidence score (0 to 1), and a concise reasoning for your decision. The reasoning should be a single sentence explaining the key factors that influenced your prediction.
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
