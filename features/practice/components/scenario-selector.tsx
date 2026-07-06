"use client";

import { HeadsetIcon } from "lucide-react";
import { OptionPill } from "@/components/ui/option-pill";
import { PremiumCard } from "@/components/ui/premium-card";
import { SCENARIOS } from "@/lib/constants";
import { useLanguage } from "@/providers/language-provider";
import type { Scenario } from "@/types/practice";

const SCENARIO_KEYS: Record<string, string> = {
  "technical-support": "practice.scenarioTechnical",
  billing: "practice.scenarioBilling",
  "customer-service": "practice.scenarioCustomer",
};

interface ScenarioSelectorProps {
  value: Scenario;
  onChange: (value: Scenario) => void;
}

export function ScenarioSelector({ value, onChange }: ScenarioSelectorProps) {
  const { t } = useLanguage();

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <HeadsetIcon size={24} className="text-primary" />
        <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-primary">
          {t("practice.scenario")}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((scenario) => (
          <OptionPill
            key={scenario.value}
            label={t(SCENARIO_KEYS[scenario.value] ?? scenario.value)}
            active={value === scenario.value}
            onClick={() => onChange(scenario.value)}
          />
        ))}
      </div>
    </PremiumCard>
  );
}
