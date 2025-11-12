
'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { cn, luhnCheck } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';

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


export function CardInput({ field }: CardInputProps) {
  const { error } = useFormField();
  const [cardValue, setCardValue] = useState(field.value || '');
  const rawValue = cardValue.replace(/\s/g, '');

  const isValid = useMemo(() => luhnCheck(rawValue), [rawValue]);
  const showInvalid = !isValid && rawValue.length > 4;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardValue(formattedValue);
    field.onChange(formattedValue.replace(/\s/g, ''));
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
        className={cn('pl-12 pr-12', error ? 'border-destructive' : (isValid ? 'border-green-500' : ''))}
        maxLength={19}
      />
      
      {isValid && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <CheckCircle2 className="size-5 text-green-500 animate-in fade-in zoom-in-50" />
        </div>
      )}
      
      {showInvalid && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <XCircle className="size-5 text-destructive animate-in fade-in zoom-in-50" />
        </div>
      )}
    </div>
  );
}
