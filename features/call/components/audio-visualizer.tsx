"use client";

import { motion } from "framer-motion";

interface AudioVisualizerProps {
  isActive: boolean;
}

export function AudioVisualizer({ isActive }: AudioVisualizerProps) {
  const bars = 5;

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-on-primary/80"
          animate={
            isActive
              ? {
                  height: [12, 32 + Math.random() * 20, 16, 40 + Math.random() * 16, 12],
                }
              : { height: 12 }
          }
          transition={
            isActive
              ? {
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: "reverse" as const,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
