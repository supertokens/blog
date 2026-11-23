---
title: "What Is a JWT? JSON Web Tokens Explained, With Examples"
date: "2024-08-02"
updated: "2026-11-23"
description: "A JWT is a signed, URL-safe token that carries claims between two parties. Learn the header.payload.signature structure, claims, verification and JWT vs sessions."
cover: "what-is-jwt-cover.png"
category: "sessions"
author: "Mostafa Ibrahim"
---

**A JSON Web Token (JWT) is a compact, URL-safe way to send claims between two parties, defined in [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html). It's three base64url-encoded parts joined by dots, `header.payload.signature`. The signature lets a server check that the claims weren't changed, so APIs can verify who a user is without a database lookup.**

*Last updated 23 November 2026. Checked against [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) (JWT) and [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html) (JWT Best Current Practices, BCP 225).*

## Table of Contents
- [What is a JWT?](#what-is-a-jwt)
- [Why tokens, and why JWTs?](#why-tokens-and-why-jwts)
- [Anatomy of a JWT: header.payload.signature](#anatomy-of-a-jwt-headerpayloadsignature)
- [Registered JWT claims](#registered-jwt-claims)
- [How JWT authentication works](#how-jwt-authentication-works)
- [JWT vs session-based authentication](#jwt-vs-session-based-authentication)
- [Pros and cons of JWTs](#pros-and-cons-of-jwts)
- [JWT security best practices](#jwt-security-best-practices)
- [Common JWT errors during development](#common-jwt-errors-during-development)
- [JWTs in SuperTokens](#jwts-in-supertokens)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Further reading](#further-reading)

---

## What is a JWT?

A **JSON Web Token (JWT)** is an open standard, [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) (published May 2015), for passing a set of **claims** (statements about a user or session) between two parties, usually an auth server and an API.

The claims are a JSON object. In almost every real-world use, that object is **signed** using JSON Web Signature ([RFC 7515](https://www.rfc-editor.org/rfc/rfc7515.html)), which makes it tamper-evident but still readable by anyone. Less often, it's **encrypted** using JSON Web Encryption ([RFC 7516](https://www.rfc-editor.org/rfc/rfc7516.html)). When people say "JWT" they nearly always mean a signed JWT, and that's what this article covers.

Here's the payload of an ID token Google issues during sign-in, taken from [Google's OpenID Connect documentation](https://developers.google.com/identity/openid-connect/openid-connect):

```json
{
  "iss": "https://accounts.google.com",
  "azp": "1234987819200.apps.googleusercontent.com",
  "aud": "1234987819200.apps.googleusercontent.com",
  "sub": "10769150350006150715113082367",
  "email": "jsmith@example.com",
  "email_verified": true,
  "iat": 1353601026,
  "exp": 1353604926,
  "nonce": "0394852-3190485-2490358",
  "hd": "example.com"
}
```

Once your app has verified the token's signature, these claims tell it **who the user is** (`sub`, `email`), **who issued the token** (`iss`), **which app it was meant for** (`aud`) and **whether it's still valid** (`exp`). It doesn't need to call Google to find out.

---

## Why tokens, and why JWTs?

If an auth server sent user data back as plain JSON, a malicious user could change a field (say, their user ID) before sending it to your API. Tokens fix this by **binding the data to a signature** that only the issuer can produce.

There are two main kinds of token:

- **Opaque tokens**: random strings that point to session data stored on the server. The server has to look them up on every request.
- **JWTs**: self-contained tokens that carry their claims inside them. Any service with the right key can verify them **locally**, with no database call.

That local verification is why JWTs became the default for APIs, microservices, mobile apps and OAuth 2.0 access tokens ([RFC 9068](https://www.rfc-editor.org/rfc/rfc9068.html) standardises the JWT access token format).

---

## Anatomy of a JWT: header.payload.signature

A signed JWT is "a sequence of URL-safe parts separated by period ('.') characters" ([RFC 7519, Section 3](https://www.rfc-editor.org/rfc/rfc7519.html#section-3)). Each part is base64url-encoded:

<img src="./jwt-anatomy.svg" alt="Anatomy of a JWT. An encoded HS256 token is split at its two dots into three base64url parts. The header decodes to alg HS256 and typ JWT. The payload decodes to the claims sub, iss, aud, iat and exp. The signature is HMAC-SHA256 of the encoded header, a dot and the encoded payload, using a secret key. The header and payload are encoded, not encrypted, so anyone can read them; the signature lets the server detect tampering." width="760" height="520" style="width: 100%; max-width: 760px; height: auto;" />

Here's the token from the diagram. It was signed with a throwaway demo secret, so you can paste it into the [SuperTokens JWT encoder/decoder](https://supertokens.com/jwt-encoder-decoder) to see the decoded parts:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImlzcyI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tIiwiYXVkIjoiZXhhbXBsZS1hcHAiLCJpYXQiOjE3OTUzOTIwMDAsImV4cCI6MTc5NTM5MjkwMH0.fqJXOxlkFVSblENMdS1ejL-2i38114HsB00_rpYT1YI
```

### 1. Header
The header names the signing algorithm (`alg`) and usually the token type (`typ`). For tokens signed with a key pair it also carries a `kid` (key ID), which tells the verifier which public key in the issuer's [JWKS (JSON Web Key Set)](https://supertokens.com/blog/understanding-jwks) to use.

```json
{ "alg": "HS256", "typ": "JWT" }
```

### 2. Payload
The payload holds the claims: who the token is about, who issued it, who it's for and when it expires, plus any application claims such as roles.

```json
{
  "sub": "user_123",
  "iss": "https://api.example.com",
  "aud": "example-app",
  "iat": 1795392000,
  "exp": 1795392900
}
```

### 3. Signature
The signature is computed over the encoded header and payload:

```text
HMACSHA256(base64url(header) + "." + base64url(payload), secret)
```

With HS256 the same shared secret signs and verifies. With RS256 or ES256, the issuer signs with a private key and anyone can verify with the matching public key. See [RS256 vs HS256](https://supertokens.com/blog/rs256-vs-hs256) for when to use each.

> **Encoded is not encrypted.** Base64url is just an encoding. Anyone who holds a signed JWT can read its header and payload, so never put passwords, secrets or sensitive personal data in the payload.

---

## Registered JWT claims

[RFC 7519, Section 4.1](https://www.rfc-editor.org/rfc/rfc7519.html#section-4.1) registers seven claim names. All of them are optional in the spec, but most auth systems use `iss`, `sub`, `aud` and `exp` at least.

| Claim | Name | What it means |
|---|---|---|
| `iss` | Issuer | Who created and signed the token |
| `sub` | Subject | Who the token is about, usually a user ID |
| `aud` | Audience | Who the token is for; a recipient not listed must reject it |
| `exp` | Expiration time | The token must not be accepted on or after this time |
| `nbf` | Not before | The token must not be accepted before this time |
| `iat` | Issued at | When the token was created |
| `jti` | JWT ID | A unique ID for the token, useful for preventing replay |

Times are Unix timestamps in seconds. Anything else in the payload, such as `email`, `roles` or `tenant_id`, is an application-specific claim. Using the registered names keeps your tokens compatible with standard libraries and identity providers such as Google, AWS Cognito and SuperTokens.

---

## How JWT authentication works

1. **The user logs in.** The auth server checks their credentials.
2. **The server issues a JWT.** It signs a token containing the user's claims and a short expiry.
3. **The client stores the token**, ideally in an `HttpOnly`, `Secure` cookie (see [cookies vs localStorage for sessions](https://supertokens.com/blog/cookies-vs-localstorage-for-sessions-everything-you-need-to-know)).
4. **The client sends the token on each request**, as a cookie or in an `Authorization: Bearer <token>` header.
5. **The API verifies the token** by checking the signature with the secret or the issuer's public key (fetched from its [JWKS](https://supertokens.com/blog/understanding-jwks)), then checking `exp`, `iss` and `aud`.
6. **The token expires** and the client gets a new one, usually by sending a longer-lived refresh token to the auth server.

Because step 5 needs only a key, any number of servers can verify tokens without sharing a session store.

---

## JWT vs session-based authentication

With [session-based authentication](https://supertokens.com/blog/session-based-authentication), the server stores session state and gives the browser an opaque session ID. With JWTs, the state travels inside the token. Here's how they compare:

| | JWT (stateless token) | Server-side session (opaque ID) |
|---|---|---|
| **Where the state lives** | In the token, signed by the issuer | In a server-side store (database, Redis) |
| **How a request is verified** | Check the signature and claims locally | Look up the session ID in the store |
| **Revoking access** | Hard: the token is valid until `exp` unless you keep a denylist | Easy: delete the session |
| **Scaling across servers and services** | Easy: any service with the key can verify | Every service needs access to the shared store |
| **Size on the wire** | Larger: carries all the claims | Small: just an ID |
| **Can the client read the data?** | Yes, the payload is only encoded | No, the ID is meaningless on its own |
| **Typical fit** | APIs, microservices, mobile apps, OAuth access tokens | Traditional server-rendered web apps |

**You don't have to choose one.** A common pattern, and the one SuperTokens uses, is a hybrid: a **short-lived JWT access token** that APIs verify locally, plus a **long-lived opaque refresh token** that's checked against the database. You get stateless verification on most requests and can still revoke a session. [OAuth vs JWT](https://supertokens.com/blog/oauth-vs-jwt) covers where OAuth fits into this.

---

## Pros and cons of JWTs

### Advantages
- **Tamper-evident**: any change to the header or payload breaks the signature.
- **Stateless verification**: no session lookup on each request.
- **Works across domains and services**: suits APIs, SPAs, mobile apps and microservices.
- **Standard and interoperable**: libraries exist for every major language, and OAuth 2.0 and OpenID Connect use JWTs.

### Limitations
- **Hard to revoke**: a token stays valid until it expires. Immediate revocation needs a denylist, which brings back server-side state (see [Revoking Access with a JWT Blacklist](https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist)).
- **Key compromise is serious**: whoever has the signing key can mint valid tokens for any user.
- **Readable payload**: claims are visible to anyone holding the token.
- **Bigger than an opaque ID**: every request carries the full set of claims.

---

## JWT security best practices

Most of these come from [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html), the IETF's JWT Best Current Practices, and the [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html).

- **Pin the allowed algorithms.** Don't trust the `alg` header. Tell your library which algorithms you accept, and never accept `none` (RFC 8725, Sections 3.1 and 3.2).
- **Always validate `iss`, `aud` and `exp`**, not just the signature. RFC 8725 says a relying party "MUST validate the audience value" (Section 3.9).
- **Prefer asymmetric signing (RS256, ES256, EdDSA)** when more than one service verifies tokens, so only the issuer holds the private key.
- **Keep access tokens short-lived**, and use refresh tokens, ideally rotating ones, to get new access tokens.
- **Store tokens in `HttpOnly`, `Secure` cookies** rather than `localStorage`, where any XSS can read them.
- **Rotate signing keys** and publish them through a JWKS with `kid` values, so verifiers pick up new keys without downtime. The [JWKS key rotation walkthrough](https://supertokens.com/blog/understanding-jwks) shows how.
- **Don't put secrets or sensitive data in the payload.**
- **Use explicit typing** (`typ`) when you issue more than one kind of JWT, so one kind can't be passed off as another (RFC 8725, Section 3.11).

---

## Common JWT errors during development

| Error | Usual cause | Fix |
|---|---|---|
| `jwt expired` / `TokenExpiredError` | `exp` is in the past | Refresh the token; check for clock skew between servers |
| `invalid signature` | Wrong secret or public key, or the token was changed | Check the key, and the `kid` against the issuer's JWKS |
| `jwt audience invalid` / `invalid issuer` | `aud` or `iss` doesn't match what the API expects | Align the issuer config with the API's expected values |
| `jwt malformed` | Not three dot-separated base64url parts, or a stray `Bearer ` prefix | Strip the prefix; make sure the whole token is sent |
| `invalid algorithm` | Token `alg` isn't in your allowed list | Fix the issuer's algorithm, or the verifier's allowed list |

Decoding a token (for example in the [JWT encoder/decoder](https://supertokens.com/jwt-encoder-decoder)) is a quick way to inspect `exp`, `iss` and `aud`. But decoding isn't verifying: never trust a decoded payload until the signature has been checked.

---

## JWTs in SuperTokens

SuperTokens uses the hybrid model described above. Its [session management](https://supertokens.com/docs/post-authentication/session-management/introduction) issues a short-lived JWT access token and a rotating opaque refresh token, stored in `HttpOnly` cookies by default. You don't write any JWT code yourself:

- **Signing and key rotation** are handled by the SuperTokens core, which publishes its public keys as a JWKS.
- **Verification** is a single call. [Protect your API routes](https://supertokens.com/docs/additional-verification/session-verification/protect-api-routes) with the backend SDK's session verification, and add [claim validation](https://supertokens.com/docs/additional-verification/session-verification/claim-validation) for roles or email verification.
- **Revocation** works despite the stateless access token, because sessions can be [invalidated](https://supertokens.com/docs/post-authentication/session-management/session-invalidation) through the refresh token.

SuperTokens is open source and can be self-hosted or used as a managed service.

---

## Frequently Asked Questions

### Is a JWT encrypted?
No, not usually. A standard JWT is signed (JWS), not encrypted: its header and payload are only base64url-encoded, so anyone holding the token can read them. The signature stops them being changed, not read. If the claims must stay confidential, use an encrypted JWT (JWE, RFC 7516) or keep the data on the server.

### What is the difference between decoding and verifying a JWT?
Decoding just base64url-decodes the header and payload so you can read them, and needs no key. Verifying checks the signature with the secret or the issuer's public key, then checks claims such as exp, iss and aud. Only a verified token should be trusted.

### Should I use JWTs or sessions for authentication?
Use server-side sessions when one web app talks to one backend and you need instant logout. Use JWTs when several services or APIs must verify users without a shared session store. Many production systems combine them: short-lived JWT access tokens with a revocable, opaque refresh token.

### Where should I store a JWT in the browser?
In an HttpOnly, Secure cookie with a suitable SameSite setting. JavaScript can't read HttpOnly cookies, so an XSS bug can't steal the token. Tokens in localStorage or sessionStorage can be read by any script running on the page.

### Can you revoke a JWT?
Not directly. A signed JWT stays valid until its exp time. To cut access early, keep access tokens short-lived and revoke the refresh token, or check each token against a denylist, which reintroduces a server-side lookup.

### How long should a JWT be valid?
Keep access tokens short-lived, measured in minutes rather than days, and use a refresh token to get new ones. The shorter the lifetime, the less time a stolen token is useful. The right value depends on your risk tolerance and how often clients can refresh.

---

## Further reading

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html) and [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)
- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OAuth vs JWT: Key Differences Explained](https://supertokens.com/blog/oauth-vs-jwt)
- [What Is a JWKS? JSON Web Key Sets Explained](https://supertokens.com/blog/understanding-jwks)
- [RS256 vs HS256: Which JWT Signing Algorithm to Use](https://supertokens.com/blog/rs256-vs-hs256)
- [Are You Using JWTs for User Sessions in the Correct Way?](https://supertokens.com/blog/are-you-using-jwts-for-user-sessions-in-the-correct-way)
- [Revoking Access with a JWT Blacklist](https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist)
- [Session-Based Authentication: How It Works](https://supertokens.com/blog/session-based-authentication)
- [Token-Based Authentication for APIs](https://supertokens.com/blog/token-based-authentication-in-api)
