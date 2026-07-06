import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-[24px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-surface-container-high flex flex-col justify-between min-h-[120px]",
        className
      )}
    >
      <div className="flex items-center gap-2 text-secondary mb-2">
        <Icon size={18} />
        <span className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-primary">
          {value}
        </span>
        {unit && (
          <span className="text-[16px] leading-[24px] text-secondary">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
