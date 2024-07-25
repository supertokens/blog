---
title: "Supertokens Vs Keycloak: Going Custom Vs. Off-The-Shelf"
date: "2024-06-12"
description: "Explore a high level comparison between two popular open-source authentication solutions, SuperTokens and Keycloak. This blog covers their key differences in architecture, configuration, UI, customizability, enterprise readiness, and more. Learn the advantages and disadvantages of each to determine which solution best fits your application's needs."
cover: "supertokens-vs-keycloak.png"
category: "featured"
author: "Nemi Shah"
---

# Table of Contents

1. [Introduction](#introduction)
2. [Do SuperTokens and Keycloak Do the Same Thing?](#do-supertokens-and-keycloak-do-the-same-thing)
3. [Differences Between SuperTokens and Keycloak](#differences-between-supertokens-and-keycloak)
4. [Advantages of Using SuperTokens](#advantages-of-using-supertokens)
5. [Disadvantages of Using SuperTokens](#disadvantages-of-using-supertokens)
6. [Advantages of Using Keycloak](#advantages-of-using-keycloak)
7. [Disadvantages of Using Keycloak](#disadvantages-of-using-keycloak)
8. [Should You Choose SuperTokens Over Keycloak?](#should-you-choose-supertokens-over-keycloak)
9. [Conclusion](#conclusion)

For an in-depth comparison, refer to the [SuperTokens vs Keycloak guide](https://supertokens.com/static/assets/st_vs_keycloak.pdf) by the SuperTokens team.

## Introduction

Most, if not all, web applications require users to log in one way or another. Authentication and authorization have become basic requirements rather than features. It is very important to choose the right authentication solution and provider when building your application. To understand what authentication and authorization are and how they are different, [read this article](#).

When building your application, you want the solution to be flexible and reliable while avoiding vendor lock-in. Many solutions are available, but a lot of developers prefer choosing an open-source solution because of the transparency it brings and because it can be easily replaced with a custom-built solution if that becomes a requirement in the future.

In this article, we will compare two open-source solutions: SuperTokens and Keycloak.

## Do SuperTokens and Keycloak Do the Same Thing?

From a high-level point of view, both SuperTokens and Keycloak are open-source authentication solutions that ultimately try to do the same thing. Some key differences between the two are:

- **Managed Service:** SuperTokens offers a self-hosted approach as well as a managed service. Keycloak is a community supported project backed by RedHat. 
- **Enterprise Features:** Keycloak provides a lot of features but is missing some key enterprise-level features such as multi-tenancy out of the box, but requires some workarounds. SuperTokens provides these features and has documentation on how to implement it yourself.

We will cover more key differences later in this article.

## Differences Between SuperTokens and Keycloak

### Architecture

- **Keycloak:**  Keycloak is a microservice that exposes a number of HTTP APIs for Identity and Access Management. It provides adapters for different langauges and frameworks, but they act as wrappers for HTTP calls.
- **SuperTokens:** SuperTokens is also a microservice but it integrates natively into your application. The frontend and backend SDKs add authentication functionality with all auth requests passing through your server. This allows you to customize authentication logic directly in your own code.

### Configuration

- **Keycloak:** Keycloak can be configured through enviorment variables or through the a dashboard after setting up the service.
- **SuperTokens:** Due to SuperTokens architecture. SuperTokens users can customize both the core microservice and the SDKs. The microservice is configured through environment variables in the self-hosted version and using a dashboard in the managed service deployment.

### Pre-Built UI

- **SuperTokens:** Offers a pre-built UI served directly from your frontend using their SDKs. The pre-built UI can be configured and customized using CSS properties to match the aeshthetics of your website or can be injected with custom UI of your own choice.
- **Keycloak:** The UI is served from the server and involves redirecting to the authentication server when trying to log users in. [Refer to this page](https://supertokens.com/blog/what-do-pre-built-authentication-ui-tools-look-like) to compare different pre-built UI offerings.

### Custom Login Forms

- **Keycloak:** Adding custom form fields to the login form can be done directly using the dashboard. Using the custom form fields in the autentication flow requries using Java.
- **SuperTokens:** Adding custom form fields requires you to change SuperTokens configuration in the frontend SDK. Although this is more involved than changing it from the dashboard, it is more flexible and powerful.

### Custom Code

- **Keycloak:** Adding custom code or modifying the solution’s logic can be complicated. It requires the user to compile write their code in JAVA, create a JAR file, add it to their Keycloak installation and finally configure the new flow in the dashabord.
- **SuperTokens:** Offers an ‘Override’ feature that lets you implement custom logic very easily. This is done natively in your own tech stack, so managing, deploying and debuggin changes is very easy.

### Enterprise Readiness

- **SuperTokens:** Offers enterprise-level features such as multi-tenancy and multi-factor authentication. They are also compliant with several popular security certifications such as SOC.
- **Keycloak:** Provides extensive features but the lack of dedicated support and multi-tenancy can be an issue.

### Documentation

- **Keycloak:** Documentation can be overwhelming because of the amount of raw information it presents, and finding a quick solution to a problem can be tedious.
- **SuperTokens:** Documentation is divided by recipes, which are different authentication mechanisms, making it easier to find what you are looking for.

### Email Service

- **Keycloak:** Requires you to always configure an SMTP client.
- **SuperTokens:** Provides a built-in default service that can be used for testing with options to provide your own SMTP client

### Serverless

- **SuperTokens:** Offers first-party support for serverless environments like NextJS using their official libraries.
- **Keycloak:** Does not have first-party libraries for this, but there are some unofficial libraries.

## Advantages of Using SuperTokens

- **Embedded APIs and Frontend Components:** Using the official SDKs, SuperTokens APIs and frontend components/routes are embedded into your application, avoiding redirection to external pages.
- **Custom Logic with Overrides:** SuperTokens provides an ‘Override’ feature that lets you customize the SDK’s behavior, making it flexible and adaptable to any use case.
- **Managed Service:** Offers a managed service version of their core for organizations that do not want the additional infrastructure cost of hosting it themselves.
- **Enterprise Features:** Provides enterprise features such as multi-tenancy and multi-factor authentication out of the box.
- **User-Friendly Documentation:** Documentation is easy to consume, divided by authentication mechanism, and further into smaller chunks, making it friendly to new users.
- **Support for Multiple Stacks:** Supports many stacks for both frontend and backend, with a generic web SDK for frameworks without first-party support.
- **Support:** Offers free support using Discord and paid plans for dedicated support.
- **Cost:** The self-hosted solution is completely free if you do not use any enterprise features. [Visit their full pricing](#) to know more about this.

## Disadvantages of Using SuperTokens

- **Manual Configuration:** When using the self-hosted offering, you have to manually pass parameters (in the form of environment variables or startup flags) to configure the app.
- **Custom Form Elements:** Adding custom form elements for login and sign-up can be tedious.
- **Mobile SDKs:** Only offer session management; there is no UI or functionality for individual recipes, requiring manual API calls.
- **New Solution:** SuperTokens is a relatively new solution.

## Advantages of Using Keycloak

- **Community Support:** The community is very helpful, and solutions to most problems can be found by asking questions on the community forum.
- **Extensions and Plugins:** There are several extensions and plugins available to make Keycloak accommodate most use cases.
- **Built-in Dashboard:** The solution comes with a built-in dashboard to let you configure the application.
- **Trust Factor:** Keycloak is backed by RedHat, which helps boost the trust factor when choosing between solutions.

## Disadvantages of Using Keycloak

- **Overwhelming Documentation:** Documentation can be overwhelming for new users, and it can be tedious to find information about specific problems.
- **Serverless Environment:** There are no first-party solutions for serverless environments; you have to rely on third-party plugins.
- **Login UI:** The login UI is served from the backend and is not part of the frontend, meaning you need to redirect between the server and frontend when authenticating users.
- **Custom Logic:** Adding custom logic for certain flows can be very complicated.

## Should You Choose SuperTokens Over Keycloak?

You should choose SuperTokens if the following applies to you:

- You require more control over the UI of your application and want to avoid redirection between the frontend and the authentication URLs.
- Your application requires custom code in several flows.
- Your organization requires a solution that is compliant with security certifications.
- Your application requires enterprise-level features such as multi-tenancy and MFA.

It is very important to identify which authentication solution is best for your application and your organization. This article quickly summarizes the benefits of using SuperTokens and Keycloak and helps identify the differences between them. Understanding how the solutions differ is key in deciding which one fits perfectly with your requirements.
