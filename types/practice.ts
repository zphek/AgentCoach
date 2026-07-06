export type Scenario = "technical-support" | "billing" | "customer-service";

export type Personality = "friendly" | "angry" | "confused";

export type Difficulty = "easy" | "medium" | "hard";

export type Accent = "us" | "uk" | "australian" | "indian" | "southern" | "irish";

export type Duration = 5 | 10;

export interface PracticeConfig {
  scenario: Scenario;
  personality: Personality;
  difficulty: Difficulty;
  accent: Accent;
  duration: Duration;
}

export interface SessionSummary {
  id: string;
  scenario: Scenario;
  personality: Personality;
  difficulty: Difficulty;
  score?: number;
  duration: number;
  createdAt: string;
}

export interface QuickStats {
  practiceTimeHours: number;
  avgScore: number;
  callsCompletedThisWeek: number;
}
