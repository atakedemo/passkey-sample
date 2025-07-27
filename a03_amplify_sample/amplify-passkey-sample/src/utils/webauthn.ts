import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/typescript-types';

export interface WebAuthnRegistrationOptions {
  rpName: string;
  rpID: string;
  userID: string;
  userName: string;
  userDisplayName: string;
  challenge: string;
  pubKeyCredParams: Array<{
    alg: number;
    type: string;
  }>;
  timeout: number;
  attestation: string;
  authenticatorSelection: {
    authenticatorAttachment: string;
    residentKey: string;
    requireResidentKey: boolean;
    userVerification: string;
  };
  excludeCredentials: Array<{
    id: string;
    type: string;
    transports: string[];
  }>;
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  timeout: number;
  rpID: string;
  allowCredentials: Array<{
    id: string;
    type: string;
    transports: string[];
  }>;
  userVerification: string;
}

export class WebAuthnService {
  static async isSupported(): Promise<boolean> {
    return browserSupportsWebAuthn();
  }

  static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    return platformAuthenticatorIsAvailable();
  }

  static async register(options: any): Promise<RegistrationResponseJSON> {
    try {
      const attResp = await startRegistration(options);
      return attResp;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  static async authenticate(options: any): Promise<AuthenticationResponseJSON> {
    try {
      const authResp = await startAuthentication(options);
      return authResp;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  static async generateRegistrationOptions(
    rpName: string,
    rpID: string,
    userID: string,
    userName: string,
    userDisplayName: string
  ): Promise<any> {
    // Generate a random challenge
    const challenge = this.generateChallenge();
    
    return {
      rp: {
        name: rpName,
        id: rpID,
      },
      user: {
        id: userID,
        name: userName,
        displayName: userDisplayName,
      },
      challenge: challenge,
      pubKeyCredParams: [
        {
          alg: -7, // ES256
          type: 'public-key',
        },
        {
          alg: -257, // RS256
          type: 'public-key',
        },
      ],
      timeout: 60000,
      attestation: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'required',
        requireResidentKey: true,
        userVerification: 'preferred',
      },
      excludeCredentials: [],
    };
  }

  static async generateAuthenticationOptions(
    rpID: string,
    allowCredentials: Array<{ id: string; type: string; transports: string[] }> = []
  ): Promise<any> {
    const challenge = this.generateChallenge();
    
    return {
      rpId: rpID,
      challenge: challenge,
      timeout: 60000,
      allowCredentials: allowCredentials,
      userVerification: 'preferred',
    };
  }

  private static generateChallenge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
} 