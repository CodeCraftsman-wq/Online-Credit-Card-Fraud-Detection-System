'use client';

import { useEffect, useState } from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import type { Transaction } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Target, AlertTriangle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
}

function AnimatedCounter({ end }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500;
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    const increment = Math.max(Math.floor((end - start) / totalFrames), 1);
    let currentFrame = 0;

    const counter = setInterval(() => {
      start += increment;
      currentFrame++;
      if (start >= end || currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [inView, end]);

  return (
    <span ref={ref} className="font-sans text-4xl font-bold">
      {count}
    </span>
  );
}

export function SystemStatsWidget({ userId }: { userId: string }) {
  const firestore = useFirestore();

  const transactionsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, `users/${userId}/transactions`) : null),
    [firestore, userId]
  );

  const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

  const totalAnalyzed = transactions?.length ?? 0;
  const fraudDetected =
    transactions?.filter((t) => t.prediction.isFraudulent).length ?? 0;

  if (isLoading && totalAnalyzed === 0) {
    return (
      <Card className="glassmorphic transition-transform-shadow duration-300 ease-out hover:scale-101 hover:shadow-2xl hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-medium">System Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around gap-4">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphic transition-transform-shadow duration-300 ease-out hover:scale-101 hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Real-Time Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around gap-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <Target className="size-5 text-primary" />
          <AnimatedCounter end={totalAnalyzed} />
          <p className="text-xs text-muted-foreground">Total Analyzed</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <AlertTriangle className="size-5 text-destructive" />
          <AnimatedCounter end={fraudDetected} />
          <p className="text-xs text-muted-foreground">Fraud Detected</p>
        </div>
      </CardContent>
    </Card>
  );
}
