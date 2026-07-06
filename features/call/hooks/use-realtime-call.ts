"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { GeneratedScenario } from "@/types/scenario";
import type { Accent, Personality, Difficulty } from "@/types/practice";
import type { Language } from "@/lib/translations";
import { buildRealtimeInstructions } from "@/services/realtime/instructions";

export type CallStatus = "idle" | "connecting" | "connected" | "ended" | "error";
export type EndReason = "user" | "ai_satisfied" | "ai_hung_up" | "error" | "disconnected";

interface TranscriptEntry {
  role: "agent" | "customer";
  text: string;
}

interface UseRealtimeCallProps {
  scenario: GeneratedScenario;
  personality: Personality;
  difficulty: Difficulty;
  accent: Accent;
  language: Language;
  customerInitiates: boolean;
}

interface UseRealtimeCallReturn {
  status: CallStatus;
  duration: number;
  isMuted: boolean;
  error: string | null;
  endReason: EndReason | null;
  transcript: TranscriptEntry[];
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
}

export function useRealtimeCall({
  scenario,
  personality,
  difficulty,
  accent,
  language,
  customerInitiates,
}: UseRealtimeCallProps): UseRealtimeCallReturn {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }
  }, []);

  const startCall = useCallback(async () => {
    try {
      setStatus("connecting");
      setError(null);
      setDuration(0);
      setTranscript([]);
      setEndReason(null);

      // 1. Build instructions
      const instructions = buildRealtimeInstructions(scenario, personality, difficulty, language, customerInitiates);

      // 2. Get ephemeral token
      const tokenRes = await fetch("/api/realtime/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions, accent, personality, customerInitiates }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.success) {
        throw new Error(tokenData.error || "Failed to get session token");
      }

      const ephemeralKey = tokenData.clientSecret.value;

      // 3. Create RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 4. Remote audio
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // 5. Local mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      pc.addTrack(stream.getTracks()[0]);

      // 6. Data channel
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        setStatus("connected");
        // If the customer should speak first, trigger a response
        if (customerInitiates) {
          const responseCreate = {
            type: "response.create",
            response: {
              modalities: ["audio", "text"],
            },
          };
          dc.send(JSON.stringify(responseCreate));
        }
      });

      dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);

          // Capture agent transcription (user speech)
          if (
            event.type === "conversation.item.input_audio_transcription.completed" &&
            event.transcript
          ) {
            setTranscript((prev) => [
              ...prev,
              { role: "agent", text: event.transcript.trim() },
            ]);
          }

          // Capture AI customer speech transcription
          if (
            event.type === "response.audio_transcript.done" &&
            event.transcript
          ) {
            setTranscript((prev) => [
              ...prev,
              { role: "customer", text: event.transcript.trim() },
            ]);
          }

          // Handle function call — AI customer wants to end the call
          if (event.type === "response.function_call_arguments.done") {
            if (event.name === "end_call") {
              const output = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: event.call_id,
                  output: JSON.stringify({ status: "call_ended" }),
                },
              };
              dc.send(JSON.stringify(output));

              setTimeout(() => {
                setEndReason("ai_satisfied");
                setStatus("ended");
                cleanup();
              }, 2000);
            }

            // AI customer hangs up because the agent was offensive
            if (event.name === "hang_up") {
              const output = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: event.call_id,
                  output: JSON.stringify({ status: "hung_up" }),
                },
              };
              dc.send(JSON.stringify(output));

              setTimeout(() => {
                setEndReason("ai_hung_up");
                setStatus("ended");
                cleanup();
              }, 2500);
            }
          }

          if (event.type === "error") {
            console.error("Realtime API error:", event);
          }
        } catch {
          // Ignore non-JSON
        }
      });

      // 7. SDP handshake
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      if (!sdpResponse.ok) {
        const sdpError = await sdpResponse.text();
        console.error("SDP Error:", sdpResponse.status, sdpError);
        throw new Error(`Failed to establish WebRTC connection: ${sdpError}`);
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setEndReason("disconnected");
          setStatus("ended");
          cleanup();
        }
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setError(message);
      setEndReason("error");
      setStatus("error");
      cleanup();
    }
  }, [scenario, personality, difficulty, accent, language, customerInitiates, cleanup]);

  const endCall = useCallback(() => {
    setEndReason("user");
    setStatus("ended");
    cleanup();
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return { status, duration, isMuted, error, endReason, transcript, startCall, endCall, toggleMute };
}
