
'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarRail
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Home, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

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
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleLogout}
        disabled={isLoggingOut}
        tooltip={{ children: 'Log Out' }}
      >
        <LogOut />
        <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">FraudShield</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className='flex items-center justify-between'>
              <LogoutButton />
              <ThemeToggle />
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
