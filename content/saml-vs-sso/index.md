---
title: "SAML vs. SSO: What's the Difference, How They Work Together, and Which One You Actually Need"
date: "2026-05-22"
description: "SAML and SSO aren't the same thing. Learn the key differences, how SAML-based SSO works step by step, when to use SAML vs. OIDC, and how to implement it with SuperTokens."
cover: "saml-vs-sso.png"
category: "programming"
author: "Mostafa Ibrahim"
---

A common moment in B2B SaaS engineering: an enterprise prospect declares that they require "SAML SSO" before signing the contract. The documentation that follows is dense with XML schemas, OASIS specifications, and a stack of acronyms (SP, IdP, ACS, AuthnRequest, SLO). The question of what to actually build and whether SAML is even the right call, instead of using an existing OIDC integration, gets lost in the terminology.

This article is written for backend and full-stack engineers at B2B SaaS companies who need to add enterprise SSO to unblock a deal. The goal is to make the underlying protocols legible, without reverse-engineering them from vendor docs.

The single most important sentence to internalize:

**SAML is not the same thing as SSO. SSO is the goal. SAML is one protocol that gets you there.**

Everything else in this article follows from that distinction.

## What is SSO?

[SSO (Single Sign-On)](https://supertokens.com/features/single-sign-on) is an authentication strategy that lets a user log in once with one identity provider and access multiple applications without re-authenticating. It is a user-experience pattern, not a protocol. SAML, OIDC, OAuth, and Kerberos are all things that can be used to [implement SSO](https://supertokens.com/blog/sso-implementation). They are not synonyms for it.

The mechanics are conceptually simple:

1. An **Identity Provider (IdP)** authenticates the user once.
2. The IdP issues a signed token or assertion proving the user's identity.
3. **Service Provider (SP)**, the actual application the user wants to use, trusts that signature and grants access without asking for credentials again.

Consumer SSO is familiar from daily life. Logging into Google grants access to Gmail, Drive, Calendar, and YouTube under a single session. The B2B version is structurally identical, but the IdP is a corporate identity platform. A marketing analyst at a Fortune 500 logs into Okta once in the morning, and from that single session can launch Salesforce, Slack, Workday, Zoom, and the SaaS product being purchased, without typing another password.

That second example is the one that matters for revenue. When an enterprise IT team states an SSO requirement, the meaning is specific: employees should be able to access the product through the corporate identity platform, with offboarding, access reviews, and audit logs flowing through the same system that handles every other application. That is the requirement. SAML is one way to fulfill it. OIDC is another.

The benefits stack quickly: one set of credentials to rotate, MFA enforced centrally, instant deprovisioning when an employee leaves, and a single audit log to satisfy compliance. These benefits do not come from SAML specifically &mdash; they come from SSO as an architecture. SAML is just the message format that some enterprises happen to insist on.

## What is SAML?

[Security Assertion Markup Language (SAML)](https://supertokens.com/blog/demystifying-saml) is an open XML-based standard for exchanging authentication and authorization data between an Identity Provider and a Service Provider. SAML 2.0, [ratified as an OASIS Standard in March 2005](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf), is the version meant whenever SAML is discussed today. SAML 1.1 still exists in legacy environments, but new integrations should never be built against it.

SAML has three core building blocks worth understanding before any code gets written:

- **Assertions** are the actual statements about a user, packaged as XML and signed by the IdP. A SAML assertion typically carries three kinds of statements: an authentication statement (proving the user authenticated, when, and how), an attribute statement (email, name, group memberships, employee ID, anything else the IdP wants to share), and optionally an authorization decision statement. The assertion is the payload an application actually consumes.
- **Protocols** are the request-response patterns used to ask for and deliver assertions. The most important is the Authentication Request Protocol: the SP sends an `<AuthnRequest>` to the IdP, the IdP responds with a signed `<Response>` containing an assertion. Other protocols defined in SAML 2.0 include Single Logout, Artifact Resolution, and Name Identifier Management.
- **Bindings** define how SAML messages travel over the wire. The two that appear most often are HTTP-Redirect (used for the initial `AuthnRequest` from SP to IdP) and HTTP-POST (used to deliver the signed `Response` back to the SP). A SOAP binding exists for back-channel communication, and an Artifact binding exists for higher-security flows.

Trust between the SP and IdP is established through metadata exchange: an XML file containing endpoint URLs, supported bindings, and the X.509 public certificate that the SP will use to verify the IdP's signatures. These metadata files (or URLs that serve them) are exchanged during the initial configuration of every SAML connection.

The major SAML IdPs encountered in enterprise integrations are Microsoft Entra ID (formerly Azure AD), Okta, Google Workspace, Ping Identity, OneLogin, and Active Directory Federation Services (ADFS). When an enterprise customer states a SAML SSO requirement, one of these is almost certainly the IdP in use.

## SAML vs. SSO: The Core Distinction

![SAML-vs-SSO](SAML-vs-SSO.png)

The cleanest way to think about it: SSO is the destination. SAML is one of the routes.

A comparison table makes the asymmetry explicit:

||**SSO**|**SAML**|
|---|---|---|
|**What it is**|An authentication strategy or goal.|An open protocol / message format.|
|**What it defines**|The user experience of "one login, many apps."|The structure and exchange of identity messages.|
|**Existence**|Can be implemented without SAML, by using OIDC, Kerberos, or proprietary protocols.|Only makes sense in the context of SSO.|
|**Governance**|Determined by architecture and product choices.|Governed by the OASIS open standard.|
|**Typical context**|Any multi-application environment.|Enterprise B2B, federated identity, legacy systems.|

The takeaway: **not all SSO is SAML, but all SAML is SSO.** A competitor's homepage that says "this product supports SSO" reveals nothing about which protocol is implemented. A claim of "SAML SSO" support is specific. It means the product speaks the XML-based OASIS standard that enterprise IT teams expect.

So the next question is the one that actually matters: how does SAML implement SSO in practice?

## How SAML SSO Works, Step By Step

SAML SSO has two flows. Both will eventually need to be supported. Understanding one well first is the path to handling both.

### **SP-Initiated Flow (The Common Case)**

![SP-Initiated-SAML-Flow](SP-Initiated-SAML-Flow.png)

This is the flow that runs when a user clicks "Log in" on the application:

1. **The user visits the application** (the Service Provider) and hits a protected route.
2. **The application detects no active session** and redirects the browser to the IdP, attaching a SAML `<AuthnRequest>` (typically via HTTP-Redirect binding, with the request encoded in the URL).
3. **The IdP authenticates the user** through whatever mechanism it controls: password, MFA, hardware key, certificate, or any combination.
4. **The IdP builds a signed SAML assertion** containing the user's identity and attributes, wrapped in a `<Response>` element.
5. **The IdP POSTs the response** to the application's **Assertion Consumer Service (ACS) URL**, a specific endpoint on the backend whose only job is to receive SAML responses. This step uses the HTTP-POST binding; the browser auto-submits a form containing the base64-encoded SAML response.
6. **The application validates the response.** It checks the XML signature against the IdP's public certificate (from the metadata configured during setup), validates the `NotBefore` and `NotOnOrAfter` timestamps, confirms the `Audience` matches the application's entity ID, and verfies the `InResponseTo` attribute matches the original `AuthnRequest`.
7. **The application creates a session** and grants the user access.

### **IdP-Initiated Flow**

The second flow starts at the IdP instead of the application. The user logs into the Okta dashboard, sees a tile for the application, clicks it, and the IdP pushes a SAML response to the ACS URL without any prior `AuthnRequest`.

This is the flow that powers the "app launcher" tiles enterprise users see inside Okta or Entra ID portals. It is also the flow that quietly creates the most security headaches, because there is no `AuthnRequest` to bind the response to. The application receives an unsolicited assertion and has to decide whether to trust it. **This is a real attack surface.** Without an `InResponseTo` value to validate against, the only defenses are signature, audience, and replay protection. The mistakes section below covers this in more detail.

### **Single Logout**

A question every enterprise customer will eventually ask: *"When a user logs out of Okta, do they get logged out of the application too?"*

Single Logout (SLO) is the SAML protocol designed to answer "yes." When the user signs out at the IdP, the IdP sends a `<LogoutRequest>` to every SP that has an active session, and each SP terminates its local session. In theory, the user is logged out everywhere simultaneously.

In practice, SLO is one of the messiest parts of SAML. Implementations vary widely between IdPs. Some send LogoutRequests synchronously and wait for responses, others fire and forget. Browser session state, cookies, and back-channel versus front-channel logout each behave differently. Most B2B SaaS teams ship SP-initiated SSO first and defer SLO until an enterprise customer files a security review finding about it. That is a defensible sequence, but the conversation is coming. Not implementing SLO means a user who logs out of an IdP can still walk back into the application on the same browser if the session cookie is alive.

## SAML vs. OIDC vs. OAuth: The Full Protocol Picture

![SAML-vs-OIDC-vs-OAuth](SAML-vs-OIDC-vs-OAuth.png)

This is where most developers get confused, and where most competitor articles wave their hands. Precision matters here.

**SAML, OIDC, and OAuth solve different problems.** They are not three options on a menu where the prettiest one wins. Specifically:

- **OAuth 2.0** is an *authorization* protocol. It answers "can this client take this action on this resource?" For example, "can this third-party app post tweets on behalf of this user?" OAuth alone is not authentication. The OAuth 2.0 specification itself is deliberately silent on user identity.
- **OpenID Connect (OIDC)** is an authentication layer built on top of OAuth 2.0. The [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html) describes it as "a simple identity layer on top of the OAuth 2.0 protocol." OIDC adds an **ID Token**, a JWT containing identity claims signed by the IdP, plus a userinfo endpoint and a discovery mechanism (`.well-known/openid-configuration`). When developers casually say "OAuth login," the actual protocol is almost always OIDC.
- **SAML 2.0** is an XML-based authentication protocol designed for browser-based [enterprise SSO](https://supertokens.com/blog/enterprise-sso). It predates OIDC by nearly a decade.

So the question of whether to use [OAuth or SAML](https://supertokens.com/blog/saml-vs-oauth) for login is malformed. OAuth alone should not be doing login. The real comparison is [OIDC vs. SAML](https://supertokens.com/blog/oidc-vs-saml), and here is how the two stack up:

||**SAML 2.0**|**OIDC**|**OAuth 2.0**|
|---|---|---|---|
|**Purpose**|Authentication (browser SSO)|Authentication|Authorization|
|**Token format**|Signed XML assertion|JWT (ID Token)|Access token (opaque or JWT)|
|**Transport**|HTTP-Redirect + HTTP-POST|HTTP + REST/JSON|HTTP + REST/JSON|
|**Released**|2005 (OASIS)|2014 (OpenID Foundation)|2012 (IETF RFC 6749)|
|**Best for**|Enterprise customers, legacy IdPs|Modern web, mobile, SPAs, APIs|Delegated API access|
|**Mobile experience**|Painful|Native|Native|
|**Developer experience**|Complex; XML, certificates, profiles|Familiar; JSON, JWTs, discovery URLs|Familiar|
|**Discovery**|Static metadata XML exchange|Dynamic .well-known endpoint|N/A|

There are two practical observations the table does not capture.

First: **SAML and OIDC are not competitors.** Most B2B SaaS products at scale support both. New consumer-facing apps default to OIDC because mobile, SPAs, and API-first architectures work better with JSON and JWTs than with browser-bound XML POSTs. The moment a customer's procurement team starts asking about identity requirements, the answer involves SAML, because that is what their existing IT stack speaks. The realistic question is rarely "OIDC or SAML?" The question is "OIDC first, then SAML when the first enterprise deal closes."

Second: **OAuth alone is not a login system.** This point cannot be repeated often enough. If an "OAuth login" is actually doing authentication, it is doing so via OIDC under the hood (by consuming the ID token), or it is doing so incorrectly (by using an access token to identify the user, which has the wrong audience and no defined identity claims). The [Auth0 protocol documentation](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol) puts it cleanly: OAuth 2.0 is about resource access, OIDC is about user authentication.

## When To Use SAML vs. OIDC: A Decision Framework

Most articles dodge this section. Here is the opinionated version.

**Use SAML when:**

- An enterprise customer's IT team explicitly requires it. Okta, Entra ID, Ping, and ADFS all support both protocols, but procurement checklists frequently still mandate SAML by name.
- Integration with legacy on-premises enterprise systems is required (older HR platforms, ERPs, SAP, Oracle products) and those systems only speak SAML.
- The customer needs attribute-based access control driven by SAML attribute assertions (group memberships, department codes, employee classifications).
- The compliance environment (FedRAMP, certain HIPAA configurations, defense-adjacent work) expects federated identity with auditable XML assertions.

**Use OIDC when:**

- Building greenfield consumer or SMB-facing features where the customer does not care which protocol is used.
- Mobile apps, single-page apps, or API-first architectures are part of the picture. OIDC's JSON/JWT model fits these cleanly; SAML does not.
- Developer experience matters and the team is small. OIDC's discovery endpoint, dynamic client registration, and standard claims make integration dramatically faster than SAML's metadata-and-certificate dance.
- Social login (Sign in with Google, GitHub, Microsoft consumer accounts) is sufficient.

**Use both when:**

- The product serves SMB customers (via OIDC) and enterprise customers (via SAML). This is the most common real-world scenario. The choice is not "pick one." The choice is "support OIDC by default, add SAML per enterprise tenant."
- The deployment is multi-tenant and different tenants have different identity stacks. Per-tenant protocol configuration becomes mandatory.

The shortest version of the decision: ship OIDC for the default flow, and treat SAML as a per-tenant extension that gets enabled when an enterprise customer requires it. Resist the temptation to make every customer use SAML, and resist the temptation to ask enterprise prospects to switch to OIDC because it would be easier on the engineering side.

## Common SAML SSO Implementation Mistakes

These are the failure modes that burn engineering time on the first SAML integration. Most have known mitigations. Knowing they exist before they surface as customer-facing failures is the goal of this section.

**1. Skipping or weakly validating the XML signature.** The OWASP SAML Security Cheat Sheet is unambiguous: signature validation must happen on every response, with schema validation against a trusted local schema. The class of attack to know by name is **XML Signature Wrapping (XSW)**, [documented in detail by OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html). An attacker takes a legitimately signed assertion, wraps it inside a manipulated XML document, and exploits the gap between what the signature covers and what the application reads. As recently as 2026, [PortSwigger research](https://portswigger.net/research/the-fragile-lock) has continued finding novel canonicalization bypasses in popular SAML libraries. Use battle-tested libraries. Do not write a custom XML signature validator. Pin library versions.

**2. Clock skew between application servers and the IdP.** SAML assertions carry `NotBefore` and `NotOnOrAfter` timestamps that are typically valid for only a few minutes. If server clocks drift more than that, every valid assertion gets rejected. The fix is operational, not architectural: run NTP, monitor drift, and allow a small clock-skew tolerance (60 to 120 seconds is typical) in validation logic.

**3. Wrong ACS URL configuration.** Roughly half of all "SAML doesn't work" tickets are an ACS URL mismatch between what the IdP posts to and what the SP expects. Protocol, host, path, and query must match exactly. Applications behind a load balancer or proxy that rewrites paths face additional risk here. Log the destination of every incoming assertion during integration testing.

**4. Missing or rigid attribute mappings.** Enterprise IdPs send user attributes under wildly non-standard claim names. Okta might send `email`, Entra ID might send `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`, and a custom Ping deployment might send `urn:oid:0.9.2342.19200300.100.1.3`. Build an attribute mapping layer that allows configuring which IdP attribute maps to which user field per tenant. Hardcoding a single attribute name will fail on the first non-Okta customer.

**5. Trusting IdP-initiated flows without InResponseTo validation.** By design, IdP-initiated SAML has no `AuthnRequest` to bind the response to, and this removes one of the protocol's strongest replay defenses. When accepting IdP-initiated assertions, validation must be aggressive: signature, audience, recipient, NotOnOrAfter, and a one-time-use check to prevent replay. Many security teams disable IdP-initiated entirely as a result. Make that choice consciously, not by default.

**6. Skipping Single Logout entirely.** Skipping SLO is a defensible early-stage choice. Never planning to add it is not. Enterprise security questionnaires routinely require it, and "no SLO support" can become a deal-blocker after the technical integration is otherwise complete.

**7. Hardcoding one SAML connection for the whole application.** This is the architectural mistake that costs the most to fix later. In B2B SaaS, every enterprise customer brings their own IdP, metadata, certificate, and attribute schema. If the initial implementation supports one SAML connection globally, the second enterprise customer breaks the model. Design for multi-tenant SAML from day one: per-tenant metadata, per-tenant ACS URLs (or a single ACS URL with tenant resolution from the SAML response), per-tenant attribute mapping.

## Implementing SAML SSO with SuperTokens

![Supertokens](Supertokens.png)

The accurate way to describe how SuperTokens handles SAML: **SuperTokens is not a direct SAML client.** It speaks OAuth and OIDC natively, and it delegates SAML to a separate component called [SAML Jackson](https://github.com/boxyhq/jackson) (built by BoxyHQ, now also distributed as Ory Polis). Jackson runs as its own microservice and converts SAML flows into an OAuth 2.0 flow that SuperTokens can consume through its standard ThirdParty provider configuration.

This architecture has a real benefit: application code only ever deals with OAuth and OIDC, regardless of whether the underlying enterprise IdP is SAML, OIDC, or both. SAML Jackson absorbs the XML, the signature validation, and the IdP-specific quirks. SuperTokens absorbs the session, the user model, and the multi-tenancy.

A typical setup runs SAML Jackson alongside SuperTokens, both self-hosted or both managed:

```bash
# Run SAML Jackson alongside SuperTokens
docker run \
  -p 5225:5225 \
  -e JACKSON_API_KEYS="your-secret" \
  -e DB_ENGINE="sql" \
  -e DB_TYPE="postgres" \
  -e DB_URL="postgres://postgres:postgres@localhost:5432/postgres" \
  -d boxyhq/jackson
```

Once Jackson is running, a tenant's SAML connection gets registered by posting their IdP metadata to it. Then, on the SuperTokens side, a ThirdParty provider is configured for that tenant pointing at the Jackson instance, using one of the supported provider IDs (`boxy-saml`, or a suffixed variant for tenants with multiple connections).

The [SuperTokens enterprise SAML integration guide](https://supertokens.com/docs/authentication/enterprise/saml) walks through the full setup including multi-tenancy. The short version: each enterprise customer becomes a SuperTokens tenant, each tenant gets its own SAML connection in Jackson, and the same SuperTokens session layer handles users from every protocol.

If you're still evaluating which SSO provider to build on, [this comparison of open source SSO providers](https://supertokens.com/blog/sso-providers) covers the main options. For teams that have landed on SuperTokens: it supports both modern OIDC (native) and SAML (via Jackson) under a unified multi-tenant session layer, is open source and self-hostable, so there is no vendor lock-in, and works with the SAML IdPs enterprise customers actually use: Entra ID, Okta, Google Workspace, ADFS, Ping, OneLogin, JumpCloud, and Rippling.

## FAQ

### **Is SAML the same as SSO?**

No. SSO is the authentication strategy where one login grants access to multiple applications. SAML is one of the protocols that implements SSO. OIDC and Kerberos are others.

### **Is SAML still relevant in 2026?**

Yes. SAML 2.0 has been the OASIS Standard since March 2005 and remains the dominant protocol for enterprise IdP integrations. Any B2B SaaS that wants enterprise customers will eventually need to support SAML.

### **Can OIDC replace SAML?**

For new integrations and modern IdPs, often yes. Okta, Entra ID, and Google Workspace all speak OIDC fluently. But if a specific enterprise customer's IT team has standardized on SAML (common with ADFS, legacy Okta tenants, or compliance-heavy environments), SAML support is required to land the deal.

### **What is a SAML assertion?**

A signed XML document issued by the IdP that proves a user's identity to a Service Provider. It typically contains an authentication statement (when and how the user logged in), an attribute statement (email, name, group memberships), and validity timestamps. The SP validates the signature against the IdP's public certificate before trusting the contents.

### **What is the difference between SP-initiated and IdP-initiated SSO?**

**SP-initiated:** The user starts at the application, the application redirects them to the IdP with an `AuthnRequest`, the IdP authenticates and sends back a response. This is the common case.

**IdP-initiated:** The user is already logged into the IdP dashboard, clicks a tile for the application, and the IdP pushes an unsolicited assertion to the ACS URL. Convenient, but riskier because there is no `AuthnRequest` to validate against.

### **Does SuperTokens support SAML?**

Yes, through integration with BoxyHQ's SAML Jackson. Jackson runs as a microservice alongside SuperTokens and exposes SAML flows as OAuth 2.0 for the application backend. SuperTokens natively supports OIDC for modern flows. Both can run side-by-side per tenant in a multi-tenant deployment.

## Conclusion

SAML and SSO are not the same thing, and conflating them is the single most common source of confusion in enterprise authentication. SSO is the goal: one login, many apps. SAML is one specific, XML-based, OASIS-standardized protocol that gets there, and the one that enterprise customers will most often demand by name.

For a B2B SaaS engineer trying to unblock an enterprise deal: ship OIDC as the default and add SAML as a per-tenant capability when the customer requires it. Avoid trying to make OIDC do SAML's job, and avoid asking enterprise customers to switch protocols to make engineering simpler. Multi-tenancy from day one. Signature validation done by a battle-tested library. SLO on the roadmap before the first security review.

[SuperTokens](https://supertokens.com) handles this combined reality with native OIDC support and SAML-via-Jackson under a unified multi-tenant session layer. Open source, self-hostable, and built so application code stays simple regardless of which protocol an individual customer brings.

***Add enterprise SAML SSO in minutes → [supertokens.com/docs/authentication/enterprise/saml](https://supertokens.com/docs/authentication/enterprise/saml)***
