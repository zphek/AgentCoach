"use client";

import { useState, useEffect } from "react";
import { GreetingSection } from "./greeting-section";
import { StartPracticeCard } from "./start-practice-card";
import { RandomCallButton } from "./random-call-button";
import { RecentSession } from "./recent-session";
import { QuickStats } from "./quick-stats";

const USER_NAME = "Yonelys";

export function HomeScreen() {
  const [showName, setShowName] = useState(true);

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("agentcoach-show-name");
    if (saved !== null) setShowName(saved === "true");
  }, []);

  const toggleName = () => {
    setShowName((prev) => {
      localStorage.setItem("agentcoach-show-name", String(!prev));
      return !prev;
    });
  };

  return (
    <div className="space-y-stack-lg">
      <GreetingSection
        userName={showName ? USER_NAME : "👋"}
        showName={showName}
        onToggleName={toggleName}
      />
      <StartPracticeCard />
      <RandomCallButton />
      <RecentSession />
      <QuickStats />
      <div className="h-8" />
    </div>
  );
}
