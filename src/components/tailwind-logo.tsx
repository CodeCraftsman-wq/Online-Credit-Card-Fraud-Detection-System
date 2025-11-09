'use client';
import { cn } from "@/lib/utils";

export function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12.001 4.5c-4.141 0-7.5 3.358-7.5 7.5s3.359 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5Zm-.813 12.188c-1.25.125-2.053-.323-2.396-1.229l-.001-.001c-.342-.906.074-1.614 1.229-2.396l.001-.001c1.155-.781 2.27 0 2.926.906.657.906.492 2.053-.76 2.72Zm5.188-.813c-1.25.125-2.053-.323-2.396-1.229l-.001-.001c-.342-.906.074-1.614 1.229-2.396l.001-.001c1.155-.781 2.27 0 2.926.906.657.906.492 2.053-.76 2.72Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
