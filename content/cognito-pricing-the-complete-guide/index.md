---
title: "AWS Cognito Pricing: The Complete Guide [2024]"
description: "An in depth guide covering AWS Cognito's pricing model"
date: "2024-06-03"
cover: "cognito-pricing-the-complete-guide.png"
category: "featured"
author: "Nemi Shah"
---

> Updated as of June 2024

## Table of Contents
- [What is AWS Cognito?](#what-is-aws-cognito)
- [AWS Cognito Pricing](#aws-cognito-pricing)
- [Free Features](#free-features)
- [Paid Features](#paid-features)
- [Should You Use AWS Cognito?](#should-you-use-aws-cognito)
- [Additional Costs Attached to AWS Cognito](#additional-costs-attached-to-aws-cognito)
- [Comparing AWS Cognito Pricing with Competitors](#comparing-aws-cognito-pricing-with-competitors)
- [AWS Cognito Alternative: SuperTokens](#aws-cognito-alternative-supertokens)


## What is AWS Cognito?

AWS Cognito is a service that provides authentication, authorization, and user management for web and mobile apps. It’s part of the AWS suite of products and can be used easily with their other offerings such as AWS Lambda.

## AWS Cognito Pricing

Amazon Cognito offers a pay for what you use. There don't have minimum fees and no upfront commitments. The main offerings and management and data synchronization. Amazon Cognito user pool pricing is based on monthly active users (MAUs). A user is counted as a MAU if, within a calendar month, generates an identity operation for that user, like administrative creation or update, sign-up, sign-in, sign-out, token refresh, password change, a user account attribute update, or an attribute query on a user (AdminGetUser API). You are not charged for subsequent sessions or for inactive users within that calendar month.

There is separate pricing for users who sign in directly with their credentials from a user pool (includes social identity providers) and for users who sign in through an enterprise directory with SAML federation.

## Free Features:
Amazon Cognito user pools has a free tier. The free tier does not automatically expire at the end of your 12 month AWS Free Tier term, and it is available to both existing and new AWS customers indefinitely. Please note - the free tier pricing isn’t available for user pool local or federated users in the AWS GovCloud (US-West) region.

- For users who sign in directly or through a social identity provider, Amazon Cognito user pools has a free tier of 50,000 MAUs per account or per AWS organization. 
- For users federated through SAML 2.0 or an OpenID Connect (OIDC) identity provider, Amazon Cognito user pools has a free tier of 50 MAUs per account or per AWS organization.
- There is no free tier for app clients or token requests when Cognito is used for the machine-to-machine use case.



## Paid Features:
- **Additional MAUs**: $0.0055 per MAU after the first 50,000 (up to 100,000)
- **Additional SAML/OIDC Users**: $0.015 per MAU after the first 50
- **Advanced Security Features**:
    - Compromised credential protection
    - Risk-based adaptive authentication
    - Monitoring
- **SMS Charges for Multi-Factor Authentication (MFA)**:
- Inbound: $0.01 per message
- Outbound: $0.01 per message


## Should You Use AWS Cognito?
- Cognito’s free tier and integration with other AWS services position it as a great auth provider, but it does not provide the best developer experience.
- As seen in this [post](https://theburningmonk.com/2021/03/the-case-for-and-against-amazon-cognito/), users have complained about the documentation being confusing at times and features, like account linking being underdeveloped or missing in the case of exporting password hashes.
- There have also been complaints about Cognito being slow to respond to bugs and feedback. For example, [this](https://github.com/aws-amplify/amplify-js/issues/987) issue was breaking the flow for many users and was open for 4 years before it was resolved thanks to a community member.


## Additional Costs Attached to AWS Cognito

Besides the basic pricing, additional costs can incur for services like SMS MFA, monitoring, and advanced security features. Advanced security features include compromised credentials detection, adaptive authentication, advanced security metrics, and access token customization. If you enabled, additional prices apply for monthly active users are applied.


## Comparing AWS Cognito Pricing with Competitors
Comparing AWS Cognito with competitors like Auth0, Okta, and SuperTokens can help you understand the cost-benefit ratio. For instance:

- **Auth0**: Offers more features but at a higher cost.
- **Okta**: Known for enterprise solutions but can be expensive for startups.
- **SuperTokens**: An open-source alternative with competitive pricing and robust features.

When evaluating AWS Cognito against its competitors, it's important to consider not only the features but also the costs involved.

### Auth0 Pricing
- **Free Tier**: Up to 7,000 active users
- **Developer Plan**: Starts at $23/month for 1,000 users
- **Enterprise Plan**: Custom pricing for more advanced features and higher MAUs
- **Add-ons**: Multi-factor authentication, anomaly detection, and more, which can increase the cost.

### Okta Pricing
- **Customer Identity Cloud**: Starts at $140/month for 500 MAUs
- **Workforce Identity**: $2/user/month
- **Enterprise Features**: Available in higher pricing tiers, including advanced security and compliance tools.

### SuperTokens Pricing
- **Self-Hosted**: Free for unlimited users
- **Managed Service**: Free for up to 5,000 MAUs, then $0.02 per MAU
- **Add-ons**: Multi-tenancy, account linking, and 2FA with additional costs depending on the feature set.

### Key Considerations
- **Flexibility and Customization**: Auth0 and Okta offer extensive customization and enterprise-level features but come at a higher price.
- **Scalability**: AWS Cognito is scalable but can become costly with high MAUs and additional features.
- **Open-Source Advantage**: SuperTokens provides a cost-effective, open-source solution with essential features, making it suitable for startups and mid-sized businesses.

## AWS Cognito Alternative: SuperTokens

### What is SuperTokens?
SuperTokens is an open-source authentication solution that provides a managed service for hassle-free auth and an on-prem solution so developers can manage their data.

### SuperTokens Pricing:
At the time of writing this article, the core SuperTokens feature set is completely free and they offer paid add-ons. If you decide to use the self-hosted version, you can download the core and set up authentication for free for an unlimited number of users.

- **Self-Hosted:**
  - Free forever for unlimited users.
- **Managed Service:**
  - Free for the first 5000 MAUs.
  - 2 cents / MAU post the first 5000 MAUs.

**Add-ons**
  - Multi-tenancy
  - Account Linking
  - MFA

### Should you use SuperTokens?
SuperToken’s feature set and pricing make it an excellent choice for startups and mid-level businesses and enterprises that value customizations and value extensibility.
