"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OptionPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}

export function OptionPill({
  label,
  active,
  onClick,
  size = "md",
  className,
}: OptionPillProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "transition-all duration-200 font-medium",
        size === "md" && "px-4 py-2 rounded-xl text-[14px] leading-[20px] tracking-[0.01em]",
        size === "sm" && "px-3 py-1.5 rounded-lg text-[12px] leading-[16px] font-semibold",
        active
          ? "bg-primary-container text-on-primary shadow-[0_4px_12px_rgba(28,28,28,0.15)]"
          : "bg-surface-container-low text-secondary border border-transparent hover:bg-surface-container",
        className
      )}
    >
      {label}
    </motion.button>
  );
}
