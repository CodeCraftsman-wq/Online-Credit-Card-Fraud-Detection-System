
import { cn } from "@/lib/utils";

export function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={cn("size-5", className)}
      fill="currentColor"
    >
      <path
        fill="#8E83E8"
        d="M24,4C12.95,4,4,12.95,4,24s8.95,20,20,20s20-8.95,20-20S35.05,4,24,4z M24,36c-2.21,0-4-1.79-4-4s1.79-4,4-4 s4,1.79,4,4S26.21,36,24,36z M28,24c0,2.21-1.79,4-4,4s-4-1.79-4-4s1.79-4,4-4S28,21.79,28,24z M24,12c-2.21,0-4-1.79-4-4 s1.79-4,4-4s4,1.79,4,4S26.21,12,24,12z"
      />
    </svg>
  );
}
