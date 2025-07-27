'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WebAuthnService } from '../../utils/webauthn';

const DemoPage: React.FC = () => {
  const [browserSupport, setBrowserSupport] = useState<{
    webauthn: boolean;
    platformAuthenticator: boolean;
  }>({ webauthn: false, platformAuthenticator: false });

  useEffect(() => {
    const checkSupport = async () => {
      const webauthn = await WebAuthnService.isSupported();
      const platformAuth = await WebAuthnService.isPlatformAuthenticatorAvailable();
      
      setBrowserSupport({
        webauthn,
        platformAuthenticator: platformAuth,
      });
    };

    checkSupport();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Passkey Demo</h1>
        <p>WebAuthn Authentication with AWS Amplify</p>
      </div>

      <div style={styles.section}>
        <h2>Browser & Device Support</h2>
        <div style={styles.supportGrid}>
          <div style={styles.supportCard}>
            <h3>WebAuthn Support</h3>
            <div style={{
              ...styles.status,
              backgroundColor: browserSupport.webauthn ? '#e8f5e8' : '#ffebee',
              color: browserSupport.webauthn ? '#2e7d32' : '#c62828',
            }}>
              {browserSupport.webauthn ? '✅ Supported' : '❌ Not Supported'}
            </div>
          </div>
          
          <div style={styles.supportCard}>
            <h3>Platform Authenticator</h3>
            <div style={{
              ...styles.status,
              backgroundColor: browserSupport.platformAuthenticator ? '#e8f5e8' : '#ffebee',
              color: browserSupport.platformAuthenticator ? '#2e7d32' : '#c62828',
            }}>
              {browserSupport.platformAuthenticator ? '✅ Available' : '❌ Not Available'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>How Passkeys Work</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3>🔐 What are Passkeys?</h3>
            <p>Passkeys are a new authentication method that uses public-key cryptography. They're more secure than passwords and can't be phished.</p>
          </div>
          
          <div style={styles.infoCard}>
            <h3>📱 Device Integration</h3>
            <p>Passkeys are stored securely on your device and can be unlocked using biometric authentication (Touch ID, Face ID, Windows Hello) or PIN.</p>
          </div>
          
          <div style={styles.infoCard}>
            <h3>🌐 Cross-Platform</h3>
            <p>Passkeys work across different devices and platforms, allowing you to sign in to the same account from multiple devices.</p>
          </div>
          
          <div style={styles.infoCard}>
            <h3>🛡️ Security Benefits</h3>
            <p>No passwords to remember, no risk of password reuse, and protection against phishing attacks and data breaches.</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Try It Out</h2>
        <div style={styles.ctaContainer}>
          <p>Ready to experience passkey authentication?</p>
          <Link href="/" style={styles.ctaButton}>
            Go to Authentication Demo
          </Link>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Technical Details</h2>
        <div style={styles.techDetails}>
          <h3>WebAuthn API</h3>
          <p>This demo uses the WebAuthn API, which is the standard for passkey authentication. It includes:</p>
          <ul style={styles.techList}>
            <li>Credential creation and registration</li>
            <li>Credential assertion and authentication</li>
            <li>Platform authenticator integration</li>
            <li>Challenge-response security model</li>
          </ul>
          
          <h3>SimpleWebAuthn Library</h3>
          <p>We use the SimpleWebAuthn library to simplify WebAuthn operations:</p>
          <ul style={styles.techList}>
            <li>Browser-side credential management</li>
            <li>Server-side verification (API route included)</li>
            <li>TypeScript support</li>
            <li>Cross-browser compatibility</li>
          </ul>
        </div>
      </div>

      <div style={styles.footer}>
        <Link href="/about" style={styles.link}>About</Link>
        <span style={styles.separator}>•</span>
        <Link href="/" style={styles.link}>Home</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  section: {
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  supportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  supportCard: {
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  status: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  infoCard: {
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    padding: '2rem',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '18px',
    marginTop: '1rem',
  },
  techDetails: {
    lineHeight: '1.6',
  },
  techList: {
    marginLeft: '2rem',
    marginBottom: '1.5rem',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '2rem',
    borderTop: '1px solid #e0e0e0',
    marginTop: '3rem',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    margin: '0 0.5rem',
  },
  separator: {
    color: '#666',
  },
};

export default DemoPage; 