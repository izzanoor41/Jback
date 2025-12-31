"use client";

import { cn } from "@/lib/utils";

interface GradientOrbsProps {
  className?: string;
}

export function GradientOrbs({ className }: GradientOrbsProps) {
  return (
    <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      {/* Top left orb */}
      <div 
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse-glow"
        style={{ background: "rgba(16, 185, 129, 0.15)" }}
      />
      
      {/* Bottom right orb */}
      <div 
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-glow"
        style={{ 
          background: "rgba(5, 150, 105, 0.12)",
          animationDelay: "500ms"
        }}
      />
      
      {/* Center orb */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] animate-pulse-glow"
        style={{ 
          background: "rgba(16, 185, 129, 0.05)",
          animationDelay: "300ms"
        }}
      />

      {/* Additional accent orb */}
      <div 
        className="absolute top-3/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse-glow"
        style={{ 
          background: "rgba(52, 211, 153, 0.08)",
          animationDelay: "700ms"
        }}
      />
    </div>
  );
}
