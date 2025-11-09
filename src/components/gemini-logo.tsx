'use client';
import { cn } from "@/lib/utils";

export function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path d="M12.59 2.59c.4-.4 1.05-.4 1.45 0l5.83 5.83c.4.4.4 1.05 0 1.45l-5.83 5.83c-.4.4-1.05.4-1.45 0l-5.83-5.83c-.4-.4-.4-1.05 0-1.45zM12 15.65l5.24-5.24L12 5.17 6.76 10.4l5.23 5.24zM2.61 14.83l5.83 5.83c.4.4 1.05.4 1.45 0l5.83-5.83c.4-.4.4-1.05 0-1.45l-5.83-5.83c-.4-.4-1.05-.4-1.45 0L2.6 13.38c-.4.4-.4 1.05.01 1.45z" />
    </svg>
  );
}
