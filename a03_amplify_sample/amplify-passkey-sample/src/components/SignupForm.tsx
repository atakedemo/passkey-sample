'use client';

import React, { useState, useEffect } from 'react';
import { WebAuthnService } from '../utils/webauthn';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !displayName.trim()) {
      onError?.('Please fill in all fields');
      return;
    }

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
      // Generate registration options
      const options = await WebAuthnService.generateRegistrationOptions(
        'Passkey Sample App',
        window.location.hostname,
        username,
        username,
        displayName
      );

      // Start registration
      const registrationResponse = await WebAuthnService.register(options);

      // In a real application, you would send this to your backend
      console.log('Registration successful:', registrationResponse);
      
      // Store user info in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify({
        username,
        displayName,
        credentialId: registrationResponse.id,
        rawId: registrationResponse.rawId,
      }));

      onSuccess?.();
    } catch (error) {
      console.error('Signup failed:', error);
      onError?.(error instanceof Error ? error.message : 'Signup failed');
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
      <h2>Sign Up with Passkey</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Enter username"
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="displayName" style={styles.label}>
            Display Name:
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={styles.input}
            placeholder="Enter display name"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Creating Passkey...' : 'Create Passkey'}
        </button>
      </form>
      
      <div style={styles.info}>
        <p>This will create a passkey on your device for secure authentication.</p>
        <p>You'll be prompted to use your device's biometric authentication or PIN.</p>
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
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  info: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    color: '#c62828',
  },
};

export default SignupForm; 