'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { simulateAndPredictTransaction } from '@/app/actions';
import type { Transaction, TransactionInput } from '@/lib/types';
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
import { Banknote, Clock, Hash, Loader2, MapPin, Store } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const formSchema = z.object({
  id: z.string().min(1, 'Transaction ID is required.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  time: z.string().min(1, 'Time is required.'),
  location: z.string().min(2, 'Location is required.'),
  merchantDetails: z.string().min(2, 'Merchant details are required.'),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onNewTransaction: (transaction: Transaction) => void;
  userId: string;
}

export function TransactionForm({ onNewTransaction, userId }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
  });

  async function onSubmit(values: TransactionFormValues) {
    setIsSubmitting(true);
    
    // 1. Get prediction from Server Action
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

    // 2. If prediction is successful, create the full transaction object
    const newTransaction: Transaction = {
      ...values,
      userId,
      prediction,
    };
    
    // 3. Save the full transaction object to Firestore from the client
    try {
      const transactionRef = doc(firestore, `users/${userId}/transactions/${newTransaction.id}`);
      
      // Using a non-blocking write with error handling
      setDoc(transactionRef, newTransaction)
        .then(() => {
          onNewTransaction(newTransaction);
          toast({
            title: 'Success',
            description: 'Transaction simulated and stored in history.',
          });
          form.reset({
            ...form.getValues(),
            id: `txn-${crypto.randomUUID().slice(0, 8)}`,
            amount: Math.floor(Math.random() * 99000) + 1000, // Random amount for next demo
            time: new Date().toISOString().slice(0, 16),
            location: 'Mumbai, India',
            merchantDetails: 'Online Store',
          });
        })
        .catch((err) => {
          console.error("Firestore write error:", err);
          const permissionError = new FirestorePermissionError({
            path: transactionRef.path,
            operation: 'create',
            requestResourceData: newTransaction,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Database Error',
            description: 'Could not save transaction to history.',
          });
        });

    } catch(e: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: e.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Simulate Transaction</CardTitle>
        <CardDescription>
          Enter transaction details to check for potential fraud.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Analyzing...' : 'Run Prediction'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
