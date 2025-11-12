
'use client';

import { useMemo, useState } from 'react';
import type { Transaction } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, writeBatch } from 'firebase/firestore';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Loader2, Trash2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return query(
      collection(firestore, 'users', userId, 'transactions'),
      orderBy('time', 'desc')
    );
  }, [firestore, userId]);
  
  const { data: transactions, isLoading, error } = useCollection<Transaction>(transactionsQuery);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter(tx => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm.trim() === '' ||
        tx.merchantDetails.toLowerCase().includes(searchLower) ||
        tx.location.toLowerCase().includes(searchLower) ||
        tx.id.toLowerCase().includes(searchLower);

      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'fraud' && tx.prediction.isFraudulent) ||
        (filterStatus === 'legit' && !tx.prediction.isFraudulent);

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, filterStatus]);


  const handleClearHistory = async () => {
    if (!firestore || !userId) return;
    
    setIsClearing(true);
    toast({
      title: 'Clearing History...',
      description: 'Please wait while we remove all transactions.',
    });

    try {
      const transactionsCollectionRef = collection(firestore, `users/${userId}/transactions`);
      const querySnapshot = await getDocs(transactionsCollectionRef);
      
      if (querySnapshot.empty) {
        toast({ title: 'History is already empty.' });
        setIsClearing(false);
        return;
      }

      const batch = writeBatch(firestore);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      toast({
        title: 'Success!',
        description: 'Transaction history has been cleared.',
      });

    } catch (e: any) {
      console.error('Failed to clear history:', e);
      toast({
        variant: 'destructive',
        title: 'Error Clearing History',
        description: e.message || 'Could not clear transaction history.',
      });
    } finally {
      setIsClearing(false);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
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
    
    if (filteredTransactions.length > 0) {
      return filteredTransactions.map((tx, index) => (
        <TableRow 
            key={tx.id}
            className={cn(
                'border-b-white/5',
                 index === 0 && transactions?.length === filteredTransactions.length && 'animate-row-in'
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
            <span>No transactions found.</span>
             {searchTerm || filterStatus !== 'all' ? (
                <span className='text-xs'>Try adjusting your search or filters.</span>
             ) : (
                <span className='text-xs'>Simulate a transaction to see its history here.</span>
             )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const canPerformActions = !transactions || transactions.length === 0 || isLoading;
  const isFiltered = searchTerm.trim() !== '' || filterStatus !== 'all';

  return (
    <Card className="col-span-1 lg:col-span-2 glassmorphic transition-transform-shadow duration-300 ease-out hover:scale-101 hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              A log of all simulated transactions and their fraud status.
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={canPerformActions || isClearing}
                className="group text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-5 transition-transform group-hover:scale-110 group-active:scale-95" />
                <span className="sr-only">Clear History</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  transaction history records from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearHistory}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={isClearing}
                >
                  {isClearing ? <Loader2 className="mr-2 animate-spin" /> : null}
                  {isClearing ? 'Clearing...' : 'Yes, clear history'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by merchant, location, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
              disabled={isLoading || (!transactions && !isLoading)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus} disabled={isLoading || (!transactions && !isLoading)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="legit">Legitimate</SelectItem>
              <SelectItem value="fraud">Fraudulent</SelectItem>
            </SelectContent>
          </Select>
          {isFiltered && (
             <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-9 px-3 animate-in fade-in duration-300 animate-button-press"
              >
                <X className="mr-1.5 size-4" />
                Clear
              </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[30rem]">
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
  );
}
    

    
