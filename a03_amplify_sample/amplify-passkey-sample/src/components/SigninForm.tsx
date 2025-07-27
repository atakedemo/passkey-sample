'use client';

import React, { useState, useEffect } from 'react';
import { WebAuthnService } from '../utils/webauthn';

interface SigninFormProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAuthenticatorAvailable, setIsPlatformAuthenticatorAvailable] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await WebAuthnService.isSupported();
      const platformAvailable = await WebAuthnService.isPlatformAuthenticatorAvailable();
      
      setIsSupported(supported);
      setIsPlatformAuthenticatorAvailable(platformAvailable);
    };

    checkSupport();
  }, []);

  const handleSignin = async () => {
    if (!isSupported) {
      onError?.('WebAuthn is not supported in this browser');
      return;
    }

    if (!isPlatformAuthenticatorAvailable) {
      onError?.('Platform authenticator is not available');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user has a stored credential
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        onError?.('No passkey found. Please sign up first.');
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      
      // Generate authentication options
      const options = await WebAuthnService.generateAuthenticationOptions(
        window.location.hostname,
        [
          {
            id: user.credentialId,
            type: 'public-key',
            transports: ['internal'],
          },
        ]
      );

      // Start authentication
      const authenticationResponse = await WebAuthnService.authenticate(options);

      // In a real application, you would verify this with your backend
      console.log('Authentication successful:', authenticationResponse);
      
      onSuccess?.(user);
    } catch (error) {
      console.error('Signin failed:', error);
      onError?.(error instanceof Error ? error.message : 'Signin failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div style={styles.error}>
        <h3>WebAuthn Not Supported</h3>
        <p>Your browser does not support WebAuthn. Please use a modern browser.</p>
      </div>
    );
  }

  if (!isPlatformAuthenticatorAvailable) {
    return (
      <div style={styles.error}>
        <h3>Platform Authenticator Not Available</h3>
        <p>Your device does not have a platform authenticator (passkey support).</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Sign In with Passkey</h2>
      
      <div style={styles.info}>
        <p>Use your device's biometric authentication or PIN to sign in.</p>
      </div>
      
      <button
        onClick={handleSignin}
        disabled={isLoading}
        style={styles.button}
      >
        {isLoading ? 'Authenticating...' : 'Sign In with Passkey'}
      </button>
      
      <div style={styles.note}>
        <p>Note: You must have created a passkey first to use this feature.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  info: {
    padding: '1rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '1rem',
  },
  note: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff3e0',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#e65100',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    color: '#c62828',
  },
};

export default SigninForm; 