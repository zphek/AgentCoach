"use client";

import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { SCENARIOS, PERSONALITIES, DIFFICULTIES, ACCENTS, DURATIONS } from "@/lib/constants";

function pickRandom<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function RandomCallButton() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleRandomCall = () => {
    const params = new URLSearchParams({
      scenario: pickRandom(SCENARIOS).value,
      personality: pickRandom(PERSONALITIES).value,
      difficulty: pickRandom(DIFFICULTIES).value,
      accent: pickRandom(ACCENTS).value,
      duration: pickRandom(DURATIONS).value.toString(),
    });
    router.push(`/call-brief?${params.toString()}`);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={handleRandomCall}
      className="w-full flex items-center gap-4 bg-surface-container-lowest rounded-[20px] px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-surface-container-high hover:bg-surface-container-low transition-colors active:bg-surface-container group"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tertiary-fixed-dim to-tertiary flex items-center justify-center flex-shrink-0">
        <Shuffle size={20} className="text-white" />
      </div>
      <div className="text-left">
        <h3 className="text-[16px] leading-[24px] font-semibold text-primary">
          {t("home.randomCall")}
        </h3>
        <p className="text-[13px] leading-[18px] text-secondary">
          {t("home.randomCallDesc")}
        </p>
      </div>
    </motion.button>
  );
}
