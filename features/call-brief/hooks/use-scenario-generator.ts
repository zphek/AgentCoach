"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import type { GeneratedScenario } from "@/types/scenario";

interface UseScenarioGeneratorProps {
  scenario: string;
  personality: string;
  difficulty: string;
  accent: string;
  duration: number;
}

interface UseScenarioGeneratorReturn {
  data: GeneratedScenario | null;
  isLoading: boolean;
  error: string | null;
  regenerate: () => void;
}

export function useScenarioGenerator(
  config: UseScenarioGeneratorProps
): UseScenarioGeneratorReturn {
  const { language } = useLanguage();
  const [data, setData] = useState<GeneratedScenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scenario/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: config.scenario,
          personality: config.personality,
          difficulty: config.difficulty,
          accent: config.accent,
          duration: config.duration,
          language,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setData(result.scenario);
      } else {
        setError(result.error || "Failed to generate scenario");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [config.scenario, config.personality, config.difficulty, config.accent, config.duration, language]);

  useEffect(() => {
    generate();
  }, [generate]);

  return { data, isLoading, error, regenerate: generate };
}
