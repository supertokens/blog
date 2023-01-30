---
title: "Introducing User Roles Authorization with SuperTokens"
description: "With user roles, you can now use SuperTokens to easily attach a different set of permissions to each user."
date: "2023-01-27"
cover: "TODO"
category: "featured"
author: "SuperTokens team"
---

As a web developer, you will inevitably have to work with authentication at some point and will come across terms like OIDC and OAuth. What do these terms mean and how are they different? In this article, we will break down OIDC and OAuth explaining the key differences between the two.

## What is OAuth?
OAuth or “Open Authentication” is not an API or service which you can query. It is an open standard for Authorization. Applications that implement an OAuth flow can authorize devices like 

For example, say you are using a service that needs to access the pictures on your google account. Instead of filling a form with your Google account credentials, Apps that implement OAuth will allow you to authorize the application to access private resources. In our example, if the service implements an OAuth flow, it can be authorized to retrieve the photos from the user's google account.

## What is OIDC?
OIDC stands for OpenID Connect. It builds on top of OAuth adding a simple identity layer. Where OAuth provides authorization, OIDC will additionally offer authentication. With OIDC, this means that not only will  

It is a simple identity layer built on top of the OAuth 2.0 protocol. While OAuth provides authorization, OIDC provides authentication. This means that OIDC not only allows third-party applications to access a user's resources, but it also allows them to authenticate the user and obtain basic profile information.

You can find OIDC implemented quite frequently with users 
OIDC is commonly used in situations where a user needs to authenticate with a third-party application and provide it with their identity information. For example, a user may use OIDC to log in to a website using their Google account, and the website can obtain their name, email address, and profile picture.

## When to use OAuth and OIDC
OAuth is best used when an application only needs to access a user's resources on another site and does not need to authenticate the user. OAuth is also the best choice when an application only needs a limited amount of user information.

OIDC is best used when an application needs to authenticate a user and obtain their identity information. OIDC is also the best choice when an application needs more detailed user information.

## Conclusion

OAuth and OIDC are both important protocols for developers to understand. OAuth provides authorization while OIDC provides authentication and identity management. By understanding the differences between these two protocols, developers can make informed decisions about which one to use in their application.

