import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username } = await req.json();
  // In a real app, generate a random challenge and fetch the user's credential
  return NextResponse.json({ challenge: "mock-login-challenge", username });
} 