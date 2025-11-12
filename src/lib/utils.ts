import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param cardNumber The credit card number string to validate.
 * @returns {boolean} True if the card number is valid, false otherwise.
 */
export function luhnCheck(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== 'string' || !/^\d+$/.test(cardNumber)) {
    return false;
  }

  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let isSecond = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isSecond = !isSecond;
  }

  return sum % 10 === 0;
}
