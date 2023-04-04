---
title: "Introducing User Roles Authorization with SuperTokens"
description: "With user roles, you can now use SuperTokens to easily attach a different set of permissions to each user."
date: "2023-01-27"
cover: "oidc-vs-oauth.png"
category: "featured"
author: "SuperTokens team"
---

As a web dev, you will inevitably have to work on authentication at some point. In this process, you will come across terms like OIDC and OAuth. What do these terms mean and how are they different? In this article, we will break down OIDC and OAuth standards explaining the key differences between the two.

## What is OAuth?
OAuth or “Open Authentication” is not an API or service which you can query, it is an open standard for authorization. Applications that implement an OAuth flow can authorize devices to fetch resources on behalf of a user.

For example, say you are using a service that needs to access the pictures on your google account. Instead sending your credentials to the service, apps that implement OAuth will redirect you to Google to authenticate yourself. Post authentication Google will issue an access token scoped to specific resources which will be used to retrieve the users pictures from google.

## What is OIDC?
OIDC stands for OpenID Connect. It builds on top of OAuth adding a simple identity layer by sitting vdei. Where OAuth provides authorization, OIDC additionally offers authentication.  This means that OIDC not only allows third-party applications to access a user's resources, but it also allows them to authenticate the user and obtain basic profile information.

## When to use OAuth and OIDC
OAuth is best used when an application only needs to access a user's resources on another site and does not need to authenticate the user. OAuth is also the best choice when an application only needs a limited amount of user information.

OIDC is best used when an application needs to authenticate a user and obtain their identity information. OIDC is also the best choice when an application needs more detailed user information.

## Conclusion

OAuth and OIDC are both important protocols for developers to understand. OAuth provides authorization while OIDC provides authentication and identity management. By understanding the differences between these two protocols, developers can make informed decisions about which one to use in their application.

