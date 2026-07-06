import { NextResponse } from "next/server";
import { z } from "zod";
import { generateScenario } from "@/services/agent";

const generateSchema = z.object({
  scenario: z.enum(["technical-support", "billing", "customer-service"]),
  personality: z.enum(["friendly", "angry", "confused"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  accent: z.enum(["us", "uk", "australian", "indian", "southern", "irish"]),
  duration: z.union([z.literal(5), z.literal(10)]),
  language: z.enum(["en", "es"]).optional().default("en"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = generateSchema.parse(body);

    const scenario = await generateScenario(config);

    return NextResponse.json({ success: true, scenario });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Scenario generation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to generate scenario" },
      { status: 500 }
    );
  }
}
