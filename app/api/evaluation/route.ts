import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateCall } from "@/services/agent/evaluator";

const evaluationSchema = z.object({
  transcript: z.string().min(10, "Transcript too short"),
  issueTitle: z.string(),
  customerName: z.string(),
  personality: z.string(),
  difficulty: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = evaluationSchema.parse(body);

    const evaluation = await evaluateCall(input);

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Evaluation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate call" },
      { status: 500 }
    );
  }
}
