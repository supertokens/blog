---
title: Add MFA to React Fast with SuperTokens
description: "Secure your React app with multi-factor authentication in minutes. Learn MFA options, setup steps, and best practices using SuperTokens."
date: "todo"
cover: "todo.png"
category: "react, mfa, guide"
author: "Maurice Saldivar"
---

# Add MFA to React Fast with SuperTokens

Passwords alone aren't enough. Credential stuffing attacks, phishing campaigns, and database breaches mean that even strong passwords end up in attacker hands. Multi-factor authentication addresses this by requiring a second verification step that attackers can't easily replicate.

The challenge for React developers: building MFA flows from scratch involves token management, session state, UI routing for factor challenges, and recovery mechanisms. SuperTokens provides pre-built MFA recipes that handle these complexities, letting you add strong second-factor security with minimal custom code.

## What Is MFA in a React Context?

MFA requires users to prove their identity through multiple independent factors before granting access. After the primary login, users complete a second verification step using something they have (an authenticator app), something they know (a one-time code), or something they are (biometrics).

### How React Apps Handle MFA Flows

React applications split MFA responsibility between the frontend and the authentication backend. React controls the user interface: rendering login forms, displaying factor challenges, and routing users through the authentication sequence. The auth SDK manages token storage, session state, and API calls to verification endpoints.

```
User submits credentials
    ↓
Backend validates password, returns partial session
    ↓
React receives "MFA required" response
    ↓
UI routes to factor challenge screen
    ↓
User completes second factor
    ↓
Backend validates factor, upgrades session
    ↓
User accesses protected routes
```

SuperTokens handles this coordination through its React SDK. Pre-built UI components manage factor setup and verification, while hooks let you check whether MFA is complete before rendering protected content. React components send user input to SuperTokens endpoints and render appropriate UI based on authentication state. Cryptographic operations stay server-side where they belong.

## Key MFA Methods You Can Enable with SuperTokens

SuperTokens supports three second-factor options, each with distinct trade-offs for security and user experience.

**Time-Based One-Time Passwords (TOTP)**

Users scan a QR code with an authenticator app like Google Authenticator or Authy. The app generates 6-digit codes that refresh every 30 seconds. Both the app and your server calculate codes from a shared secret, so verification works offline without network dependencies. TOTP suits technical users comfortable managing authenticator apps and provides strong security without per-verification costs.

**Email/SMS One-Time Passcodes (OTP)**

The server sends a temporary code to the user's verified email or phone number. Zero app installation required, making this the lowest-friction option for consumer SaaS products. The trade-off: each verification requires network delivery, and SMS is vulnerable to SIM-swapping attacks. Email OTP offers better security than SMS while maintaining accessibility for non-technical users.

**Passkeys/WebAuthn**

Hardware-backed authentication using security keys or device biometrics. The browser handles cryptographic verification with credentials bound to specific origins, providing phishing resistance that TOTP and OTP lack. When a user registers a passkey, their device generates a key pair. The private key never leaves the hardware. SuperTokens supports passkeys through its WebAuthn recipe, though adoption remains early compared to TOTP.

The method you choose depends on your user base. Enterprise applications with security-conscious users lean toward TOTP or passkeys. Consumer products prioritizing conversion often start with email OTP.