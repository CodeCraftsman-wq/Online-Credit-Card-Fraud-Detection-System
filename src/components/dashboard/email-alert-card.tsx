'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { sendFraudAlertEmail } from '@/app/actions';

const formSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required.' }),
});

type EmailFormValues = z.infer<typeof formSchema>;

export function EmailAlertCard() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: EmailFormValues) {
    setIsSending(true);

    const { success, error } = await sendFraudAlertEmail(values.email);

    if (error || !success) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send Alert',
        description: error || 'An unknown error occurred.',
      });
    } else {
      toast({
        title: 'Alert Sent (Simulated)',
        description: `An alert has been logged for ${values.email}.`,
      });
      form.reset();
    }

    setIsSending(false);
  }

  return (
    <Card className="glassmorphic transition-shadow duration-300 ease-out hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader>
        <CardTitle>Send Fraud Alert</CardTitle>
        <CardDescription>
          Manually send an alert to an administrator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="admin@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-full font-semibold transition-all duration-150 ease-in-out active:scale-95 active:opacity-75 hover:opacity-90" disabled={isSending}>
              {isSending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSending ? 'Sending...' : 'Send Alert'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
