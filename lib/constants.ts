import type { Scenario, Personality, Difficulty, Accent, Duration } from "@/types/practice";

export const APP_NAME = "AgentCoach";
export const APP_TAGLINE = "Elevate your craft.";
export const APP_FOOTER = "Made with ❤️ by Bernardo";

export const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: "technical-support", label: "Technical Support" },
  { value: "billing", label: "Billing" },
  { value: "customer-service", label: "Customer Service" },
];

export const PERSONALITIES: { value: Personality; label: string }[] = [
  { value: "friendly", label: "Friendly" },
  { value: "angry", label: "Angry" },
  { value: "confused", label: "Confused" },
];

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const ACCENTS: { value: Accent; label: string }[] = [
  { value: "us", label: "🇺🇸 US" },
  { value: "uk", label: "🇬🇧 UK" },
  { value: "australian", label: "🇦🇺 AU" },
  { value: "indian", label: "🇮🇳 IN" },
  { value: "southern", label: "🤠 South" },
  { value: "irish", label: "🇮🇪 Irish" },
];

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: 5, label: "5m" },
  { value: 10, label: "10m" },
];

export const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "Home" as const },
  { href: "/practice", label: "Practice", icon: "Dumbbell" as const },
  { href: "/history", label: "History", icon: "History" as const },
  { href: "/profile", label: "Profile", icon: "User" as const },
] as const;
