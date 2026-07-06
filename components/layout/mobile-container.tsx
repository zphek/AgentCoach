import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "splash";
}

export function MobileContainer({
  children,
  className,
  variant = "default",
}: MobileContainerProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[430px] bg-surface min-h-dvh",
        variant === "splash" &&
          "md:min-h-0 md:h-[921px] md:rounded-[40px] md:shadow-2xl md:border md:border-surface-variant overflow-hidden flex flex-col justify-between",
        variant === "default" && "shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
