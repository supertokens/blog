---
title: "FedCM and how OAuth Flows are affected in the Post-Third-Party Cookie Era"
date: "2024-03-20"
description: "Third Party Cookies have been synonymous with user tracking and privacy issues. In 2021 Google put forth a plan to retire third party cookies from chromium based browsers and put for the FedCM APIs. In this blog we will be discussing this change and what it means for traditional OAuth flows."
cover: "fedcm.png"
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

**"logged-in"**: The Identity Provider has at least one user account signed in. 
If the login status is "logged-in", a request is made to the IdP's accounts list endpoint, and available accounts for sign-in are displayed to the user in the browser-provided FedCM dialog.

**"logged-out"**: All Identity Provider accounts are currently signed out.
If the login status is "logged-out", the promise returned by the FedCM get() request rejected without making a request to the accounts list endpoint. In such a case it is up to the developer to handle the flow, for example by prompting the user to go and sign in to a suitable IdP.

**"unknown"**: The sign-in status of this Identity Provider is not known. This is the default value.
If the login status is "unknown", a request is made to the IdP's accounts list endpoint and the login status is updated depending on the response:
- If the endpoint returns a list of available accounts for sign-in, update the status to "logged-in" and display the sign-in options to the user in the browser-provided FedCM dialog.
- If the endpoint returns no accounts, update the status to "logged-out"; the promise returned by the FedCM get() request then rejects.


### Step 2: Client Integration Changes

For clients that use the SDKs provided by identity providers like [Google one-tap](https://developers.google.com/identity/gsi/web/guides/display-google-one-tap), there should be no explicit requirements apart from updating to the latest version. If you manually want to interact with the FedCM APIs, here is what you need to do.

#### Using the Credentials Manager API to get federated credentials

Using the [navigator.credentials.get()](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get) function, you can request a user to sign in to the client with an existing Identity Provider account that is already signed into the browser. This function takes an `identity` option where the details of the Identity Provider can be configured. 

Example:

```
async function signIn() {
  const identityCredential = await navigator.credentials.get({
    identity: {
      context: "signup",
      providers: [
        {
          configURL: "https://accounts.idp.example/config.json",
          clientId: "********",
          nonce: "******",
          loginHint: "user1@example.com",
        },
      ],
    },
  });
}
```


If the user identity is successfully validated by the Identity Provider, an `IdentityCredential` object is returned. This object contains a token that includes user identity information that has been signed with the Identity Provider’s digital certificate.

You can then send the token to the server to validate the certificate, and on success can use the (now trusted) identity information in the token to sign them into their service (starting a new session), sign them up to their service if they are a new user, etc.


If the user has never signed into the Identity Provider or is logged out, the get() method rejects with an error and you can direct the user to the Identity Provider login page to sign in or create an account.

This is the typical flow:

![FedCM flow](./fedcm-flow.png)

- The client calls the navigator.credentials.get() function to start the sign-in flow.
- The browser requests two files from the configURL provided in the get() call:
  - The well known file (/.well-known/web-identity), available from /.well-known/web-identity at the eTLD+1 of the configURL.
  - The Identity providers config file (/config.json), available at the configURL
- The browser validates the configURL passed in the get() request against the list of valid config URLs inside the well-known file.
- If the browser has the Identity Provider's login status set to "logged-in", it makes a credentialed request (i.e. with a cookie that identifies the user that is signed in) to the `accounts_endpoint` inside the Identity Providers config file for the user's account details. The request is sent without the `client_id` parameter or the `Origin` header and prevents the Identity Provider from learning which client the user is trying to sign in to. As a result, the list of accounts returned is client agnostic.
- The Identity provider responds with the account information requested from the `accounts_endpoint``. This is an array of all accounts associated with the user's Identity Provider cookies for any clients associated with the Identity Provider.
- The browser uses the information obtained by the previous two requests to create the UI asking the user to choose an account to sign in to the client with (in the case where there is more than one available).
- If the user grants permission to do so, the browser makes a credentialed request to the `id_assertion_endpoint` to request a validation token from the Identity Provider for the selected account.
- When the flow is complete, the get() promise resolves with an `IdentityCredential` object, which provides further client functionality. Most notably, this object contains a token that the client can verify comes from the Identity Provider (using a certificate) and that contains trusted information about the signed in user. Once the Client validates the token, they can use the contained information to sign the user in and start a new session, sign them up to their service, etc. The format and structure of the token depends on the Identity Provider and has nothing to do with the FedCM API (the Client needs to follow the Identity Provider's instructions).

For additional information on how FedCM works, you can take a look at the [official documentation](https://developer.mozilla.org/en-US/docs/Web/API/FedCM_API).


## Conclusion
The main question at the end of this is whether or not Identity Providers should become FedCM compliant. Although FedCM is still in it's nascent stage of development and Google has mainly rolled out these changes to ensure Google one tap still works, it's important to keep eyes on it. FedCM is not a web standard yet and is not compatible with SAML or OpenID connect in it's current iteration. It is also quite hard. But as browser privacy laws change Identity Providers may have to become compliant if FedCM becomes the defacto method for Federated Identity.
