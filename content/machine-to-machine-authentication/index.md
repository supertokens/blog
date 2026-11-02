---
title: "Machine-to-Machine (M2M) Authentication: Methods and AI Agents"
description: "How services, workloads and AI agents authenticate with no user present: API keys, client credentials, private_key_jwt, mTLS, workload identity and MCP."
date: "2025-03-18"
updated: "2026-11-02"
cover: "M2M.png"
category: "featured, programming"
author: "Maria Shimkovska"
---

**Machine-to-machine (M2M) authentication is how one piece of software proves its identity to another when no user is involved, such as a backend service calling an API, a cron job writing to a database, or an AI agent calling a tool server.** The standard approach is the OAuth 2.0 client credentials grant: the calling service authenticates to an authorization server and gets a short-lived, scoped access token, which it sends to the API. The service proves who it is with a client secret, a signed JWT (`private_key_jwt`), a TLS client certificate (mTLS), or a credential issued by its platform (workload identity).

*Last updated 2 November 2026. Checked against [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html) (OAuth 2.0), [RFC 7523](https://www.rfc-editor.org/rfc/rfc7523.html) (JWT client authentication), [RFC 8705](https://www.rfc-editor.org/rfc/rfc8705.html) (mTLS), [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html) (token exchange), the [MCP authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) (version 2026-07-28) and the SuperTokens docs.*

## Table of contents

- [What counts as M2M authentication](#what-counts-as-m2m-authentication)
- [The main M2M authentication methods](#the-main-m2m-authentication-methods)
- [How the client credentials flow works](#how-the-client-credentials-flow-works)
- [Verifying M2M access tokens](#verifying-m2m-access-tokens)
- [M2M authentication for AI agents and workload identity](#m2m-authentication-for-ai-agents-and-workload-identity)
- [Implementing M2M authentication with SuperTokens](#implementing-m2m-authentication-with-supertokens)
- [M2M security checklist](#m2m-security-checklist)
- [Frequently Asked Questions](#frequently-asked-questions)

## What counts as M2M authentication

A "machine" here is any non-human caller: a microservice, a background worker, a CI pipeline, a serverless function, a CLI running in a script, or an AI agent. This guide covers software talking to software over HTTP, not device-level protocols for IoT hardware.

| | User authentication | M2M authentication |
|---|---|---|
| Who proves identity | A person, with a password, passkey or social login | A service, with a client credential or platform-issued identity |
| Interaction | Interactive (login form, redirect, MFA prompt) | Fully automated |
| Typical OAuth flow | Authorization code with PKCE | Client credentials |
| Access tied to | A user session | A client or workload identity |
| Token subject (`sub`) | The user | The client itself |

M2M authentication answers *which service is calling*. Authorization answers *what that service may do*, usually through scopes and audiences on its token. The two are easy to blur, so see [authentication vs authorization](https://supertokens.com/blog/authentication-vs-authorization) if you want the long version.

## The main M2M authentication methods

### API keys

A static string sent in a header, such as `X-API-Key`. API keys are simple and every HTTP client supports them, but they are long-lived bearer secrets: anyone who copies the key *is* the service until someone notices and rotates it. Most have no built-in expiry, scope or audience. They work for low-risk internal calls or as a simple developer onboarding path for a public API, but you have to build hashing, rotation and per-key permissions yourself.

### OAuth 2.0 client credentials with a client secret

The service sends its `client_id` and `client_secret` to the authorization server's token endpoint and receives an access token ([RFC 6749, Section 4.4](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4)). The API only ever sees the short-lived token, never the secret, and the token carries scopes and an audience. The spec limits this grant to confidential clients, meaning ones that can keep a secret, and says the response SHOULD NOT include a refresh token: the client simply requests a new access token.

The secret is still a static shared secret, but it travels only to the token endpoint, and the authorization server can revoke it centrally.

### `private_key_jwt` (JWT client assertion)

Instead of a shared secret, the service holds a private key and signs a short-lived JWT, the *client assertion*, for each token request ([RFC 7523, Section 2.2](https://www.rfc-editor.org/rfc/rfc7523.html#section-2.2)). The authorization server holds only the public key, registered directly or fetched from the client's [JWKS](https://supertokens.com/blog/understanding-jwks). Nothing secret crosses the network, and a leaked assertion expires in minutes.

```js
import * as jose from "jose";
import { randomUUID } from "node:crypto";

const TOKEN_URL = "https://auth.example.com/oauth2/token";
const CLIENT_ID = "reporting-service";

// Only this service holds the private key. The auth server has the public key,
// registered directly or published at a jwks_uri.
const privateKey = await jose.importPKCS8(process.env.CLIENT_PRIVATE_KEY_PEM, "ES256");

const clientAssertion = await new jose.SignJWT({})
  .setProtectedHeader({ alg: "ES256", kid: "reporting-service-2026-11" })
  .setIssuer(CLIENT_ID)
  .setSubject(CLIENT_ID)
  .setAudience(TOKEN_URL) // must identify the authorization server
  .setJti(randomUUID()) // lets the server reject replays
  .setIssuedAt()
  .setExpirationTime("2m")
  .sign(privateKey);

const res = await fetch(TOKEN_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: clientAssertion,
    scope: "reports.read",
  }),
});
const { access_token } = await res.json();
```

RFC 7523 requires `iss`, `sub` (the `client_id`), `aud` (the authorization server) and `exp`. `jti` is optional in the RFC, but include it so the server can detect replays.

### Mutual TLS (mTLS)

The service presents an X.509 client certificate during the TLS handshake. [RFC 8705](https://www.rfc-editor.org/rfc/rfc8705.html) defines two ways to use this at the token endpoint: `tls_client_auth` (a CA-issued certificate whose subject matches the registered client) and `self_signed_tls_client_auth` (a certificate registered in advance). It also defines **certificate-bound access tokens**: the token carries a `cnf` claim with the certificate's SHA-256 thumbprint, and the API rejects the token if it arrives over a connection that used any other certificate. A stolen token is useless without the private key.

mTLS is strong, but you need a PKI to issue and rotate certificates, and TLS must reach the service rather than terminating at a load balancer. Service meshes and SPIFFE (covered below) take care of much of that.

[DPoP (RFC 9449)](https://www.rfc-editor.org/rfc/rfc9449.html) gives the same sender-constraining at the application layer: the client signs a proof JWT for each request, and the token is bound to that key's thumbprint. It works where mTLS can't, for example behind TLS-terminating proxies.

### Which method to use

| Method | What the caller proves | Secret held by the caller | Token lifetime | Best for |
|---|---|---|---|---|
| API key | It has the key | Long-lived shared key | Usually none | Low-risk internal calls, simple public APIs |
| Client credentials + secret | It has the client secret | Long-lived shared secret, sent only to the token endpoint | Short (minutes to an hour) | Most service-to-service calls |
| `private_key_jwt` | It holds a private key | Private key that never leaves the service | Short; assertion lasts minutes | Higher-assurance clients, regulated APIs |
| mTLS | It holds a certificate's private key | Private key plus certificate | Short, and token can be cert-bound | Meshes and zero-trust networks with a PKI |
| Workload identity | The platform vouches for it | Nothing static; platform issues short-lived tokens | Short, rotated automatically | Kubernetes, cloud and CI workloads |

The usual progression: use client credentials with a secret by default, move to `private_key_jwt` or mTLS when the secret is the weak point, and use workload identity wherever your platform offers it, so there's no static secret at all.

## How the client credentials flow works

![Client credentials flow between two microservices: 1. Microservice A requests an access token from the authorization server with its client ID and secret. 2. The server validates the credentials. 3. It returns an access token. 4. Microservice A calls Microservice B with the token. 5. Microservice B validates the token. 6. It returns the protected resource.](./client-credentials-flow.png)

1. The client service sends a token request to the authorization server, authenticating with its credentials.
2. The authorization server checks the credentials and the scopes requested.
3. It returns an access token, typically valid for minutes to an hour.
4. The client calls the API (the resource server) with `Authorization: Bearer <token>`.
5. The API validates the token's signature, expiry, issuer, audience and scopes.
6. If everything checks out, it serves the request.

On the wire, the token request looks like this:

```http
POST /oauth2/token HTTP/1.1
Host: auth.example.com
Authorization: Basic dGFzay1zZXJ2aWNlOjxDTElFTlRfU0VDUkVUPg==
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=event.create
```

The credentials go in an HTTP Basic header (base64 of `client_id:client_secret`; the value above encodes a placeholder). RFC 6749 requires authorization servers to support Basic authentication and calls putting `client_secret` in the request body "NOT RECOMMENDED". The body is form-encoded, not JSON.

The client should cache the token and reuse it until shortly before it expires, rather than requesting a new token for every call.

## Verifying M2M access tokens

The API has two options. If the access tokens are JWTs, it verifies them locally with the issuer's public keys. [Understanding JWKS](https://supertokens.com/blog/understanding-jwks) walks through that, including caching and key rotation. If the tokens are opaque, the API calls the authorization server's introspection endpoint for each token, or caches the results.

[RFC 9068](https://www.rfc-editor.org/rfc/rfc9068.html) standardizes JWT access tokens. A resource server should check:

- `typ` is `at+jwt`, so an ID token or other JWT can't pass as an access token
- `iss` exactly matches the expected issuer
- `aud` includes this API's identifier
- the signature, using an algorithm allowlist (never `none`)
- `exp`, with a small clock-skew allowance
- the scopes needed for this operation

For client credentials tokens, RFC 9068 says `sub` should identify the client itself, and `client_id` names it too. Return 401 when the token is missing or invalid, and 403 when it's valid but lacks the scope. [401 vs 403](https://supertokens.com/blog/http-error-codes-401-vs-403) explains why that distinction matters to clients.

## M2M authentication for AI agents and workload identity

Classic M2M assumes a small number of long-running services, each with a client secret in its config. Two newer kinds of caller break that model.

- **Workloads** are pods, functions and CI jobs that start and stop by the thousand. Handing each one a copy of a static secret means the secret ends up in environment variables, container images and build logs, and rotating it means redeploying everything.
- **AI agents** decide at runtime which tools to call, often on behalf of a user. That raises questions classic M2M doesn't: whose authority is the agent using, how far does it extend, and does the audit log show the agent or the user?

### Short-lived credentials from the platform, not static secrets

Platforms can already tell which workload is running, so they can issue it a short-lived, signed identity token. You exchange that token for access instead of storing a secret.

- **Kubernetes projected service account tokens.** Kubernetes mounts a short-lived, automatically rotated JWT into the pod, with an `audience` you choose and an `expirationSeconds` that defaults to 1 hour (minimum 10 minutes). On EKS, for example, external systems verify it against the cluster's public OIDC discovery endpoint, which publishes the signing keys.
- **AWS.** With IAM roles for service accounts (IRSA), a pod's projected token is passed to STS `AssumeRoleWithWebIdentity` for temporary IAM credentials. EKS Pod Identity is the newer, simpler option, which AWS describes as not needing an OIDC identity provider. Either way, no access keys live in the pod.
- **Google Cloud Workload Identity Federation.** Workloads outside Google Cloud exchange an external credential (from AWS, Azure, GitHub, GitLab, Kubernetes, any OIDC or SAML 2.0 provider, or an X.509 certificate) at Google's Security Token Service, which follows RFC 8693, for a short-lived access token. Google's docs describe this as an alternative to service account keys.
- **Microsoft Entra workload identity federation.** A *federated identity credential* on an app registration or user-assigned managed identity trusts tokens from an external issuer, such as GitHub Actions, a Kubernetes cluster or SPIFFE, and swaps them for Entra access tokens. Workloads running in Azure can use managed identities directly.
- **SPIFFE/SPIRE.** A vendor-neutral standard for workload identity. Each workload gets a SPIFFE ID (`spiffe://<trust-domain>/<path>`) and short-lived, automatically rotated credentials called SVIDs: an X.509-SVID for mTLS, or a JWT-SVID when a proxy sits in between. SPIFFE recommends X.509-SVIDs where possible because JWT-SVIDs can be replayed.

At the IETF, the WIMSE working group is developing standards for workload identity across platforms. For now, the building blocks are the OAuth and JOSE RFCs above.

### Delegation and on-behalf-of with token exchange

When an agent acts for a user, it shouldn't reuse the user's token, and it shouldn't use a broad service credential that ignores who the user is. [RFC 8693 token exchange](https://www.rfc-editor.org/rfc/rfc8693.html) lets the agent trade the user's token for a new one that's narrower and records both parties:

```http
POST /oauth2/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<USER_ACCESS_TOKEN>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&actor_token=<AGENT_CREDENTIAL>
&actor_token_type=urn:ietf:params:oauth:token-type:jwt
&audience=calendar-api
&scope=event.read
```

(The agent also authenticates as a client on this request; that's omitted here.) RFC 8693 separates **impersonation**, where the new token simply says "the user", from **delegation**, where the agent keeps its own identity and acts for the user. Delegated tokens carry an `act` (actor) claim naming the agent, with nested `act` claims when agents call other agents. Prefer delegation: your logs and policies can then tell "Alice did this" apart from "Alice's agent did this". The authorization server decides which actors may act for which subjects, and can use a `may_act` claim to express that.

### Scope and audience on every token

- **One audience per token.** Request tokens for a specific API using the `resource` parameter from [RFC 8707](https://www.rfc-editor.org/rfc/rfc8707.html) or an `audience` parameter, and have every API reject tokens whose `aud` isn't its own. A token stolen from one tool server then can't be replayed against another.
- **Narrow scopes, short lifetimes.** An agent should hold only the scopes the current task needs, for minutes rather than hours.
- **Sender-constraining for high-value calls.** Binding tokens to a key with mTLS or DPoP means a token leaked through logs or prompt injection can't be used on its own.

### Where MCP authorization fits

The [Model Context Protocol authorization spec](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) (version 2026-07-28) brings these rules to AI tool servers:

- Authorization is optional. HTTP-based transports SHOULD follow the spec. Local stdio servers SHOULD NOT, and take credentials from the environment instead.
- An MCP server is an OAuth 2.1 resource server. It MUST publish [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728.html) protected resource metadata naming its authorization server, and point clients to it from the `WWW-Authenticate` header of a 401 response or at a well-known URI.
- Clients MUST send the RFC 8707 `resource` parameter naming the MCP server. Servers MUST check that tokens were issued for them and MUST NOT pass tokens they receive on to other services.
- For client registration, Client ID Metadata Documents are the SHOULD. Dynamic Client Registration is deprecated, kept for backward compatibility.

The core flow is user-delegated (authorization code with PKCE). For agents with no user at all, MCP has an **OAuth Client Credentials** extension, marked stable at the same 2026-07-28 revision, which recommends JWT client authentication (RFC 7523) over a client secret. A separate **Enterprise-Managed Authorization** extension lets a company's identity provider issue access to MCP servers, using token exchange followed by a JWT bearer grant. Both are optional.

The spec builds on OAuth 2.1, which is still an IETF Internet-Draft (draft -17, dated 31 October 2026), not an RFC. Expect details to keep changing, and pin the MCP spec version you implement.

For the full agent architecture, including per-action authorization, human approval gates and revocation, see [AI agent authentication](https://supertokens.com/blog/auth-for-ai-agents). For MCP servers built on SuperTokens, see the [SuperTokens MCP toolkit](https://supertokens.com/blog/supertokens-mcp-toolkit).

## Implementing M2M authentication with SuperTokens

SuperTokens supports M2M through its OAuth2 provider and the client credentials flow. Per the [SuperTokens M2M docs](https://supertokens.com/docs/authentication/m2m/introduction), this is a paid feature of the managed service, with Node.js and Python backend SDK support. (A [legacy flow](https://supertokens.com/docs/authentication/m2m/legacy-flow) remains for backward compatibility.)

![SuperTokens client credentials flow: 1. Service A requests a token from the authorization service (SuperTokens backend SDK with SuperTokens Core). 2. It receives an OAuth2 access token. 3. Service A calls Service B with the token. 4. Service B validates the token. 5. Service B returns the resource.](./machine-to-machine.png)

Using the docs' example, a **Task Service** creates events on a **Calendar Service**:

1. **Enable M2M Authentication** for your managed deployment under **Features** in the SuperTokens.com dashboard.
2. **Create one OAuth2 client per service** through the SuperTokens Core API (`POST /appid-<appId>/recipe/oauth/clients`) with a stable `clientId`, `grantTypes: ["client_credentials"]`, a space-separated `scope` such as `"event.create"` and an `audience` list such as `["event"]`. Keep the API key and the returned client secret in a secret manager.
3. **Add the OAuth2Provider recipe** to the backend that acts as the authorization server: `recipeList: [OAuth2Provider.init()]`.
4. **Request tokens** from `<YOUR_API_DOMAIN>/auth/oauth/token`, with the client credentials in an HTTP Basic header and a form-encoded body:

```js
const TOKEN_URL = "https://api.example.com/auth/oauth/token";

let cached; // { accessToken, expiresAt }

export async function getAccessToken() {
  // Reuse the token until a minute before it expires.
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.accessToken;

  // Credentials come from the environment or a secret manager, never from code.
  const credentials = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "event.create",
      audience: "event",
    }),
  });
  if (!res.ok) throw new Error(`Token request failed with ${res.status}`);

  const { access_token, expires_in } = await res.json();
  cached = { accessToken: access_token, expiresAt: Date.now() + expires_in * 1000 };
  return access_token;
}
```

The response contains `access_token`, `expires_in` (3600 seconds in the docs' example), `token_type` and `scope`. Each target service needs its own token, because each has its own audience.

5. **Validate tokens in the Calendar Service** with the SDK, which checks the signature, expiry and token type, plus the audience, client and scopes you require. Also check the issuer:

```ts
import express from "express";
import OAuth2Provider from "supertokens-node/recipe/oauth2provider";

const app = express();

app.post("/events", async (req, res) => {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.set("WWW-Authenticate", 'Bearer realm="calendar"').sendStatus(401);
  }
  try {
    // Checks signature, expiry, token type, audience, client and scopes.
    // It throws on any failure, including a missing scope.
    const { payload } = await OAuth2Provider.validateOAuth2AccessToken(token, {
      audience: "event",
      clientId: "task-service",
      scopes: ["event.create"],
    });
    if (payload.iss !== "https://api.example.com/auth") throw new Error("Unexpected issuer");
  } catch {
    return res.set("WWW-Authenticate", 'Bearer realm="calendar", error="invalid_token"').sendStatus(401);
  }
  res.status(201).json({ created: true });
});
```

This assumes `supertokens.init` has already run in the Calendar Service. Services without a SuperTokens SDK can verify the same tokens against the JWKS, as described in [Understanding JWKS](https://supertokens.com/blog/understanding-jwks). The docs also point out that token validation doesn't make a request replay-safe: for create and update endpoints, add an idempotency key tied to the client and request body.

The [client credentials guide](https://supertokens.com/docs/authentication/m2m/client-credentials) in the SuperTokens docs has the full setup, including Python and routes that accept both session tokens and OAuth2 tokens.

## M2M security checklist

- **No static secrets where the platform can vouch for the workload.** Use Kubernetes, cloud or SPIFFE workload identity first.
- **One identity per service or agent.** Never share a client between services. Separate clients make revocation and audit logs meaningful.
- **Least-privilege scopes**, requested per task rather than "everything this client may do".
- **Audience on every token**, and every API rejects tokens issued for a different `aud`.
- **Short token lifetimes.** Minutes to an hour, cached by the client and renewed shortly before expiry.
- **Secrets in a secret manager**, not in code, images, CI logs or command-line arguments.
- **Rotation that's automated and overlapping.** Client secrets and signing keys both need a window where old and new are valid. [Key rotation, step by step](https://supertokens.com/blog/understanding-jwks#key-rotation-step-by-step) covers the signing-key side.
- **Asymmetric client authentication or sender-constrained tokens** (`private_key_jwt`, mTLS, DPoP) for high-value APIs.
- **Delegation, not impersonation, for agents**, so the actor is visible in tokens and logs.
- **Correct error codes:** 401 for missing or invalid tokens, 403 for valid tokens without the required scope.

## Frequently Asked Questions

### What is machine-to-machine authentication?

M2M authentication is how a service, job, workload or AI agent proves its identity to another service with no user involved. Most systems use the OAuth 2.0 client credentials grant: the caller authenticates to an authorization server with a client secret, a signed JWT, a certificate or a platform-issued workload identity, and gets a short-lived access token to send to the API.

### Is the client credentials flow secure?

Yes, when used as intended. RFC 6749 limits it to confidential clients that can keep their credentials secret. The API only receives short-lived, scoped tokens, never the client secret. The weak point is the client secret itself, which is why higher-assurance setups use `private_key_jwt`, mTLS or workload identity instead.

### What's the difference between an API key and OAuth client credentials?

An API key is a long-lived secret sent with every request, usually without expiry, scopes or audience. With client credentials, the secret goes only to the authorization server, which issues short-lived tokens with scopes and an audience. That limits the damage from a leaked token and lets you revoke the client centrally.

### What is private_key_jwt?

`private_key_jwt` is an OAuth client authentication method from RFC 7523. Instead of sending a client secret, the client signs a short-lived JWT assertion with its private key and sends it as `client_assertion`. The authorization server verifies it with the client's registered public key or JWKS, so no shared secret exists to leak.

### Should I use mTLS or OAuth for service-to-service authentication?

They complement each other. mTLS authenticates the connection and, under RFC 8705, can bind access tokens to the client certificate. OAuth adds scopes, audiences and central revocation. Use OAuth client credentials as the baseline, and add mTLS (or DPoP) where you need tokens that are useless if stolen and you can run a PKI or service mesh.

### How do AI agents authenticate to APIs and MCP servers?

An agent acting for a user should get a delegated token through OAuth: the authorization code flow, or RFC 8693 token exchange, which records the agent in an `act` claim. An agent with no user can use the client credentials grant. The MCP authorization spec (version 2026-07-28) requires audience-bound tokens and, through its stable OAuth Client Credentials extension, recommends JWT client authentication for agents that act on their own behalf.

### What is workload identity federation?

Workload identity federation lets a workload use a short-lived token issued by its platform, such as a Kubernetes service account token, a GitHub Actions OIDC token or a SPIFFE SVID, to get access in another system without storing a long-lived secret. AWS (IRSA and EKS Pod Identity), Google Cloud Workload Identity Federation and Microsoft Entra federated identity credentials all work this way.

## Related reading

- [AI Agent Authentication: Scoped Tokens, MCP, and Per-Action Authorization](https://supertokens.com/blog/auth-for-ai-agents)
- [What Is a JWKS? JSON Web Key Sets Explained](https://supertokens.com/blog/understanding-jwks)
- [Choosing the Right OAuth Grant Types](https://supertokens.com/blog/oauth-grant-types)
- [OAuth vs JWT: An In-Depth Comparison](https://supertokens.com/blog/oauth-vs-jwt)
- [Authentication vs Authorization: What's the Difference?](https://supertokens.com/blog/authentication-vs-authorization)
