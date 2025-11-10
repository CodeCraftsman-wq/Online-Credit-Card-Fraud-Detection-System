'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';
import { TransactionForm } from '@/components/dashboard/transaction-form';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { TransactionHistory } from '@/components/dashboard/transaction-history';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

export default function DashboardPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [currentPrediction, setCurrentPrediction] =
    useState<FraudPredictionOutput | null>(null);

  useEffect(() => {
    // When the component mounts and the user is not logged in and we are not in a loading state,
    // then sign the user in anonymously.
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const handleNewTransaction = (transaction: Transaction) => {
    // The history is now managed by Firestore, but we still want to update
    // the real-time prediction result component.
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
           <TransactionHistory />
        </div>
      </div>
    </main>
  );
}
