import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button";
}

export function PremiumCard({
  children,
  className,
  onClick,
  as = "div",
}: PremiumCardProps) {
  const Component = as;

  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-surface-container-lowest rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-surface-container-high",
        onClick &&
          "cursor-pointer transition-transform duration-200 hover:scale-[0.99] active:scale-[0.98]",
        as === "button" && "w-full text-left",
        className
      )}
    >
      {children}
    </Component>
  );
}
