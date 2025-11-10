
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
}

export const PlexusBackground: React.FC<PlexusBackgroundProps> = ({
  className,
  particleColor: customParticleColor,
  lineColor: customLineColor,
  particleAmount = 70,
  defaultSpeed = 0.5,
  interactive = true,
  minDistance = 120,
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

    const particleColor = customParticleColor || (theme === 'dark' ? 'rgba(206, 243, 255, 0.5)' : 'rgba(34, 69, 128, 0.5)');
    const lineColor = customLineColor || (theme === 'dark' ? 'rgba(206, 243, 255, 0.08)' : 'rgba(34, 69, 128, 0.08)');

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
        this.vx = (Math.random() - 0.5) * defaultSpeed;
        this.vy = (Math.random() - 0.5) * defaultSpeed;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
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
        ctx.fill();
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
        ctx.strokeStyle = lineColor;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.lineWidth = 1 - distance / minDistance;
                    ctx.stroke();
                }
            }
        }

        if (interactive) {
            for (let i = 0; i < particles.length; i++) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance + 50) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.lineWidth = 0.5 - distance / (minDistance + 50);
                    ctx.stroke();
                }
            }
        }
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
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [theme, particleAmount, defaultSpeed, interactive, minDistance, customParticleColor, customLineColor]);

  return <canvas ref={canvasRef} className={cn("fixed top-0 left-0 -z-10", className)} {...props} />;
};
