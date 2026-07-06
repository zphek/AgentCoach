"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTimeGreeting } from "@/hooks/use-time-greeting";
import { useLanguage } from "@/providers/language-provider";

interface GreetingSectionProps {
  userName: string;
  showName?: boolean;
  onToggleName?: () => void;
}

export function GreetingSection({ userName, showName = true, onToggleName }: GreetingSectionProps) {
  const greeting = useTimeGreeting();
  const { t } = useLanguage();

  return (
    <section className="space-y-stack-sm pt-stack-md">
      <div className="flex items-start justify-between">
        <h2 className="text-[28px] leading-[34px] tracking-[-0.02em] font-bold text-primary">
          {greeting}{showName ? `, ${userName}` : ""} {showName ? "" : "👋"}
        </h2>
        {onToggleName && (
          <button
            type="button"
            onClick={onToggleName}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95 flex-shrink-0 mt-1"
            aria-label={showName ? "Hide name" : "Show name"}
          >
            {showName ? (
              <EyeOff size={16} className="text-secondary" />
            ) : (
              <Eye size={16} className="text-secondary" />
            )}
          </button>
        )}
      </div>
      <p className="text-[16px] leading-[24px] text-secondary">
        {t("greeting.subtitle")}
      </p>
    </section>
  );
}
