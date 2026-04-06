"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<{ id: number, top: string, left: string, size: number, opacity: number, duration: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Setup random stars on client to avoid hydration mismatch
    setStars(Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.1,
      duration: `${Math.random() * 4 + 2}s`
    })));
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  // Parallax transform styles based on layer depth
  const transformLayer1 = `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`;
  const transformLayer2 = `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`;
  const transformLayer3 = `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-[#000000]">
      {/* Dynamic base gradient (Black -> Deep Blue -> Dark Purple) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0A192F_0%,#000000_60%)] opacity-95" />
      
      {/* Star Particles Layer */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: transformLayer1 }}>
        {stars.map((star) => (
          <div 
            key={star.id} 
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: star.duration
            }}
          />
        ))}
      </div>
      
      {/* Soft moving gradient waves via rotated elements */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out flex items-center justify-center opacity-40 mix-blend-screen"
        style={{ transform: transformLayer2 }}
      >
        <div className="w-[150vw] h-[100vw] bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.04)_0%,transparent_70%)] animate-wave rounded-[100%]" />
      </div>

      {/* Floating Blobs (Mid layer) */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out mix-blend-screen"
        style={{ transform: transformLayer3 }}
      >
        <div className="absolute top-[10%] left-[15%] w-[35vw] h-[35vw] bg-cyan-500/10 rounded-full filter blur-[120px] animate-blob" />
        <div className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full filter blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-10 left-[30%] w-[45vw] h-[45vw] bg-blue-800/15 rounded-full filter blur-[150px] animate-blob animation-delay-4000" />
      </div>
      
      {/* Heavy noise/grain overlay for that premium textural glass feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
    </div>
  );
}
