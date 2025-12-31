"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string[];
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = ["#10B981", "#34D399", "#059669"],
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
        "--border-width": `${borderWidth}px`,
        "--shine-duration": `${duration}s`,
        "--shine-color-1": color[0],
        "--shine-color-2": color[1],
        "--shine-color-3": color[2] || color[0],
      } as React.CSSProperties}
      className={cn(
        "relative rounded-[--border-radius] p-[--border-width]",
        "before:absolute before:inset-0 before:rounded-[--border-radius]",
        "before:bg-[conic-gradient(from_0deg,var(--shine-color-1),var(--shine-color-2),var(--shine-color-3),var(--shine-color-1))]",
        "before:animate-[spin_var(--shine-duration)_linear_infinite]",
        "before:opacity-50",
        className
      )}
    >
      <div
        className="relative rounded-[calc(var(--border-radius)-var(--border-width))] bg-background"
        style={{
          borderRadius: `calc(${borderRadius}px - ${borderWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
