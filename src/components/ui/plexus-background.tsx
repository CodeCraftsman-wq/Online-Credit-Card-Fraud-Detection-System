
'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface PlexusBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  particleColor?: string;
  lineColor?: string;
  particleAmount?: number;
  defaultSpeed?: number;
  interactive?: boolean;
  minDistance?: number;
  glowing?: boolean;
}

export const PlexusBackground: React.FC<PlexusBackgroundProps> = ({
  className,
  particleColor: customParticleColor,
  lineColor: customLineColor,
  particleAmount = 70,
  defaultSpeed = 0.3,
  interactive = true,
  minDistance = 140,
  glowing = true,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    const particleColor = customParticleColor || (theme === 'dark' ? 'rgba(200, 225, 255, 0.7)' : 'rgba(34, 69, 128, 0.6)');
    const lineColor = customLineColor || (theme === 'dark' ? 'rgba(200, 225, 255, 0.1)' : 'rgba(34, 69, 128, 0.1)');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5 + 0.5; // Smaller particles for depth
        const speed = defaultSpeed * (this.radius * 0.75);
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
      }

      update() {
        // Attraction to mouse
        if(interactive) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance * 1.5) {
            const acceleration = 0.03; // Gentle pull
            this.vx += (dx / dist) * acceleration;
            this.vy += (dy / dist) * acceleration;
          }
        }
        
        // Max speed limit
        const maxSpeed = defaultSpeed * 2;
        this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));
        this.vy = Math.max(-maxSpeed, Math.min(maxSpeed, this.vy));


        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        
        if (glowing) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = particleColor;
        }
        ctx.fill();
        if (glowing) { // Reset shadow for lines
            ctx.shadowBlur = 0;
        }
      }
    }

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleAmount; i++) {
        particles.push(new Particle());
      }
    };
    
    const connectParticles = () => {
        if(!ctx) return;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = 1 - (distance / minDistance); // Pulsating effect
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1; // Reset alpha
    }


    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
    
    const handleMouseOut = () => {
        mouse.x = -9999;
        mouse.y = -9999;
    }

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    if (interactive) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [theme, particleAmount, defaultSpeed, interactive, minDistance, customParticleColor, customLineColor, glowing]);

  return <canvas ref={canvasRef} className={cn("fixed top-0 left-0 -z-10", className)} {...props} />;
};
