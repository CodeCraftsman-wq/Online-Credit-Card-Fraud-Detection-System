import { cn } from "@/lib/utils";

export function NextJsLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4", className)}
      aria-label="Next.js logomark"
      role="img"
      viewBox="0 0 180 180"
      width="32"
      height="32"
    >
      <mask
        id="a"
        style={{
          maskType: "alpha",
        }}
        width="180"
        height="180"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <circle cx="90" cy="90" r="90" fill="currentColor"></circle>
      </mask>
      <g mask="url(#a)">
        <path
          fill="currentColor"
          d="M149.53 167.13 73.87 59.37V167.13H54.2V12.87h19.67l75.66 107.76V12.87h19.67v154.26h-19.67Z"
        ></path>
      </g>
    </svg>
  );
}
