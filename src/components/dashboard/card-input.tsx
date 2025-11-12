
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 30" width="48" height="30" className="size-full">
      <path fill="#1a1f71" d="M48 3.2V26.8c0 1.8-1.4 3.2-3.2 3.2H3.2C1.4 30 0 28.6 0 26.8V3.2C0 1.4 1.4 0 3.2 0h41.6C46.6 0 48 1.4 48 3.2z"/>
      <path fill="#fff" d="M22.8 19.9l-1.1-7.1h2.2l1.1 7.1h-2.2zm-6.2-7.1l-2.9 9.8-1.5-9.8h-2.6l2.3 12.3h2.6l4.6-12.3h-2.5zm19.6-2.7c0-1.2-.7-1.8-2.1-1.8-.7 0-1.4.3-1.9.6v1.7c.4-.3.9-.4 1.4-.4.6 0 1 .3 1 .8s-.3.7-1.2.9c-1.1.3-1.8.7-1.8 1.6 0 .9.8 1.5 2 1.5.8 0 1.5-.3 2.1-.6v-1.7c-.5.3-1.1.5-1.6.5-.7 0-1.1-.3-1.1-.8 0-.5.4-.7 1.4-.9.9-.3 1.6-.7 1.6-1.6zm-11.4 4.8h1.8c.7 0 1.3-.2 1.7-.7.4-.5.6-1.2.6-2.1 0-1.3-.4-2.2-1.2-2.7-.8-.5-2-.8-3.5-.8h-2.9v12.3h2.5V14.9zm13.1-4.8l-1.9 12.3h2.4l1.9-12.3h-2.4z"/>
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

    
