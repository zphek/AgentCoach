"use client";

import { Gauge } from "lucide-react";
import { OptionPill } from "@/components/ui/option-pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { DIFFICULTIES } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";
import type { Difficulty } from "@/types/practice";

const DIFFICULTY_KEYS: Record<string, string> = {
  easy: "practice.easy",
  medium: "practice.medium",
  hard: "practice.hard",
};

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const { t } = useLanguage();

  return (
    <PremiumCard className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Gauge size={20} className="text-primary" />
        <h3 className="text-[12px] leading-[16px] font-semibold text-primary">
          {t("practice.difficulty")}
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        {DIFFICULTIES.map((d) => (
          <OptionPill
            key={d.value}
            label={t(DIFFICULTY_KEYS[d.value] ?? d.value)}
            active={value === d.value}
            onClick={() => onChange(d.value)}
            size="sm"
            className="text-left"
          />
        ))}
      </div>
    </PremiumCard>
  );
}
