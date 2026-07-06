"use client";

import { useRouter } from "next/navigation";
import { Mic, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { usePracticeConfig } from "../hooks/use-practice-config";
import { ScenarioSelector } from "./scenario-selector";
import { PersonalitySelector } from "./personality-selector";
import { DifficultySelector } from "./difficulty-selector";
import { AccentSelector } from "./accent-selector";
import { DurationSelector } from "./duration-selector";
import { PrimaryButton } from "@/components/ui/primary-button";

export function PracticeSetupScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    config,
    setScenario,
    setPersonality,
    setDifficulty,
    setAccent,
    setDuration,
  } = usePracticeConfig();

  const handleStartCall = () => {
    const params = new URLSearchParams({
      scenario: config.scenario,
      personality: config.personality,
      difficulty: config.difficulty,
      accent: config.accent,
      duration: config.duration.toString(),
    });
    router.push(`/call-brief?${params.toString()}`);
  };

  return (
    <>
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.push("/home")}
        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95 mb-4"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-primary" />
      </button>

      <div className="mb-stack-lg">
        <h2 className="text-[28px] leading-[34px] tracking-[-0.02em] font-bold text-primary mb-stack-sm">
          {t("practice.title")}
        </h2>
        <p className="text-[16px] leading-[24px] text-secondary">
          {t("practice.subtitle")}
        </p>
      </div>

      <div className="space-y-stack-md pb-28">
        <ScenarioSelector value={config.scenario} onChange={setScenario} />
        <PersonalitySelector
          value={config.personality}
          onChange={setPersonality}
        />

        {/* Two Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DifficultySelector
            value={config.difficulty}
            onChange={setDifficulty}
          />
          <DurationSelector value={config.duration} onChange={setDuration} />
        </div>

        {/* Accent — full width with 6 options */}
        <AccentSelector value={config.accent} onChange={setAccent} />
      </div>

      {/* Floating Start Button */}
      <div className="fixed bottom-0 w-full max-w-[430px] px-edge pb-8 z-40 bg-gradient-to-t from-surface via-surface/90 to-transparent pt-8 -ml-edge">
        <PrimaryButton onClick={handleStartCall} icon={Mic}>
          {t("practice.startCall")}
        </PrimaryButton>
      </div>
    </>
  );
}
