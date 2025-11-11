'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import type { Transaction } from '@/lib/types';
import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';
import { TransactionForm } from '@/components/dashboard/transaction-form';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { TransactionHistory } from '@/components/dashboard/transaction-history';
import { cn } from '@/lib/utils';
import { PlexusBackground } from '@/components/ui/plexus-background';
import { Loader2 } from 'lucide-react';
import { EmailAlertCard } from '@/components/dashboard/email-alert-card';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [currentPrediction, setCurrentPrediction] =
    useState<FraudPredictionOutput | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!user && !isUserLoading && auth) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
      });
    }
  }, [user, isUserLoading, auth]);

  const handleNewTransaction = (transaction: Transaction) => {
    setCurrentPrediction(transaction.prediction);
    // The transaction history component will now update from Firestore directly.
  };
  
  const animationClass = (delay: string) =>
    cn(
      'opacity-0 animate-fade-in-down fill-mode-forwards',
      isMounted ? `animation-delay-[${delay}]` : ''
    );

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2">Connecting to Secure Server...</p>
      </div>
    );
  }

  return (
    <main className="relative flex-1 overflow-hidden">
       <PlexusBackground className="opacity-50 dark:opacity-30" />
       <div className="relative p-4 md:p-6 lg:p-8">
         <div className="mx-auto grid max-w-7xl auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
           <div className={cn('grid gap-4 lg:col-span-1', animationClass('200ms'))}>
             <TransactionForm onNewTransaction={handleNewTransaction} userId={user.uid} />
             <EmailAlertCard />
           </div>
           <div className={cn('grid gap-4 lg:col-span-2', animationClass('400ms'))}>
              <PredictionResult prediction={currentPrediction} />
              <TransactionHistory userId={user.uid} />
           </div>
         </div>
      </div>
    </main>
  );
}
