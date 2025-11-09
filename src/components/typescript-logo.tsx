'use client';
import { cn } from "@/lib/utils";

export function TypeScriptLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={cn("size-5", className)}
    >
      <path fill="#1976d2" d="M48 24a24 24 0 1 1-48 0 24 24 0 0 1 48 0Z" />
      <path
        fill="#fff"
        d="M28.36 21.84h-4.32V35h-3.24V21.84h-4.32v-2.76h11.88v2.76ZM38.4 21.96c-1.2.72-2.52 1.2-3.96 1.44v-2.88c.96-.12 1.8-.48 2.52-1.08.6-.48 1.08-.96 1.44-1.68h2.64c-.48 1.56-1.32 2.88-2.64 3.96Z"
      />
      <path
        fill="#fff"
        d="M38.34 27.6c-1.2.72-2.52 1.2-3.96 1.44V26.4c.96-.12 1.8-.48 2.52-1.08.6-.48 1.08-.96 1.44-1.68h2.64c-.48 1.56-1.32 2.88-2.64 3.96Z"
      />
    </svg>
  );
}
