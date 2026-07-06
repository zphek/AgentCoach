import { NextResponse } from "next/server";
import { z } from "zod";

const createSessionSchema = z.object({
  scenario: z.enum(["technical-support", "billing", "customer-service"]),
  personality: z.enum(["friendly", "angry", "confused"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  accent: z.enum(["us", "uk", "australian", "indian", "southern", "irish"]),
  duration: z.union([z.literal(5), z.literal(10)]),
});

export async function GET() {
  // TODO: Fetch sessions from database
  return NextResponse.json({
    sessions: [],
    message: "Session endpoint ready",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createSessionSchema.parse(body);

    // TODO: Create session in database, integrate with OpenAI Realtime API
    const sessionId = crypto.randomUUID();

    return NextResponse.json(
      {
        id: sessionId,
        ...validated,
        status: "created",
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
