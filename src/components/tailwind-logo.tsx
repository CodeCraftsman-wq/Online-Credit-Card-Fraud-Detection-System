
import { cn } from "@/lib/utils";

export function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={cn("size-5", className)}
      fill="none"
    >
      <path
        fill="#38bdf8"
        d="M24,11.53Q12.94,11.53,8,16.27a1,1,0,0,0,1.41,1.41,10.15,10.15,0,0,1,14.59.09,1,1,0,0,0,1.41-1.41Q29.06,11.53,24,11.53Z"
      />
      <path
        fill="#38bdf8"
        d="M39.9,23.53Q28.84,23.53,23.9,28.27a1,1,0,0,0,1.41,1.41,10.15,10.15,0,0,1,14.59.09,1,1,0,0,0,1.41-1.41Q35,23.53,39.9,23.53Z"
      />
    </svg>
  );
}
