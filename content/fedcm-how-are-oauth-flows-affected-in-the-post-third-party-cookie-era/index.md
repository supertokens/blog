---
title: "FedCM and how OAuth Flows are affected in the Post-Third-Party Cookie Era"
date: "2024-03-20"
description: "Third Party Cookies have been synonymous with user tracking and privacy issues. In 2021 Google put forth a plan to retire third party cookies from chromium based browsers and put for the FedCM APIs. In this blog we will be discussing this change and what it means for traditional OAuth flows."
cover: "todo.png"
category: "programming"
author: "Joel Coutinho"
---

### Introduction

Federated identity has been a game changer in the authentication space. With increased security, smoother onboarding, and greater conversions it has been the most popular auth choice for applications. Although there are several methods to enable federated identity, the OAuth protocol has risen to be the most popular. In 2022, the Privacy Sandbox Team, created by Google to protect people's privacy online, issued an [announcement](https://blog.google/products/chrome/update-testing-privacy-sandbox-web/) stating the release and testing of new privacy-focused APIs with the eventual goal of retiring third-party cookies from Chrome by 2024. Why did they do this? How will cookies be accessed for different domains? How does this affect OAuth? In this blog, we explore these questions and more.


### What are third-party cookies?

A cookie is some information that a website can store on a user's computer. Websites use cookies for session management and personalization. Third-party cookies though are set by domains other than the domain the user is currently on. For example, when you are browsing a website and interacting with an embedded video or an advertisement the external domain will set some third-party cookies. The issue that arises is that services use third-party cookies to track user activity across websites to serve targeted ads based on their browsing and search history. This raises several privacy concerns and is the main impetus behind Google’s decision to retire third-party cookies.


### The Impact on the OAuth Protocol

OAuth traditionally performs a full page redirect to the Identity Provider’s domain and accesses session cookies if they exist or allow the user to sign in. This flow is unaffected by the third-party cookie change. Some applications like google one-tap, however, want to achieve a more organic flow and allow the users to sign in without being redirected. They achieve this using an iframe and access third-party cookies to check if the user has a valid session.

![google one tap](./google-one-tap.gif)

Since the user is technically not redirected to a different domain, third-party cookies have to be used to facilitate the authentication, and it is this flow that is affected by third-party cookies being retired.


## Introducing FedCM

The Federated Consent Management (FedCM) APIs, are a solution designed to address the limitations of third-party cookies in effected OAuth flows. FedCM enables more private sign-in flows without requiring the use of third-party cookies. The browser controls user settings, displays user prompts, and only contacts an Identity Provider like Google, Facebook, or Github after explicit user consent is given.

## Supporting FedCM: How Identity Providers Can Adapt

There are two steps to becoming FedCM compatible:

- Identity provider integration
  - This would be an Identity provider like Google, Facebook, or Github that wants to be compliant with FedCM.
- Client integration changes
  - Frontend libraries will also need to be updated to support the FedCM flow. In Google’s case that would be the Google one-tap SDK.


### Step 1: Identity Provider Integration

To integrate with FedCM, an Identity Provider needs to do the following:

A. Provide a well-known file to identify the Identity Provider.
B. Provide a config file and endpoints for accounts list and assertion issuance (and optionally, client metadata).
C. Update its login status using the Login Status API.



#### A. Provide a well-known file to identify the Identity Provider.

There is a potential privacy issue whereby an Identity Provider is able to discern whether a user visited without explicit consent. This has tracking implications, so an Identity Provider is required to provide a well-known file to verify its identity and mitigate this issue.

The well-known file is requested via a GET request, which doesn't follow redirects. This effectively prevents the Identity Provider from learning who made the request and which the client is attempting to connect.

The well-known file must be served from the eTLD+1 of the Identity Provider at /.well-known/web-identity. For example, if the Identity Provider endpoints are served under https://accounts.idenity-provider.example/, they must serve a well-known file at https://idenity-provider.example/.well-known/web-identity. The well-known file's content should have the following JSON structure:

```
{
  "provider_urls": ["https://accounts.idenity-provider.example/config.json"]
}
```


For example, Google’s well-known file can be found at https://www.google.com/.well-known/web-identity

And it serves the following file:

```
{
  "provider_urls": [
    "https://accounts.google.com/gsi/fedcm.json"
  ]
}
```

B. Provide a config file and endpoints for accounts list and assertion issuance (and optionally, client metadata).

- The Identity provider config file lists the endpoints the browser needs to process the identity federation flow and manage the sign-ins.

- The config file (hosted at https://accounts.identity-provider.example/config.json in our example) should have the following JSON structure:


```
{
  "accounts_endpoint": "/accounts.php",
  "client_metadata_endpoint": "/client_metadata.php",
  "id_assertion_endpoint": "/assertion.php",
  "login_url": "/login",
  "branding": {
    "background_color": "green",
    "color": "0xFFEEAA",
    "icons": [
      {
        "url": "https://Identity Provider.example/icon.ico",
        "size": 25
      }
    ]
  }
}
```

As an example, Google's config looks like the following:

```
{
  "idtoken_endpoint": "https://accounts.google.com/gsi/fedcm/issue",
  "id_token_endpoint": "https://accounts.google.com/gsi/fedcm/issue",
  "id_assertion_endpoint": "https://accounts.google.com/gsi/fedcm/issue",
  "accounts_endpoint": "https://accounts.google.com/gsi/fedcm/listaccounts",
  "client_metadata_endpoint": "https://accounts.google.com/gsi/fedcm/clientmetadata",
  "client_id_metadata_endpoint": "https://accounts.google.com/gsi/fedcm/clientmetadata",
  "signin_url": "https://accounts.google.com/gsi/fedcm/signin",
  "login_url": "https://accounts.google.com/gsi/fedcm/signin",
  "revocation_endpoint": "https://accounts.google.com/gsi/fedcm/revoke",
  "disconnect_endpoint": "https://accounts.google.com/gsi/fedcm/revoke",
  "supports_add_account": true,
  "modes": {
    "button": {
      "supports_use_other_account": true
    },
    "widget": {
      "supports_use_other_account": false
    }
  },
  "branding": {
    "background_color": "#1a73e8",
    "color": "#fff",
    "icons": [
      {
        "url": "https://accounts.google.com/gsi-static/google-logo.png"
      }
    ]
  }
}

```

#### C. Login status using the Login Status API

The Login Status API allows an Identity Provider to inform a browser of its login (sign-in) status in that particular browser, i.e. whether any users are logged into the Identity Provider on the current browser or not.

For each known Identity Provider (identified by its config URL) the browser keeps a tri-state variable representing the login state with three possible values:

"logged-in": The Identity Provider has at least one user account signed in. 
"logged-out": All Identity Provider accounts are currently signed out.
"unknown": The sign-in status of this Identity Provider is not known. This is the default value.

If the login status is "logged-in", a request is made to the IdP's accounts list endpoint, and available accounts for sign-in are displayed to the user in the browser-provided FedCM dialog.

If the login status is "logged-out", the promise returned by the FedCM get() request rejected without making a request to the accounts list endpoint. In such a case it is up to the developer to handle the flow, for example by prompting the user to go and sign in to a suitable IdP.

If the login status is "unknown", a request is made to the IdP's accounts list endpoint and the login status is updated depending on the response:
If the endpoint returns a list of available accounts for sign-in, update the status to "logged-in" and display the sign-in options to the user in the browser-provided FedCM dialog.
If the endpoint returns no accounts, update the status to "logged-out"; the promise returned by the FedCM get() request then rejects.
