
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { AccentColorPicker } from '@/components/accent-color-picker';

function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // In a real app, you'd also handle token clearing here.
    // The animation takes 300ms, so we redirect after that.
    setTimeout(() => {
      router.push('/login');
    }, 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label="Log Out"
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="size-5" />
    </Button>
  );
}

function UserDisplay() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return null; // Or a loading skeleton
  }

  // The login is a mock, so the user object will be from anonymous sign-in
  // or a hardcoded one. We'll display a generic email.
  const displayEmail = user?.isAnonymous ? 'anonymous.user@fraudshield.io' : (user?.email || 'user@example.com');
  const userInitial = displayEmail ? displayEmail.charAt(0).toUpperCase() : '?';


  return (
    <div className="flex items-center gap-3">
       <div className="flex items-center gap-2 text-sm text-muted-foreground">
         <Avatar className="size-8 border">
            { user?.photoURL && <AvatarImage src={user.photoURL} alt="User avatar" /> }
            <AvatarFallback>
              <span className='sr-only'>{displayEmail}</span>
              {userInitial}
            </AvatarFallback>
         </Avatar>
         <span className="hidden md:inline">{displayEmail}</span>
      </div>
      <AccentColorPicker />
      <ThemeToggle />
      <LogoutButton />
    </div>
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
        <nav className="flex w-full items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">FraudShield</span>
          </Link>
          <UserDisplay />
        </nav>
      </header>
      {children}
    </div>
  );
}
