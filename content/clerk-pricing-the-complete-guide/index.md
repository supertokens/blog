---
title: "Clerk Pricing (2026): Free Tier, Plans, Overage Costs and Hidden Fees"
date: "2026-02-16"
updated: "2026-09-24"
description: "Clerk pricing explained: the free 50K MRU tier, Pro and Business plans, per-user and per-organization overage rates, add-ons, worked cost examples, and how it compares with Auth0 and SuperTokens."
cover: "clerk-pricing-the-complete-guide.png"
category: "programming"
author: "Joel Coutinho"
---

**Clerk is free for up to 50,000 monthly retained users (MRUs) per application on its Hobby plan. Paid plans start at $25/month for Pro ($20/month billed annually) and $300/month for Business ($250/month annually), each including 50,000 MRUs. Beyond that, Clerk charges $0.02 per MRU, falling to $0.012 at very high volume, plus separate fees for organizations, enterprise SSO connections and add-ons.**

*Prices checked on 24 September 2026 against [clerk.com/pricing](https://clerk.com/pricing). Clerk changes its pricing regularly, so confirm current rates before you budget.*

## Table of Contents

- [Clerk pricing at a glance](#clerk-pricing-at-a-glance)
- [How Clerk counts users: Monthly Retained Users](#how-clerk-counts-users-monthly-retained-users)
- [The free Hobby plan](#the-free-hobby-plan)
- [Per-user overage pricing](#per-user-overage-pricing)
- [Organization pricing for B2B SaaS](#organization-pricing-for-b2b-saas)
- [Enterprise SSO connections](#enterprise-sso-connections)
- [Add-ons](#add-ons)
- [Worked cost examples](#worked-cost-examples)
- [Costs that are easy to miss](#costs-that-are-easy-to-miss)
- [Clerk vs Auth0 vs SuperTokens pricing](#clerk-vs-auth0-vs-supertokens-pricing)
- [When Clerk makes sense](#when-clerk-makes-sense)
- [Frequently Asked Questions](#frequently-asked-questions)

## Clerk Pricing at a Glance

| Plan | Monthly price | Billed annually | Included users | Best for |
|---|---|---|---|---|
| Hobby | Free | Free | 50,000 MRUs per app | Prototypes and early-stage products |
| Pro | $25/month | $20/month | 50,000 MRUs per app, 1 enterprise connection | Production apps that need MFA and no Clerk branding |
| Business | $300/month | $250/month | 50,000 MRUs per app, 1 enterprise connection, 10 dashboard seats | Teams that need a SOC 2 report, enhanced roles and priority support |
| Enterprise | Custom (annual only) | Custom | Negotiated | 99.99% uptime SLA, HIPAA BAA, custom log retention |

All plans allow unlimited applications. Usage limits such as the 50,000 included MRUs apply **per application**.

## How Clerk Counts Users: Monthly Retained Users

Clerk bills on **Monthly Retained Users (MRUs)**, not monthly active users. An MRU is a user who comes back to your app at least one day after signing up. Clerk calls this "First Day Free": someone who signs up and never returns is never billed.

This matters if you run campaigns that bring in lots of sign-ups who don't come back. Those users don't count toward your bill, whereas most other providers count every monthly active user.

## The Free Hobby Plan

The Hobby plan includes:

- 50,000 MRUs per application
- 100 monthly retained organizations, with up to 20 members each
- Prebuilt sign-in and sign-up components, social login and custom domains
- Up to 3 dashboard seats
- 7-day fixed sessions and 1-day log retention

What it does **not** include: multi-factor authentication (MFA), removal of Clerk branding, custom session lengths, or enterprise SSO connections. These start on Pro.

If a Hobby application goes over 50,000 MRUs, Clerk requires you to upgrade to Pro. You get a one-month grace period before service is affected.

## Per-User Overage Pricing

Pro and Business include 50,000 MRUs per application. Additional MRUs are billed on a sliding scale:

| MRUs per month | Price per MRU |
|---|---|
| First 50,000 | Included |
| 50,001 – 100,000 | $0.02 |
| 100,001 – 1,000,000 | $0.018 |
| 1,000,001 – 10,000,000 | $0.015 |
| 10,000,001+ | $0.012 |

Each rate applies only to the users within its band, so 150,000 MRUs costs 50,000 × $0.02 + 50,000 × $0.018 = $1,900/month in overage, on top of the plan fee.

## Organization Pricing for B2B SaaS

Clerk models B2B customers as **organizations**. Every plan includes 100 monthly retained organizations (MROs) per application. Beyond that:

| Organizations per month | Price per organization |
|---|---|
| First 100 | Included |
| 101 – 1,000 | $1.00 |
| 1,001 – 10,000 | $0.90 |
| 10,001 – 100,000 | $0.75 |
| 100,001+ | $0.60 |

By default an organization can have up to 20 members. Unlimited members, verified domains with automatic invitations, custom roles, and linking enterprise connections to organizations all require the **B2B Authentication add-on** (see [Add-ons](#add-ons)).

Few providers charge per organization, so for B2B products with many small customer accounts this can become the largest part of the bill.

## Enterprise SSO Connections

Pro and Business each include one enterprise connection (SAML or OIDC, for example to Okta or Microsoft Entra ID). Additional connections are priced per month:

| Connections | Price per connection |
|---|---|
| 1 | Included (Pro and Business) |
| 2 – 15 | $75 |
| 16 – 100 | $60 |
| 101 – 500 | $30 |
| 501+ | $15 |

If you sell to enterprises, expect roughly one connection per enterprise customer.

## Add-ons

| Add-on | Price | What it unlocks |
|---|---|---|
| B2B Authentication | $100/month ($85/month annually) | Unlimited organization members, verified domains, enterprise connections linked to organizations, custom roles and role sets |
| Administration | $100/month ($85/month annually) | Unlimited user impersonation |
| Additional dashboard seats (Business) | $20/month each | Seats beyond the 10 included |
| SMS authentication | $0.01 per SMS (US and Canada); market rate elsewhere | SMS one-time passcodes |

## Worked Cost Examples

The examples below use monthly (not annual) pricing.

### Example 1: Early-stage B2C app on Hobby

- 20,000 MRUs, no MFA requirement, Clerk branding acceptable

**Total: $0/month.** Moving to Pro for MFA and unbranded UI makes it $25/month.

### Example 2: Growing consumer app on Pro

- 80,000 MRUs

| Item | Cost |
|---|---|
| Pro plan | $25 |
| 30,000 MRUs × $0.02 | $600 |
| **Total** | **$625/month** |

### Example 3: B2B SaaS on Pro

- 40,000 MRUs across 500 customer organizations
- Some customers have more than 20 users, so the B2B Authentication add-on is needed
- 3 customers require SAML SSO

| Item | Cost |
|---|---|
| Pro plan | $25 |
| MRUs (within the 50,000 included) | $0 |
| 400 organizations × $1 | $400 |
| B2B Authentication add-on | $100 |
| 2 additional enterprise connections × $75 | $150 |
| **Total** | **$675/month** |

### Example 4: Scaling app on Pro

- 300,000 MRUs

| Item | Cost |
|---|---|
| Pro plan | $25 |
| 50,000 MRUs × $0.02 | $1,000 |
| 200,000 MRUs × $0.018 | $3,600 |
| **Total** | **$4,625/month** |

## Costs That Are Easy to Miss

1. **Organizations.** B2B products often grow faster in customer accounts than in users. At 1,000 organizations you pay $900/month in organization fees alone.
2. **The 20-member limit.** Once any customer organization needs more than 20 members, you need the $100/month B2B Authentication add-on.
3. **Enterprise connections.** Each enterprise customer asking for SAML SSO adds about $75/month after the first connection.
4. **Features gated to Pro.** MFA, custom session lengths and removal of Clerk branding are not in the free plan, so most production apps pay at least $25/month.
5. **Per-application limits.** The 50,000 included MRUs and 100 included organizations apply to each application separately.
6. **Log retention and compliance.** A SOC 2 report and 30-day logs require Business ($300/month). HIPAA BAAs are Enterprise-only.

## Clerk vs Auth0 vs SuperTokens Pricing

*As of September 2026, from each vendor's public pricing page.*

| | Clerk | Auth0 | SuperTokens |
|---|---|---|---|
| Free tier | 50,000 MRUs per app (Hobby, no MFA) | Up to 25,000 MAUs (Free plan) | Self-hosted: core features free with no user limit. Managed: free under 5,000 MAUs |
| Entry paid plan | Pro: $25/month | B2C Essentials: from $35/month (500 MAUs); B2B Essentials: from $150/month (500 MAUs) | Managed: $0.02 per MAU above 5,000 |
| How users are counted | Retained users (first day free) | Monthly active users | Monthly active users (managed service) |
| Organizations / multi-tenancy | 100 included, then $1 → $0.60 each | 5 on Free; unlimited on B2B plans | Multi-tenancy is a paid add-on (custom pricing) |
| Enterprise SSO connections | 1 included on Pro; $75 each for 2–15 | 1 on Free; 3 (Essentials) or 5 (Professional) on B2B plans, then $100/month each | Via the multi-tenancy add-on |
| MFA | Pro and above | Varies by plan (see [Auth0 pricing](https://auth0.com/pricing)) | Add-on: $0.01 per MAU (minimum $100/month) |
| Self-hosting | No | No | Yes |

Clerk usually costs the least for consumer apps under 50,000 retained users, especially if many sign-ups never return. Auth0's B2B plans include more organizations and SSO connections but start at a higher price. SuperTokens can be self-hosted, so core authentication costs nothing per user no matter how many users you have. You pay for your own infrastructure, plus any paid add-ons such as MFA and multi-tenancy. See [SuperTokens pricing](https://supertokens.com/pricing) for details.

For a feature comparison rather than pricing, see [Auth0 vs Clerk](/blog/auth0-vs-clerk) and [Clerk alternatives](/blog/clerk-alternatives). For Auth0's costs in detail, see the [Auth0 pricing guide](/blog/auth0-pricing-the-complete-guide).

## When Clerk Makes Sense

Clerk is a strong fit when:

- You are building with Next.js, React, Remix or Expo and want prebuilt, embeddable UI components
- Your app is consumer-facing and likely to stay near or under 50,000 retained users
- You want organizations and invitations without building them yourself, and your customer accounts are small

Consider modeling costs carefully, or looking at alternatives, when:

- You expect hundreds or thousands of B2B customer organizations
- Many customers will need enterprise SSO
- You need to self-host authentication for compliance or data-residency reasons

## Frequently Asked Questions

### Is Clerk free?

Yes. Clerk's Hobby plan is free for up to 50,000 monthly retained users per application, with prebuilt UI, social login and custom domains. MFA, removing Clerk branding and enterprise SSO require the Pro plan or higher.

### How much does Clerk cost for 100,000 users?

On the Pro plan, 100,000 monthly retained users costs $1,025/month: the $25 plan fee plus 50,000 additional users at $0.02 each. Organization, enterprise connection and add-on fees are extra.

### What is a Monthly Retained User (MRU) in Clerk?

An MRU is a user who returns to your app at least one day after signing up during a billing month. Users who sign up and never come back are not billed, which Clerk calls "First Day Free".

### Does Clerk charge per organization?

Yes. Each application includes 100 monthly retained organizations. Beyond that, organizations cost $1 each per month for 101–1,000, then decreasing to $0.60 each above 100,000. Organizations with more than 20 members need the $100/month B2B Authentication add-on.

### How much do enterprise SSO connections cost on Clerk?

Pro and Business include one enterprise connection. Connections 2 to 15 cost $75 each per month, with lower per-connection prices at higher volumes ($60, $30 and then $15 each).

### Is Clerk cheaper than Auth0?

For consumer apps under 50,000 retained users, Clerk is usually cheaper: its free tier is larger and Pro starts at $25/month. For B2B apps with many organizations and SSO connections, compare carefully. Clerk charges per organization, while Auth0's B2B plans include unlimited organizations but start at $150/month.
