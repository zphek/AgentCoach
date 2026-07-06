"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PinDotsProps {
  length: number;
  filled: number;
  error: boolean;
}

export function PinDots({ length, filled, error }: PinDotsProps) {
  return (
    <motion.div
      className="flex gap-4 justify-center"
      animate={error ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {Array.from({ length }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-4 h-4 rounded-full border-2 transition-colors duration-200",
            error
              ? "border-error bg-error"
              : i < filled
                ? "border-primary bg-primary"
                : "border-outline-variant bg-transparent"
          )}
          animate={
            i === filled - 1 && !error
              ? { scale: [1, 1.3, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.15 }}
        />
      ))}
    </motion.div>
  );
}
