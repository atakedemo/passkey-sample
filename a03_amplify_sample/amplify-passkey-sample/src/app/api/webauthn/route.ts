import { NextRequest, NextResponse } from 'next/server';
import { 
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// In a real application, you would store these in a database
const users = new Map();
const challenges = new Map();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'generate-registration-options':
        return await handleGenerateRegistrationOptions(data);
      
      case 'verify-registration':
        return await handleVerifyRegistration(data);
      
      case 'generate-authentication-options':
        return await handleGenerateAuthenticationOptions(data);
      
      case 'verify-authentication':
        return await handleVerifyAuthentication(data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('WebAuthn API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleGenerateRegistrationOptions(data: { username: string; displayName: string }) {
  const { username, displayName } = data;
  
  const options = await generateRegistrationOptions({
    rpName: 'Passkey Sample App',
    rpID: 'localhost',
    userID: username,
    userName: username,
    userDisplayName: displayName,
    attestationType: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'required',
      requireResidentKey: true,
      userVerification: 'preferred',
    },
  });

  // Store challenge for verification
  challenges.set(username, options.challenge);

  return NextResponse.json(options);
}

async function handleVerifyRegistration(data: any) {
  const { username, response } = data;
  
  const expectedChallenge = challenges.get(username);
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 400 });
  }

  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
    });

    if (verification.verified) {
      // Store user credential in database
      users.set(username, {
        credentialID: verification.registrationInfo?.credentialID,
        credentialPublicKey: verification.registrationInfo?.credentialPublicKey,
        counter: verification.registrationInfo?.counter,
      });
      
      challenges.delete(username);
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Registration verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}

async function handleGenerateAuthenticationOptions(data: { username: string }) {
  const { username } = data;
  
  const user = users.get(username);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const options = await generateAuthenticationOptions({
    rpID: 'localhost',
    allowCredentials: [
      {
        id: user.credentialID,
        type: 'public-key',
        transports: ['internal'],
      },
    ],
    userVerification: 'preferred',
  });

  // Store challenge for verification
  challenges.set(username, options.challenge);

  return NextResponse.json(options);
}

async function handleVerifyAuthentication(data: any) {
  const { username, response } = data;
  
  const expectedChallenge = challenges.get(username);
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 400 });
  }

  const user = users.get(username);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
      authenticator: {
        credentialPublicKey: user.credentialPublicKey,
        credentialID: user.credentialID,
        counter: user.counter,
      },
    });

    if (verification.verified) {
      // Update counter
      user.counter = verification.authenticationInfo.newCounter;
      users.set(username, user);
      
      challenges.delete(username);
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Authentication verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
} 