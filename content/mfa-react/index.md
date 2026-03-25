---
title: Add MFA to React Fast with SuperTokens
description: "Secure your React app with multi-factor authentication in minutes. Learn MFA options, setup steps, and best practices using SuperTokens."
date: "2026-03-09"
cover: "add_mfa_to_react.png"
category: "react, mfa, guide"
author: "Maurice Saldivar"
---

## Add MFA to React Fast by using SuperTokens

Passwords alone aren't enough. Credential-stuffing attacks, phishing campaigns, and database breaches mean that even strong passwords end up in the hands of attackers. Multi-factor authentication addresses this by requiring a second verification step, which attackers can't easily replicate.

The challenge for React developers: building MFA flows from scratch involves token management, session state, UI routing for factor challenges, and recovery mechanisms. The solution: SuperTokens provides pre-built MFA recipes that handle these complexities, letting you add strong second-factor security with minimal custom code.

## What Is MFA in a React Context?

MFA requires users to prove their identity through multiple independent factors before granting access. After the primary login, users complete a second verification step by using something they have (an authenticator app), something they know (a one-time code), or something they are (biometrics).

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

SuperTokens handles this coordination through its React SDK. Pre-built UI components manage factor setup and verification, while hooks let you check whether MFA is complete before rendering protected content. React components send user input to SuperTokens endpoints, and then render the appropriate UI based on the authentication state. Cryptographic operations stay server-side where they belong.

## Key MFA Methods You Can Enable with SuperTokens

SuperTokens supports three second-factor options, each with distinct trade-offs for security and user experience.

**Time-Based One-Time Passwords (TOTP)**

Users scan a QR code with an authenticator app like Google Authenticator or Authy. The app generates six-digit codes that refresh every 30 seconds. Both the app and your server calculate codes from a shared secret, so verification works offline without network dependencies. TOTP suits technical users who are comfortable managing authenticator apps and TOTP provides strong security without per-verification costs.

**Email/SMS One-Time Passcodes (OTP)**

The server sends a temporary code to the user's verified email or phone number. There is zero app installation required, making this the lowest-friction option for consumer SaaS products. The trade-off: each verification requires network delivery, and SMS is vulnerable to SIM-swapping attacks. Email OTP offers better security than SMS, while maintaining accessibility for non-technical users.

**Passkeys/WebAuthn**

Hardware-backed authentication by using security keys or device biometrics. The browser handles cryptographic verification with credentials bound to specific origins, providing phishing resistance that TOTP and OTP lack. When a user registers a passkey, their device generates a key pair. The private key never leaves the hardware. SuperTokens supports passkeys through its WebAuthn recipe, though adoption remains early compared to TOTP.

The method you choose depends on your user base. Enterprise applications with security-conscious users lean toward TOTP or passkeys. Consumer products prioritizing conversion often start with email OTP.

## Planning Your MFA Roll-Out: Critical Questions to Ask

Before writing code, answer these architectural questions. Changing MFA policy after launch affects every user session.

**Mandatory vs. Step-Up MFA**

Should all logins require a second factor, or only high-risk actions? Mandatory MFA provides consistent security, but adds friction to every authentication. Step-up MFA lets users browse freely, then triggers additional verification for sensitive operations like password changes, payment modifications, or admin actions. SuperTokens supports both models through claim validators that check MFA completion on specific routes.

**Recovery Mechanism**

Users will lose access to their second factor. Phones break, authenticator apps get deleted, email accounts change. Plan your recovery path before users need it. Options include backup codes generated at setup, secondary email verification, or administrative override with identity verification. Without a recovery mechanism, locked-out users become support tickets or abandoned accounts.

**Device Remembering**

Requiring MFA on every login from the same device frustrates users. Device trust lets users skip the second factor on recognized browsers for a configured period. The trade-off: a compromised device with remembered trust bypasses MFA entirely. Consider shorter trust periods (7-14 days) for sensitive applications or disabling device trust for admin accounts.

**Scaling and Latency**

MFA verification adds a round-trip to your auth flow. For large user bases, consider where the session state lives. Centralized session stores (Redis, database) enable instant revocation, but add latency. Stateless JWTs reduce database calls, but complicate mid-session revocation. SuperTokens supports both patterns, with built-in token theft detection that works across either architecture.

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
import EmailPassword from "supertokens-node/recipe/emailpassword";
import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";
import TOTP from "supertokens-node/recipe/totp";
import Session from "supertokens-node/recipe/session";

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

Initialize SuperTokens in your React app. The pre-built UI components for login, factor setup, and verification auto-mount under `/auth`. Users see TOTP QR codes and input fields,without custom component work.


```javascript
import supertokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import TOTP from "supertokens-auth-react/recipe/totp";
import Session from "supertokens-auth-react/recipe/session";

supertokens.init({
    appInfo: {
        appName: "...",
        apiDomain: "...",
        websiteDomain: "...",
    },
    recipeList: [
        EmailPassword.init(),
        TOTP.init(),
        MultiFactorAuth.init({
            firstFactors: ["emailpassword"],
        }),
        Session.init()
    ]
});
```

**5. Protect Routes with SessionAuth**

Wrap protected components with `SessionAuth`. The wrapper checks session validity and MFA completion before rendering children. Incomplete sessions redirect to the appropriate challenge screen.

```javascript
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <SessionAuth>
                            <Dashboard />
                        </SessionAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
```

**6. Test Token Rotation and Theft Detection**

You don't need to build token rotation or theft detection yourself. `Session.init()` handles both out of the box.

Here's the mechanism. SuperTokens issues short-lived access tokens paired with long-lived refresh tokens. Every time the frontend calls the refresh endpoint, the server issues a brand new refresh token and invalidates the previous one. If an attacker steals an old refresh token and tries to use it after the legitimate user has already rotated, SuperTokens flags it as theft and revokes the entire session. Both the attacker and the real user get logged out, forcing re-authentication.

One detail worth understanding: SuperTokens doesn't kill the old refresh token the instant it issues a new pair. It waits until the new tokens are actually used by the client. This prevents false lockouts when a refresh response gets dropped by a flaky network. The old token only becomes truly invalid once the new one is confirmed in play.

To see this working in your app, open your browser DevTools and navigate to the Application tab. Under Cookies, watch the `sRefreshToken` value. Log in, then trigger a refresh (you can let the access token expire naturally or call a protected route). The `sRefreshToken` value changes on every rotation cycle. If you're running the [SuperTokens Dashboard](https://supertokens.com/docs/post-authentication/dashboard/about) (`Dashboard.init()` in your recipe list), you can view active sessions per user and watch them get revoked in real time when theft detection triggers.

The important takeaway: this isn't something you configure or toggle on. It's baked into the session layer. If `Session.init()` is in your recipe list, you have rotating refresh tokens and theft detection running from day one.

## Security Best Practices for React MFA

MFA strengthens authentication, but implementation details determine whether that strength holds.

**Rotate Refresh Tokens on Every Use**

SuperTokens issues a new refresh token every time the current one is used. But the old token isn't invalidated immediately. It stays valid until the client confirms receipt by actually using the new token pair. This prevents false lockouts from dropped network responses. Once the new tokens are in use, the old refresh token is invalidated. If an attacker tries to use that old token after it's been invalidated, SuperTokens detects the reuse as theft and revokes the entire session, forcing both parties to re-authenticate. This rotation strategy is enabled by default in `Session.init()`.


**Use Secure, HttpOnly Cookies**

Store tokens in cookies by using the `Secure`, `HttpOnly`, and `SameSite` attributes. This prevents JavaScript access (blocking XSS extraction) and ensures transmission only over HTTPS. Avoid localStorage for authentication tokens in browser environments.

**Set Short Access Token TTLs**

Keep access tokens short-lived, ideally 15 minutes or less. Short TTLs limit the damage window if a token leaks. Pair this with silent refresh to maintain user sessions without re-prompting for credentials.

**Log Token Theft Detection Events**

SuperTokens exposes an `onTokenTheftDetected` handler inside `Session.init()` that fires when rotating refresh token reuse is detected. The default behavior revokes the session and sends a `401`. You can hook into this to add logging before that happens.

```javascript
Session.init({
    errorHandlers: {
        onTokenTheftDetected: async (sessionHandle, userId, req, res, userContext) => {
            // Log the event with whatever context matters to you
            console.error("Token theft detected", {
                sessionHandle,
                userId,
                ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date().toISOString(),
            });

            // Revoke the compromised session and respond with 401
            await Session.revokeSession(sessionHandle);
            res.statusCode = 401;
            res.json({ message: "session revoked" });
        },
    }
})
```

The handler receives the `sessionHandle` and `userId` directly, so you don't need to extract them from the request. Replace `console.error` with your logging service of choice. The key point: this runs automatically when theft is detected. You're not polling or checking manually. SuperTokens calls this handler for you when it sees an invalidated refresh token get replayed.

SuperTokens also provides `errorHandlers` for other session errors like `onUnauthorised` and `onTryRefreshToken`. Full details in the [error handling docs](https://supertokens.com/docs/post-authentication/session-management/advanced-workflows/customize-error-handling).


**Serve All MFA Endpoints over HTTPS**

TOTP secrets, OTP codes, and session tokens must never traverse unencrypted connections. Enforce HTTPS at the infrastructure level and reject plaintext requests. This applies to development environments too, since local testing habits become production configurations.

## How SuperTokens Simplifies React MFA

Building MFA from scratch means implementing factor enrollment flows, token management, recovery mechanisms, and session state coordination. SuperTokens handles this infrastructure so you can focus on application logic.

**Drop-In UI Components**

Pre-built screens for signup, factor setup, and verification mount automatically under `/auth`. Users see polished flows for scanning TOTP QR codes, entering verification codes, and managing backup options. Custom styling is supported when defaults don't match your design system.

**Flexible Policy Engine**

Claim validators let you require MFA globally or on specific routes. Protect admin panels with mandatory second factors while letting standard users browse freely. Policies evaluate at request time, so changes apply without redeployment.

**Built-In Token Theft Detection**

When refresh tokens rotate, SuperTokens tracks expected values. If an attacker uses a stolen token while the legitimate user continues their session, the system detects the conflict and revokes all sessions for that user. No custom implementation required.

**Pluggable Factors**

Switching from TOTP to email OTP requires a configuration change, not a rewrite. Add multiple factor options and let users choose their preference. The underlying session management remains consistent regardless of which factor verifies the user.

**Open Source and Self-Hostable**

Run SuperTokens Core on your infrastructure to meet data residency requirements or compliance mandates. The open-source model means you can audit the code handling your authentication logic and avoid vendor lock-in.

## Additional Technical Considerations

MFA integration touches more than just login screens. Consider how your architecture affects implementation.

**SSR and Next.js**

Server-side rendering (SSR) requires session verification on both the client and server. The SuperTokens Next.js SDK handles this by checking sessions during server rendering and hydrating state on the client. Without proper SSR support, users see authentication flickers or incorrect UI states on initial page loads. Middleware integration lets you protect routes at the edge before rendering begins.

**Microservices Architecture**

In service-mesh deployments, each service needs to validate tokens without calling SuperTokens Core on every request. JWTs enable local validation by using public keys, while Core remains the authority for revocation. When a session is revoked, services continue accepting the token until TTL expiration. Balance TTL length against your revocation latency requirements.

**Analytics and A/B Testing**

Track MFA adoption and drop-off rates through recipe hooks. SuperTokens exposes events for factor setup initiation, completion, and failure. Pipe these to your analytics system to measure conversion impact. Hook implementations receive session context without exposing TOTP secrets or verification codes, keeping sensitive data out of analytics pipelines.

## Common Pitfalls and How to Avoid Them

These mistakes undermine MFA security even when the rest of your implementation is solid.

**Storing TOTP Secrets in Plaintext**

TOTP secrets are equivalent to passwords. If an attacker accesses your database, plaintext secrets let them generate valid codes for any user. SuperTokens encrypts TOTP secrets at rest. If you're managing secrets manually, encrypt them with a key stored outside the database.

**Skipping CSRF Protection on OTP Endpoints**

OTP verification endpoints work by accepting a code and upgrading session privileges. Without CSRF protection, an attacker who knows a user's OTP (via social engineering or interception) can submit it from a malicious site by using the user's existing session cookie. SuperTokens includes anti-CSRF middleware by default. Don't disable it to "simplify" development.

**Long-Lived JWTs**

Extended token lifetimes feel convenient but defeat MFA's purpose. If an attacker captures a JWT valid for 24 hours, they have 24 hours of access, regardless of MFA. The user can't revoke the session until expiration. Keep access tokens short (15 minutes or less) and use refresh token rotation. The minor latency cost of frequent refreshes is worth the security gain.

## Future-Proofing Your MFA Stack

Authentication standards evolve. Building on extensible infrastructure lets you adopt new factors without rewriting your auth system.

**Passkeys and Device Public Keys**

WebAuthn adoption is accelerating as browsers and operating systems add native support. Passkeys eliminate shared secrets entirely: users authenticate with device biometrics or security keys, and private keys never leave the hardware. SuperTokens supports WebAuthn integrations, positioning your app to offer passkeys as user adoption grows. Start with TOTP or OTP today, add passkeys as a secondary option for early adopters.

**Risk-Based Adaptive MFA**

Static MFA policies treat every login identically. Adaptive approaches analyze signals like user-agent changes, IP geolocation shifts, and login time patterns to adjust factor requirements dynamically. A user logging in from their usual device and location might skip MFA, while the same user connecting from a new country triggers additional verification. SuperTokens' claim validators provide the foundation for implementing risk scoring logic.

**Zero-Knowledge Proof Factors**

Emerging standards explore verification without revealing underlying data. A user could prove they possess a valid credential without transmitting the credential itself. These protocols remain experimental, but privacy regulations may drive adoption. Choosing an open-source, extensible auth platform keeps your options open as standards evolve.

## Conclusion: Ship MFA the Smart Way

Password-only authentication is a liability. Credential breaches happen constantly, and users reuse passwords across services. MFA provides meaningful protection against account takeover, but only if you implement it correctly.

Building MFA from scratch means handling TOTP secret encryption, token rotation, theft detection, recovery flows, and session state management. Each component introduces opportunities for security gaps. SuperTokens provides tested implementations of these pieces, letting you add MFA to React applications without rebuilding authentication infrastructure.

Start with the factor that fits your users: TOTP for technical audiences, email OTP for consumer products, passkeys for security-forward applications. Plan your recovery mechanism before launch. Keep tokens short-lived and rotate them on every refresh.

SuperTokens’ documentation includes complete integration guides for React, Next.js, and backend frameworks. If you've followed along with this overview, you have the conceptual foundation. The implementation is straightforward from here.