"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { CallScreen } from "@/features/call/components/call-screen";
import { Loader2 } from "lucide-react";
import type { Personality, Difficulty, Accent, Scenario } from "@/types/practice";
import type { GeneratedScenario } from "@/types/scenario";

function CallPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scenario = (searchParams.get("scenario") as Scenario) || "technical-support";
  const personality = (searchParams.get("personality") as Personality) || "angry";
  const difficulty = (searchParams.get("difficulty") as Difficulty) || "medium";
  const accent = (searchParams.get("accent") as Accent) || "us";
  const customerInitiates = searchParams.get("customerInitiates") === "true";

  const [scenarioData, setScenarioData] = useState<GeneratedScenario | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read the scenario from sessionStorage (stored by call-brief)
    const stored = sessionStorage.getItem("agentcoach-scenario");
    if (stored) {
      try {
        const parsed: GeneratedScenario = JSON.parse(stored);
        setScenarioData(parsed);
      } catch {
        setError("Failed to load scenario data");
      }
    } else {
      setError("No scenario data found. Please go back and try again.");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-primary-container to-[#0a0a0a] flex flex-col items-center justify-center px-8">
        <p className="text-on-primary/60 text-[16px] font-medium text-center mb-6">
          {error}
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl bg-white/20 text-on-primary font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!scenarioData) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-primary-container to-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-on-primary/60 animate-spin mb-4" />
        <p className="text-on-primary/60 text-[14px] font-medium">
          Preparing your call...
        </p>
      </div>
    );
  }

  return (
    <CallScreen
      scenario={scenarioData}
      personality={personality}
      difficulty={difficulty}
      accent={accent}
      customerInitiates={customerInitiates}
      onEnd={() => router.push("/home")}
    />
  );
}

export default function CallPage() {
  return (
    <MobileContainer variant="splash" className="bg-[#0a0a0a]">
      <Suspense
        fallback={
          <div className="min-h-dvh bg-gradient-to-b from-primary-container to-[#0a0a0a] flex items-center justify-center">
            <Loader2 size={40} className="text-on-primary/60 animate-spin" />
          </div>
        }
      >
        <CallPageContent />
      </Suspense>
    </MobileContainer>
  );
}
