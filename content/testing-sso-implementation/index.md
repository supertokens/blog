---
title: Testing SSO Implementation
date: "2023-04-17"
description: "A guide into single sign-on implementation and how to perform sso testing for authentication and login"
cover: "sso_implementation_banner.png"
category: "programming"
author: "Advait Ruia"
---

One of the biggest causes of attrition in the conversion funnel is user registration. As little as one in fifty website visitors take the time to input their email, username, and create a new password to register. That’s a 2% conversion rate. 

Single Sign-On (SSO), such as Sign In with Google or Facebook, reduces the time it takes for a user to experience a product to just a few clicks and less than 10 seconds. It leads to a better user experience and establishes a higher level of trust. 

Yet, ensuring that SSO systems are stable is quite the challenge.

The SSO provider can change design or APIs without informing application developers. Or, the language between application and SSO screen can be out of sync. Or, the provider could be performing some AB testing or display different UIs based on region. Or, the provider could rate limit login attempts and mess up unit tests that occur one after another. 

All of these intricacies make SSO more tricky than the SSO provider’s description of just adding a few lines of code. In this piece, we’ll walk through a couple of ways of testing an SSO implementation.

## Manual testing for SSO

For the most part, SSO implementation is straightforward.

Most SSO providers are incentivized to streamline the developer experience. However, when it comes to testing SSO implementations, these providers have their own custom tooling and little support for automated testing. For example, Google has a special [Linking OAuth Tutorial](https://developers.google.com/identity/account-linking/gal-validation-tool) with a [demo](https://gal-demo.withgoogle.com) attached. Facebook lists out [all the various steps](https://developers.facebook.com/docs/facebook-login/guides/test) that a developer should try after implementing Facebook SSO. 

Because of this lack of support, a lot of SSO testing cannot be automated and instead need to be tested manually.

### Login Flow

The first thing to test is the login flow. Does inputting the right credentials on the SSO provider page result in a successful login? What about incorrect credentials?

### Linking Accounts

The ideal case for user behavior is that they sign up using SSO and keep logging in through SSO. However, the real world is messy. A user might decide to sign up through email/password authentication and then try to log-in through the SSO. An application will need to link the two login methods and show the user the same account information. For example, a user logging onto Discord expects the same message history whether they log in through Google or manually. 

### Changing of emails in the provider’s site

Say a user signs into an application with Facebook. Then, they change the email associated with their Facebook account. If the application is identifying the user based on the email, then this change will break the user account. Instead, the application should identify the user based on the SSO provider’s userID, and update the user’s email in the app when they update the email on the social provider. 

### Error states

One possibility is that the user clicks the back button on the provider page or exits the SSO provider popup without providing any credentials. The SSO provider would then respond back to the application with an incorrect state, an error param, or without any state at all. In these cases, the application needs to display corresponding messages to guide the user.  

### Incorrect permissions

A key benefit of Single Sign-On is that an application can obtain information about the user from the SSO provider. Since this closely couples a user’s privacy, SSO providers generally give users the option to share such information. In a case where users don’t grant certain permissions, an application needs to either request the permissions again or handle this edge case. 

### Login CSRF protection

When the provider redirects the user back to the application, the application needs to check that the state query param in the callback URL is the same as what was generated before the user is navigated to the provider’s website. This is to prevent login CSRF attacks wherein an attacker can generate a valid callback url for their login and send that to a user. When the user clicks on the link, if a state check does not happen, they would be logged in to the attacker’s account, and this way, an attacker would be able to spy on what the user does.

## Considerations for Specific SSO’s

Beyond basic test cases, there are plenty of edge cases. In the following sections, we'll work through a non-exhaustive list of tips and tricks for SSO. 

### Salesforce

SSO systems derive their value from the applications connect with. Let’s try integrating with Salesforce, one of the most common applications for any company with SSO. Salesforces supports both [SAML and OpenID Connect](https://help.salesforce.com/s/articleView?id=sf.sso_use_cases.htm&type=5).

To do test our connection, we’ll install the [simple_salesforce](https://pypi.org/project/simple-salesforce/) python package to simplify the testing process. Before we start testing, we must ensure that the internal Salesforce settings are correct, including configuring Salesforce as the authentication providers:

```python
from simple_salesforce import Salesforce

def test_salesforce_integration(): 
	sf = Salesforce(username='TEST@EMAIL.COM', password='TEST_PASSWORD', consumer_key='CONSUMER_KEY', consumer_secret='CONSUMER_SECRET')
```

Authorization URL

One test is to ensure that the authorization URL generated by the application contains the right scopes, `client_id`, and `redirect_uri`. Of particular importance is the `redirect_uri` where SSO providers deliver the auth code token.

## Conclusion

At the end of the day, SSO shines not just as a security feature, but as a growth lever as well - reducing onboarding time and building user confidence.

With SuperTokens, SSO is super easy — in fact, we’ve done all the heavy lifting for you. With all the necessary API calls abstracted away, and you can simply drag and drop our open-source auth solution into place.

See our docs to implement SSO in [just five minutes](https://supertokens.com/docs/thirdpartypasswordless/custom-ui/thirdparty-login)!