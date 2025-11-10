'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { FraudPredictionOutput } from '@/ai/flows/real-time-fraud-prediction';
import { ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface PredictionResultProps {
  prediction: FraudPredictionOutput | null;
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  const isFraudulent = prediction?.isFraudulent;
  const confidence = (prediction?.confidenceScore ?? 0) * 100;
  const reasoning = prediction?.reasoning;

  const status =
    prediction === null
      ? 'pending'
      : isFraudulent
      ? 'fraud'
      : 'legitimate';

  const statusConfig = {
    pending: {
      Icon: HelpCircle,
      title: 'Awaiting Transaction',
      description: 'Submit a transaction to see the prediction.',
      colorClass: 'text-muted-foreground',
      progressClass: 'bg-muted',
    },
    fraud: {
      Icon: ShieldAlert,
      title: 'Potential Fraud Detected',
      description: 'This transaction shows patterns of fraudulent activity.',
      colorClass: 'text-destructive',
      progressClass: 'bg-destructive',
    },
    legitimate: {
      Icon: ShieldCheck,
      title: 'Transaction appears Legitimate',
      description: 'This transaction seems normal.',
      colorClass: 'text-green-600',
      progressClass: 'bg-green-600',
    },
  };

  const { Icon, title, description, colorClass, progressClass } =
    statusConfig[status];

  return (
    <Card
      className="relative overflow-hidden"
    >
      <CardHeader>
        <CardTitle>Real-time Prediction</CardTitle>
        <CardDescription>
          AI-powered analysis of the latest transaction.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
        {prediction && (
           <div className="absolute top-4 right-4 animate-in fade-in zoom-in">
             <div
               className={cn(
                 "flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10",
                 isFraudulent ? 'bg-destructive' : 'bg-green-600'
               )}
             >
               <Icon className={cn('size-6', colorClass)} />
             </div>
           </div>
        )}
        <div data-state={prediction ? 'open' : 'closed'} className="w-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {prediction === null ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <Icon className="size-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            ) : (
                <>
                  <p className={cn('text-2xl font-bold', colorClass)}>{title}</p>
                  <p className="text-muted-foreground">{description}</p>
                  <div className="w-full pt-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Confidence Score</span>
                        <span className={colorClass}>{confidence.toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={confidence}
                        className="mt-2 h-2"
                        indicatorClassName={progressClass}
                      />
                    </div>
                    {reasoning && (
                      <>
                        <Separator />
                        <div className='space-y-2 text-left'>
                          <h4 className='font-medium text-sm'>AI Reasoning</h4>
                          <p className='text-sm text-muted-foreground italic'>
                            &quot;{reasoning}&quot;
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
