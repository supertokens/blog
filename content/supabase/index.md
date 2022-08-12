---
title: Why you should choose SuperTokens to protect your Supabase App
date: "2022-08-11"
description: "There are a lot of authentication solutions out there including Supabase's built in Auth solution, but, here are a couple of reasons why you might want to SuperTokens to protect your Supabase App."
cover: "TODO.png"
category: "featured"
author: "SuperTokens Team"
---

So you're creating a web app and have decided to use Supabase to manage your data. You are now faced with the decision of how you want to implement authentication.

Supabase comes with it's only solution which is a fork of [Netlify's goTrue](https://supabase.com/docs/learn/auth-deep-dive/auth-gotrue) and is great if you want an out of the box solution with email-password or social login, but, as soon as you need a custom flow or have a custom requirement you are going to run into issues.

So what are the third-party options available which offer the flexibility you need but are easy to use? We actually have a [blog](https://supertokens.com/blog/auth-provider-comparison) which compares some of the most popular solutions out there, but the focus of this blog is on SuperTokens, how it can adapt to accommodate your custom requirements and why it pairs so well with Supabase.

## What is SuperTokens
SuperTokens is an Open Source Authentication solution. They have a managed service but if you prefer to manage your own data you can use their self hosted solution.
SuperTokens unique architecture distinguishes it from the competitors and enables a greater level of and customization. You can learn more about the architecture [here](https://supertokens.com/docs/thirdpartyemailpassword/architecture), but, essentially there are three parts to SuperTokens:
- The Frontend SDK you integrate into your frontend (ReactJs, Angular, Vue...) 
- The Backend SDK you integrate into your backend layer (NodeJs, Python, Go).
- The SuperTokens Core which can be deployed using SuperTokens managed service or you can self host it.

This architecture paired with SuperTokens *"Override"* feature allows you to extend and customize authentication flows very quickly in a stack you are comfortable with.

## Example apps with custom flows
Here are some examples of custom flows we've already built:

### Verify a users email before they enter their password during Sign Up.
Say you have a custom requirement where you want to verify a users ownership of an email before they type in a password during sign up.
- The overall approach can be achieved in the following manner:
    - On first sign up via email, we set a fake, random password against the user's info. This is some unguessable string but is common for all users.
    - The above step allows us to create a new session for the user and go through the email verification flow as usual.
    - Post email verification, we show a UI for the user to set their own password and then call an API which updates their fake password with the new one. 
- Example app with [email verification before entering password during sign up](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-emailverification-then-password-thirdpartyemailpassword).


### Email Verification with OTP
Instead of having the user click a link during email verification, maybe you would like them to enter an OTP.
- This can be achieved in the following manner:
    - Override the Email Verification screen on the frontend to display a custom component which has an input to enter the OTP.
    - On the backend override the Email Verification function which sends the email verification emails to the user to now generate an otp, map it to the user and send it to the users email. You will also need to override the api which validates the email verification link to now check if the OTP sent is valid.
- Example app with [email verification with OTP](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-emailverification-with-otp).

### Login with Phone Password:
In this flow, users create an account using their phone number with a password.
- You can find a full guide on how to implement this authentication strategy in our [example app](https://github.com/supertokens/supertokens-auth-react/tree/master/examples/with-phone-password).

## Other customizations and extensibility options:

Here is a list of possible use cases and how SuperTokens can help you achieve them

- Do you need to migrate your users to SuperTokens, but, have data associated with their userIds? With UserId Mapping you can continue to use these userIds by mapping the SuperTokens userId to the pre-existing userId during migration. Now when pass the pre-existing Id to any SuperTokens APIs, it internally resolve the mapping and make sure that pre-existing id is also returned in the response.

- If your app requires users to sign up with their work related emails or Google workspace associated domains, you can use the SuperTokens email validator functions to enforce the check.

- Add additional form fields to Sign Up or Sign In pages to retrieve more information like the user's name and age.

- Streaming services need to limit the number of active devices associated with an account. If you are building a streaming service you  using the SuperTokens Session recipe.

- Don't like the default email and sms templates? Create your own email and sms content! You can also choose your own delivery methods if you don't want to use the default service.

These are just some of the use cases that SuperTokens supports. If you have a custom requirement feel free to join our [discord](https://supertokens.com/discord). We are really passionate about Auth and would love to discuss your use case.

## Integrating SuperTokens into Supabase:

So why does SuperTokens pair so well with Supabase? Well one of Supabase's key features is Row Level Security. A feature that allows you to create powerful Authorization polices to suit your business requirements. We provide a [full guide](https://supabase.com/docs/guides/integrations/supertokens) on how to integrate SuperTokens with Supabase and leverage RLS to only allow authorized users to access their own data.

## Conclusion

In the end the authentication solution you choose depends on your use case. For example if don't have a backend you cant use SuperTokens(since SuperTokens architecture requires you to have a backend) and you will be better served using Supabase's own auth solution, but, if you fit SuperTokens requirements and require the flexibility you should look into SuperTokens. 
