'use client';

import React, { useState, useEffect } from 'react';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';

interface User {
  username: string;
  displayName: string;
  credentialId: string;
}

const AuthContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignupSuccess = () => {
    setMessage({ text: 'Passkey created successfully! You can now sign in.', type: 'success' });
    setCurrentView('signin');
    
    // Update user state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleSigninSuccess = (userData: User) => {
    setUser(userData);
    setMessage({ text: `Welcome back, ${userData.displayName}!`, type: 'success' });
  };

  const handleError = (error: string) => {
    setMessage({ text: error, type: 'error' });
  };

  const handleSignout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMessage({ text: 'Signed out successfully.', type: 'success' });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  // If user is signed in, show welcome message
  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.welcomeContainer}>
          <h2>Welcome, {user.displayName}!</h2>
          <p>You are signed in with your passkey.</p>
          <div style={styles.userInfo}>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Display Name:</strong> {user.displayName}</p>
          </div>
          <button onClick={handleSignout} style={styles.signoutButton}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Passkey Authentication</h1>
        <p>Secure authentication using WebAuthn passkeys</p>
      </div>

      {message && (
        <div 
          style={{
            ...styles.message,
            backgroundColor: message.type === 'success' ? '#e8f5e8' : '#ffebee',
            color: message.type === 'success' ? '#2e7d32' : '#c62828',
            border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
          }}
        >
          <span>{message.text}</span>
          <button onClick={clearMessage} style={styles.closeButton}>×</button>
        </div>
      )}

      <div style={styles.tabs}>
        <button
          onClick={() => setCurrentView('signin')}
          style={{
            ...styles.tab,
            backgroundColor: currentView === 'signin' ? '#0070f3' : '#f0f0f0',
            color: currentView === 'signin' ? 'white' : '#333',
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => setCurrentView('signup')}
          style={{
            ...styles.tab,
            backgroundColor: currentView === 'signup' ? '#0070f3' : '#f0f0f0',
            color: currentView === 'signup' ? 'white' : '#333',
          }}
        >
          Sign Up
        </button>
      </div>

      <div style={styles.content}>
        {currentView === 'signin' ? (
          <SigninForm onSuccess={handleSigninSuccess} onError={handleError} />
        ) : (
          <SignupForm onSuccess={handleSignupSuccess} onError={handleError} />
        )}
      </div>

      <div style={styles.footer}>
        <p>
          {currentView === 'signin' ? "Don't have a passkey?" : "Already have a passkey?"}{' '}
          <button
            onClick={() => setCurrentView(currentView === 'signin' ? 'signup' : 'signin')}
            style={styles.linkButton}
          >
            {currentView === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  message: {
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 0.5rem',
  },
  tabs: {
    display: 'flex',
    marginBottom: '2rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: '1rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: '2rem',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '1rem',
    borderTop: '1px solid #e0e0e0',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  welcomeContainer: {
    textAlign: 'center' as const,
    padding: '2rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  userInfo: {
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    textAlign: 'left' as const,
  },
  signoutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default AuthContainer; 