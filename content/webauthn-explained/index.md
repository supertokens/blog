---
title: "WebAuthn Explained"
description: "A comprehensive guide to understanding WebAuthn, its benefits, and implementation details."
date: 2025-09-14
cover: "webauthn-explained.png"
author: "Joel Coutinho"
category: "programming"
---


WebAuthn (short for Web Authentication) is a modern web standard that enables passwordless or two-factor authentication using public key cryptography. 

In practice, WebAuthn allows a web application (the relying party) to ask a client (browser + authenticator) to create or use a key pair in a way that ensures strong security, phishing resistance, and origin binding. The private key never leaves the user’s device, and the public key is stored on the server.

Because WebAuthn is part of the FIDO2 framework, something we've gone into more detail [here](../what-is-fido), it works together with CTAP (the Client to Authenticator Protocol) to support a variety of authenticators: built-in device biometrics (Touch ID, fingerprint sensors), security keys (e.g. YubiKey), or platform authenticators (e.g. secure enclave, TPM).

In this article we’ll explore why WebAuthn matters, how it works, real code examples, how SuperTokens supports it, and common pitfalls and future trends.

## What Problem Does WebAuthn Solve?
Over decades, password-based authentication has proven to be brittle and vulnerable. Some of the common failure modes:

-   **Phishing attacks**: Users can be tricked into entering their password on a malicious site that looks like the real one. Because the password is a shared secret, attackers can replay it.

-   **Credential reuse**: Users often reuse the same password across multiple sites. If one site is breached, attackers try the same credentials elsewhere.

-   **Poor entropy**: Many users choose simple or memorable passwords, which can be weak and vulnerable to brute-force or dictionary attacks.

-   **Server-side risk**: Servers store hashed passwords; if the password database is breached, attackers may use offline cracking or other attacks.

These weaknesses motivate a shift to authentication models where **no shared secret** exists that the server holds (beyond a public key), and phishing or replay attacks become much harder.

## What Is the Web Authentication API?

**WebAuthn (Web Authentication API)** is a **W3C standard** built into modern browsers and platforms. It allows web apps to create and use **cryptographic credentials** for secure authentication, enabling:

- **Passwordless login**
- **Second-factor authentication**
- **Phishing-resistant multi-device credentials (passkeys)**

It’s part of the **FIDO2 standard**, which combines:
- **WebAuthn (browser API)** — handles credential creation and verification in web contexts.
- **CTAP (Client to Authenticator Protocol)** — lets browsers talk to authenticators (like YubiKeys or OS-level biometric sensors).

Together, these protocols make it possible for websites to offer secure logins via biometrics, hardware tokens, or OS-based authenticators — all without passwords.

## How Does WebAuthn Work?

### Registration Flow
1. The server (relying party) generates a **challenge** and sends it to the browser.
2. The browser calls `navigator.credentials.create()` to ask the authenticator to create a new credential.
3. The authenticator (device) generates a **public-private key pair**.
4. The private key stays securely on the device; the **public key and credential ID** are sent to the server.
5. The server stores the public key and associates it with the user.

### Authentication Flow
1. The server sends a **challenge** (random string) to the client.
2. The browser calls `navigator.credentials.get()` to ask the authenticator to sign the challenge.
3. The authenticator uses the private key to sign the challenge.
4. The signed data and credential ID are sent back to the server.
5. The server verifies the signature using the stored public key.

### Credential Storage
Private keys are stored in secure hardware such as:
- **TPM (Trusted Platform Module)** — Windows devices
- **Secure Enclave** — Apple devices
- **External authenticators** — YubiKeys, Titan keys, etc.

Credentials are bound to both the **origin (domain)** and the **relying party ID**, preventing phishing and replay attacks.


## Web Authentication API Example
------------------------------

Here is a simple illustrative code walkthrough for registration and authentication using the Web Authentication API.

> **Note:** In production, you'll wrap this in safer encoding, error handling, and server integration.

### Registration Example (Client Side)

```ts
const publicKeyOptionsFromServer = {
  challenge: Uint8Array.from(atob(serverChallenge), c => c.charCodeAt(0)),
  rp: { name: "My App", id: "example.com" },
  user: {
    id: Uint8Array.from(atob(userIdBase64), c => c.charCodeAt(0)),
    name: userEmail,
    displayName: userFullName
  },
  pubKeyCredParams: [
    { type: "public-key", alg: -7 },   // ES256
    { type: "public-key", alg: -257 }  // RS256, optional
  ],
  authenticatorSelection: {
    userVerification: "preferred",
    residentKey: "discouraged"
  },
  attestation: "none"
};

navigator.credentials.create({ publicKey: publicKeyOptionsFromServer })
.then(credential => {
  // Convert to JSON-safe format and send to server
  const clientDataJSON = credential.response.clientDataJSON;
  const attestationObject = credential.response.attestationObject;
  const rawId = credential.rawId;
  // e.g. send { id, rawId, response: { clientDataJSON, attestationObject }, type } to server
})
.catch(err => {
  console.error("WebAuthn registration failed", err);
});
```

### Authentication Example (Client Side)

```ts
const requestOptions = {
  challenge: Uint8Array.from(atob(serverChallenge), c => c.charCodeAt(0)),
  allowCredentials: [
    {
      id: Uint8Array.from(atob(credIdBase64), c => c.charCodeAt(0)),
      type: "public-key"
    }
  ],
  timeout: 60000,
  userVerification: "preferred"
};

navigator.credentials.get({ publicKey: requestOptions })
.then(assertion => {
  // Process and send to server
  const clientDataJSON = assertion.response.clientDataJSON;
  const authenticatorData = assertion.response.authenticatorData;
  const signature = assertion.response.signature;
  // Send { id, response: { clientDataJSON, authenticatorData, signature }, type } to server
})
.catch(err => {
  console.error("WebAuthn authentication failed", err);
});
```

### Server Side (Simplified)

On the backend, typical steps are:

-   For registration: validate and parse attestation, ensure challenge matches, record public key, credential ID, user handle.

-   For authentication: verify the client data JSON, parse authenticator data, validate the signature against stored public key, check origin and challenge, check signature counter.

-   If valid, issue a session token (cookie, JWT, etc.)

In real code, you'd use a library (e.g. webauthn libraries in Node.js, Python) to safely perform these cryptographic checks.

### Challenges, Attestation, and Extensions

-   **Attestation object**: carries information about the authenticator (e.g. manufacturer, model) and may include certificates or metadata.

-   **ClientDataJSON**: wraps data including the challenge, origin, type, and hash of the client behavior.

-   **Extensions**: you can request extra features (for example, credential management, authorization time extension) via WebAuthn extensions.

-   **Error handling**: browsers may reject based on missing authenticators, user cancelation, or parameter mismatch.


## Understanding the WebAuthn Spec


Delving into the specification provides insight into more advanced capabilities and guarantees.

### Credential Types, Transports & Attestation Formats

-   **Credential types** (currently just `"public-key"`) define the kind of credential.

-   **Transports** identify how the authenticator is connected (USB, NFC, BLE, internal).

-   **Attestation formats** (e.g. `packed`, `fido-u2f`, `none`, `android-safetynet`, `tpm`) define how the authenticator certifies itself to the relying party.

-   **Authenticator models** define mandatory functional elements (user verification, user presence, key protection).

### Extensions (Resident Credentials, Discoverable Keys, Enterprise Attestation)

-   **Resident / discoverable credentials**: credentials stored on the authenticator so that users don't need to supply credential ID during login.

-   **User verification / user presence**: ensures that the user consents or verifies via PIN, biometric, or other mechanism.

-   **Enterprise Attestation**: allows organizations to require unique device attestation for managed devices. [Yubico Developers](https://developers.yubico.com/WebAuthn/Concepts/WebAuthn_Level_2_Features_and_Enhancements.html?utm_source=chatgpt.com)

### Security Guarantees

-   **Origin scoping**: credentials are bound to a specific relying party origin, preventing phishing.

-   **User consent / user verification**: no action by the authenticator is done without the user.

-   **Replay protection**: unique, unpredictable challenge per request + signature counters.

-   **Credential isolation**: credentials from another relying party are invisible to the client. [W3C+1](https://www.w3.org/TR/webauthn-2/?utm_source=chatgpt.com)

### Browser Compatibility & Support Matrix

Most modern browsers support WebAuthn:

-   Chrome, Firefox, Edge, Safari all support WebAuthn (Level 1) by default. [Auth0+3Wikipedia+3W3C+3](https://en.wikipedia.org/wiki/WebAuthn?utm_source=chatgpt.com)

-   The Level 2 enhancements are being adopted gradually. [Yubico Developers+1](https://developers.yubico.com/WebAuthn/Concepts/WebAuthn_Level_2_Features_and_Enhancements.html?utm_source=chatgpt.com)

-   On mobile platforms, WebAuthn works with biometric sensors and secure enclaves.

If you target older browsers, fallback mechanisms (e.g. OTP, SMS) or polyfills may be required.


## How SuperTokens Enhances WebAuthn-Based Authentication

SuperTokens is an open-source authentication framework, and it offers built-in support for WebAuthn / passkeys to simplify integration and management. Here's how SuperTokens leverages WebAuthn and smooths the developer experience.

### Device-Based Login & Credential Management

-   SuperTokens includes WebAuthn-based passwordless login, supporting passkey-style authentication. [SuperTokens](https://supertokens.com/blog/passkeys-vs-passwords)

-   It provides backend recipes and frontend SDKs (Node.js, Python) to integrate WebAuthn flows. [SuperTokens](https://supertokens.com/docs/authentication/passkeys/initial-setup)

-   You can **customize** parameters like relying party ID, relying party name, attestation settings, and more via configuration overrides. [SuperTokens](https://supertokens.com/docs/authentication/passkeys/customization)

### Fallback Mechanisms & MFA

-   SuperTokens allows combining WebAuthn with fallback methods such as magic links, OTPs, or password login to support legacy devices or recovery workflows.

-   In their blog, SuperTokens describes how to build **phishing-resistant MFA** using WebAuthn as a second factor and still maintain session control and fallback paths. [SuperTokens](https://supertokens.com/blog/phishing-resistant-mfa)

### Metadata & Device Tracking

-   SuperTokens keeps metadata about devices and registered WebAuthn credentials, allowing you to list, revoke, or manage them.

-   Because the system is open source, you can extend the backend logic to integrate device policies, risk scoring, or custom attestation checks.

### Open-Source Flexibility

-   You get full control over the backend APIs, flow customization, UI integration, and extension of logic.


Thus, using SuperTokens can reduce boilerplate and risk while adopting WebAuthn in your application.


## Developer Considerations for Implementing WebAuthn

When integrating WebAuthn into real-world apps, you should weigh several practical considerations.

### Do You Need a Backend?

Yes. A WebAuthn implementation requires server-side support to:

-   Generate cryptographic challenges,

-   Validate attestation and assertions,

-   Store public keys and credential metadata,

-   Manage sessions or issue tokens post-authentication.

You cannot rely solely on client-side code --- the server is essential to complete the cryptographic protocol.

### User Experience Challenges

-   **Discoverability**: If you expect users to authenticate using passkeys (resident keys), the UI must guide them properly.

-   **Fallback flows**: Not all users have compatible devices or want to use WebAuthn. You must handle fallback paths (password, OTP, magic link).

-   **Enrollment friction**: The first-time setup (registering a credential) can cause drop-offs --- provide clear UX messaging.

-   **Authenticator selection prompts**: Be cautious how you present multiple authenticators (platform vs external).

### Cross-Device Login

-   If a user registers WebAuthn on one device, how do they log in on a new device? You need to support credential registration on multiple devices or migration.

-   Use **discoverable credentials** (if supported) or fallback verification (email, SMS) to link new devices.

-   Synchronization of passkeys (e.g. via iCloud Keychain, Google Passkeys) is emerging, but handling edge cases remains important.

### Session Management Post-Authentication

-   After validating the assertion, you typically issue a session token (cookie, JWT, etc.).

-   You must integrate token rotation, revocation, expiration, and refresh logic.

-   If you combine WebAuthn with further multi-factor or step-up authentication, manage chained session logic carefully.


## Common Pitfalls When Adopting WebAuthn

When adopting WebAuthn, teams often stumble over these common pitfalls:

### Device Loss & Recovery

If a user loses their main device or security key, they could be locked out. Mitigation strategies:

-   Encourage registering multiple authenticators (redundancy).

-   Offer fallback login (email link, OTP) to re-enroll WebAuthn.

-   Provide device-recovery workflows in your UI.

### Misconfigured Origin / Relying Party ID

Many failures stem from mismatches in the **relying party ID** or origin. If you misconfigure domain, subdomain, or port, registration and authentication will fail silently. Always ensure your `rp.id` matches the domain logic used by browsers.

### Browser Compatibility & Quirks

-   Differences in implementation across browsers or platforms may cause unexpected errors.

-   Level 2 (newer) features such as resident keys or extensions may not be universally supported yet.

-   Testing on mobile Safari, Chrome on Android, and Windows Hello is critical.

### Privacy & Attestation Concerns

Attestation can reveal device manufacturer or model, which may raise privacy concerns. Some servers will prefer using **"none"** attestation or **self attestation** to limit disclosure. Always assess your privacy policy and legal constraints around device metadata.


## The Future of WebAuthn and Passkeys

### Passkeys Explained

"Passkeys" is an emerging user-friendly term for WebAuthn credentials that can be synced across devices (e.g. via iCloud, Google). [SuperTokens+2SuperTokens+2](https://supertokens.com/docs/authentication/passkeys/important-concepts?utm_source=chatgpt.com) Because they follow the WebAuthn spec, passkeys provide a seamless, cross-platform passwordless experience.

### Platform Integration

Large platforms (Apple, Google, Microsoft) are integrating passkey support across their ecosystems (macOS, iOS, Android, Windows). This makes WebAuthn-based authentication more frictionless and interoperable.

### FIDO2 Momentum

Regulated industries (finance, government) and enterprise sectors are increasingly adopting FIDO2 / WebAuthn for strong identity assurance. The standards are gaining momentum as compliance, phishing risk, and user expectations push for stronger authentication.

Looking ahead, we can expect richer tooling, broader device support, and even tighter integration with identity federation.


## Conclusion: Is WebAuthn Right for Your App?

WebAuthn is a powerful standard that enables passwordless, phishing-resistant, cryptographically strong authentication. It addresses many of the fundamental weaknesses of password-based systems by eliminating shared secrets, binding credentials to origin, and requiring user consent.

However, adopting WebAuthn requires careful thinking around fallback mechanisms, UX, device loss, and server-side logic. That's where a framework like **SuperTokens** can help --- by providing built-in support, credential management, flexible configuration, and integration of fallback flows.

If your app requires higher security, better usability, and future-proof authentication, WebAuthn --- either implemented directly or via a platform like SuperTokens --- is an excellent choice. If you like, I can help you draft a sample implementation using Node.js + SuperTokens + WebAuthn. Do you want me to build that for you?