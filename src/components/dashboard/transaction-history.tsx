'use client';

import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { analyzeTransactions } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDialogOpwn, setIsDialogOpen] = useState(false);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return query(
      collection(firestore, 'users', userId, 'transactions'),
      orderBy('time', 'desc')
    );
  }, [firestore, userId]);
  
  const { data: transactions, isLoading, error } = useCollection<Transaction>(transactionsQuery);

  const handleAnalyze = async () => {
    if (!transactions || transactions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'There are no transactions to analyze.',
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeTransactions(transactions);
      if (result.error || !result.data) {
        throw new Error(result.error || 'Analysis failed to return data.');
      }
      setAnalysisResult(result.data);
      setIsDialogOpen(true);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: err.message || 'An unexpected error occurred during analysis.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 size-6 animate-spin" />
              <span>Loading Transaction History...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
       return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
             Error loading transactions. Please try again later.
          </TableCell>
        </TableRow>
      );
    }
    
    if (transactions && transactions.length > 0) {
      return transactions.map((tx, index) => (
        <TableRow 
            key={tx.id}
            className={cn(
                'border-b-white/5',
                 index === 0 && transactions.length > 1 && 'animate-highlight'
            )}
        >
          <TableCell>
            <Badge
              variant={
                tx.prediction.isFraudulent
                  ? 'destructive'
                  : 'secondary'
              }
              className={!tx.prediction.isFraudulent ? 'bg-green-800/80 text-green-100 border-green-700' : 'border-red-700'}
            >
              {tx.prediction.isFraudulent ? 'Fraud' : 'Legit'}
            </Badge>
          </TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground">{tx.id}</TableCell>
          <TableCell className="text-right font-medium">
            {formatCurrency(tx.amount)}
          </TableCell>
          <TableCell className="text-muted-foreground">{tx.location}</TableCell>
          <TableCell className="text-muted-foreground">{tx.merchantDetails}</TableCell>
          <TableCell className="text-muted-foreground">
            {new Date(tx.time).toLocaleString()}
          </TableCell>
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Info className="size-8" />
            <span>No transactions yet.</span>
            <span className='text-xs'>Simulate a transaction to see its history here.</span>
          </div>
        </TableCell>
      </TableRow>
    );
  };


  return (
    <>
    <Card className="col-span-1 lg:col-span-2 glassmorphic">
      <CardHeader className='flex-row items-center justify-between'>
        <div className='space-y-1.5'>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
            A log of all simulated transactions and their fraud status.
            </CardDescription>
        </div>
        <Button 
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isLoading || !transactions || transactions.length === 0}
        >
            {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Bot className="mr-2 h-4 w-4" />
            )}
            Analyze History
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[26.5rem]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
    <Dialog open={isDialogOpwn} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Analysis Report</DialogTitle>
            <DialogDescription>
              AI-powered analysis of your recent transaction history.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4">
             <div
                className="prose prose-sm prose-invert"
                dangerouslySetInnerHTML={{ __html: analysisResult ? analysisResult.replace(/\n/g, '<br />') : '' }}
              />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
