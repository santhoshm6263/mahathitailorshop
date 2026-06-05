'use client';

// src/widgets/Hero/index.tsx
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Scissors, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track mouse
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Blouse Wireframe Model Vertices (x, y, z)
    // We define a bodice structure that spins
    const vertices: { x: number; y: number; z: number }[] = [];
    const connections: [number, number][] = [];

    // 1. Neckline points (circular loop)
    const neckPointsCount = 12;
    for (let i = 0; i < neckPointsCount; i++) {
      const angle = (i / neckPointsCount) * Math.PI * 2;
      vertices.push({
        x: Math.cos(angle) * 35,
        y: -40 + Math.sin(angle) * 5, // slightly tilted neck
        z: Math.sin(angle) * 35,
      });
      // Connect in a circle
      connections.push([i, (i + 1) % neckPointsCount]);
    }

    // 2. Waistline points (circular loop)
    const waistPointsCount = 12;
    const waistOffset = vertices.length;
    for (let i = 0; i < waistPointsCount; i++) {
      const angle = (i / waistPointsCount) * Math.PI * 2;
      vertices.push({
        x: Math.cos(angle) * 55,
        y: 70,
        z: Math.sin(angle) * 55,
      });
      // Connect in a circle
      connections.push([waistOffset + i, waistOffset + ((i + 1) % waistPointsCount)]);
      // Connect neck to waist vertically
      if (i % 2 === 0) {
        connections.push([i, waistOffset + i]);
      }
    }

    // 3. Left Sleeve Points
    const leftShoulderIdx = vertices.length;
    vertices.push({ x: -65, y: -30, z: 0 }); // L Shoulder Top
    vertices.push({ x: -85, y: 10, z: -15 }); // L Sleeve Outer
    vertices.push({ x: -70, y: 20, z: 15 }); // L Sleeve Inner
    vertices.push({ x: -50, y: 5, z: 0 }); // L Armpit

    connections.push([2, leftShoulderIdx]); // Neck to shoulder
    connections.push([leftShoulderIdx, leftShoulderIdx + 1]);
    connections.push([leftShoulderIdx + 1, leftShoulderIdx + 2]);
    connections.push([leftShoulderIdx + 2, leftShoulderIdx + 3]);
    connections.push([leftShoulderIdx + 3, waistOffset + 2]); // Armpit to waist

    // 4. Right Sleeve Points
    const rightShoulderIdx = vertices.length;
    vertices.push({ x: 65, y: -30, z: 0 }); // R Shoulder Top
    vertices.push({ x: 85, y: 10, z: -15 }); // R Sleeve Outer
    vertices.push({ x: 70, y: 20, z: 15 }); // R Sleeve Inner
    vertices.push({ x: 50, y: 5, z: 0 }); // R Armpit

    connections.push([8, rightShoulderIdx]); // Neck to shoulder
    connections.push([rightShoulderIdx, rightShoulderIdx + 1]);
    connections.push([rightShoulderIdx + 1, rightShoulderIdx + 2]);
    connections.push([rightShoulderIdx + 2, rightShoulderIdx + 3]);
    connections.push([rightShoulderIdx + 3, waistOffset + 8]); // Armpit to waist

    // Floating Embroidery Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      growth: number;
    }

    const particles: Particle[] = [];
    const particleColors = ['#D4AF37', '#1296F3', '#4F6BFF', '#8A3DFF', '#D600C7'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        growth: Math.random() * 0.01 + 0.002,
      });
    }

    // Rotation angles
    let angleX = 0.15;
    let angleY = 0;

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw animated backdrop gradient aura
      const grad = ctx.createRadialGradient(
        width / 2 + Math.sin(Date.now() * 0.001) * 100,
        height / 2 + Math.cos(Date.now() * 0.001) * 80,
        50,
        width / 2,
        height / 2,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(79, 107, 255, 0.08)');
      grad.addColorStop(0.5, 'rgba(138, 61, 255, 0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Floating Embroidery Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Attraction to mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            p.x += (dx / dist) * 0.5;
            p.y += (dy / dist) * 0.5;
          }
        }

        // Sinusoidal opacity fade
        p.alpha += p.growth;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.growth *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      ctx.globalAlpha = 1;

      // 3. Draw 3D Rotating Blouse wireframe on the right side of the screen
      // Determine center position of rendering (desktop vs mobile)
      const centerX = width > 1024 ? width * 0.72 : width / 2;
      const centerY = width > 1024 ? height * 0.48 : height * 0.72;
      const scale = width > 1024 ? 2.5 : 1.8;

      // Slowly rotate based on time and mouse position
      angleY += 0.005;
      if (mouse.active && width > 1024) {
        const targetAngleX = ((mouse.y - centerY) / height) * 0.8;
        const targetAngleY = ((mouse.x - centerX) / width) * 1.5;
        angleX += (targetAngleX - angleX) * 0.05;
        angleY += (targetAngleY - angleY) * 0.05;
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project vertices
      const projected = vertices.map((v) => {
        // Rotate Y-axis
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.z * cosY + v.x * sinY;

        // Rotate X-axis
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + v.y * sinX;

        // Perspective projection
        const d = 200;
        const f = d / (d + z2);
        return {
          x: centerX + x1 * scale * f,
          y: centerY + y2 * scale * f,
          depth: z2,
        };
      });

      // Draw Connection lines (embroidery thread lines)
      ctx.lineWidth = 1.2;
      connections.forEach(([p1, p2]) => {
        const pt1 = projected[p1];
        const pt2 = projected[p2];

        // Draw shadow/glow lines
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);

        // Gradient color for threads based on depth
        const depthAvg = (pt1.depth + pt2.depth) / 2;
        const alpha = Math.max(0.1, 1 - (depthAvg + 60) / 120);

        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.85})`;
        ctx.stroke();

        // Overlay multi-color glowing thread
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = '#8A3DFF';
        ctx.stroke();
      });

      // Draw shining dots on vertices (embroidery nodes / crystals)
      projected.forEach((pt, idx) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, idx % 3 === 0 ? 3.5 : 2, 0, Math.PI * 2);
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4AF37';
        ctx.fillStyle = idx % 2 === 0 ? '#D4AF37' : '#D600C7';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center bg-[#0F0F12] text-white overflow-hidden pt-[80px]">
      
      {/* Background Cinematic Gradients (OTT Premium style) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0F0F12] via-[#0F0F12]/90 to-transparent z-0"></div>
      
      {/* Dynamic Animated background mesh */}
      <div className="absolute top-0 right-0 w-[60%] h-full opacity-35 blur-[120px] pointer-events-none z-0">
        <div className="w-full h-full bg-luxury-gradient-animated"></div>
      </div>

      {/* Floating Canvas containing 3D model and interactive particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
      />

      {/* Hero Copy Content */}
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-20 py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side text content */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center space-y-6 max-w-2xl">
          
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
            <span className="font-poppins text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
              MAHATHI COUTURE STUDIO
            </span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-wide leading-tight max-w-xl">
            Bespoke <br />
            <span className="text-luxury-gradient font-bold drop-shadow-md">
              Bridal Fashion
            </span> <br />
            & Tailoring
          </h1>

          <p className="font-poppins text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg">
            Experience Indian ethnic tailoring reimagined. Each bridal blouse, designer gown, and intricate Aari-Maggam work masterpiece is sculpted to your custom measurements using state-of-the-art styling.
          </p>

          {/* Interactive buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/booking"
              className="font-poppins text-[10px] uppercase tracking-widest font-bold btn-gold-glow py-4 px-8 rounded-full border border-gold transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Consult A Designer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              href="/custom-tailoring"
              className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white hover:text-gold py-4 px-8 rounded-full border border-white/10 hover:border-gold/30 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center space-x-2 backdrop-blur-md"
            >
              <Scissors className="w-4 h-4 text-gold" />
              <span>Tailor Blouse Live</span>
            </Link>
          </div>

        </div>

        {/* Right side is reserved for the 3D Blouse canvas render */}
        <div className="lg:col-span-5 hidden lg:block" />

      </div>

      {/* Discover link at bottom */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
        onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
      >
        <span className="font-poppins text-[8px] uppercase tracking-[0.25em] text-gold mb-2">Explore Atelier</span>
        <div className="w-[16px] h-[26px] rounded-full border border-gold/30 flex items-start justify-center p-1">
          <div className="w-[1.5px] h-[5px] bg-gold rounded-full animate-bounce"></div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
