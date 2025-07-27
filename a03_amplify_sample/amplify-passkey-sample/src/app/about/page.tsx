// app/about/page.tsx
import Link from 'next/link';
import React from 'react';

const About: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>About Passkey Sample App</h1>
      
      <div style={styles.section}>
        <h2>What is this app?</h2>
        <p>
          This is a demonstration of passkey (WebAuthn) authentication using Next.js and AWS Amplify. 
          Passkeys are a modern, secure alternative to traditional passwords that use public-key cryptography 
          and biometric authentication.
        </p>
      </div>

      <div style={styles.section}>
        <h2>Key Features</h2>
        <ul style={styles.featureList}>
          <li><strong>Passkey Registration:</strong> Create a new passkey on your device</li>
          <li><strong>Passkey Authentication:</strong> Sign in using your existing passkey</li>
          <li><strong>Cross-platform Support:</strong> Works on devices with platform authenticators</li>
          <li><strong>Modern UI:</strong> Clean and intuitive user interface</li>
          <li><strong>Error Handling:</strong> Comprehensive error messages and validation</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>Technology Stack</h2>
        <ul style={styles.techList}>
          <li><strong>Frontend:</strong> Next.js 15 with TypeScript</li>
          <li><strong>Authentication:</strong> WebAuthn API with SimpleWebAuthn library</li>
          <li><strong>Cloud Platform:</strong> AWS Amplify</li>
          <li><strong>Styling:</strong> Inline styles with modern CSS</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>Security Benefits</h2>
        <ul style={styles.benefitList}>
          <li>No passwords to remember or manage</li>
          <li>Protection against phishing attacks</li>
          <li>No risk of password reuse across sites</li>
          <li>Biometric authentication integration</li>
          <li>Cryptographically secure</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>Browser & Device Requirements</h2>
        <p>This app requires:</p>
        <ul style={styles.requirementList}>
          <li>A modern browser that supports WebAuthn (Chrome 67+, Safari 13+, Firefox 60+, Edge 18+)</li>
          <li>A device with platform authenticator support:
            <ul>
              <li>iOS: Touch ID or Face ID enabled device</li>
              <li>macOS: Touch ID enabled MacBook or Magic Keyboard</li>
              <li>Windows: Windows Hello (fingerprint, face, or PIN)</li>
              <li>Android: Fingerprint sensor or face recognition</li>
            </ul>
          </li>
        </ul>
      </div>

      <div style={styles.navigation}>
        <Link href="/" style={styles.link}>← Back to Home</Link>
        <Link href="/demo" style={styles.link}>View Demo →</Link>
      </div>
    </div>
  );
};

const styles: { 
  container: React.CSSProperties;
  section: React.CSSProperties;
  featureList: React.CSSProperties;
  techList: React.CSSProperties;
  benefitList: React.CSSProperties;
  requirementList: React.CSSProperties;
  navigation: React.CSSProperties;
  link: React.CSSProperties;
} = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
  },
  techList: {
    listStyle: 'none',
    padding: 0,
  },
  benefitList: {
    listStyle: 'disc',
    marginLeft: '2rem',
  },
  requirementList: {
    listStyle: 'disc',
    marginLeft: '2rem',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '3rem',
    padding: '1rem',
    borderTop: '1px solid #e0e0e0',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    border: '1px solid #0070f3',
    borderRadius: '4px',
  },
};

export default About;
