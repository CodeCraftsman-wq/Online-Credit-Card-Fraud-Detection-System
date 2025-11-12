
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

    const dotColor = customDotColor || (theme === 'dark' ? 'hsla(217, 91%, 60%, 0.3)' : 'hsla(221, 83%, 53%, 0.3)');

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
          let opacity = 0.5;

          if (dist < maxDist) {
            const proximity = (maxDist - dist) / maxDist;
            size = dotSize + proximity * 2;
            opacity = 0.5 + proximity * 0.5;
          }

          ctx.beginPath();
          ctx.arc(x, y, size * pulseFactor, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.globalAlpha = opacity * pulseFactor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
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
