"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 150;
    const PRIMARY = { r: 58, g: 220, b: 204 };   // #3adccc
    const SECONDARY = { r: 201, g: 191, b: 255 }; // #c9bfff

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    function init() {
      resize();
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const blend = p.x / w;
        const r = Math.round(PRIMARY.r + (SECONDARY.r - PRIMARY.r) * blend);
        const g = Math.round(PRIMARY.g + (SECONDARY.g - PRIMARY.g) * blend);
        const b = Math.round(PRIMARY.b + (SECONDARY.b - PRIMARY.b) * blend);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx!.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            const midX = (particles[i].x + particles[j].x) / 2;
            const blend = midX / w;
            const r = Math.round(PRIMARY.r + (SECONDARY.r - PRIMARY.r) * blend);
            const g = Math.round(PRIMARY.g + (SECONDARY.g - PRIMARY.g) * blend);
            const b = Math.round(PRIMARY.b + (SECONDARY.b - PRIMARY.b) * blend);
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
