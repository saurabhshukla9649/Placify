"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-[#0A192F]">
      {/* Dynamic base gradient (Black -> Deep Blue -> Purple) */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#000000_0%,#0A192F_50%,#2D1B4E_100%)] animate-gradient-shift bg-[length:200%_200%] opacity-80" />
      
      {/* Soft moving gradient waves */}
      <div className="absolute top-0 left-0 w-[200%] h-[100%] bg-[linear-gradient(to_right,transparent,rgba(0,174,239,0.05),transparent)] animate-wave mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[50%] bg-[linear-gradient(to_top,transparent,rgba(111,0,255,0.08),transparent)] animate-wave animation-delay-4000 mix-blend-screen" />

      {/* Floating Blobs (Mid layer) */}
      <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      
      <div className="absolute top-[30%] right-[10%] w-[45vw] h-[45vw] bg-purple-500/15 rounded-full mix-blend-screen filter blur-[140px] animate-blob animation-delay-2000" />
      
      <div className="absolute -bottom-10 left-[40%] w-[50vw] h-[50vw] bg-blue-600/15 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000" />
      
      {/* Subtle particle overlay grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPC9zdmc+')] opacity-60 mix-blend-overlay" />
    </div>
  );
}
