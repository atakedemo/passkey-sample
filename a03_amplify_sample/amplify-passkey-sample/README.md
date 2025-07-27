# Passkey Sample App with AWS Amplify

This is a Next.js application that demonstrates passkey (WebAuthn) authentication using AWS Amplify. The app allows users to sign up and sign in using their device's biometric authentication or PIN.

## Features

- **Passkey Registration**: Create a new passkey on your device
- **Passkey Authentication**: Sign in using your existing passkey
- **Cross-platform Support**: Works on devices with platform authenticators
- **Modern UI**: Clean and intuitive user interface
- **Error Handling**: Comprehensive error messages and validation

## Prerequisites

- Node.js 18+ 
- A device with platform authenticator support (Touch ID, Face ID, Windows Hello, etc.)
- A modern browser that supports WebAuthn (Chrome, Safari, Firefox, Edge)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Sign Up (Create Passkey)

1. Click on the "Sign Up" tab
2. Enter your username and display name
3. Click "Create Passkey"
4. Follow your device's biometric authentication prompt (Touch ID, Face ID, PIN, etc.)
5. Your passkey will be created and stored locally

### Sign In (Use Passkey)

1. Click on the "Sign In" tab
2. Click "Sign In with Passkey"
3. Follow your device's biometric authentication prompt
4. You'll be signed in if authentication is successful

## Technical Details

### Dependencies

- **@simplewebauthn/browser**: Client-side WebAuthn operations
- **@simplewebauthn/server**: Server-side WebAuthn verification (for backend integration)
- **@simplewebauthn/typescript-types**: TypeScript definitions
- **aws-amplify**: AWS Amplify framework
- **@aws-amplify/ui-react**: Amplify UI components

### Architecture

The app consists of several key components:

- **WebAuthnService**: Utility class for WebAuthn operations
- **SignupForm**: Component for passkey registration
- **SigninForm**: Component for passkey authentication
- **AuthContainer**: Main container managing the authentication flow

### Security Features

- Uses WebAuthn standard for secure authentication
- Platform authenticator integration
- Challenge-response authentication
- Local credential storage (demo purposes)

## Browser Support

This app requires a browser that supports the WebAuthn API:

- Chrome 67+
- Safari 13+
- Firefox 60+
- Edge 18+

## Device Requirements

- **iOS**: Touch ID or Face ID enabled device
- **macOS**: Touch ID enabled MacBook or Magic Keyboard
- **Windows**: Windows Hello (fingerprint, face, or PIN)
- **Android**: Fingerprint sensor or face recognition

## Development Notes

This is a demonstration app that stores credentials locally. In a production environment, you would:

1. Implement server-side credential verification
2. Store user data in a secure database
3. Add proper session management
4. Implement credential backup and recovery
5. Add multi-device support

## Troubleshooting

### "WebAuthn Not Supported"
- Ensure you're using a modern browser
- Check that your browser supports WebAuthn

### "Platform Authenticator Not Available"
- Verify your device has biometric authentication or PIN setup
- Ensure you're on a supported platform

### "No passkey found"
- You need to create a passkey first using the Sign Up feature

## License

This project is for educational purposes. Please ensure compliance with your organization's security policies before using in production.
