---
title: Protecting your Supabase app with SuperTokens authentication.
date: "2022-09-12"
description: "When building an app with Supabase you will have to choose an authentication solution. Here are some reasons why you should choose SuperTokens as you auth provider and why it pairs so well with Supabase"
cover: "supabase-blog-cover.png"
category: "featured"
author: "SuperTokens Team"
---

## Table of Contents

- [Introduction](#introduction)
- [What is SuperTokens?](#what-is-supertokens)
- [Examples of some customizations you can make with SuperTokens](#examples-of-some-customizations-you-can-make-with-supertokens)
- [Example apps with custom flows](#example-apps-with-custom-flows)
- [Integrating SuperTokens into Supabase](#integrating-supertokens-into-supabase)
- [Conclusion](#conclusion)


## Introduction

So you’re creating a web app and have decided to use Supabase. You now face the decision of how you want to implement authentication.

Supabase comes with its own authentication solution, based on a fork of [Netlify's goTrue](https://supabase.com/docs/learn/auth-deep-dive/auth-gotrue).

![Netlify goTrue](./gotrue-supabase-logo.png)

It provides authentication flows like email-password, social login, and phone number based OTP and is ideal for quickly building out authentication for many use cases.

However, if your app is going to scale to a large number of users or have non-standard requirements, it may make sense to consider alternatives since GoTrue has some limitations:

For example:
- For B2C apps: Features like account linking only link accounts that share the same email.
- For B2B apps: There is currently no support for multi factor authentication.

Now that we know the limitations, lets dive deeper into when to use Supabase auth and when to consider other solutions:

**Use Supabase Auth if**:
- You are building a simple web app which does not require an api layer and uses Supabase for storage. 

**Consider alternative solutions if**:
- You’re building a high growth startup that will have a large numbers of users or will be selling to big companies.
- Require features such as: language translations, custom form fields and field validators.
- You require a custom flow - For example: You are building a streaming service and would like to limit the number of active sessions for a user or maybe you need to verify a users email before a user enters their password during sign up.

So what third-party options are available that offer the flexibility you need and, are easy to use? 
We have a [blog](https://supertokens.com/blog/auth0-vs-okta-cognito-supertokens) that compares some of the most popular solutions out there, but today we are looking at SuperTokens, how it can adapt to accommodate your custom requirements and why it pairs so well with Supabase.

## What is SuperTokens?

![SuperTokens Logo](./supertokens-logo.png)

SuperTokens is an Open Source Authentication solution. We have a managed service, but if you prefer to handle your own data, you can use our self-hosted solution. We built SuperTokens from the ground up to be easy to use and customizable.

> Note: SuperTokens requires you to have an api layer. If your app does not require a discrete api layer, Supabase auth is a more viable option.

### What does SuperTokens offer?
- All popular sign up methods such as passwordless (with email or SMS), email and password, social login.
- A Pre-built UI that is hosted on your domain itself. 
- SDKs that will handle automatically create and manage user’s session tokens (access & refresh tokens).
- Hosted and self hosted options that enable you to manage your own data.
- 2FA, user roles, SAML and more on the way!
- The ability to easily customise the end user experience or the backend auth logic within your API layer: This is what makes SuperTokens really powerful.

You can learn more about SuperTokens architecture and how customizations work from our [guide](https://supertokens.com/docs/thirdpartyemailpassword/architecture).

## Examples of some customizations you can make with SuperTokens:

Here is a list of possible use cases and how SuperTokens can help you achieve them.

- **Restrict signups to work emails**: If your app requires users to sign up with their work-related emails or Google workspace-associated domains, you can use the SuperTokens email validator functions to enforce the check.

- **Collect more information on signup**: Collect user’s name and age on the Sign Up or Sign In pages.

- **Use your own SMS / email sending service**: Don’t like the default email and SMS templates? Create your own email and SMS content! You can also choose your own delivery method if you don’t want to use the default service.

- **Migration**: SuperTokens allows you to migrate users from other auth providers to SuperTokens and preserve the users' original userId. This allows you to continue to use any data you had mapped to the previous provider's userId.

## Example apps with custom flows
Here are some examples of custom flows we've already built:

### Verify a users email before they enter their password during Sign Up.
Say you have a custom requirement where you want to verify a user's ownership of an email before they type in a password during sign-up.

- Example app with [email verification before entering the password during sign up](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-emailverification-then-password-thirdpartyemailpassword).

![Verify a users email before you enter your password during Sign Up ](./verify-email-before-password.gif)

### Email Verification with OTP
Instead of having the user click a link during email verification, maybe you would like them to enter an OTP.
- Example app with [email verification with OTP](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-emailverification-with-otp).

![Verify a users email with OTP](./emailverification-with-otp.gif)

### Login with Phone number Password
In this flow, users create an account using their phone number and password.
- Example app with [phone number and password login](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-phone-password).

![Phone number with password based login](./phone-password-login.gif)

These are just some of the use cases that SuperTokens supports. If you have a custom requirement, feel free to join our [discord](https://supertokens.com/discord). We are passionate about Auth and would love to discuss your use case.

## Integrating SuperTokens into Supabase

We provide a [guide](https://supabase.com/docs/guides/integrations/supertokens) on how to secure you Supabase app with SuperTokens. The guide details the process of leveraging Supabase's Row Level Security feature to create powerful authorization policies so only authorized users can access data.

## Conclusion

In the end, the authentication solution you choose depends on your use case.
- For apps where you need to quickly setup simple authentication flows, Supabase Auth is a great choice.
- For startups or mid-level organisations looking for an open-source authentication solution that can grow with their organisation, SuperTokens is a great choice.