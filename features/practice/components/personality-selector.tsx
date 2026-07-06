"use client";

import { Smile } from "lucide-react";
import { OptionPill } from "@/components/ui/option-pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { PERSONALITIES } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";
import type { Personality } from "@/types/practice";

const PERSONALITY_KEYS: Record<string, string> = {
  friendly: "practice.friendly",
  angry: "practice.angry",
  confused: "practice.confused",
};

interface PersonalitySelectorProps {
  value: Personality;
  onChange: (value: Personality) => void;
}

export function PersonalitySelector({ value, onChange }: PersonalitySelectorProps) {
  const { t } = useLanguage();

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Smile size={24} className="text-primary" />
        <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-primary">
          {t("practice.personality")}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {PERSONALITIES.map((p) => (
          <OptionPill
            key={p.value}
            label={t(PERSONALITY_KEYS[p.value] ?? p.value)}
            active={value === p.value}
            onClick={() => onChange(p.value)}
          />
        ))}
      </div>
    </PremiumCard>
  );
}
