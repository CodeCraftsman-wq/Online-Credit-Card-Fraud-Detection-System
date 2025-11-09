'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'user@example.com',
      password: 'password',
    },
  });

  function onSubmit() {
    setIsLoggingIn(true);
    // In a real app, you'd handle authentication here.
    // For this demo, we'll just navigate to the dashboard after a short delay.
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  }

  const animationClass = (delay: string) =>
    cn(
      'opacity-0 animate-fade-in-slide-up fill-mode-forwards',
      isMounted ? `animation-delay-[${delay}]` : ''
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className={cn("mx-auto mb-4", animationClass('0ms'))}>
            <Logo className="size-12" />
          </div>
          <div className={cn(animationClass('200ms'))}>
            <CardTitle className="text-2xl">Fraud Detection System</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className={cn(animationClass('400ms'))}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn(animationClass('600ms'))}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn(animationClass('800ms'))}>
                <Button
                  type="submit"
                  className="w-full rounded-full font-semibold transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 active:opacity-75"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoggingIn ? 'Logging in...' : 'Log In'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
       <div
        className={cn(
          "absolute bottom-4 text-center text-sm text-muted-foreground",
          animationClass('1000ms')
        )}
      >
        <p>&copy; {new Date().getFullYear()} Made by Agnik Konar</p>
      </div>
    </div>
  );
}
