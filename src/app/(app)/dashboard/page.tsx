'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';
import { TransactionForm } from '@/components/dashboard/transaction-form';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { TransactionHistory } from '@/components/dashboard/transaction-history';
import { cn } from '@/lib/utils';
import { PlexusBackground } from '@/components/ui/plexus-background';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPrediction, setCurrentPrediction] =
    useState<FraudPredictionOutput | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNewTransaction = (transaction: Transaction) => {
    setCurrentPrediction(transaction.prediction);
    setTransactions((prev) => [transaction, ...prev]);
  };
  
  const animationClass = (delay: string) =>
    cn(
      'opacity-0 animate-fade-in-down fill-mode-forwards',
      isMounted ? `animation-delay-[${delay}]` : ''
    );

  return (
    <main className="relative flex-1 overflow-hidden">
       <PlexusBackground className="opacity-50 dark:opacity-30" />
       <div className="relative p-4 md:p-6 lg:p-8">
         <div className="mx-auto grid max-w-7xl auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
           <div className={cn('grid gap-4 lg:col-span-1', animationClass('200ms'))}>
             <TransactionForm onNewTransaction={handleNewTransaction} />
           </div>
           <div className={cn('grid gap-4 lg:col-span-2', animationClass('400ms'))}>
              <PredictionResult prediction={currentPrediction} />
              <TransactionHistory transactions={transactions} />
           </div>
         </div>
      </div>
    </main>
  );
}
