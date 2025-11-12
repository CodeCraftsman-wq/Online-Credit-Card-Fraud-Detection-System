
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      scale: {
        '101': '1.01',
      },
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'row-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.98)',
            backgroundColor: 'hsl(var(--accent) / 0.2)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            backgroundColor: 'transparent',
          },
        },
        'gemini-shimmer': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
            color: '#4285F4', // Blue
          },
          '25%': {
            color: '#E06981', // Pink/Red
          },
          '50%': {
            transform: 'rotate(180deg) scale(1.2)',
            color: '#8869E0', // Purple
          },
          '75%': {
            color: '#69BDE0', // Light Blue
          },
          '100%': {
            transform: 'rotate(360deg) scale(1)',
            color: '#4285F4', // Blue
          },
        },
        'spin-slow': {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'spinner-ease': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spinner-dot-fade': {
          '0%': {
            transform: 'scale(0.1)',
            opacity: '0',
          },
          '39%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(0.1)',
            opacity: '0',
          },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'row-in': 'row-in 0.75s ease-out',
        'gemini-shimmer': 'gemini-shimmer 2s infinite ease-in-out',
        'spin-slow': 'spin-slow 5s linear infinite',
        'spinner-ease': 'spinner-ease 2.5s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography'), 
  function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.glowing-border': {
            '@apply relative overflow-hidden rounded-lg p-px': {},
        },
        '.glowing-border::before': {
            content: "''",
            '@apply absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--secondary))_50%,hsl(var(--primary))_100%)] z-[-1]': {},
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
      });
    },
  ],
} satisfies Config;
