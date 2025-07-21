import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, credential, challenge } = await req.json();
  // In a real app, verify the attestation and store the credential
  return NextResponse.json({ message: `User ${username} registered with passkey (mock).` });
} 