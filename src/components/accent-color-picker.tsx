
'use client';

import * as React from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Define the structure for our color presets
interface ColorPreset {
  name: string;
  light: {
    primary: string; // HSL value
    primaryForeground: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
  };
}

// Inspired by OxygenOS and other modern UI color palettes
const colorPresets: ColorPreset[] = [
  {
    name: 'Default Blue',
    light: { primary: '221 83% 53%', primaryForeground: '210 40% 98%' },
    dark: { primary: '217 91% 60%', primaryForeground: '210 40% 98%' },
  },
  {
    name: 'Rose',
    light: { primary: '347 90% 59%', primaryForeground: '356 100% 97%' },
    dark: { primary: '347 81% 62%', primaryForeground: '356 100% 97%' },
  },
  {
    name: 'Emerald',
    light: { primary: '142 71% 45%', primaryForeground: '145 83% 96%' },
    dark: { primary: '142 63% 51%', primaryForeground: '145 83% 96%' },
  },
  {
    name: 'Amber',
    light: { primary: '36 97% 51%', primaryForeground: '45 100% 97%' },
    dark: { primary: '39 92% 55%', primaryForeground: '45 100% 97%' },
  },
  {
    name: 'Violet',
    light: { primary: '262 84% 58%', primaryForeground: '266 100% 97%' },
    dark: { primary: '263 75% 69%', primaryForeground: '266 100% 97%' },
  },
];

export function AccentColorPicker() {
  const { theme: mode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [activeColor, setActiveColor] = React.useState(colorPresets[0]);

  React.useEffect(() => {
    setMounted(true);
    // On mount, read from localStorage if a color was previously set
    const savedColorName = localStorage.getItem('app-accent-color');
    const savedColor = colorPresets.find(c => c.name === savedColorName);
    if (savedColor) {
      handleColorChange(savedColor);
    }
  }, []);

  const handleColorChange = (color: ColorPreset) => {
    const root = document.documentElement;
    const colors = color[mode === 'dark' ? 'dark' : 'light'];
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    // The ring color is often the same as the primary color.
    root.style.setProperty('--ring', colors.primary); 

    setActiveColor(color);
    localStorage.setItem('app-accent-color', color.name);
  };

  if (!mounted) {
    return <div className="size-10" />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Customize accent color">
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          {colorPresets.map((color) => {
            const isActive = color.name === activeColor.name;
            const swatchColor = mode === 'dark' ? color.dark.primary : color.light.primary;

            return (
              <TooltipProvider key={color.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleColorChange(color)}
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110',
                        isActive
                          ? 'border-[hsl(var(--primary))]'
                          : 'border-transparent'
                      )}
                      style={{ backgroundColor: `hsl(${swatchColor})` }}
                      aria-label={`Set accent color to ${color.name}`}
                    >
                      {isActive && (
                        <Check className="size-5 text-[hsl(var(--primary-foreground))]" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// We need to add Tooltip and TooltipProvider to the PopoverContent,
// but they are not exported from the ui/popover file. Let's create a minimal
// version here for local use.
const TooltipProvider = Popover;
const Tooltip = Popover;
const TooltipTrigger = PopoverTrigger;
const TooltipContent = ({ children, ...props }: React.ComponentProps<typeof PopoverContent>) => (
  <PopoverContent {...props} className="text-xs px-2 py-1">
    {children}
  </PopoverContent>
);

