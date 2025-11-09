'use client';
import { cn } from "@/lib/utils";

export function FirebaseLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path d="M12.19 2.43a2 2 0 0 0-2.38 0l-7.33 4.23a2 2 0 0 0-1 1.74v8.52a2 2 0 0 0 1 1.74l7.33 4.23a2 2 0 0 0 2.38 0l7.33-4.23a2 2 0 0 0 1-1.74V8.4a2 2 0 0 0-1-1.74Z" />
    </svg>
  );
}
