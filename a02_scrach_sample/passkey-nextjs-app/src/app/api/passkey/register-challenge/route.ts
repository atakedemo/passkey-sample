import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username } = await req.json();
  // In a real app, generate a random challenge and store it server-side
  return NextResponse.json({ challenge: "mock-registration-challenge", username });
} 