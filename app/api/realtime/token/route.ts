import { NextResponse } from "next/server";
import { z } from "zod";
import { getVoiceForConfig } from "@/services/realtime/voice-map";
import { getRealtimeTools } from "@/services/realtime/instructions";
import type { Accent, Personality } from "@/types/practice";

const tokenSchema = z.object({
  instructions: z.string(),
  accent: z.enum(["us", "uk", "australian", "indian", "southern", "irish"]),
  personality: z.enum(["friendly", "angry", "confused"]),
  customerInitiates: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instructions, accent, personality, customerInitiates } = tokenSchema.parse(body);

    const voice = getVoiceForConfig(accent as Accent, personality as Personality);
    const tools = getRealtimeTools();

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-realtime-2",
            instructions,
            tools,
            audio: {
              output: { voice },
              input: {
                transcription: {
                  model: "gpt-4o-mini-transcribe",
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.3,
                  prefix_padding_ms: 500,
                  silence_duration_ms: 800,
                  interrupt_response: false,
                },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI token error:", response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Failed to create session token: ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      clientSecret: data,
      voice,
      customerInitiates,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Realtime token error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
