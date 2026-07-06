"use client";

import { useState, useCallback } from "react";
import type {
  PracticeConfig,
  Scenario,
  Personality,
  Difficulty,
  Accent,
  Duration,
} from "@/types/practice";

const DEFAULT_CONFIG: PracticeConfig = {
  scenario: "technical-support",
  personality: "angry",
  difficulty: "medium",
  accent: "us",
  duration: 10,
};

export function usePracticeConfig(initial?: Partial<PracticeConfig>) {
  const [config, setConfig] = useState<PracticeConfig>({
    ...DEFAULT_CONFIG,
    ...initial,
  });

  const setScenario = useCallback(
    (scenario: Scenario) => setConfig((prev) => ({ ...prev, scenario })),
    []
  );

  const setPersonality = useCallback(
    (personality: Personality) =>
      setConfig((prev) => ({ ...prev, personality })),
    []
  );

  const setDifficulty = useCallback(
    (difficulty: Difficulty) =>
      setConfig((prev) => ({ ...prev, difficulty })),
    []
  );

  const setAccent = useCallback(
    (accent: Accent) => setConfig((prev) => ({ ...prev, accent })),
    []
  );

  const setDuration = useCallback(
    (duration: Duration) => setConfig((prev) => ({ ...prev, duration })),
    []
  );

  return {
    config,
    setScenario,
    setPersonality,
    setDifficulty,
    setAccent,
    setDuration,
  };
}
