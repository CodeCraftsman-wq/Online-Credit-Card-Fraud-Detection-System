'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { cn, luhnCheck } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';
import Image from 'next/image';

const cardBrands = {
  visa: { regex: /^4/, logo: '/cards/visa.svg' },
  mastercard: { regex: /^5[1-5]/, logo: '/cards/mastercard.svg' },
  amex: { regex: /^3[47]/, logo: '/cards/amex.svg' },
  discover: { regex: /^6(?:011|5)/, logo: '/cards/discover.svg' },
  diners: { regex: /^3(?:0[0-5]|[68])/, logo: '/cards/diners.svg' },
  jcb: { regex: /^(?:2131|1800|35)/, logo: '/cards/jcb.svg' },
};

type CardBrand = keyof typeof cardBrands;

function getCardBrand(cardNumber: string): CardBrand | null {
  for (const brand in cardBrands) {
    if (cardBrands[brand as CardBrand].regex.test(cardNumber)) {
      return brand as CardBrand;
    }
  }
  return null;
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
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

export function CardInput({ field }: CardInputProps) {
  const { error } = useFormField();
  const [cardValue, setCardValue] = useState(field.value || '');

  const cardBrand = useMemo(() => getCardBrand(cardValue.replace(/\s/g, '')), [cardValue]);
  const isValid = useMemo(() => luhnCheck(cardValue.replace(/\s/g, '')), [cardValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardValue(formattedValue);
    field.onChange(formattedValue.replace(/\s/g, ''));
  };
  
  const brandLogo = cardBrand ? cardBrands[cardBrand].logo : null;

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center [perspective:1000px]">
        <div 
          className={cn(
            "relative w-full h-full transition-transform duration-500 transform-style-3d",
            cardBrand && 'rotate-y-180'
          )}
        >
          <div className="absolute w-full h-full backface-hidden">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            {brandLogo && (
              <Image 
                src={brandLogo} 
                alt={`${cardBrand} logo`} 
                width={24} 
                height={24} 
                className="object-contain"
              />
            )}
          </div>
        </div>
      </div>
      
      <Input
        {...field}
        value={cardValue}
        onChange={handleChange}
        placeholder="0000 0000 0000 0000"
        className={cn('pl-12 pr-10', error ? 'border-destructive' : (isValid ? 'border-green-500' : ''))}
        maxLength={19}
      />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isValid && !error && (
          <CheckCircle2 className="size-5 text-green-500 animate-in fade-in zoom-in-50" />
        )}
      </div>
    </div>
  );
}
