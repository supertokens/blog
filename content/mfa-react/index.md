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

## Planning Your MFA Roll-Out: Critical Questions to Ask

Before writing code, answer these architectural questions. Changing MFA policy after launch affects every user session.

**Mandatory vs. Step-Up MFA**

Should all logins require a second factor, or only high-risk actions? Mandatory MFA provides consistent security but adds friction to every authentication. Step-up MFA lets users browse freely, then triggers factor verification for sensitive operations like password changes, payment modifications, or admin actions. SuperTokens supports both models through claim validators that check MFA completion on specific routes.

**Recovery Mechanism**

Users will lose access to their second factor. Phones break, authenticator apps get deleted, email accounts change. Plan your recovery path before users need it. Options include backup codes generated at setup, secondary email verification, or administrative override with identity verification. Without a recovery mechanism, locked-out users become support tickets or abandoned accounts.

**Device Remembering**

Requiring MFA on every login from the same device frustrates users. Device trust lets users skip the second factor on recognized browsers for a configured period. The trade-off: a compromised device with remembered trust bypasses MFA entirely. Consider shorter trust periods (7-14 days) for sensitive applications or disabling device trust for admin accounts.

**Scaling and Latency**

MFA verification adds a round-trip to your auth flow. For large user bases, consider where session state lives. Centralized session stores (Redis, database) enable instant revocation but add latency. Stateless JWTs reduce database calls but complicate mid-session revocation. SuperTokens supports both patterns, with built-in token theft detection that works across either architecture.

## Step-by-Step Integration Overview

This roadmap covers the integration sequence. Full code examples live in the SuperTokens MFA documentation.

**1. Spin Up SuperTokens Core**

Run the core service via Docker or use SuperTokens' managed offering. The core handles session management, token generation, and factor verification logic.

```bash
docker run -p 3567:3567 -d registry.supertokens.io/supertokens/supertokens-postgresql
```

**2. Enable Email-Password and Session Recipes**

Configure your backend SDK with the primary authentication recipe and session management. This establishes the first factor before adding MFA.

**3. Add TOTP or OTP Recipe**

Enable your chosen second factor in the recipe list. Configure requirements: whether MFA is mandatory for all users or triggered conditionally.

```javascript
import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";
import TOTP from "supertokens-node/recipe/totp";

recipeList: [
    EmailPassword.init(),
    TOTP.init(),
    MultiFactorAuth.init({
        firstFactors: ["emailpassword"],
    }),
    Session.init()
]
```

**4. Wire the Frontend SDK**

Initialize SuperTokens in your React app. Pre-built UI components for login, factor setup, and verification auto-mount under `/auth`. Users see TOTP QR codes and input fields without custom component work.

**5. Protect Routes with SessionAuth**

Wrap protected components with `SessionAuth`. The wrapper checks session validity and MFA completion before rendering children. Incomplete sessions redirect to the appropriate challenge screen.

**6. Test Token Rotation and Theft Detection**

Verify that refresh tokens rotate on each use and that concurrent token usage triggers theft detection. SuperTokens automatically revokes sessions when replay attacks are detected.