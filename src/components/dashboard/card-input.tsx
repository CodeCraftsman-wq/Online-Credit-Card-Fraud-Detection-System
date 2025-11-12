
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
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="30" viewBox="0 0 48 30" className="size-full">
        <path fill="#4285F4" d="M41.4,29.3C38.9,30.3,35,30,35,30H13c0,0-3.9,0.3-6.4-0.7C3.1,28.2,0,25.3,0,25.3V4.7c0,0,3.1-2.9,6.6-4 C9.1,0.3,13,0,13,0h22c0,0,3.9,0.3,6.4,1.3C44.9,2.4,48,5.3,48,5.3v20C48,25.3,44.9,28.2,41.4,29.3z" />
        <path fill="#FFF" d="M14.6,18.4l-1.9-8.3h2.3l1.2,5.7c0.2,0.9,0.4,1.8,0.5,2.4h0.1c0.1-0.6,0.3-1.5,0.5-2.4l1.2-5.7h2.3l-1.9,8.3H16.4z M23.9,10.1h-2.3l-0.5,8.3h2.3L23.9,10.1z M25.8,12.3c0-1.5,1-2.4,2.3-2.4c0.4,0,0.8,0.1,1.1,0.2V12c-0.3-0.1-0.7-0.2-1.1-0.2c-0.7,0-1.2,0.4-1.2,1.1c0,0.5,0.7,0.8,1.4,1.1c0.9,0.4,1.2,0.8,1.2,1.4c0,0.9-0.8,1.5-2.2,1.5c-0.5,0-1.1-0.1-1.5-0.3v-1.9c0.4,0.2,0.9,0.3,1.4,0.3c0.8,0,1.3-0.3,1.3-1c0-0.5-0.4-0.8-1.3-1.1C26.3,13.1,25.8,12.8,25.8,12.3z M35.3,12.2c1.1-1.2,2.4-1.8,3.9-1.8c1.6,0,2.8,0.6,3.6,1.4c0.8,0.8,1.2,1.9,1.2,3.3c0,1.4-0.4,2.5-1.2,3.3c-0.8,0.8-2,1.4-3.6,1.4c-1.5,0-2.8-0.6-3.9-1.8v1.6h-2V10.4h2V12.2z M37.1,17.4c0.6,0.6,1.4,0.9,2.2,0.9c0.8,0,1.6-0.3,2.2-0.9c0.6-0.6,0.9-1.4,0.9-2.3c0-0.9-0.3-1.7-0.9-2.3c-0.6-0.6-1.4-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9c-0.6,0.6-0.9,1.4-0.9,2.3C36.2,16,36.5,16.8,37.1,17.4z" />
    </svg>
);

const MastercardLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="30" viewBox="0 0 48 30" className="size-full">
        <path fill="#FF5F00" d="M24,15c0-5.5,4.5-10,10-10c5.5,0,10,4.5,10,10s-4.5,10-10,10C28.5,25,24,20.5,24,15z" />
        <path fill="#EB001B" d="M14,15c0-5.5,4.5-10,10-10c-1.9,0-3.6,0.5-5.1,1.5C15.5,8.6,14,11.6,14,15z" />
        <path fill="#F79E1B" d="M18.9,23.5c-2.9-2.1-4.9-5.6-4.9-9.5c0-3.9,2-7.3,4.9-9.5C16.4,6.4,14,10.4,14,15C14,19.6,16.4,23.6,18.9,23.5z" />
    </svg>
);

const AmexLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="30" viewBox="0 0 48 30" className="size-full">
        <path fill="#006FCF" d="M41.4,29.3C38.9,30.3,35,30,35,30H13c0,0-3.9,0.3-6.4-0.7C3.1,28.2,0,25.3,0,25.3V4.7c0,0,3.1-2.9,6.6-4 C9.1,0.3,13,0,13,0h22c0,0,3.9,0.3,6.4,1.3C44.9,2.4,48,5.3,48,5.3v20C48,25.3,44.9,28.2,41.4,29.3z" />
        <g fill="#FFF">
            <path d="M28,12.9h-1.6L24,20h2.3l0.7-1.4h3.3l0.4,1.4h2.1L28,12.9z M27.1,17.2l1-3.2l0.5,3.2H27.1z" />
            <path d="M33.6 12.9H32l-2.4 7.1h2.3l0.4-1.4h3.3l0.4 1.4H38L33.6 12.9zM33.1 17.2l1-3.2 0.5 3.2H33.1z" />
            <path d="M19.1,12.9h4.3v1.3h-3v1.8h2.8v1.3h-2.8v2.8h-1.3V12.9z" />
            <path d="M13.2,12.9h1.3v5.8h3v1.3h-4.3V12.9z" />
        </g>
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-auto animate-in fade-in zoom-in-50">
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
        <div className="absolute right-16 top-1/2 -translate-y-1/2">
          <CheckCircle2 className="size-5 text-green-500 animate-in fade-in zoom-in-50" />
        </div>
      )}
    </div>
  );
}

    