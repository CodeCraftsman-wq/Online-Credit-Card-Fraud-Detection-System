'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface GridBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

export const PlexusBackground: React.FC<GridBackgroundProps> = ({
  className,
  dotColor: customDotColor,
  dotSize = 1,
  spacing = 35,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mousePosition = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const isDark = theme === 'dark';
    const baseDotColor = customDotColor || (isDark ? 'hsla(210, 100%, 75%, 0.2)' : 'hsla(221, 83%, 53%, 0.3)');
    const highlightColor = isDark ? 'hsla(210, 100%, 75%, 0.8)' : 'hsla(221, 83%, 53%, 0.8)';


    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.0001;

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          const dx = mousePosition.current.x - x;
          const dy = mousePosition.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxDist = 250;
          const pulseFactor = Math.sin(time * 5 + x * 0.01 + y * 0.01) * 0.2 + 0.8;
          
          let size = dotSize;
          let color = baseDotColor;

          if (dist < maxDist) {
            const proximity = (maxDist - dist) / maxDist;
            size = dotSize + proximity * 2;
            
            // Interpolate color towards the highlight color
            const r1 = parseInt(baseDotColor.slice(5, 8));
            const g1 = parseInt(baseDotColor.slice(9, 12));
            const b1 = parseInt(baseDotColor.slice(13, 16));
            const a1 = parseFloat(baseDotColor.slice(17, 21));

            const r2 = parseInt(highlightColor.slice(5, 8));
            const g2 = parseInt(highlightColor.slice(9, 12));
            const b2 = parseInt(highlightColor.slice(13, 16));
            const a2 = parseFloat(highlightColor.slice(17, 21));

            const r = Math.floor(r1 + (r2 - r1) * proximity);
            const g = Math.floor(g1 + (g2 - g1) * proximity);
            const b = Math.floor(b1 + (b2 - b1) * proximity);
            const a = a1 + (a2 - a1) * proximity;
            
            color = `hsla(${isDark ? 210 : 221}, ${isDark ? '100%' : '83%'}, ${isDark ? '75%' : '53%'}, ${a})`;

          } else {
             color = baseDotColor;
          }

          ctx.beginPath();
          ctx.arc(x, y, size * pulseFactor, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    };
    
    const animate = () => {
        drawGrid();
        animationFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, dotSize, spacing, customDotColor]);

  return <canvas ref={canvasRef} className={cn("fixed top-0 left-0 -z-10 bg-transparent", className)} {...props} />;
};
