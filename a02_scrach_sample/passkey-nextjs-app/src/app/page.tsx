"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");

  // Helper to call the mock API
  async function callApi(endpoint: string, body: any) {
    const res = await fetch(`/api/passkey/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  // Helper to convert base64url to Uint8Array
  function base64urlToUint8Array(base64url: string) {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? 0 : 4 - (base64.length % 4);
    const padded = base64 + "=".repeat(pad);
    const binary = atob(padded);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  }

  // Passkey registration using device keys
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!window.PublicKeyCredential) {
      setMessage("WebAuthn is not supported in this browser.");
      return;
    }
    try {
      const { challenge } = await callApi("register-challenge", { username });
      // Build publicKey options (mocked, but structure matches real WebAuthn)
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: base64urlToUint8Array(btoa(challenge)),
        rp: { name: "Passkey Sample" },
        user: {
          id: base64urlToUint8Array(btoa(username)),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { userVerification: "preferred" },
        timeout: 60000,
        attestation: "none",
      };
      const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;
      const credential = {
        id: cred.id,
        type: cred.type,
        rawId: btoa(String.fromCharCode(...new Uint8Array(cred.rawId as ArrayBuffer))),
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((cred.response as AuthenticatorAttestationResponse).clientDataJSON))),
          attestationObject: btoa(String.fromCharCode(...new Uint8Array((cred.response as AuthenticatorAttestationResponse).attestationObject))),
        },
      };
      const result = await callApi("register", { username, credential, challenge });
      setMessage(result.message);
    } catch (err: any) {
      setMessage("Signup failed: " + (err?.message || err));
    }
  }

  // Passkey login using device keys
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!window.PublicKeyCredential) {
      setMessage("WebAuthn is not supported in this browser.");
      return;
    }
    try {
      const { challenge } = await callApi("login-challenge", { username });
      // Build publicKey options (mocked, but structure matches real WebAuthn)
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: base64urlToUint8Array(btoa(challenge)),
        allowCredentials: [
          {
            id: base64urlToUint8Array(btoa(username)),
            type: "public-key",
          },
        ],
        userVerification: "preferred",
        timeout: 60000,
      };
      const assertion = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
      const assertionData = {
        id: assertion.id,
        type: assertion.type,
        rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId as ArrayBuffer))),
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((assertion.response as AuthenticatorAssertionResponse).clientDataJSON))),
          authenticatorData: btoa(String.fromCharCode(...new Uint8Array((assertion.response as AuthenticatorAssertionResponse).authenticatorData))),
          signature: btoa(String.fromCharCode(...new Uint8Array((assertion.response as AuthenticatorAssertionResponse).signature))),
          userHandle: (assertion.response as AuthenticatorAssertionResponse).userHandle
            ? btoa(String.fromCharCode(...new Uint8Array((assertion.response as AuthenticatorAssertionResponse).userHandle as ArrayBuffer)))
            : null,
        },
      };
      const result = await callApi("login", { username, assertion: assertionData, challenge });
      setMessage(result.message);
    } catch (err: any) {
      setMessage("Login failed: " + (err?.message || err));
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Passkey Sample</h1>
        <div style={{ marginTop: 32, maxWidth: 400 }}>
          <h2>Passkey {mode === "signup" ? "Signup" : "Login"}</h2>
          <form onSubmit={mode === "signup" ? handleSignup : handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
            <button type="submit" className={styles.primary} style={{ width: "100%" }}>
              {mode === "signup" ? "Sign up with Passkey" : "Login with Passkey"}
            </button>
          </form>
          <button
            className={styles.secondary}
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            Switch to {mode === "signup" ? "Login" : "Signup"}
          </button>
          {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
