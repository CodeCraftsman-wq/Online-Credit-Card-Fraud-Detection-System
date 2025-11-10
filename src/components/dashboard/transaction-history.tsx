'use client';

import type { Transaction } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A log of all simulated transactions and their fraud status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[28.5rem]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
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
                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
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
                  <TableCell colSpan={6} className="h-24 text-center">
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
    </Card>
  );
}
