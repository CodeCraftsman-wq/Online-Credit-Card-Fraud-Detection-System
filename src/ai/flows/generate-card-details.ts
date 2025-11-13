'use server';
/**
 * @fileOverview Flow to generate a synthetic credit card number and CVV.
 *
 * - generateCardDetails - Generates a single credit card number and CVV.
 * - GenerateCardDetailsOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { luhnCheck } from '@/lib/utils';

const GenerateCardDetailsOutputSchema = z.object({
  cardNumber: z.string()
    .length(16, "Card number must be 16 digits.")
    .refine(luhnCheck, 'Generated card number is not valid.'),
  cvv: z.string().length(3, "CVV must be 3 digits."),
});
export type GenerateCardDetailsOutput = z.infer<typeof GenerateCardDetailsOutputSchema>;

export async function generateCardDetails(): Promise<GenerateCardDetailsOutput> {
  return generateCardDetailsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateCardDetailsPrompt',
  output: { schema: GenerateCardDetailsOutputSchema },
  prompt: `You are a data compliance officer creating a test dataset.
Your task is to generate a single, realistic, but entirely synthetic 16-digit credit card number that passes the Luhn algorithm check.
You must also generate a corresponding realistic 3-digit CVV.

Ensure the generated card number is a string of exactly 16 digits and is mathematically valid according to the Luhn formula.
`,
});

const generateCardDetailsFlow = ai.defineFlow(
  {
    name: 'generateCardDetailsFlow',
    outputSchema: GenerateCardDetailsOutputSchema,
  },
  async () => {
    // Add retry logic in case the model fails to generate a valid number on the first try.
    for (let i = 0; i < 3; i++) {
      const { output } = await prompt();
      if (output && luhnCheck(output.cardNumber)) {
        return output;
      }
    }
    // If it fails after retries, throw an error.
    throw new Error('Failed to generate a valid card number after multiple attempts.');
  }
);
