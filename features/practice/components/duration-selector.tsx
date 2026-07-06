"use client";

import { OptionPill } from "@/components/ui/option-pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { DURATIONS } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";
import type { Duration } from "@/types/practice";

interface DurationSelectorProps {
  value: Duration;
  onChange: (value: Duration) => void;
}

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  const { t } = useLanguage();

  return (
    <PremiumCard className="p-4 flex-1">
      <h3 className="text-[12px] leading-[16px] font-semibold text-primary mb-2">
        {t("practice.duration")}
      </h3>
      <div className="flex gap-2">
        {DURATIONS.map((duration) => (
          <OptionPill
            key={duration.value}
            label={duration.label}
            active={value === duration.value}
            onClick={() => onChange(duration.value)}
            size="sm"
            className="flex-1"
          />
        ))}
      </div>
    </PremiumCard>
  );
}
