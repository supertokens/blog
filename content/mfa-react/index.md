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

## Security Best Practices for React MFA

MFA strengthens authentication, but implementation details determine whether that strength holds.

**Rotate Refresh Tokens on Every Use**

Single-use refresh tokens nullify stolen credentials. If an attacker captures a refresh token, the next legitimate refresh invalidates it. SuperTokens enables rotation by default, detecting when both parties attempt to use the same token.

**Use Secure, HttpOnly Cookies**

Store tokens in cookies with `Secure`, `HttpOnly`, and `SameSite` attributes. This prevents JavaScript access (blocking XSS extraction) and ensures transmission only over HTTPS. Avoid localStorage for authentication tokens in browser environments.

**Set Short Access Token TTLs**

Keep access tokens short-lived, ideally 15 minutes or less. Short TTLs limit the damage window if a token leaks. Pair this with silent refresh to maintain user sessions without re-prompting for credentials.

**Log Token Theft Detection Events**

When SuperTokens detects refresh token reuse, it fires `onTokenTheftDetected`. Pipe these events to your SIEM or monitoring system. Token theft attempts indicate active attacks against your users, not just background noise.

**Serve All MFA Endpoints over HTTPS**

TOTP secrets, OTP codes, and session tokens must never traverse unencrypted connections. Enforce HTTPS at the infrastructure level and reject plaintext requests. This applies to development environments too, since local testing habits become production configurations.

## How SuperTokens Simplifies React MFA

Building MFA from scratch means implementing factor enrollment flows, token management, recovery mechanisms, and session state coordination. SuperTokens handles this infrastructure so you can focus on application logic.

**Drop-In UI Components**

Pre-built screens for signup, factor setup, and verification mount automatically under `/auth`. Users see polished flows for scanning TOTP QR codes, entering verification codes, and managing backup options. Custom styling is supported when defaults don't match your design system.

**Flexible Policy Engine**

Claim validators let you require MFA globally or on specific routes. Protect admin panels with mandatory second factors while letting standard users browse freely. Policies evaluate at request time, so changes apply without redeployment.

**Built-In Token Theft Detection**

When refresh tokens rotate, SuperTokens tracks expected values. If an attacker replays a stolen token while the legitimate user continues their session, the system detects the conflict and revokes all sessions for that user. No custom implementation required.

**Pluggable Factors**

Switching from TOTP to email OTP requires a configuration change, not a rewrite. Add multiple factor options and let users choose their preference. The underlying session management remains consistent regardless of which factor verifies the user.

**Open Source and Self-Hostable**

Run SuperTokens Core on your infrastructure to meet data residency requirements or compliance mandates. The open-source model means you can audit the code handling your authentication logic and avoid vendor lock-in.

## Additional Technical Considerations

MFA integration touches more than just login screens. Consider how your architecture affects implementation.

**SSR and Next.js**

Server-side rendering requires session verification on both client and server. The SuperTokens Next.js SDK handles this by checking sessions during server rendering and hydrating state on the client. Without proper SSR support, users see authentication flickers or incorrect UI states on initial page loads. Middleware integration lets you protect routes at the edge before rendering begins.

**Microservices Architecture**

In service-mesh deployments, each service needs to validate tokens without calling SuperTokens Core on every request. JWTs enable local validation using public keys, while Core remains the authority for revocation. When a session is revoked, services continue accepting the token until TTL expiration. Balance TTL length against your revocation latency requirements.

**Analytics and A/B Testing**

Track MFA adoption and drop-off rates through recipe hooks. SuperTokens exposes events for factor setup initiation, completion, and failure. Pipe these to your analytics system to measure conversion impact. Hook implementations receive session context without exposing TOTP secrets or verification codes, keeping sensitive data out of analytics pipelines.

## Common Pitfalls and How to Avoid Them

These mistakes undermine MFA security even when the rest of your implementation is solid.

**Storing TOTP Secrets in Plaintext**

TOTP secrets are equivalent to passwords. If an attacker accesses your database, plaintext secrets let them generate valid codes for any user. SuperTokens encrypts TOTP secrets at rest. If you're managing secrets manually, encrypt them with a key stored outside the database.

**Skipping CSRF Protection on OTP Endpoints**

OTP verification endpoints accept a code and upgrade session privileges. Without CSRF protection, an attacker who knows a user's OTP (via social engineering or interception) can submit it from a malicious site using the user's existing session cookie. SuperTokens includes anti-CSRF middleware by default. Don't disable it to "simplify" development.

**Long-Lived JWTs**

Extended token lifetimes feel convenient but defeat MFA's purpose. If an attacker captures a JWT valid for 24 hours, they have 24 hours of access regardless of MFA. The user can't revoke the session until expiration. Keep access tokens short (15 minutes or less) and use refresh token rotation. The minor latency cost of frequent refreshes is worth the security gain.