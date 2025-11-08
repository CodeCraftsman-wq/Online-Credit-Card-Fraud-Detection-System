'use client';

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { analyzeTransactions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Loader2, Info } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const { data, error } = await analyzeTransactions(transactions);
    if (error) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: error });
    }
    if (data) {
      setAnalysisResult(data);
      setIsDialogOpen(true);
    }
    setIsAnalyzing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A log of all simulated transactions and their fraud status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Badge
                          variant={
                            tx.prediction.isFraudulent
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={!tx.prediction.isFraudulent ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : ''}
                        >
                          {tx.prediction.isFraudulent ? 'Fraud' : 'Legit'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>{tx.location}</TableCell>
                      <TableCell>{tx.merchantDetails}</TableCell>
                      <TableCell>
                        {new Date(tx.time).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Info className="size-8" />
                        <span>No transactions yet.</span>
                        <span className='text-xs'>Simulate a transaction to see its history here.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || transactions.length === 0}
            className='ml-auto'
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LineChart className="mr-2 h-4 w-4" />
            )}
            Analyze All Transactions
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Transaction Data Analysis</DialogTitle>
            <DialogDescription>
              AI-generated summary of trends and anomalies in the transaction
              data.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] rounded-md border p-4">
            <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
