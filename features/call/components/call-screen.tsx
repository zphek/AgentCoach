"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  ChevronDown,
  Lock,
  Sparkles,
  Lightbulb,
  Volume2,
  Grid3X3,
} from "lucide-react";
import { useRealtimeCall, type CallStatus } from "../hooks/use-realtime-call";
import { useLanguage } from "@/providers/language-provider";
import { formatDuration } from "@/lib/format";
import type { GeneratedScenario } from "@/types/scenario";
import type { Accent, Personality, Difficulty } from "@/types/practice";

interface CallScreenProps {
  scenario: GeneratedScenario;
  personality: Personality;
  difficulty: Difficulty;
  accent: Accent;
  customerInitiates: boolean;
  onEnd: () => void;
}

/* ─── Waveform Bars ─── */
function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  const bars = [
    { h: "h-full", opacity: 20, delay: "0s", dur: "1s" },
    { h: "h-3/4", opacity: 40, delay: "0.1s", dur: "1.2s" },
    { h: "h-1/2", opacity: 60, delay: "0.2s", dur: "0.9s" },
    { h: "h-full", opacity: 80, delay: "0.3s", dur: "1.5s" },
    { h: "h-2/3", opacity: 100, delay: "0.4s", dur: "1.1s" },
    { h: "h-full", opacity: 80, delay: "0.5s", dur: "1.3s" },
    { h: "h-1/2", opacity: 60, delay: "0.6s", dur: "1s" },
    { h: "h-3/4", opacity: 40, delay: "0.7s", dur: "1.4s" },
    { h: "h-full", opacity: 20, delay: "0.8s", dur: "1.2s" },
  ];

  return (
    <div className="w-full h-24 relative rounded-xl overflow-hidden bg-surface-container-low/50 flex items-center justify-center border border-surface-container-high/50">
      <div className="flex items-center gap-1 h-12">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`w-1.5 ${bar.h} rounded-full transition-all duration-300 ${
              isActive ? "animate-pulse" : "opacity-20"
            } ${
              i === 4
                ? "bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(237,193,68,0.5)]"
                : `bg-primary-container/${bar.opacity}`
            }`}
            style={
              isActive
                ? {
                    animationDelay: bar.delay,
                    animationDuration: bar.dur,
                  }
                : undefined
            }
          />
        ))}
      </div>
      <div className="absolute bottom-2 text-[12px] font-semibold text-secondary/60">
        {isActive ? "AI Listening..." : "Muted"}
      </div>
    </div>
  );
}

/* ─── Auto Start Hook ─── */
function useAutoStart(startCall: () => Promise<void>, micGranted: boolean) {
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (!hasStartedRef.current && micGranted) {
      hasStartedRef.current = true;
      startCall();
    }
  }, [startCall, micGranted]);
}

/* ─── Main Component ─── */
export function CallScreen({
  scenario,
  personality,
  difficulty,
  accent,
  customerInitiates,
  onEnd,
}: CallScreenProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { status, duration, isMuted, error, endReason, transcript, startCall, endCall, toggleMute } =
    useRealtimeCall({ scenario, personality, difficulty, accent, language, customerInitiates });

  // Mic permission state
  const [micState, setMicState] = useState<"checking" | "granted" | "denied" | "prompt">("checking");

  useEffect(() => {
    async function checkMic() {
      try {
        // Check current permission state if available
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
          if (result.state === "granted") {
            setMicState("granted");
            return;
          }
          if (result.state === "denied") {
            setMicState("denied");
            return;
          }
        }
        setMicState("prompt");
      } catch {
        // permissions API not supported, try requesting directly
        setMicState("prompt");
      }
    }
    checkMic();
  }, []);

  const requestMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // release immediately
      setMicState("granted");
    } catch {
      setMicState("denied");
    }
  }, []);

  useAutoStart(startCall, micState === "granted");

  const goToReview = useCallback(() => {
    const reviewData = {
      transcript: transcript
        .map((entry) => `${entry.role === "agent" ? "Agent" : "Customer"}: ${entry.text}`)
        .join("\n"),
      issueTitle: scenario.issueTitle,
      customerName: scenario.customerName,
      personality,
      difficulty,
      endReason,
      duration,
    };
    sessionStorage.setItem("agentcoach-review", JSON.stringify(reviewData));
    router.push("/call-review");
  }, [transcript, scenario, personality, difficulty, endReason, duration, router]);

  useEffect(() => {
    if (status === "ended" && (endReason === "ai_satisfied" || endReason === "ai_hung_up") && transcript.length > 0) {
      const delay = endReason === "ai_hung_up" ? 3000 : 1500;
      const timer = setTimeout(goToReview, delay);
      return () => clearTimeout(timer);
    }
  }, [status, endReason, transcript, goToReview]);

  const emoji = personality === "angry" ? "😤" : personality === "confused" ? "😕" : "😊";

  /* ─── Mic Permission Required ─── */
  if (micState === "checking") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-tertiary-fixed-dim animate-spin mb-4" />
      </div>
    );
  }

  if (micState === "prompt" || micState === "denied") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center px-8 gap-6">
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
          <MicOff size={40} className="text-secondary" />
        </div>
        <h2 className="text-[24px] font-bold text-primary text-center">
          {language === "es" ? "Micrófono Requerido" : "Microphone Required"}
        </h2>
        <p className="text-[16px] text-secondary text-center max-w-[300px]">
          {micState === "denied"
            ? language === "es"
              ? "Has denegado el acceso al micrófono. Habilítalo en la configuración de tu navegador para continuar."
              : "You've denied microphone access. Enable it in your browser settings to continue."
            : language === "es"
              ? "Necesitamos acceso a tu micrófono para poder hacer la llamada de práctica."
              : "We need microphone access to start the practice call."}
        </p>
        {micState === "prompt" ? (
          <button
            type="button"
            onClick={requestMic}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-on-primary font-semibold text-[16px] active:scale-95 transition-transform shadow-md"
          >
            <Mic size={20} />
            {language === "es" ? "Habilitar Micrófono" : "Enable Microphone"}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={requestMic}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-on-primary font-semibold text-[16px] active:scale-95 transition-transform shadow-md"
            >
              <Mic size={20} />
              {language === "es" ? "Intentar de Nuevo" : "Try Again"}
            </button>
            <button
              type="button"
              onClick={onEnd}
              className="px-6 py-3 rounded-2xl bg-surface-container text-primary font-semibold text-[14px] active:scale-95 transition-transform"
            >
              {language === "es" ? "Volver" : "Go Back"}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── Connecting / Error state ─── */
  if (status === "connecting" || status === "idle") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-tertiary-fixed-dim animate-spin mb-4" />
        <p className="text-[16px] font-medium text-secondary">{t("call.connecting")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center px-8 gap-4">
        <p className="text-error text-[16px] font-medium text-center">{error}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => startCall()}
            className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-semibold text-[14px]"
          >
            {t("call.retry")}
          </button>
          <button
            type="button"
            onClick={onEnd}
            className="px-6 py-3 rounded-2xl bg-surface-container text-primary font-semibold text-[14px]"
          >
            {t("call.goBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-container-lowest flex flex-col relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface-container-low opacity-50 z-0" />

      {/* ─── Header ─── */}
      <header className="relative z-10 w-full px-6 py-4 flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            endCall();
            setTimeout(goToReview, 500);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <ChevronDown size={20} className="text-primary" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full shadow-sm">
          <Lock size={14} className="text-tertiary-fixed-dim" />
          <span className="text-[12px] font-semibold text-secondary">
            {language === "es" ? "Conexión Segura" : "Secure Connection"}
          </span>
        </div>
        <div className="w-10 h-10" />
      </header>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full pb-[280px]">
        {/* Avatar + Identity */}
        <div className="flex flex-col items-center mb-12 relative">
          {/* Decorative rings */}
          <div className="absolute inset-0 -m-8 border border-surface-container-high rounded-full opacity-50" />
          <div className="absolute inset-0 -m-16 border border-surface-container-high rounded-full opacity-30" />

          <div className="relative">
            {/* Pulse ring */}
            {status === "connected" && (
              <div className="absolute inset-0 bg-tertiary-fixed-dim/20 rounded-full animate-pulse -m-2" />
            )}
            <div className="w-32 h-32 rounded-full bg-surface-container flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative z-10 border-4 border-surface-container-lowest">
              <span className="text-[56px]">{emoji}</span>
            </div>
          </div>

          <h1 className="text-[28px] leading-[34px] tracking-[-0.02em] font-bold text-primary mt-4 mb-2 relative z-10">
            {scenario.customerName}
          </h1>
          <div className="flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[14px] font-medium text-secondary">
              {status === "connected"
                ? `${language === "es" ? "En Llamada" : "Live Call"} - ${formatDuration(duration)}`
                : t("call.ended")}
            </span>
          </div>
        </div>

        {/* Waveform */}
        <WaveformVisualizer isActive={status === "connected" && !isMuted} />

        {/* Coaching Nudge */}
        {status === "connected" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4 w-full bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-2xl border border-surface-container-high/50 shadow-sm flex items-start gap-3"
          >
            <Lightbulb size={20} className="text-tertiary-fixed-dim flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] font-semibold text-primary">
                {language === "es" ? "Consejo" : "Suggested Pivot"}
              </h3>
              <p className="text-[14px] text-secondary mt-1">
                {!customerInitiates && transcript.length === 0
                  ? language === "es"
                    ? "El cliente espera tu saludo. ¡Preséntate y pregúntale en qué puedes ayudarle!"
                    : "The customer is waiting for your greeting. Introduce yourself and ask how you can help!"
                  : language === "es"
                    ? "Reconoce su frustración antes de ofrecer la solución."
                    : "Acknowledge their frustration before offering the solution."}
              </p>
            </div>
          </motion.div>
        )}

        {/* End reason feedback */}
        {status === "ended" && endReason === "ai_satisfied" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#10B981] text-[14px] font-medium mt-4 text-center"
          >
            ✅ {t("call.satisfied")}
          </motion.p>
        )}

        {status === "ended" && endReason === "ai_hung_up" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-error text-[14px] font-medium mt-4 text-center px-4"
          >
            📞❌ {language === "es" ? "¡El cliente te colgó! Preparando tu evaluación..." : "The customer hung up on you! Preparing your review..."}
          </motion.p>
        )}
      </div>

      {/* ─── Current Mission Card ─── */}
      {status === "connected" && (
        <div className="absolute bottom-[140px] left-6 right-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-2xl border border-surface-container-high/50 shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-tertiary-fixed-dim" />
              <span className="text-[14px] font-semibold text-primary uppercase tracking-wider">
                {language === "es" ? "Misión Actual" : "Current Mission"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {scenario.objectives.slice(0, 2).map((obj, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[12px] font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-[14px] text-primary">{obj}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Bottom Controls ─── */}
      <div className="absolute bottom-0 w-full left-0 right-0 p-6 pb-[max(24px,env(safe-area-inset-bottom))] bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent flex justify-center items-center gap-6 z-20">
        {status === "connected" && (
          <>
            {/* Keypad */}
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-all active:scale-95"
            >
              <Grid3X3 size={22} />
            </button>

            {/* Mute */}
            <button
              type="button"
              onClick={toggleMute}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                isMuted
                  ? "bg-tertiary-fixed-dim text-white"
                  : "bg-surface-container text-primary hover:bg-surface-container-high"
              }`}
            >
              {isMuted ? <MicOff size={26} /> : <Mic size={26} />}
            </button>

            {/* End Call */}
            <button
              type="button"
              onClick={() => {
                endCall();
                setTimeout(goToReview, 500);
              }}
              className="w-20 h-20 rounded-full bg-error flex items-center justify-center text-on-error hover:opacity-90 transition-all active:scale-95 shadow-[0_8px_24px_rgba(186,26,26,0.3)]"
            >
              <PhoneOff size={30} />
            </button>

            {/* Volume */}
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-all active:scale-95"
            >
              <Volume2 size={22} />
            </button>
          </>
        )}

        {status === "ended" && (
          <div className="flex gap-4">
            {transcript.length > 2 && (
              <button
                type="button"
                onClick={goToReview}
                className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-semibold text-[16px] active:scale-95 transition-transform"
              >
                {t("call.viewReview")}
              </button>
            )}
            <button
              type="button"
              onClick={onEnd}
              className="px-8 py-4 rounded-2xl bg-surface-container text-primary font-semibold text-[16px] active:scale-95 transition-transform"
            >
              {t("call.backHome")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
