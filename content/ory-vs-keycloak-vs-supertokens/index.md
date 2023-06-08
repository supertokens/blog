---
title: Ory vs Keycloak vs SuperTokens
date: "2023-06-08"
description: "Comparing the three leading open-source authentication providers - Ory, Keycloak and SuperTokens"
cover: "ory-vs-keycloak-vs-supertokens.png"
category: "programming"
author: "Advait Ruia"
---

## Open-Source Authentication Providers

Compared to a couple of years ago, open-source authentication has seen huge progress. In this post, we’ll compare three of the leading open-source authentication providers - Ory, Keycloak, and SuperTokens. 

Each of these providers has its own set of pros and cons. We’ll evaluate each independently and summarize the relative strengths and weaknesses towards the end of the post.

## Ory Kratos / Ory Identities

Ory Kratos is an API-first identity and user management system. Ory also offers other products including:

1. Ory Hydra: OAuth 2.0 and OpenID Connect provider 
2. Ory Oathkeeper: zero-trust networking proxy) 
3. Ory Keto: open-source implementation of Google’s Zanzibar. 

Among these products, we’ll focus on Kratos for its relevance to authentication.

Introduced in January 2020 as an open-source authentication and identity solution, Ory Kratos is now powering companies like Fandom. Since launch, the Ory team has rebranded the Kratos product to Ory Identities. To minimize confusion, we’ll continue using the Kratos name.

**Advantages**

- **Customizability**: Developers have maximum control over their user journeys and the ability to self-host authentication. In particular, [Ory Actions](https://www.ory.sh/docs/kratos/hooks/configure-hooks) allows developers to integrate with custom applications or third-party services such as Stripe or Mailchimp to build custom business logic. These integrations can be triggered by any user-related event such as login, registration, account recovery, account verification, or user settings update.
- **Support**: Unlike legacy authentication providers, Ory supplies a [public slack server](https://slack.ory.sh/) for developers to ask questions or get help with their implementation.

**Disadvantages**

- **Technical Customization complexity.** - **Technical Customization complexity.** Once deployed, basic changes such as changing the color scheme for authentication screens or understanding user management can be found at [console.ory.sh](https://console.ory.sh/login). However, further customizations with third party integrations are limited to Ory Actions. These provide webhook triggers, as opposed to overriding the function/ API (SuperTokens). Depending on the implementation, these triggers may even require a separate automation service.
- **Features gated by enterprise**. A couple of Ory’s features are limited to their enterprise plan that starts at $3000/month. In particular, a private slack channel with Ory engineers is priced at $500/month or bundled with the enterprise plan. SAML is limited to enterprise. And their 99.95% service level objective (SLO) is only available at the $690/month plan.
- **Compliance and hosting options.** Current managed hosting options are limited to EU data regions and their SOC2 certifications is still underway. They do not offer SMS based 2FA

**Ory Pricing**

Self-hosting with Ory is free. As an open-source startup, Ory primarily makes money through their managed service called Ory Cloud. Pricing for Ory Cloud starts at - 

- Essentials plan - $29/month for 1,000 DAU and $30/1,000 DAU afterward.
- Scale plan - $690/month for 20,000 DAU and $30/1,000 DAU afterward.
    - Additional features include 99.95% SLO and multi-tenancy
- Enterprise plan - $3,000/month for 20,000 DAU
    - Additional features include dedicated support, SAML, and more.

## Keycloak

Keycloak is an open source software product to allow single sign-on with identity and access management. Introduced in 2014, Keycloak was one of the first open-source implementations for sign sign-on. Since then, it’s become a broader open source identity and access management solution. 

Keycloak’s age shows most in its features. Of the three providers, Keycloak has the richest feature set. For sophisticated developers looking to self-host an authentication solution with minimal customizations, Keycloak is a good bet. The tradeoff is that customizing a Keycloak system is authentication on hard mode.

**Advantages**

- **Feature set.** Keycloak has nearly every authentication feature possible. From SSO to SAML to passwordless (minus SMS) to Kerberos, Keycloak’s off the shelf offering is incredibly wide. These features are available to everyone, no payment required.
- **History and stability**. Keycloak has been around a long time. In 2018, it was adopted as the upstream project to Redhat’s SSO implementation - geared towards enterprise customers. As a result, Keycloak has been extremely stable with the potential to scale up to millions of users.

**Disadvantages**

- **Support**. The biggest gripe that most Keycloak users have is support. There’s no official support channel and the documentation can be frustrating at times. While Keycloak has a large community of developers, given its small core staff, [resolving issues](https://github.com/keycloak/keycloak/issues/14122) can be iffy at best. Instead, many companies turn to consultancies that specialize in wrangling with Keycloak.
- **Customization**. Part of why Keycloak needs so much support is the fact that there’s very little off-the-shelf customization possibilities. Changes in email to sign-up fields to basic user flow require meaningful amounts of engineering. And security features like SMS 2FA aren’t supported by Keycloak, requiring developers to patch an external service into Keycloak.
- **No managed service**. Keycloak does not offer a managed service and hence if you want that optionality to start off with or for the future, then that is not possible.
- **Scaling concerns**. While Keycloak has been proven to scale to millions of users, most companies at a large enough stage [have trouble keeping up](https://news.ycombinator.com/item?id=26359685) with the engineering required to customize Keycloak. Instead, they’ll need to engage with RH SSO (where pricing starts at $1,650 per month and goes up to $43,200 per month), or migrate out of Keycloak.

**Pricing**

Keycloak is entirely open-source and free to use. Developers will need to self-host their implementation.

### SuperTokens

SuperTokens is an open-source authentication alternative to Auth0 / Firebase Auth / AWS Cognito. Introduced in 2020, SuperTokens manages tens of millions of customer identities.

SuperTokens was built to be the best of both build and buy. Companies often have to consider the opportunity cost and complexity in building their own authentication system but also the flexibility limitations of buying from an authentication provider.

SuperTokens makes it easy to implement authentication, with great extensibility options due to the unique frontend, backend, and core architecture.

**Advantages**

- **Speed of implementation**. Setting up an authentication demo locally with SuperTokens is quick with their CLI tool. Support on [SuperTokens’ Discord](https://supertokens.com/discord) is responsive, with engineers from SuperTokens chiming in as little as a minute.
- **Customization.** SuperTokens’ unique architecture allows the developer to pick and choose what functionality they want. Developers can even build atop React, Vanilla JS, and React Native SDKs to create the pixel-perfect authentication screen (for the full list of SuperTokens SDKs, refer to the [Github page](https://github.com/supertokens)).
- **Authentication focused.** SuperTokens is focused on authentication. Keycloak is a single product within Red Hat which is a part of the larger IBM organization. Ory has [four distinct product lines](https://github.com/ory) including end point security and an implementation of Google’s Zanzibar - which all need to be managed simultaneously.

**Disadvantages**

- **Tech stack support.** SuperTokens provides backend SDKs for `Nodejs`, `Golang` and `Python`. On the frontend, SuperTokens has `Reactjs`, `VanillaJS`, and `React Native(only session management)`. For Angular and Vuejs, developers would need to build their own UI.
- **Feature maturity.** SuperTokens is not as feature rich as some of the other alternatives - especially Keycloak
- **Additional integration:** To provide the additional customisability, SuperTokens also requires developers to integrate SuperTokens backend SDK into their API layer

**Pricing**

Self-hosting with SuperTokens is free. 

As an open-source startup, SuperTokens offers a managed service that abstracts the complexity with self-hosting.

- Free if under 5,000 MAUs
- 2 cents per MAU or $20 per 1,000 MAU
- Custom pricing available for enterprise

## Choosing an Auth Provider

![Star growth rate comparison](./star-growth-chart.png)

Compared to a couple of years ago, developers have far more choice in choosing an open-source authentication provider. All three are great options, used in production across startups and large enterprises alike.

By Github stars, SuperTokens is the fastest growing of the three and was one of the fastest growing open source companies in 2022 [Link]. Keycloak is the oldest, most feature rich and is 100% free. Ory is somewhere in the middle of the two.