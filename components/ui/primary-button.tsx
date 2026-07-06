"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  disabled = false,
  className,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full h-[56px] rounded-[16px] text-white font-semibold text-[16px] leading-[24px]",
        "flex items-center justify-center gap-2",
        "bg-gradient-to-b from-[#2C2C2C] to-[#1C1C1C]",
        "shadow-[0_8px_24px_rgba(28,28,28,0.2)]",
        "transition-shadow duration-200",
        "active:shadow-[0_4px_12px_rgba(28,28,28,0.15)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
}
