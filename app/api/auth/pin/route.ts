import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";

const pinSchema = z.object({
  pin: z.string().length(4, "PIN must be 4 digits"),
});

const AUTH_COOKIE = "agent-coach-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = pinSchema.parse(body);

    const validPin = process.env.AUTH_PIN || "2004";

    if (pin !== validPin) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN" },
        { status: 401 }
      );
    }

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
