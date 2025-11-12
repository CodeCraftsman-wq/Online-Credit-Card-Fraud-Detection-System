'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const alerts = [
  { text: "High-risk transaction of ₹85,000 detected in Bangalore" },
  { text: "Atypical international purchase of $1,200 flagged in New York" },
  { text: "Multiple rapid transactions detected on card ending in 4028" },
  { text: "Anomalous transaction time: 3:15 AM for ₹50,000 in Delhi" },
  { text: "Suspicious merchant 'QuickCash' flagged in Goa" },
  { text: "Large gift card purchase of ₹30,000 detected" },
];

// Duplicate the alerts to create a seamless loop
const extendedAlerts = [...alerts, ...alerts];

export function FraudAlertTicker() {
  return (
    <div className="relative mx-auto max-w-xl w-full overflow-hidden whitespace-nowrap rounded-full bg-card/60 backdrop-blur-xl border border-border/20 p-2 text-sm text-muted-foreground shadow-inner">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center justify-center w-12 bg-gradient-to-r from-card/80 via-card/50 to-transparent">
            <AlertTriangle className="size-5 text-destructive" />
        </div>
        <div className="inline-block animate-marquee">
            {extendedAlerts.map((alert, index) => (
            <span key={index} className="mx-4">
                {alert.text}
                <span className="text-primary mx-2">&#x2022;</span>
            </span>
            ))}
        </div>
        <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card/80 via-card/50 to-transparent"></div>
    </div>
  );
}
