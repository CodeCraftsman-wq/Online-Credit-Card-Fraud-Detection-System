'use client';

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';
import { TransactionForm } from '@/components/dashboard/transaction-form';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { TransactionHistory } from '@/components/dashboard/transaction-history';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPrediction, setCurrentPrediction] =
    useState<FraudPredictionOutput | null>(null);

  const handleNewTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    setCurrentPrediction(transaction.prediction);
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-1">
          <TransactionForm onNewTransaction={handleNewTransaction} />
        </div>
        <div className="grid gap-4 lg:col-span-2">
           <PredictionResult prediction={currentPrediction} />
           <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </main>
  );
}
