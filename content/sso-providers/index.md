---
title: "Top Open Source SSO Providers in 2026: Keycloak, authentik, Authelia, ZITADEL and More"
description: "Compare the best open source SSO providers in 2026: Keycloak, authentik, Authelia, ZITADEL, Apereo CAS, Ory and SuperTokens. Licenses, supported protocols, pricing and which to choose."
date: "2025-07-07"
updated: "2026-09-24"
cover: "sso_providers_2025.png"
category: "sso, sso providers, guide"
author: "Maurice Saldivar"
---

**The leading open source SSO providers in 2026 are Keycloak, authentik, Authelia, ZITADEL, Apereo CAS, Ory and SuperTokens.** Keycloak is the most widely deployed general-purpose option. authentik and ZITADEL cover the most protocols in a modern package. Authelia is the lightest choice for putting SSO in front of self-hosted apps behind a reverse proxy. SuperTokens is built for adding login and SSO to your own product.

*License, protocol and pricing details checked against each project's GitHub repository and pricing page on 24 September 2026. GitHub star counts are rounded and as of the same date.*

## Table of Contents

- [Open source SSO providers at a glance](#open-source-sso-providers-at-a-glance)
- [Protocol support compared](#protocol-support-compared)
- [Keycloak](#keycloak)
- [authentik](#authentik)
- [Authelia](#authelia)
- [ZITADEL](#zitadel)
- [Apereo CAS](#apereo-cas)
- [Ory](#ory)
- [SuperTokens](#supertokens)
- [What about Microsoft Entra ID, Okta and Auth0?](#what-about-microsoft-entra-id-okta-and-auth0)
- [How to choose an open source SSO provider](#how-to-choose-an-open-source-sso-provider)
- [What is SSO and how does it work?](#what-is-sso-and-how-does-it-work)
- [SSO best practices](#sso-best-practices)
- [Frequently Asked Questions](#frequently-asked-questions)

## Open Source SSO Providers at a Glance

| Provider | License | Best for | Paid option | GitHub stars |
|---|---|---|---|---|
| **Keycloak** | Apache 2.0 | General-purpose IAM for workforce and customer apps; large enterprises | Commercial support via the Red Hat build of Keycloak | ~37k |
| **authentik** | MIT (core); proprietary enterprise features | Self-hosters who want one IdP for SAML, OIDC, LDAP and RADIUS | Enterprise: $5/internal user/month, $0.02/external user/month | ~26k |
| **Authelia** | Apache 2.0 | Adding SSO and 2FA in front of self-hosted apps via a reverse proxy | None (community project) | ~29k |
| **ZITADEL** | AGPL-3.0 (some directories Apache 2.0/MIT) | Multi-tenant B2B SaaS that needs SAML, OIDC and SCIM | Managed ZITADEL Cloud | ~15k |
| **Apereo CAS** | Apache 2.0 | Universities and enterprises with CAS, SAML or WS-Federation estates | Commercial support from Apereo partners | ~11k |
| **Ory** (Hydra, Kratos) | Apache 2.0 | Teams building their own login UI on a certified OAuth 2.0/OIDC server | Managed Ory Network | ~18k (Hydra) |
| **SuperTokens** | Apache 2.0 (core); enterprise features under a separate licence | Adding login, sessions and enterprise SSO to your own product | Managed service; multi-tenancy/enterprise SSO is a paid add-on | ~15k |

## Protocol Support Compared

| | OIDC / OAuth 2.0 | SAML 2.0 | LDAP | SCIM | Passkeys / WebAuthn | Reverse-proxy auth |
|---|---|---|---|---|---|---|
| Keycloak | Yes | Yes | Yes (user federation) | Preview (native SCIM API since 26.7) | Yes | Via companion proxies |
| authentik | Yes | Yes | Yes (LDAP provider) | Yes | Yes | Yes (built-in proxy) |
| Authelia | Yes (OpenID Certified) | No | Yes (user backend) | No | Yes | Yes (core use case) |
| ZITADEL | Yes (OpenID Certified) | Yes | Yes | Yes | Yes | No |
| Apereo CAS | Yes | Yes | Yes | Yes | Yes | No |
| Ory | Yes (Hydra is OpenID Certified) | Not in the open source projects | No | No | Yes (Kratos) | Via Ory Oathkeeper |
| SuperTokens | Yes (social and enterprise OIDC providers) | Yes, via the paid multi-tenancy feature | No | No | Yes | No |

"Yes" means the capability is built in or officially supported. Check each project's documentation for version-specific details.

## Keycloak

[Keycloak](https://github.com/keycloak/keycloak) is the most widely adopted open source identity and access management server. It is a CNCF project, originally created by Red Hat, and licensed under Apache 2.0.

- **Protocols:** OpenID Connect, OAuth 2.0 and SAML 2.0, with user federation from LDAP and Active Directory
- **Features:** Realms for multi-tenancy, identity brokering to external IdPs, fine-grained authorization, passkeys/WebAuthn, themeable login pages and an admin console
- **Pricing:** Free. Red Hat offers commercial support through the Red Hat build of Keycloak.
- **Watch out for:** Running Keycloak well (clustering, upgrades, database tuning) takes real DevOps effort, and deep UI customisation means working with its theme system.

**Choose Keycloak if** you need a proven, standards-complete IdP and have the operations capacity to run it. See [Keycloak alternatives](/blog/keycloak-alternatives) if it feels too heavy.

## authentik

[authentik](https://github.com/goauthentik/authentik) is a self-hosted identity provider positioned as an open source replacement for Okta, Auth0 and Entra ID. Its core is MIT-licensed.

- **Protocols:** OAuth 2.0/OIDC, SAML, LDAP and RADIUS providers, SCIM, plus a built-in reverse proxy for apps with no SSO support
- **Features:** Visual "flows" for customising login, enrollment and recovery; passkeys/WebAuthn; deployable with Docker Compose, Kubernetes (Helm) or AWS CloudFormation
- **Pricing:** The open source edition is free. Enterprise is $5 per internal user per month and $0.02 per external user per month, billed annually. Enterprise Plus starts at $20,000 per year.
- **Watch out for:** Flows are powerful but take time to learn, and some features are only in the paid Enterprise edition.

**Choose authentik if** you want one self-hosted IdP that covers almost every protocol, including legacy LDAP and RADIUS. Compare it head-to-head in [authentik vs Keycloak](/blog/authentik-vs-keycloak).

## Authelia

[Authelia](https://github.com/authelia/authelia) is a lightweight authentication and authorization server that sits beside a reverse proxy such as Traefik, nginx, Caddy, Envoy or HAProxy and enforces login and two-factor authentication for the apps behind it.

- **Protocols:** OpenID Connect 1.0 / OAuth 2.0 provider (OpenID Certified™ for several OP profiles). No SAML.
- **Features:** Forward-auth access control rules per domain and path; 2FA with security keys (WebAuthn), TOTP and Duo push
- **Pricing:** Free and community-maintained, with no commercial tier
- **Watch out for:** It is not a full user-management platform, and without SAML it can't serve apps that only speak SAML.

**Choose Authelia if** you want SSO and 2FA in front of self-hosted services with minimal resources. See [Authelia vs Keycloak](/blog/authelia-vs-keycloak) and [Authelia alternatives](/blog/authelia-alternatives).

## ZITADEL

[ZITADEL](https://github.com/zitadel/zitadel) is a cloud-native identity platform with first-class multi-tenancy, designed for B2B SaaS. It is licensed under AGPL-3.0, with Apache 2.0 and MIT exceptions for specific directories.

- **Protocols:** OpenID Connect (certified), OAuth 2.0, SAML 2.0 and LDAP, with a SCIM 2.0 server for user provisioning
- **Features:** Organizations for customer tenants, passkeys (FIDO2/WebAuthn), audit trail built on event sourcing, managed cloud or self-hosted
- **Watch out for:** AGPL-3.0 has obligations if you modify ZITADEL and offer it as a network service, so check with your legal team.

**Choose ZITADEL if** you are building multi-tenant B2B SaaS and need SAML, OIDC and SCIM from one open source project.

## Apereo CAS

[Apereo CAS](https://github.com/apereo/cas) is a long-running Java (Spring Boot) identity provider maintained by the Apereo Foundation, widely used in higher education.

- **Protocols:** CAS v1–v3, SAML v1 and v2, OAuth 2.0, OpenID Connect and WS-Federation
- **Features:** Very broad protocol and authentication-source support, MFA integrations, extensive configuration options
- **Watch out for:** Configuration is extensive and Java-centric, and the UI and developer experience feel dated compared with newer projects.

**Choose Apereo CAS if** you already run CAS or WS-Federation, or need the widest protocol coverage in one server.

## Ory

[Ory](https://github.com/ory/hydra) is a set of Apache 2.0 building blocks: **Hydra** (an OpenID Certified OAuth 2.0 and OpenID Connect server), **Kratos** (identity and user management) and **Oathkeeper** (an identity-aware proxy).

- **Protocols:** OAuth 2.0 and OpenID Connect via Hydra; passkeys and social sign-in via Kratos
- **Features:** Headless by design (you build the login and consent UI), high throughput, low resource use; a managed version is available as Ory Network
- **Watch out for:** Hydra doesn't include user management or a login UI, so you'll combine several components. SAML isn't part of the open source projects.

**Choose Ory if** you want a certified, headless OAuth 2.0/OIDC server and are happy to build your own UI. See [Ory vs Keycloak vs SuperTokens](/blog/ory-vs-keycloak-vs-supertokens).

## SuperTokens

[SuperTokens](https://github.com/supertokens/supertokens-core) is an open source authentication platform for adding login, session management and SSO to your own web and mobile apps. The core is Apache 2.0, and enterprise features are under a separate licence.

- **Protocols:** Social and enterprise OIDC/OAuth providers; enterprise SSO including SAML through the multi-tenancy feature, with login methods configurable per tenant
- **Features:** Pre-built and custom UI, secure cookie-based sessions with automatic token rotation, passwordless and [passkeys](/blog/what-are-passkeys), MFA, roles, machine-to-machine auth, backend SDKs for Node.js, Python and Go
- **Pricing:** Self-hosted core features are free with no user limit. The managed service is free under 5,000 MAUs, then $0.02 per MAU. MFA ($0.01/MAU, minimum $100/month), account linking and multi-tenancy/enterprise SSO are paid add-ons. See [supertokens.com/pricing](https://supertokens.com/pricing).
- **Watch out for:** SuperTokens is built for customer-facing authentication in your product. It isn't a workforce IdP for signing employees into third-party SaaS apps.

**Choose SuperTokens if** you are building a product and want users (or your B2B customers' employees, via their corporate IdP) to sign in with SSO, without running a full IAM server.

### Adding SSO to your app with SuperTokens

Generate a working example app with social login (for example GitHub or Google) in one command:

```bash
npx create-supertokens-app@latest --appname=sso-with-supertokens --recipe=thirdparty
```

Then follow the [social login guide](https://supertokens.com/docs/authentication/social/introduction) to configure providers, or the [enterprise login guide](https://supertokens.com/docs/authentication/enterprise/introduction) to let each B2B customer (tenant) sign in through their own SAML or OIDC identity provider.

## What About Microsoft Entra ID, Okta and Auth0?

These are the most common commercial SSO providers. None is open source, but they are often shortlisted alongside the projects above:

| Provider | Model | Pricing (as of Sep 2026) |
|---|---|---|
| Microsoft Entra ID | Workforce IdP, deeply integrated with Microsoft 365 and Azure | Free tier with M365/Azure; P1 $7/user/month, P2 $10/user/month, paid yearly |
| Okta | Workforce and customer identity (Auth0 is Okta's customer identity product) | See [Okta pricing](/blog/okta-pricing-the-complete-guide) |
| Auth0 | Customer identity (CIAM) SaaS | Free up to 25,000 MAUs; paid plans from $35/month. See [Auth0 pricing](/blog/auth0-pricing-the-complete-guide) |

Choose a commercial provider if you'd rather pay per user than operate identity infrastructure. Choose open source if you need data residency, deep customisation, or costs that don't grow per user.

## How to Choose an Open Source SSO Provider

1. **Workforce or customer SSO?** To sign employees into internal and third-party apps, look at Keycloak, authentik, Authelia or Apereo CAS. To add SSO to your own product for your customers, look at SuperTokens, ZITADEL, Ory or Keycloak.
2. **Which protocols do your apps speak?** If any app needs SAML, rule out Authelia and open source Ory. For LDAP or RADIUS clients, authentik is the most complete.
3. **Do you need multi-tenancy?** For B2B SaaS where each customer brings its own IdP, ZITADEL, SuperTokens (multi-tenancy) and Keycloak (realms or organizations) are designed for it.
4. **How much operations capacity do you have?** Authelia is the lightest to run. Keycloak and CAS need the most care. ZITADEL, Ory and SuperTokens also offer managed versions.
5. **Is the license acceptable?** Apache 2.0 and MIT are permissive. AGPL-3.0 (ZITADEL) has obligations if you modify it and offer it as a network service. Open-core projects keep some features in a paid tier.

## What Is SSO and How Does It Work?

Single sign-on (SSO) lets a user sign in once with an **identity provider (IdP)** and then access multiple applications (**service providers**) without signing in again. The IdP authenticates the user and issues a signed assertion (SAML) or token (OpenID Connect) that each application trusts.

A typical flow:

1. The user opens an app and is redirected to the IdP.
2. The user signs in at the IdP, ideally with MFA or a passkey.
3. The IdP sends a signed SAML assertion or OIDC ID token back to the app, which creates a session.
4. When the user opens a second app, the IdP recognises the existing session and signs them in without a new prompt.

The main protocols are:

- **SAML 2.0:** XML-based and dominant in enterprise workforce apps. See [SAML vs OAuth](/blog/saml-vs-oauth) and [OIDC vs SAML](/blog/oidc-vs-saml).
- **OAuth 2.0:** A delegated *authorization* framework, not an authentication protocol on its own.
- **OpenID Connect (OIDC):** An identity layer on top of OAuth 2.0, and the default for modern web and mobile apps. See [OpenID Connect vs OAuth 2.0](/blog/openid-connect-vs-oauth2).

For a step-by-step rollout, see our [SSO implementation guide](/blog/sso-implementation).

## SSO Best Practices

- **Enforce phishing-resistant MFA at the IdP.** SSO concentrates risk in one account, so protect it with passkeys or security keys rather than SMS codes, which are vulnerable to [SIM swapping](/blog/sim-swapping).
- **Automate deprovisioning.** Use SCIM where possible so that removing a user at the IdP removes their access everywhere.
- **Set sensible session lifetimes** and re-authenticate for sensitive actions ([step-up authentication](/blog/step-up-auth)).
- **Monitor sign-ins centrally.** Alert on spikes in failed logins and impossible-travel patterns.
- **Plan for IdP outages.** Keep documented break-glass accounts for critical systems.
- **Test every integration.** See [how to test an SSO implementation](/blog/testing-sso-implementation).

## Frequently Asked Questions

### What is the best open source SSO provider?

There is no single best option. Keycloak is the most widely used general-purpose choice. authentik covers the most protocols for self-hosters. Authelia is the lightest option for putting SSO in front of self-hosted apps. SuperTokens and ZITADEL are designed for adding SSO to your own SaaS product.

### Is Keycloak free?

Yes. Keycloak is open source under the Apache 2.0 license and free to use, including commercially. You pay only for the infrastructure you run it on, or for optional commercial support such as the Red Hat build of Keycloak.

### Does Authelia support SAML?

No. Authelia acts as an OpenID Connect 1.0 / OAuth 2.0 provider and a forward-auth server for reverse proxies, but it does not act as a SAML identity provider. If you need SAML, consider authentik, Keycloak, ZITADEL or Apereo CAS.

### What is the difference between an SSO provider and an identity provider?

In practice the terms overlap. An identity provider (IdP) authenticates users and issues assertions or tokens. An SSO provider is an IdP used so that one sign-in grants access to many applications. See [What is an identity provider?](/blog/what-is-an-identity-provider)

### Can I add enterprise SSO (SAML) to my own SaaS app with open source tools?

Yes. SuperTokens (through its paid multi-tenancy feature), ZITADEL and Keycloak all let each of your business customers sign in through their own SAML or OIDC identity provider, such as Okta or Microsoft Entra ID.
