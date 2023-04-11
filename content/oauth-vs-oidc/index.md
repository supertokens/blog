---
title: "OIDC vs OAuth"
description: "We break down the OIDC and OAuth standards and explain the key differences between the two"
date: "2023-04-13"
cover: "oidc-vs-oauth.png"
category: "featured"
author: "SuperTokens team"
---

As a web developer, you will inevitably have to work on authentication at some point. In this process, you will come across terms like OIDC and OAuth. Although both protocols are used for similar purposes, they have some significant differences that are important to understand.


## What is OAuth?
OAuth or “Open Authentication” is not an API or service which you can query, but, an authorization protocol. Applications that implement an OAuth flow can authorize devices to fetch resources on behalf of a user.

### Use cases for OAuth
OAuth is commonly used in scenarios where an application needs to access data from another application or service on behalf of the user. Some examples of use cases for OAuth include:

- Social media integration, where an application can post to a user's social media account on their behalf.
- Calendar integration, where an application can access a user's calendar to schedule appointments.
- Payment processing, where an application can process payments on behalf of the user.


## What is OIDC?
OIDC or OpenID Connect is a simple identity layer built on the OAuth 2.0 protocol. While OAuth describes what resources a user has access to, OIDC describes who the user is. This means that OIDC not only allows third-party applications to access a user's resources but also allows them to authenticate the user with the application and obtain basic profile information.  OIDC is often used as a replacement for traditional username and password authentication.


### Use cases for OIDC
OIDC is commonly used in scenarios where the application needs to authenticate users with an external identity provider. Some examples of use cases for OIDC include:

- Single sign-on (SSO) for enterprise applications.
- Authentication for mobile applications.
- Authentication for social media websites.


## OIDC vs OAuth: Key Differences
While OIDC and OAuth share some similarities, there are some key differences between the two protocols. Here are the main differences:
- The primary difference between OIDC and OAuth is that OIDC is used for authentication, while OAuth is used for authorization. OIDC provides information about the user, while OAuth provides access to resources.
- OIDC is built on top of the OAuth 2.0 protocol, which means that OIDC includes all of the features of OAuth, plus some additional features for authentication.


## Conclusion

In conclusion, OAuth and OIDC are both important protocols for developers to understand with OAuth providing authorization and OIDC providing authentication and identity management. By understanding the differences between these two protocols, developers can make informed decisions on how to go about building authentication and integrating with third-party services.

