import type { Accent, Personality } from "@/types/practice";

export type RealtimeVoice = "alloy" | "ash" | "ballad" | "coral" | "echo" | "sage" | "shimmer" | "verse";

/**
 * Maps accent + personality to an OpenAI Realtime voice.
 * Different combinations produce different voice characteristics.
 */
const VOICE_MAP: Record<Accent, Record<Personality, RealtimeVoice>> = {
  us: {
    friendly: "shimmer",
    angry: "ash",
    confused: "coral",
  },
  uk: {
    friendly: "sage",
    angry: "echo",
    confused: "ballad",
  },
  australian: {
    friendly: "alloy",
    angry: "verse",
    confused: "shimmer",
  },
  indian: {
    friendly: "coral",
    angry: "sage",
    confused: "echo",
  },
  southern: {
    friendly: "ballad",
    angry: "alloy",
    confused: "ash",
  },
  irish: {
    friendly: "verse",
    angry: "coral",
    confused: "sage",
  },
};

export function getVoiceForConfig(accent: Accent, personality: Personality): RealtimeVoice {
  return VOICE_MAP[accent]?.[personality] ?? "alloy";
}
