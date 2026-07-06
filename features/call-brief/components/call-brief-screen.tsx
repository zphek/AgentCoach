"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  HeadsetIcon,
  Smile,
  Gauge,
  Globe,
  Clock,
  Lightbulb,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowLeft,
  Target,
  MessageSquareQuote,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useScenarioGenerator } from "../hooks/use-scenario-generator";
import { useLanguage } from "@/providers/language-provider";
import { SCENARIOS, PERSONALITIES, DIFFICULTIES, ACCENTS, DURATIONS } from "@/lib/constants";
import type { Scenario, Personality, Difficulty, Accent } from "@/types/practice";
import { useState } from "react";

/* ─── Config Summary Item ─── */
interface ConfigItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ConfigItem({ icon, label, value }: ConfigItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 text-secondary">
        {icon}
        <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
          {label}
        </span>
      </div>
      <span className="text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-primary">
        {value}
      </span>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function ScenarioSkeleton() {
  return (
    <div className="space-y-stack-md animate-pulse">
      <PremiumCard className="p-6">
        <div className="h-8 bg-surface-container-high rounded-lg w-3/4 mb-3" />
        <div className="h-5 bg-surface-container-high rounded-lg w-full mb-2" />
        <div className="h-5 bg-surface-container-high rounded-lg w-2/3" />
      </PremiumCard>
      <PremiumCard className="p-6">
        <div className="h-4 bg-surface-container-high rounded w-1/3 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between py-3">
            <div className="h-4 bg-surface-container-high rounded w-1/4" />
            <div className="h-4 bg-surface-container-high rounded w-1/3" />
          </div>
        ))}
      </PremiumCard>
      <PremiumCard className="p-6">
        <div className="h-4 bg-surface-container-high rounded w-1/4 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="w-6 h-6 bg-surface-container-high rounded-full flex-shrink-0" />
            <div className="h-4 bg-surface-container-high rounded w-full" />
          </div>
        ))}
      </PremiumCard>
    </div>
  );
}

/* ─── Error State ─── */
function ScenarioError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <PremiumCard className="p-6 text-center">
      <p className="text-error text-[16px] font-medium mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-primary font-semibold text-[14px] hover:opacity-80 transition-opacity"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </PremiumCard>
  );
}

/* ─── Main Screen ─── */
export function CallBriefScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const scenario = (searchParams.get("scenario") as Scenario) || "technical-support";
  const personality = (searchParams.get("personality") as Personality) || "angry";
  const difficulty = (searchParams.get("difficulty") as Difficulty) || "medium";
  const accent = (searchParams.get("accent") as Accent) || "us";
  const duration = Number(searchParams.get("duration") || "10");

  const {
    data: generatedScenario,
    isLoading,
    error,
    regenerate,
  } = useScenarioGenerator({ scenario, personality, difficulty, accent, duration });

  const scenarioLabel = SCENARIOS.find((s) => s.value === scenario)?.label ?? scenario;
  const personalityLabel = PERSONALITIES.find((p) => p.value === personality)?.label ?? personality;
  const difficultyLabel = DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? difficulty;
  const accentLabel = ACCENTS.find((a) => a.value === accent)?.label ?? accent;
  const durationLabel = DURATIONS.find((d) => d.value === duration)?.label ?? `${duration}m`;

  // Randomly decide who initiates the conversation (50/50)
  const [customerInitiates] = useState(() => Math.random() > 0.5);

  const animProps = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-edge pt-14 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-bold text-primary">
          {t("brief.title")}
        </h1>

        {/* Regenerate button */}
        {!isLoading && generatedScenario && (
          <button
            type="button"
            onClick={regenerate}
            className="ml-auto w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
            aria-label="Generate new scenario"
          >
            <RefreshCw size={18} className="text-secondary" />
          </button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 px-edge space-y-stack-md pb-32">
        {/* Loading State */}
        {isLoading && <ScenarioSkeleton />}

        {/* Error State */}
        {error && <ScenarioError message={error} onRetry={regenerate} />}

        {/* Generated Scenario */}
        {!isLoading && !error && generatedScenario && (
          <>
            {/* Scenario Header */}
            <motion.div {...animProps(0)}>
              <PremiumCard className="p-6">
                <h2 className="text-[28px] leading-[34px] tracking-[-0.02em] font-bold text-primary mb-2">
                  {generatedScenario.issueTitle}
                </h2>
                <p className="text-[16px] leading-[24px] text-secondary mb-3">
                  {generatedScenario.issueDescription}
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg w-fit">
                  <Smile size={14} className="text-secondary" />
                  <span className="text-[12px] leading-[16px] font-semibold text-secondary">
                    {generatedScenario.customerName} · {generatedScenario.emotionalState}
                  </span>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Background Context */}
            <motion.div {...animProps(0.1)}>
              <PremiumCard className="p-6">
                <h3 className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider mb-3">
                  {t("brief.background")}
                </h3>
                <p className="text-[14px] leading-[22px] text-on-surface-variant">
                  {generatedScenario.backgroundContext}
                </p>
              </PremiumCard>
            </motion.div>

            {/* Config Summary */}
            <motion.div {...animProps(0.15)}>
              <PremiumCard className="p-6">
                <h3 className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider mb-2">
                  {t("brief.sessionDetails")}
                </h3>
                <div className="divide-y divide-surface-container-high">
                  <ConfigItem icon={<HeadsetIcon size={18} />} label={t("practice.scenario")} value={scenarioLabel} />
                  <ConfigItem icon={<Smile size={18} />} label={t("practice.personality")} value={personalityLabel} />
                  <ConfigItem icon={<Gauge size={18} />} label={t("practice.difficulty")} value={difficultyLabel} />
                  <ConfigItem icon={<Globe size={18} />} label={t("practice.accent")} value={accentLabel} />
                  <ConfigItem icon={<Clock size={18} />} label={t("practice.duration")} value={durationLabel} />
                  <ConfigItem
                    icon={customerInitiates ? <PhoneIncoming size={18} /> : <PhoneOutgoing size={18} />}
                    label={language === "es" ? "Quién Inicia" : "Who Initiates"}
                    value={customerInitiates
                      ? (language === "es" ? "🔔 El Cliente" : "🔔 Customer")
                      : (language === "es" ? "🎙️ Tú (Agente)" : "🎙️ You (Agent)")}
                  />
                </div>
              </PremiumCard>
            </motion.div>

            {/* Key Phrases */}
            <motion.div {...animProps(0.2)}>
              <PremiumCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquareQuote size={18} className="text-tertiary-container" />
                  <h3 className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider">
                    {t("brief.customerMightSay")}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedScenario.keyPhrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-surface-container-low rounded-lg text-[13px] leading-[18px] text-on-surface-variant italic"
                    >
                      &ldquo;{phrase}&rdquo;
                    </span>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>

            {/* Objectives */}
            <motion.div {...animProps(0.25)}>
              <PremiumCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-tertiary-container" />
                  <h3 className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider">
                    {t("brief.objectives")}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {generatedScenario.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-on-primary">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-[14px] leading-[20px] text-on-surface-variant">
                        {obj}
                      </p>
                    </li>
                  ))}
                </ul>
              </PremiumCard>
            </motion.div>

            {/* Tips */}
            <motion.div {...animProps(0.3)}>
              <PremiumCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-tertiary-fixed-dim" />
                  <h3 className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider">
                    Tips
                  </h3>
                </div>
                <ul className="space-y-3">
                  {generatedScenario.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[12px] font-semibold text-primary">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-[14px] leading-[20px] text-on-surface-variant">
                        {tip}
                      </p>
                    </li>
                  ))}
                </ul>
              </PremiumCard>
            </motion.div>
          </>
        )}
      </div>

      {/* Floating Begin Call Button */}
      <div className="fixed bottom-0 w-full max-w-[430px] px-edge pb-8 z-40 bg-gradient-to-t from-surface via-surface/90 to-transparent pt-8">
        <PrimaryButton
          icon={Phone}
          disabled={isLoading || !!error || !generatedScenario}
          onClick={() => {
            if (generatedScenario) {
              sessionStorage.setItem(
                "agentcoach-scenario",
                JSON.stringify(generatedScenario)
              );
              const params = new URLSearchParams({
                scenario,
                personality,
                difficulty,
                accent,
                duration: duration.toString(),
                customerInitiates: customerInitiates.toString(),
              });
              router.push(`/call?${params.toString()}`);
            }
          }}
        >
          {t("brief.beginCall")}
        </PrimaryButton>
      </div>
    </div>
  );
}
