---
title: Adding social login to your website with SuperTokens (custom UI only)
date: "2022-01-26"
description: "This blog walks you through integrating your frontend with social login APIs provided by SuperTokens."
cover: "adding-social-login-to-your-website-with-supertokens.png"
category: "programming"
author: "Rishabh Poddar"
---

This tutorial walks you through building your own social login UI using SuperTokens.

> Note, that it’s only meant for users who are building their own frontend and are building a website. This blog is not meant for users using our pre-built UI.

To start off, you want to make sure that you have finished the frontend and backend quick setup guides for [the recipe](https://supertokens.com/docs/community/recipes) that you have chosen.

As of this writing, that’s either:
- [ThirdParty recipe](https://supertokens.com/docs/thirdparty/introduction) (only social login)
- [ThirdPartyEmailPassword recipe](https://supertokens.com/docs/thirdpartyemailpassword/introduction) (social + email password login)

**For ease of explanation, we will assume the following:**

We want to implement sign in with GitHub
- Your website domain is `http://localhost:3000`
- Your API domain is `http://localhost:3001`
- You have chosen the default `apiBasePath` and `websiteBasePath` (`/auth` in both the cases)
- You want to implement the **thirdpartyemailpassword** recipe.
- The authorisation redirect URL set on the GitHub dashboard is `http://localhost:3000/auth/callback/github`.
- We will be using the [supertokens-web-js SDK](https://github.com/supertokens/supertokens-web-js), so we assume that you have initilaised that in your app already (as shown in the recipe setup guide)

On a high level, there are two steps to the flow:
- When the user clicks on the `Sign in with GitHub` button, you want to fetch the GitHub redirect URL and redirect the user to that page. This is where the user will interact with GitHub to enter their credentials.
- When GitHub redirects the user back to your app, you want to use the (one time use) auth code issued by Github to sign in / sign up the user.

### Step 1

When the user clicks on `Sign in with GitHub` button, you want to call the following function using the `supertokens-web-js` SDK

```js
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword"

async function loginWithGitHubClicked() {
  let githubAuthURL = await ThirdPartyEmailPassword.getAuthorisationURLWithQueryParamsAndSetState({
    authorisationURL: "http://localhost:3000/auth/callback/github",
    providerId: "github"
  })

  // an example value of githubAuthURL is
  // https://github.com/login/oauth/authorize?scope=read%3Auser+user%3Aemail&client_id=21d82062d1f35b68e66c

  // we redirect the user to sign in with github
  window.location.href = githubAuthURL
}
```

The URL returned in the response of calling `getAuthorisationURLWithQueryParamsAndSetState` is where you will redirect your user to.

### Step 2

When the user is navigated back to your app (from GitHub), the URL will contain a `code` query param (on successful login), like this:

`http://localhost:3000/auth/callback/github?code=3cf143e0af0f1bed8d34`

First, you want to create a page on your frontend app which will handle this route (`/auth/callback/github`). On this page, you want to show a loading spinner, and call the following function from our SDK:

```js
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword"

async function consumeAuthCodeAndLoginUser() {
  let result = await ThirdPartyEmailPassword.thirdPartySignInAndUp();

  if (result.status === "OK") {
    if (result.createdNewUser) {
      // user sign up
    } else {
      // user sign in
    }
  } else {
    // TODO: this means that the user does not have
    // an email associated with their GitHub account.
    // Ask them to sign in using another method.
  }
}
```

When we call the `thirdPartySignInAndUp` function, it extracts the `code` from the query params and sends it to the backend. The backend then exchanges that code with Github to get the user's information and create a new session.

## Where are the session tokens?

From inspecting the `result` variable from the above code snippet, we don’t see an access token / JWT in the response body - so where are they?

SuperTokens issues session cookies that get sent via the `Set-Cookie` header in the API response and is automatically handled by the browser.

![Set-Cookie Header](./set-cookie-header.png)

Furthermore, our frontend SDK handles these session tokens for you automatically:

- Automatic refresh of session
- Automatic injection of the access token for your API calls
- Provides a `signOut` function

These features are a part of the session recipe that you initialized when following the quick setup guide.

## Conclusion

We have seen how to integrate your custom UI with the social login functions exposed by SuperToken’s frontend SDK. Furthermore, we see that on successful login, we are issued cookie based session tokens which are handled automatically by SuperTokens.
