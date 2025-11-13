'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { simulateAndPredictTransaction, generateAndPredictTransactions, generateCardDetailsAction } from '@/app/actions';
import type { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, Clock, Hash, Loader2, MapPin, Sparkles, Store, Lock } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Separator } from '../ui/separator';
import { cn, luhnCheck } from '@/lib/utils';
import { CardInput } from './card-input';

const formSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(2, 'Location is required.'),
  merchantDetails: z.string().min(2, 'Merchant details are required.'),
  cardNumber: z.string()
    .min(13, 'Card number must be between 13 and 19 digits.')
    .max(19, 'Card number must be between 13 and 19 digits.')
    .refine(luhnCheck, 'The card number is not valid.'),
  cvv: z.string().min(3, 'CVV must be 3 or 4 digits.').max(4, 'CVV must be 3 or 4 digits.'),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onNewTransaction: (transaction: Transaction) => void;
  userId: string;
}

export function TransactionForm({ onNewTransaction, userId }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: `txn-${crypto.randomUUID().slice(0, 8)}`,
      amount: 1000,
      time: new Date().toISOString().slice(0, 16),
      location: 'Mumbai, India',
      merchantDetails: 'Online Store',
      cardNumber: '',
      cvv: '',
    },
  });

  const saveTransactionToFirestore = (transaction: Transaction) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Database Error', description: 'Firestore not initialized.' });
      return;
    }
    const transactionRef = doc(firestore, `users/${userId}/transactions/${transaction.id}`);
    
    setDoc(transactionRef, transaction)
      .then(() => {
        onNewTransaction(transaction);
      })
      .catch((err) => {
        console.error("Firestore write error:", err);
        const permissionError = new FirestorePermissionError({
          path: transactionRef.path,
          operation: 'create',
          requestResourceData: transaction,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Database Error',
          description: `Could not save transaction ${transaction.id} to history.`,
        });
      });
  };

  async function onSubmit(values: TransactionFormValues) {
    setIsSubmitting(true);
    
    const { data: prediction, error } = await simulateAndPredictTransaction(values);

    if (error || !prediction) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error || 'Failed to get fraud prediction.',
      });
      setIsSubmitting(false);
      return;
    }

    const newTransaction: Transaction = {
      ...values,
      userId,
      prediction,
    };
    
    saveTransactionToFirestore(newTransaction);
    
    toast({
      title: 'Success',
      description: 'Transaction simulated and stored in history.',
    });
    
    form.reset({
      ...form.getValues(),
      id: `txn-${crypto.randomUUID().slice(0, 8)}`,
      amount: Math.floor(Math.random() * 99000) + 1000,
      time: new Date().toISOString().slice(0, 16),
      cardNumber: '',
      cvv: '',
    });

    setIsSubmitting(false);
  }

  async function handleGenerateSamples() {
    setIsGenerating(true);
    toast({
      title: 'Generating Data...',
      description: 'The AI is creating synthetic transactions. This may take a moment.',
    });
    
    const { data: transactions, error } = await generateAndPredictTransactions(5);

    if (error || !transactions) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error || 'Could not generate synthetic data.',
      });
      setIsGenerating(false);
      return;
    }

    toast({
      title: 'Success!',
      description: `Generated ${transactions.length} transactions. Saving to history...`,
    });

    // Save each generated transaction to Firestore
    for (const tx of transactions) {
      const newTransaction: Transaction = {
        ...tx,
        userId,
      };
      // We don't await this so the UI can remain responsive
      saveTransactionToFirestore(newTransaction);
    }
    
    setIsGenerating(false);
  }

  async function handleGenerateCardDetails() {
    setIsGeneratingCard(true);
    toast({
      title: 'Generating Card Details...',
      description: 'The AI is creating a sample card number and CVV.',
    });

    const { data, error } = await generateCardDetailsAction();

    if (error || !data) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error || 'Could not generate card details.',
      });
    } else {
      form.setValue('cardNumber', data.cardNumber, { shouldValidate: true });
      form.setValue('cvv', data.cvv, { shouldValidate: true });
      toast({
        title: 'Card Details Generated!',
        description: 'The card number and CVV have been filled in.',
      });
    }
    setIsGeneratingCard(false);
  }

  return (
    <Card className="glassmorphic transition-shadow duration-300 ease-out hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader>
        <CardTitle>Simulate Transaction</CardTitle>
        <CardDescription>
          Enter transaction details manually or use AI to generate sample data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="generate">Generate Card</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <CardInput field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="123"
                                  maxLength={4}
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="txn-..."
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (INR)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="1000"
                            className="pl-10"
                            {...form.register('amount', { valueAsNumber: true })}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="e.g., Mumbai, India" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="merchantDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant Details</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder="e.g., Online Store" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-full font-semibold transition-all duration-150 ease-in-out active:scale-95 active:opacity-75 hover:opacity-90" disabled={isSubmitting || isGenerating || isGeneratingCard}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? 'Analyzing...' : 'Run Prediction'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="generate">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border bg-card/20 p-8 text-center min-h-[200px]">
                <div className='p-3 rounded-full bg-primary/10 border border-primary/20'>
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Generate with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Let the AI create a valid sample card number and CVV for your simulation. The details will be automatically filled into the form.
                </p>
                <Button
                  variant="secondary"
                  className="w-full max-w-xs"
                  onClick={handleGenerateCardDetails}
                  disabled={isGeneratingCard || isSubmitting || isGenerating}
                >
                  <Sparkles className={cn("mr-2 h-4 w-4", isGeneratingCard && "animate-gemini-shimmer")} />
                  {isGeneratingCard ? 'Generating...' : 'Generate Card Details'}
                </Button>
            </div>
          </TabsContent>
        </Tabs>
        <Separator className="my-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Need Sample Data?</p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGenerateSamples}
            disabled={isGenerating || isSubmitting}
          >
            <Sparkles className={cn("mr-2 h-4 w-4", isGenerating && "animate-gemini-shimmer")} />
            {isGenerating ? 'Generating...' : 'Generate 5 Full Transactions'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
