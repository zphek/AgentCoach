"use client";

import { OptionPill } from "@/components/ui/option-pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { ACCENTS } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";
import type { Accent } from "@/types/practice";

interface AccentSelectorProps {
  value: Accent;
  onChange: (value: Accent) => void;
}

export function AccentSelector({ value, onChange }: AccentSelectorProps) {
  const { t } = useLanguage();

  return (
    <PremiumCard className="p-4">
      <h3 className="text-[12px] leading-[16px] font-semibold text-primary mb-2">
        {t("practice.accent")}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {ACCENTS.map((accent) => (
          <OptionPill
            key={accent.value}
            label={accent.label}
            active={value === accent.value}
            onClick={() => onChange(accent.value)}
            size="sm"
          />
        ))}
      </div>
    </PremiumCard>
  );
}
