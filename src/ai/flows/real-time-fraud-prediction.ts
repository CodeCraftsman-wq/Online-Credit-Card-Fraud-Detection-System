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
  cardNumber: z.string().describe('The credit card number used for the transaction. This is a critical piece of information for fraud analysis.'),
});
export type FraudPredictionInput = z.infer<typeof FraudPredictionInputSchema>;

const FraudPredictionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is predicted as fraudulent.'),
  confidenceScore: z.number().describe('The confidence score of the fraud prediction.'),
  reasoning: z.string().describe('A brief, single-sentence explanation of the key factors that influenced the prediction.'),
  riskFactors: z.array(z.object({
    factor: z.string().describe('The name of the risk factor (e.g., "High amount", "Unusual location").'),
    score: z.number().describe('The numeric contribution of this factor to the overall confidence score (e.g., 0.45).')
  })).describe('A breakdown of individual risk factors and their contribution to the fraud score. This should only be populated if the transaction is fraudulent.')
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
- Card number patterns (e.g., new vs. known card, velocity of use).

Card Number: {{{cardNumber}}}
Transaction Amount: {{{amount}}} INR
Transaction Time: {{{time}}}
Transaction Location: {{{location}}}
Merchant Details: {{{merchantDetails}}}

Based on these details, determine if the transaction is fraudulent, provide a confidence score (0 to 1), and a concise reasoning for your decision.

If the transaction is fraudulent, you MUST provide a 'riskFactors' array. Each item in the array should represent a reason for the fraud flag and its estimated contribution to the total confidence score.
For example: [
  { "factor": "High transaction amount", "score": 0.45 },
  { "factor": "Unusual location", "score": 0.32 }
]
The sum of the risk factor scores should approximate the overall confidenceScore.

If the transaction is NOT fraudulent, the 'riskFactors' array should be empty.
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
