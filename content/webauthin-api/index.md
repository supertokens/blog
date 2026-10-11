---
title: What Is the WebAuthn API (and How to Use It in Your Auth Flow)
description: "Learn how the WebAuthn API enables passwordless, phishing-resistant login. Get step-by-step code and how to plug it into your auth stack."
date: "2026-06-09"
cover: "webauthn_api.png"
category: "webauthn, authentication, guide"
author: "Maurice Saldivar"
---

# What Is the WebAuthn API?

The Web Authentication API (WebAuthn) is a [W3C standard](https://www.w3.org/TR/webauthn-3/) that lets web applications authenticate users with public-key cryptography instead of passwords. It is the browser-facing half of the [FIDO2 framework](https://fidoalliance.org/fido2-2/fido2-web-authentication-webauthn/), which pairs WebAuthn with the Client-to-Authenticator Protocol (CTAP) to enable passwordless, phishing-resistant login across browsers and platforms. WebAuthn reached W3C Recommendation status in March 2019, and Level 3 of the spec entered Candidate Recommendation in January 2026 with support across Chrome, Firefox, Edge, and Safari.

The problem WebAuthn solves is structural. Password-based authentication relies on shared secrets: the server stores a representation of your password, and you prove your identity by reproducing it. That model breaks in predictable ways. Credential stuffing, password spraying, and database breaches all exploit the same fundamental weakness. Even layering traditional MFA on top only raises the bar; it doesn't change the underlying architecture. Authenticator app codes and SMS tokens are still shared secrets that can be intercepted through phishing, SIM swapping, or social engineering.

WebAuthn eliminates shared secrets entirely. When a user registers with a WebAuthn-enabled service, their device generates an asymmetric key pair. The private key stays on the device, locked inside a secure element or trusted platform module. The public key goes to the server. During authentication, the server issues a cryptographic challenge that only the correct private key can sign. No password crosses the wire. No secret is stored on the server to be stolen.

Four core concepts define how WebAuthn operates:

**Credential.** A credential is the public-key pair bound to a specific user and a specific origin (the website's domain). Each credential is scoped so it can only be used on the origin where it was created. This origin binding is what makes WebAuthn phishing-resistant; a cloned login page at a different domain simply cannot trigger the correct credential.

**Attestation.** During registration, the authenticator can provide an attestation statement: a cryptographic proof that the credential was created by a genuine, trusted device. Attestation lets the server verify the authenticator's make and model, which matters in regulated environments where only hardware-backed keys are acceptable.

**Assertion.** During login, the authenticator produces an assertion: a signed response to the server's challenge that proves the user possesses the private key. The server validates this signature against the stored public key to complete authentication.

**Origin binding.** The browser enforces that authentication requests are scoped to the exact origin (scheme + domain + port) that registered the credential. Even a pixel-perfect phishing site at a different URL will fail because the browser will not match credentials across origins. This protection operates at the protocol level, independent of user behavior or awareness.

Together, these mechanisms create an authentication model where there is nothing to phish, nothing to replay, and nothing stored on the server worth stealing.

## How WebAuthn Works: Registration and Authentication Flows

WebAuthn operates through two ceremonies: registration (creating a credential) and authentication (proving you own it). Both follow the same pattern. The server generates a challenge, the browser mediates the interaction with the authenticator, and the authenticator performs the cryptographic operation. Understanding these flows is essential before writing any integration code.

### Registration with `navigator.credentials.create()`

Registration binds a new credential to a user account. The server initiates the process by generating a random challenge and specifying parameters about the relying party (your application) and the user.

```javascript
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverGeneratedChallenge,       // random bytes from your server
    rp: { id: "example.com", name: "My App" }, // relying party identity
    user: {
      id: userId,                              // unique user handle (ArrayBuffer)
      name: "user@example.com",
      displayName: "Jane Developer"
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },         // ES256 (recommended)
      { alg: -257, type: "public-key" }        // RS256 (broad compatibility)
    ],
    authenticatorSelection: {
      userVerification: "preferred"             // biometric/PIN if available
    },
    attestation: "none"                         // or "direct" for device verification
    timeout: 60000
  }
});
```

When this call executes, the browser prompts the user to interact with an authenticator: a fingerprint sensor, a security key tap, or a platform prompt like Windows Hello. The authenticator generates a new key pair, locks the private key inside its secure storage, and returns the public key along with a credential ID. Your frontend sends this response to the server for verification and storage.

### Authentication with `navigator.credentials.get()`

Authentication proves the user controls the private key registered earlier. The server sends a challenge and optionally a list of acceptable credential IDs.

```javascript
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: serverGeneratedChallenge,
    rpId: "example.com",
    allowCredentials: [{
      id: storedCredentialId,                   // from registration
      type: "public-key",
      transports: ["usb", "ble", "internal"]   // hint for authenticator discovery
    }],
    userVerification: "preferred",
    timeout: 60000
  }
});
```

The authenticator locates the matching credential, verifies the user (biometric or PIN), and signs the challenge with the private key. The browser returns this signed assertion to your application, which forwards it to the server for signature verification.

### The Backend's Role

The server has three responsibilities across both ceremonies.

During registration, the backend must verify the attestation response. This means confirming that the challenge matches what was issued, the origin matches your application's domain, and the public key uses an acceptable algorithm. Libraries like `@simplewebauthn/server` handle the cryptographic verification, but your application is responsible for storing the resulting credential data: the public key, credential ID, a signature counter, and the transports the authenticator supports.

During authentication, the backend verifies the assertion signature against the stored public key. It also checks the signature counter. Authenticators increment this counter with each use, so a counter value lower than or equal to the stored value signals a potential cloned credential. After successful verification, the backend updates the stored counter and issues a session.

The step-by-step flow looks like this:

1. Server generates and stores a random challenge
2. Frontend calls `navigator.credentials.create()` or `.get()` with the challenge
3. Browser mediates the authenticator interaction, enforcing origin binding
4. Authenticator performs the cryptographic operation after user verification
5. Frontend sends the response to the server
6. Server validates the response (challenge, origin, signature, counter)
7. Server stores the credential (registration) or issues a session (authentication)

Origin binding happens at step 3. The browser automatically includes the current origin in the data sent to the authenticator. If a user is on a phishing site at `evil-example.com`, the authenticator will not find a credential registered for that origin. The authentication fails silently, with no secret exposed to the attacker.

## WebAuthn Spec and Browser Support

### The W3C Specification

The WebAuthn standard has matured through three specification levels. [Level 1](https://www.w3.org/TR/webauthn-1/) became a W3C Recommendation in March 2019, establishing the core API for credential creation and assertion. [Level 2](https://www.w3.org/TR/webauthn-2/) followed in April 2021, adding support for cross-platform authenticator transports, improved attestation handling, and better alignment with the CTAP2 protocol. [Level 3](https://www.w3.org/TR/webauthn-3/) reached Candidate Recommendation status in January 2026 and introduces features like the PRF extension for deriving encryption keys from credentials, conditional mediation (the ability to autofill passkey prompts), and the Signal API for relying parties to communicate credential state changes back to authenticators.

Each level builds on the previous one without breaking backward compatibility. If your application targets Level 2 features today, it will continue to work as Level 3 gains full browser adoption.

### Browser Compatibility and Secure Contexts

WebAuthn enjoys broad support across modern browsers. Chrome has supported it since version 67, Firefox since version 60, Edge since version 18, and Safari since version 13. On mobile, both Android (via Chrome and the platform credential manager) and iOS (via Safari with Face ID and Touch ID) provide full WebAuthn support. The practical result is that the vast majority of users on current browsers can use WebAuthn credentials without installing anything.

One hard requirement: WebAuthn only works in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). That means HTTPS in production, no exceptions. The API will not execute over plain HTTP. For local development, `localhost` is treated as a secure context by browsers, so you can test without configuring TLS certificates on your dev machine. This requirement exists because origin binding is the foundation of WebAuthn's phishing resistance, and origin verification is only meaningful over authenticated connections.

Browser support is not perfectly uniform across every feature. Platform authenticator availability depends on the operating system (Windows Hello, macOS Touch ID, Android biometrics), and newer Level 3 extensions like PRF are still rolling out across browsers and platforms. Implement feature detection using `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` and provide graceful fallbacks for users on older configurations.

### From U2F to WebAuthn

WebAuthn did not appear in a vacuum. It evolved from FIDO U2F (Universal 2nd Factor), a protocol the FIDO Alliance introduced in 2014 for hardware-based second-factor authentication. U2F was effective but limited: it only functioned as a second factor alongside a password, it required a physical USB security key, and it never saw native Safari support.

WebAuthn addresses each of those limitations. It supports both multi-factor and single-factor (passwordless) authentication, so a fingerprint scan or security key tap can replace passwords entirely rather than just supplementing them. It works with platform authenticators built into devices, not only roaming USB keys. And it has universal browser adoption, something U2F never achieved.

The transition is effectively complete. Chrome deprecated the U2F JavaScript API in version 98 and removed it entirely in version 115. Firefox deprecated U2F in favor of WebAuthn starting with version 60. Existing U2F security keys remain compatible with WebAuthn through CTAP1 backward compatibility, so users with older YubiKeys or Google Titan keys do not need to replace their hardware. For new implementations, WebAuthn through the FIDO2 framework is the only standard worth building on.

## How to Integrate WebAuthn in Your Auth Stack (Frontend + Backend)

The WebAuthn API surface is small, but the data flowing between client and server requires careful handling. The browser returns `ArrayBuffer` objects that need encoding before transmission. The server receives attestation and assertion structures that must be parsed, validated, and stored correctly. Here is a practical walkthrough of both sides.

### Frontend: Registration

Registration starts with your server generating options (challenge, user info, relying party config) and ends with the browser returning a new credential.

```typescript
async function registerCredential(userId: string): Promise<void> {
  // 1. Fetch registration options from your server
  const options = await fetch('/api/webauthn/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  }).then(res => res.json());

  // 2. Call the WebAuthn API
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64UrlToBuffer(options.challenge),
      rp: { id: options.rpId, name: options.rpName },
      user: {
        id: base64UrlToBuffer(options.userId),
        name: options.userName,
        displayName: options.userDisplayName
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }  // RS256
      ],
      authenticatorSelection: {
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      attestation: 'none',
      timeout: 60000
    }
  }) as PublicKeyCredential;

  // 3. Send the response to the server for verification
  const attestationResponse = credential.response as AuthenticatorAttestationResponse;
  await fetch('/api/webauthn/register/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: credential.id,
      rawId: bufferToBase64Url(credential.rawId),
      response: {
        clientDataJSON: bufferToBase64Url(attestationResponse.clientDataJSON),
        attestationObject: bufferToBase64Url(attestationResponse.attestationObject)
      },
      type: credential.type
    })
  });
}
```

### Frontend: Authentication

Authentication follows the same pattern. The server provides a challenge and optionally a list of allowed credential IDs, the browser collects the signed assertion, and the frontend forwards it.

```typescript
async function authenticate(): Promise<void> {
  const options = await fetch('/api/webauthn/login/options', {
    method: 'POST'
  }).then(res => res.json());

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: base64UrlToBuffer(options.challenge),
      rpId: options.rpId,
      allowCredentials: options.allowCredentials?.map((cred: any) => ({
        id: base64UrlToBuffer(cred.id),
        type: 'public-key',
        transports: cred.transports
      })),
      userVerification: 'preferred',
      timeout: 60000
    }
  }) as PublicKeyCredential;

  const assertionResponse = assertion.response as AuthenticatorAssertionResponse;
  await fetch('/api/webauthn/login/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: assertion.id,
      rawId: bufferToBase64Url(assertion.rawId),
      response: {
        clientDataJSON: bufferToBase64Url(assertionResponse.clientDataJSON),
        authenticatorData: bufferToBase64Url(assertionResponse.authenticatorData),
        signature: bufferToBase64Url(assertionResponse.signature),
        userHandle: assertionResponse.userHandle
          ? bufferToBase64Url(assertionResponse.userHandle)
          : null
      },
      type: assertion.type
    })
  });
}
```

Both flows depend on a pair of encoding helpers. The WebAuthn API works with `ArrayBuffer`, but JSON transport requires base64url strings.

```typescript
function bufferToBase64Url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  return Uint8Array.from(binary, c => c.charCodeAt(0)).buffer;
}
```

### Backend: Parsing and Verification

The server's job is to unpack the response, verify it cryptographically, and reject anything that does not match. For registration, that means parsing `clientDataJSON` to confirm the challenge and origin, then extracting the public key from the `attestationObject`. For authentication, it means validating the signature over the `authenticatorData` and `clientDataJSON` hash against the stored public key.

Libraries like [`@simplewebauthn/server`](https://github.com/MasterKale/SimpleWebAuthn) handle the low-level CBOR decoding and signature math. Using one is strongly recommended over rolling your own verification.

```javascript
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require('@simplewebauthn/server');

const RP_ID = 'example.com';
const ORIGIN = 'https://example.com';

// Registration verification
async function handleRegistrationVerify(req, res) {
  const { body } = req;
  const expectedChallenge = await getStoredChallenge(req.session.userId);

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID
  });

  if (verification.verified) {
    const { credential } = verification.registrationInfo;
    // Store the credential (see schema below)
    await saveCredential(req.session.userId, {
      credentialId: credential.id,
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transports: body.response.transports || []
    });
  }
}

// Authentication verification
async function handleAuthVerify(req, res) {
  const { body } = req;
  const expectedChallenge = await getStoredChallenge(body.userId);
  const storedCredential = await getCredential(body.id);

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    credential: storedCredential
  });

  if (verification.verified) {
    // Update counter to detect cloned authenticators
    await updateCredentialCounter(
      body.id,
      verification.authenticationInfo.newCounter
    );
    // Issue session
  }
}
```

Three fields inside `clientDataJSON` matter most during verification: `type` (must be `webauthn.create` for registration or `webauthn.get` for authentication), `challenge` (must match the server-issued value), and `origin` (must match your relying party origin exactly). If any of these fail, reject the response. Never trust `req.headers.origin` as your expected origin; hardcode it or load it from your server configuration.

### Credential Storage

Each user can register multiple credentials (a laptop fingerprint sensor, a phone, a backup security key), so your storage needs to support a one-to-many relationship between users and credentials.

```sql
CREATE TABLE webauthn_credentials (
  credential_id  TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id),
  public_key     BYTEA NOT NULL,
  counter        BIGINT NOT NULL DEFAULT 0,
  transports     TEXT[],           -- e.g. {'internal', 'usb'}
  created_at     TIMESTAMP DEFAULT NOW(),
  last_used_at   TIMESTAMP,
  friendly_name  TEXT              -- "MacBook Touch ID", "Backup YubiKey"
);
```

Track `last_used_at` so users can identify stale credentials in their account settings. Store `transports` so the browser can hint which authenticator type to prompt during login. Include a `friendly_name` column so users can distinguish between their registered devices. The `counter` column is your cloned-authenticator detection mechanism: if an authentication response arrives with a counter value less than or equal to the stored value, flag the credential and force re-registration.

## WebAuthn + Fallback and Progressive Enhancement Strategies

WebAuthn is the strongest authentication mechanism available in browsers today, but you cannot assume every user has access to it. Some users are on older devices without biometric sensors. Some are logging in from a borrowed machine. Some work in environments where USB security keys are impractical. A production auth flow needs to handle all of these cases without degrading security for the users who *can* use WebAuthn.

### Conditional Offering: Detect Before You Prompt

The right approach is progressive enhancement: offer WebAuthn when the device supports it, and fall back gracefully when it does not. The WebAuthn API provides the tools for this through feature detection.

```javascript
async function getAvailableAuthMethods() {
  const methods = ['password']; // baseline always available

  if (window.PublicKeyCredential) {
    methods.push('webauthn-roaming'); // security key support

    const platformAvailable =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

    if (platformAvailable) {
      methods.push('webauthn-platform'); // biometric/PIN support
    }
  }

  return methods;
}
```

`PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` tells you whether the device has a built-in authenticator like Touch ID, Face ID, or Windows Hello. If it returns `false`, prompting for a platform authenticator will only confuse the user. Check first, then adapt the UI accordingly.

Conditional mediation, introduced in WebAuthn Level 3, takes this further. With `navigator.credentials.get({ mediation: "conditional" })`, the browser can surface passkey options in the autofill dropdown alongside saved passwords. Users who have registered a passkey see it as a login option without any extra UI. Users who have not registered one see the standard password field. No special prompts, no feature flags on your end.

### Fallback Flows

When WebAuthn is unavailable or fails (the user cancels the prompt, a timeout occurs, the authenticator is not recognized), your application needs a clear fallback hierarchy. The goal is to maintain security while keeping the user moving forward.

A practical fallback chain looks like this:

1. WebAuthn (platform or roaming authenticator)
2. TOTP via authenticator app
3. One-time code via email or SMS
4. Pre-generated recovery codes
5. Administrative account recovery with identity verification

```javascript
async function handleAuthFallback(userId, failedMethod) {
  const registeredMethods = await getUserMFAMethods(userId);

  if (failedMethod === 'webauthn' && registeredMethods.totp) {
    return { fallback: 'totp', message: 'Enter the code from your authenticator app.' };
  }

  if (registeredMethods.backupCodes > 0) {
    return { fallback: 'backup', message: 'Enter one of your recovery codes.' };
  }

  return { fallback: 'recovery', message: 'Contact support to verify your identity.' };
}
```

Each step down the chain accepts a weaker proof of identity, so the tradeoffs matter. TOTP codes are still strong second factors. Email and SMS one-time codes are vulnerable to interception but are better than locking a user out entirely. Recovery codes are single-use secrets that should be generated at enrollment time, stored offline by the user, and hashed on the server. Administrative recovery should require out-of-band identity verification and should be logged and auditable.

The critical mistake is treating fallbacks as optional. Users will not register backup methods unless you build it into the enrollment flow. After a user registers their primary WebAuthn credential, prompt them immediately to set up a secondary method. Make it a required step, not a dismissible banner they will ignore.

### Matching Security to Risk

Not every action in your application carries the same risk. A user browsing a dashboard does not need the same authentication assurance as one changing account credentials or approving a financial transaction. Progressive enhancement applies here too.

For routine access, a valid session token is sufficient. For sensitive operations, trigger step-up authentication using the strongest method the user has registered. If they have a WebAuthn credential, require it. If they only have TOTP, require that. This layered approach lets you enforce strong authentication where it matters without adding friction to every interaction.

The underlying principle is straightforward: make the secure path the default path, design the fallbacks honestly, and never let the absence of one method leave a user without any path forward.

## Using WebAuthn in a Plugin or Auth Framework (e.g. SuperTokens)

Implementing WebAuthn from scratch means writing and maintaining challenge generation, CBOR parsing, attestation verification, signature validation, counter tracking, and credential storage. An auth framework handles that machinery for you and exposes WebAuthn as a configurable component. [SuperTokens](https://supertokens.com/docs/authentication/passkeys/initial-setup) is a good example: it ships WebAuthn (passkeys) as a recipe in its Node.js and Python SDKs, so you enable it the same way you enable email/password or social login.

### Enabling WebAuthn via Plugin Configuration

In SuperTokens, authentication methods are "recipes" that you add to a `recipeList`. Adding passkey support means adding the WebAuthn recipe to both your backend and frontend initialization.

Backend (Node.js):

```javascript
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import WebAuthn from "supertokens-node/recipe/webauthn";

supertokens.init({
  supertokens: { connectionURI: "..." },
  appInfo: {
    appName: "Your App",
    apiDomain: "https://api.example.com",
    websiteDomain: "https://example.com"
  },
  recipeList: [
    WebAuthn.init(),
    Session.init()
  ]
});
```

Frontend (React):

```javascript
import SuperTokens from "supertokens-auth-react";
import WebAuthn from "supertokens-auth-react/recipe/webauthn";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "Your App",
    apiDomain: "https://api.example.com",
    websiteDomain: "https://example.com"
  },
  recipeList: [
    WebAuthn.init(),
    Session.init()
  ]
});
```

With those two changes, the framework wires up the API routes for credential options, signup, and signin. The core exposes endpoints like `POST /recipe/webauthn/options/signin` and `POST /recipe/webauthn/signup`, and the SDK handles the browser-side `navigator.credentials` calls and base64url encoding you would otherwise write yourself. If you use the prebuilt UI, the passkey registration and login screens render automatically. If you build custom UI, the SDK exposes functions that drive the same flows.

### Registration, Authentication, Errors, and Fallback

The recipe maps cleanly to the two WebAuthn ceremonies. On signup, the framework generates options, the SDK calls the authenticator, and the core verifies the attestation and stores the credential against the user. On signin, it generates a challenge, collects the assertion, verifies the signature, and updates the counter.

Error handling is where framework integration earns its keep. WebAuthn surfaces a defined set of `DOMException` types: `NotAllowedError` when the user cancels or the prompt times out, `InvalidStateError` when a credential is already registered on the device, and `NotSupportedError` when the requested parameters are unavailable. The SDK normalizes these into status responses you can branch on, rather than leaving you to parse raw browser exceptions.

For fallback, you compose recipes rather than building a parallel system. Pair the WebAuthn recipe with email/password or passwordless (magic link / OTP) recipes in the same `recipeList`. Users on devices without passkey support authenticate through the alternate method, and the framework manages both paths under one user identity. You can also configure the relying party ID, attestation policy, and user verification requirements through the recipe's customization options to match your security posture.

### Migration Strategies for Existing Users

You rarely flip an existing user base to WebAuthn overnight. The realistic path is optional, incremental adoption layered on top of your current authentication.

Start by keeping your existing login intact and offering passkey registration as an opt-in inside account settings. After a user signs in with their password, prompt them to add a passkey for faster future logins. This builds a population of WebAuthn-capable accounts without forcing anyone through a migration wall.

Once a user has registered a passkey, you can offer it as the default login method on their next visit while keeping the password available as fallback. Track adoption, and for high-value accounts (admins, users with elevated permissions), you can move from optional to required once enough of that cohort has enrolled.

In SuperTokens specifically, this layering is handled by combining the WebAuthn recipe with your existing first-factor recipe, and optionally with the [MFA recipe](https://supertokens.com/docs/additional-verification/mfa/webauthn-setup) when you want WebAuthn enforced as a second factor for specific users or roles. The migration becomes a configuration and UX exercise rather than a rewrite of your auth layer.

## Common Pitfalls, Security Considerations, and Best Practices

WebAuthn removes entire categories of attack, but it introduces operational details that are easy to get wrong. The failures here are rarely cryptographic. They show up in attestation handling, credential lifecycle management, and error states that leave users stranded.

### Attestation, Consent, and Extensions

Attestation is the most commonly over-engineered part of a WebAuthn integration. It lets you verify the make and model of an authenticator, but most applications do not need it. Requesting `attestation: "direct"` pulls back identifying information about the user's device, which raises privacy concerns and adds verification complexity you have to maintain. Unless you operate in a regulated environment that mandates specific hardware (FIPS-validated keys, for example), set `attestation: "none"`. This respects user privacy and simplifies your server logic without weakening the core security guarantee.

User consent is built into the protocol through user presence and user verification. User presence (a touch or tap) confirms a human is physically present. User verification (biometric or PIN) confirms it is the right human. Set `userVerification: "preferred"` for most flows so the authenticator uses verification when available without hard-failing on devices that lack it. Reserve `"required"` for sensitive operations where you cannot accept presence alone.

Extensions like the PRF extension (for deriving encryption keys) or `credProps` (for learning whether a credential is discoverable) are powerful but unevenly supported. Treat them as enhancements, not dependencies, and always check the extension results rather than assuming they were honored.

### Key Rotation and Credential Revocation

WebAuthn credentials do not expire on their own, so revocation is your responsibility. Build a credential management interface where users can view their registered authenticators and remove ones they no longer control. When a user reports a lost device, revoking the corresponding credential should immediately invalidate it server-side by deleting the stored public key.

There is no "rotating" a WebAuthn private key the way you rotate a password, because the key never leaves the authenticator. Rotation in practice means registering a new credential and revoking the old one. Encourage users to register a replacement before removing an old authenticator so they never drop to zero registered credentials.

### Multi-Device Registration

A single registered authenticator is a single point of failure. If it is the only credential and the device is lost, the user is locked out. Make multi-device registration a deliberate part of onboarding: after a user registers their first credential, prompt them to add a second (a phone passkey alongside a laptop sensor, or a backup security key). Store credentials in a one-to-many relationship with the user, and let users assign friendly names so they can tell their devices apart when managing them later.

Synced passkeys (backed up through iCloud Keychain or Google Password Manager) reduce this risk because the credential follows the user across their devices. Device-bound credentials like hardware security keys do not sync, so backup registration matters more for those.

### Error Handling

WebAuthn surfaces failures as `DOMException` types, and handling them gracefully separates a usable flow from a frustrating one.

```javascript
try {
  const credential = await navigator.credentials.get({ publicKey: options });
  // verify on server
} catch (err) {
  switch (err.name) {
    case 'NotAllowedError':
      // User canceled or the operation timed out
      showMessage('Authentication canceled. Try again or use another method.');
      break;
    case 'InvalidStateError':
      // Credential already registered on this device (during create)
      showMessage('This device is already registered.');
      break;
    case 'NotSupportedError':
      // Requested parameters not supported
      offerFallbackMethod();
      break;
    case 'SecurityError':
      // Origin or RP ID mismatch
      logSecurityEvent(err);
      break;
    default:
      offerFallbackMethod();
  }
}
```

`NotAllowedError` is the one you will see most. It covers both user cancellation and timeouts, so do not treat it as an attack signal. Give the user a clear path to retry or fall back. Authenticator removal mid-flow (unplugging a security key) also surfaces here. Always pair a timeout value with a fallback option so a stalled prompt never becomes a dead end.

### Phishing Resistance Is Not Automatic Configuration Safety

Origin binding is what makes WebAuthn phishing-resistant: a credential registered for `example.com` cannot be used on `evil-example.com`, because the browser includes the real origin in the signed data and the authenticator will not match credentials across origins. A credential captured by a phishing site is useless because it was never issued for that origin in the first place.

That protection depends on configuring your relying party ID and expected origin correctly. The most common self-inflicted wound is loose origin validation on the server. Never derive your expected origin from the incoming request's `Origin` header, because an attacker controls that value. Hardcode your allowed origins or load them from server configuration, and validate strictly.

```javascript
// WRONG: trusting attacker-controlled input
expectedOrigin: req.headers.origin

// CORRECT: server-defined allowlist
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? ['https://example.com']
  : ['http://localhost:3000'];
```

A mismatched or overly broad relying party ID (allowing wildcard subdomains, for instance) can also create silent failures or widen your attack surface. Set the RP ID to the registrable domain you actually serve, test it against your real origin, and resist the urge to loosen it to make a misconfiguration "work."

## WebAuthn vs Other Auth Methods: When Should You Use It?

WebAuthn is the strongest browser-based authentication available, but "strongest" does not mean "right for every situation." Choosing it well means understanding what it beats, where it shines, and what it costs.

### How It Compares

The decisive difference between WebAuthn and every password-derived method is the shared secret. Passwords, OTP codes, and TOTP seeds are all secrets that exist in two places and can be intercepted, phished, or leaked. WebAuthn's private key never leaves the authenticator, so there is nothing to intercept.

| Method | Phishing-resistant | Shared secret | Breach exposure | User friction |
|---|---|---|---|---|
| Password only | No | Yes | High (stored hashes) | Low |
| Password + SMS OTP | No | Yes | Medium (interceptable) | Medium |
| Password + TOTP | Partial | Yes (seed) | Medium (seed theft) | Medium |
| WebAuthn | Yes | No | Minimal (public keys only) | Low to medium |

Against password-plus-SMS-OTP, WebAuthn wins decisively. SMS codes are vulnerable to SIM swapping and interception, and the password underneath remains phishable. TOTP (authenticator-app codes) is stronger because the code is generated locally and never transmitted as a long-lived secret, but the shared seed can still be stolen at enrollment, and a user can be tricked into typing a valid code into a phishing page. WebAuthn closes that gap entirely: even a user who wants to authenticate on a phishing site cannot, because the browser will not release a credential bound to a different origin.

Compared to traditional MFA generally, the difference is architectural rather than incremental. Traditional MFA stacks a second shared secret on top of the first. WebAuthn replaces the secret model with possession of a private key plus local user verification. That is why it resists the entire phishing and credential-stuffing class of attacks rather than just raising the cost.

### Where WebAuthn Is the Right Choice

WebAuthn is the strongest fit anywhere phishing resistance is a hard requirement. High-value targets benefit most: admin consoles, financial and healthcare applications, developer infrastructure, and any system where a compromised account causes serious downstream damage. It is also a strong choice for step-up authentication on sensitive operations, where you want cryptographic assurance for actions like changing credentials or approving transactions.

Consumer-facing products with broad device support are increasingly good candidates too, especially using synced passkeys. The login experience (a fingerprint or face scan) is often faster and smoother than typing a password plus an OTP code, so the security upgrade can actually reduce friction rather than add it.

### The Tradeoffs Are Real

Device availability is the main constraint. Not every user has a biometric sensor or a security key, and users logging in from shared or borrowed machines may not have access to their authenticator. This is why a fallback path is mandatory rather than optional, as covered earlier.

Adoption friction is the second cost. Users are unfamiliar with passkeys, and account recovery becomes more involved when there is no password to reset. A lost device with no backup credential and no recovery method means a locked-out user. You absorb this cost through deliberate onboarding: prompt for a backup credential at registration, provide recovery codes, and keep a well-designed fallback chain in place.

The practical answer for most teams is not "WebAuthn or nothing." It is WebAuthn as the preferred, default method, backed by TOTP and recovery options for the cases where it is unavailable. You get phishing-resistant authentication for the users and moments that matter most, without locking out anyone who cannot use it yet.

## FAQ / People Also Ask

### What is the difference between WebAuthn and FIDO2?

FIDO2 is the overall framework; WebAuthn is one of its two components. FIDO2 combines WebAuthn (the W3C API that browsers and web applications use) with CTAP, the Client-to-Authenticator Protocol that handles communication between the device and external authenticators like security keys. In short, WebAuthn is what your web application calls, and CTAP is how the browser talks to the hardware. When people say "FIDO2 authentication," they are usually describing the full passwordless experience that WebAuthn enables.

### Does WebAuthn work on mobile, iOS, and Android browsers?

Yes. iOS supports WebAuthn through Safari using Face ID and Touch ID, and Android supports it through Chrome and the platform credential manager using fingerprint and PIN. Both platforms back synced passkeys (iCloud Keychain on Apple devices, Google Password Manager on Android), so a credential registered on a phone can follow the user across their devices. Mobile is one of the strongest environments for WebAuthn precisely because nearly every modern phone ships with a built-in biometric authenticator.

### Can WebAuthn be used as a second factor?

Yes. WebAuthn supports both single-factor (passwordless) and second-factor use. As a second factor, it replaces weaker options like SMS or TOTP with a phishing-resistant cryptographic check after a primary login. Many teams adopt it this way first, layering a WebAuthn security key or passkey on top of an existing password or social login, then move toward passwordless once adoption grows. Frameworks like SuperTokens let you configure WebAuthn as a required second factor for specific users or roles through their MFA recipe.

### What happens if I lose my device with WebAuthn credentials?

It depends on the type of credential. Synced passkeys are backed up to your platform account (iCloud or Google), so they are recoverable on a new device by signing back into that account. Device-bound credentials, like hardware security keys, are not recoverable; the private key is gone with the device. This is why backup matters. A well-designed implementation prompts you to register a second credential at enrollment and provides recovery codes, so losing one authenticator never means losing access to your account. If you do lose your only credential with no backup, you fall back to the application's account recovery process, which should require out-of-band identity verification.

## Getting Started

WebAuthn looks complex from the spec, but adding it to a real application is mostly a matter of choosing the right tools and wiring them in. You do not need to implement CBOR parsing or signature verification yourself. Here is the fastest path from reading to shipping.

### Pick a Library

If you are building the flow directly, [`@simplewebauthn`](https://github.com/MasterKale/SimpleWebAuthn) is the most widely used option in the JavaScript ecosystem. It provides `@simplewebauthn/server` for backend verification and `@simplewebauthn/browser` for the frontend, handling the encoding and cryptographic work described earlier in this guide. For other stacks, the [FIDO Alliance maintains a list](https://fidoalliance.org/certification/fido-certified-products/) of certified server libraries.

If you would rather not manage the auth layer at all, use a framework that ships WebAuthn as a configurable component. [SuperTokens](https://supertokens.com/docs/authentication/passkeys/initial-setup) provides passkey support as a recipe in its Node.js and Python SDKs. Enabling it is a matter of adding `WebAuthn.init()` to your backend and frontend `recipeList`, as shown earlier. Because it is open source, you keep full visibility into the backend logic with no vendor lock-in, and you can self-host the core if you need to.

### Add WebAuthn to Your Existing Auth

You do not have to rebuild your login to adopt WebAuthn. The lowest-risk starting point is to layer it on top of what you already have:

1. Keep your current login (password, social, or passwordless) in place.
2. Add passkey registration as an opt-in inside account settings.
3. After a user registers a passkey, offer it as the default login on their next visit, with the existing method as fallback.
4. For high-value accounts, move from optional to required once adoption is healthy.

In SuperTokens, this means composing the WebAuthn recipe alongside your existing first-factor recipe, and optionally the [MFA recipe](https://supertokens.com/docs/additional-verification/mfa/webauthn-setup) when you want it enforced as a second factor. The migration becomes a configuration and UX exercise rather than a rewrite.

### Resources

For deeper reference as you build:

- [W3C WebAuthn Level 3 specification](https://www.w3.org/TR/webauthn-3/): the authoritative source on the API and its data structures.
- [MDN Web Authentication API docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API): practical, example-driven reference for the browser API.
- [SuperTokens passkeys documentation](https://supertokens.com/docs/authentication/passkeys/initial-setup): setup, customization, and MFA configuration.
- [FIDO Alliance](https://fidoalliance.org/fido2-2/fido2-web-authentication-webauthn/): background on FIDO2, CTAP, and the broader passwordless ecosystem.
- [passkeys.dev](https://passkeys.dev/): community guides and device support tables maintained alongside the FIDO Alliance and W3C.

The shift away from shared secrets is already underway. Apple, Google, and Microsoft all support passkeys across their platforms, and the libraries and frameworks to implement WebAuthn are mature and well documented. Start by adding passkey registration as an option for your existing users, measure adoption, and expand from there. Phishing-resistant authentication is no longer a project reserved for large security teams; it is a recipe you can enable this week.

<!-- Section word count: 461 -->
<!-- Total word count: 5,829 -->