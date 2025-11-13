'use client';

import { useState, useEffect } from 'react';
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

function useTypingAnimation(text: string, speed = 30) {
  const [animatedText, setAnimatedText] = useState('');

  useEffect(() => {
    if (!text) {
      setAnimatedText('');
      return;
    }

    setAnimatedText('');
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setAnimatedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);
  
  return animatedText;
}


export function PredictionResult({ prediction }: { prediction: FraudPredictionOutput | null }) {
  const isFraudulent = prediction?.isFraudulent;
  const confidence = (prediction?.confidenceScore ?? 0) * 100;
  const reasoning = prediction?.reasoning ?? '';
  const riskFactors = prediction?.riskFactors ?? [];
  
  const animatedReasoning = useTypingAnimation(reasoning);


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
      title: 'Transaction Appears Legitimate',
      description: 'The transaction amount, time, and location are all consistent with typical, low-risk activity, with no immediate red flags identified.',
      colorClass: 'text-green-500',
      progressClass: 'bg-green-500',
    },
  };

  const { Icon, title, description, colorClass, progressClass } =
    statusConfig[status];

  return (
    <Card
      className="relative overflow-hidden glassmorphic transition-shadow duration-300 ease-out hover:shadow-2xl hover:shadow-primary/10"
    >
      <CardHeader>
        <CardTitle>Real-time Prediction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
        {prediction && (
           <div className="absolute top-4 right-4 animate-in fade-in zoom-in-50 duration-500">
             <div
               className={cn(
                 "flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10",
                 isFraudulent ? 'bg-destructive' : 'bg-green-500'
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
                      <div className='space-y-2 text-left p-3 bg-card/50 rounded-lg min-h-[5rem]'>
                        <h4 className='font-medium text-sm'>AI Reasoning</h4>
                        <p className='text-sm text-muted-foreground font-sans'>
                          {animatedReasoning}
                          { animatedReasoning.length === reasoning.length ? null : <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1"></span>}
                        </p>
                      </div>
                    )}
                    
                    {isFraudulent && riskFactors.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2 text-left">
                          <h4 className="font-medium text-sm">Key Risk Factors</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {riskFactors.map((item, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <span>- {item.factor}</span>
                                <span className="font-mono text-destructive/80">
                                  (+{item.score.toFixed(2)})
                                </span>
                              </li>
                            ))}
                          </ul>
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
