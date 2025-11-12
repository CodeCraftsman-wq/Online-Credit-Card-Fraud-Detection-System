
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { cn, luhnCheck } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

const getCardBrand = (cardNumber: string): CardBrand => {
  if (cardNumber.startsWith('4')) {
    return 'visa';
  }
  if (/^5[1-5]/.test(cardNumber)) {
    return 'mastercard';
  }
  if (/^3[47]/.test(cardNumber)) {
    return 'amex';
  }
  return 'unknown';
};

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{1,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

interface CardInputProps {
  field: any; // ControllerRenderProps from react-hook-form
}

const VisaLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="24"
    viewBox="0 0 38 24"
    aria-label="Visa"
    role="img"
    className="size-full"
  >
    <path
      fill="#1A1F71"
      d="M35.25.125H2.75A2.75 2.75 0 0 0 0 2.875v18.25A2.75 2.75 0 0 0 2.75 24h32.5A2.75 2.75 0 0 0 38 21.125V2.875A2.75 2.75 0 0 0 35.25.125Z"
    />
    <path
      fill="#fff"
      d="m28.1 16.8-2.1-7.8h2.6L30 16.8h-1.9ZM16.6 8.9l-2.6 7.9-1.3-3.2-.9-4.7h-2.6l2.3 10.3h2.6l4.6-10.3h-2.5Zm12.5-2.1c0-.6-.3-1-.9-1-.4 0-.7.1-1.1.3v1.1c.3-.2.6-.3 1-.3.3 0 .5.1.5.4 0 .3-.1.4-.8.6-.7.2-1.2.4-1.2 1.1 0 .6.4 1 1.2 1 .5 0 1-.2 1.3-.4v-1.1c-.3.2-.7.3-1.1.3-.4 0-.6-.2-.6-.5s.2-.4.9-.6c.8-.2 1.2-.4 1.2-1.1ZM25.4 9.1h1.5c.9 0 1.5.3 1.9 1 .5.6.7 1.4.7 2.4 0 2.1-1.2 3.3-3.1 3.3h-2.8v-7.6h1.8v6.7c.6 0 1.1-.1 1.4-.4.3-.3.4-.7.4-1.3 0-1.2-.5-1.7-1.4-1.7h-1.2V9.1Z"
    />
  </svg>
);

const MastercardLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="24"
    viewBox="0 0 38 24"
    aria-label="Mastercard"
    role="img"
    className="size-full"
  >
    <path
      fill="#fff"
      d="M35.25.125H2.75A2.75 2.75 0 0 0 0 2.875v18.25A2.75 2.75 0 0 0 2.75 24h32.5A2.75 2.75 0 0 0 38 21.125V2.875A2.75 2.75 0 0 0 35.25.125Z"
    />
    <circle cx="15" cy="12" r="7" fill="#EB001B" />
    <circle cx="23" cy="12" r="7" fill="#F79E1B" />
    <path
      fill="#FF5F00"
      d="M23 12c0-3.87-3.13-7-7-7v14c3.87 0 7-3.13 7-7Z"
    />
  </svg>
);

const AmexLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="24"
    viewBox="0 0 38 24"
    aria-label="American Express"
    role="img"
    className="size-full"
  >
    <path
      fill="#0077C8"
      d="M35.25.125H2.75A2.75 2.75 0 0 0 0 2.875v18.25A2.75 2.75 0 0 0 2.75 24h32.5A2.75 2.75 0 0 0 38 21.125V2.875A2.75 2.75 0 0 0 35.25.125Z"
    />
    <path
      fill="#fff"
      d="M19 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm-8.4 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm16.8 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
    />
    <path
      fill="#fff"
      d="M19.65 15.65h-1.3L15.4 9h2.3l1.2 4.2 1.2-4.2h2.3l-2.95 6.65Zm-8.4 0h-1.3L7 9h2.3l1.2 4.2 1.2-4.2h2.3l-2.95 6.65Zm16.8 0h-1.3l-2.95-6.65h2.3l1.2 4.2 1.2-4.2h2.3l-2.95 6.65Z"
    />
  </svg>
);


const BrandLogo = ({ brand }: { brand: CardBrand }) => {
    if (brand === 'unknown') return null;

    const logos = {
        visa: <VisaLogo />,
        mastercard: <MastercardLogo />,
        amex: <AmexLogo />,
    };

    return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-auto animate-in fade-in zoom-in-50">
            {logos[brand]}
        </div>
    );
};

export function CardInput({ field }: CardInputProps) {
  const { error } = useFormField();
  const [cardValue, setCardValue] = useState(field.value || '');
  const [brand, setBrand] = useState<CardBrand>('unknown');

  const isValid = useMemo(() => luhnCheck(cardValue.replace(/\s/g, '')), [cardValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    const rawValue = formattedValue.replace(/\s/g, '');
    setCardValue(formattedValue);
    setBrand(getCardBrand(rawValue));
    field.onChange(rawValue);
  };
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center">
        <CreditCard className="size-5 text-muted-foreground" />
      </div>
      
      <Input
        {...field}
        value={cardValue}
        onChange={handleChange}
        placeholder="0000 0000 0000 0000"
        className={cn('pl-12 pr-16', error ? 'border-destructive' : (isValid ? 'border-green-500' : ''))}
        maxLength={19}
      />
      
      <BrandLogo brand={brand} />
      
      {isValid && !error && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <CheckCircle2 className="size-5 text-green-500 animate-in fade-in zoom-in-50" />
        </div>
      )}
    </div>
  );
}
