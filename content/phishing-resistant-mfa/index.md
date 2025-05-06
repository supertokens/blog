---
title: "Implementing Phishing-Resistant MFA: Hands-On Developer Guide"
description: "Learn how to implement phishing-resistant MFA with FIDO2, WebAuthn, and SuperTokens. Step-by-step tutorial for secure, developer-friendly authentication."
date: "2025-05-06"
cover: "Implementing-Phishing-Resistant-MFA.png"
category: "programming, mfa"
author: "Maurice Saldivar"
---

## Why Traditional Multi-Factor Authentication (MFA) Is No Longer Enough 

Multi-factor authentication has become a standard security recommendation, but not all MFA implementations are created equal. Traditional MFA methods, despite adding a security layer beyond passwords, contain critical vulnerabilities that sophisticated attackers regularly exploit. Traditional MFA methods \- SMS codes, authenticator apps with time-based one-time passwords (TOTPs), and even email verification have proven vulnerable to sophisticated phishing attacks.

## Why Traditional MFA Fails

### SIM Swapping: When Your Phone Number Betrays You

This attack occurs when bad actors convince mobile carriers to transfer a victim's phone number to a device they control. Once successful, they can intercept SMS-based verification codes meant for the legitimate user. This isn't some obscure practice either, in 2022 CEO of Transform Ventures Michael Terpin [won a $75 million lawsuit against a SIM-swapping perpetrator who stole millions in digital assets](https://commsrisk.com/the-story-of-a-24mn-sim-swap/) by hijacking his phone number. More information can be found on our dedicated [SIM Swapping Post](https://supertokens.com/blog/sim-swapping).  

### Phishing For Credentials 

Even app-based authenticators like Google Authenticator or Authy can be compromised through well-crafted phishing campaigns. In 2023, the MGM Resorts cyberattack caused [an estimated $100 million in damages](https://thrivedx.com/resources/article/investigating-the-mgm-cyberattack-how-social-engineering-and-a-help-desk-put-the-whole-strip-at-risk) despite having MFA in place. A group of bad actors used social engineering to manipulate MGM help desk employees into resetting MFA settings, granting them access to terabytes of data.

### Social Engineering: Exploiting the Human

Human psychology remains the weakest link in security systems. The widely documented "0ktapus" campaign [successfully targeted over 130 organizations](https://group-ib.com/blog/0ktapus/), as reported by cybersecurity firm Group-IB, would target employees with convincing Okta login pages to steal credentials in real time. Victims who clicked the links and entered their credentials and MFA codes inadvertently gave attackers access to their corporate accounts, leading to significant data breaches at companies like Twilio and Cloudflare. Cloudflare's [own security incident report](https://blog.cloudflare.com/2022-07-sms-phishing-attacks/) noted that employees using FIDO2-based hardware security keys remained protected while those using push notifications were compromised. 

## What Makes MFA Phishing-Resistant?

The core issue? These methods rely on shared secrets that can be intercepted or stolen. Phishing-resistant MFA eliminates reliance on shared secrets by leveraging asymmetric cryptography and binding authentication to specific origins (websites). This fundamentally changes the security model:

* Authentication is bound to specific domains, preventing credential reuse across different sites  
* Private keys never leave the user's device  
* Biometric or physical presence verification ensures the legitimate user is present

In this guide, we'll implement a bulletproof phishing-resistant MFA system using SuperTokens, WebAuthn, and FIDO2 standards. This approach not only strengthens security but also improves user experience by reducing friction.

### Why WebAuthn? 

Phishing remains one of the most effective attack vectors against traditional authentication. WebAuthn counters this by binding authentication directly to the user's device through public-key cryptography. When users register with WebAuthn, their device generates a unique key pair for that service. The private key never leaves the device, while the public key is stored on the server. During authentication, the server sends a challenge only the correct private key can sign.

The critical phishing protection comes from origin binding \- the browser ensures authentication requests can only come from the exact domain that registered the credential. Even perfect site clones at different URLs will fail because the origins don't match. For developers, this means implementing authentication that protects users regardless of their susceptibility to phishing attempts.

### How WebAuthn works

WebAuthn creates a secure authentication framework built on asymmetric cryptography. Instead of storing shared secrets like passwords on servers, it employs public-private key pairs. When users register their device generates these unique keys - the private key remains secured on the device while the public key is stored on the server.The absence of passwords eliminates common vulnerabilities like credential stuffing, password spraying, and database breaches. There's simply no password to steal, reuse, or crack, removing entire categories of attacks from consideration.

User verification happens locally on the device through either biometrics (fingerprints, facial recognition) or hardware security keys. This verification proves the legitimate user is present without transmitting biometric data to the server. The local device handles all sensitive verification, then cryptographically signs the authentication challenge using the private key only after successful verification.

## Prerequisites – What You Need to Get Started

Before diving into implementation, ensure you have:

* SuperTokens Core and a backend sdk installed (we'll cover a quick setup if you haven't)  
* A WebAuthn-supported browser (Chrome, Firefox, Edge, Safari all have excellent support)  
* A FIDO2 security key (YubiKey, SoloKey) or device with built-in biometric authentication (Windows Hello, Face ID, Touch ID)  
* A basic web application (we'll use React/Node.js, but the concepts apply to other stacks)


Let's get started with a robust implementation that will protect your users from even the most sophisticated phishing attempts.

## **Step 1 – Setting Up SuperTokens for Authentication**

* Installing SuperTokens Core and Backend SDK. More details about the Core service and SDKs can be found at the Supertokens docs \- [here](https://supertokens.com/docs/quickstart/introduction)

  `npx create-supertokens-app@latest --recipe=emailpassword`

* Once everything has finished installing `cd` into the new project directory and run `npm start`. Visit [`http://localhost:3000/auth`](http://localhost:3000) in your browser to see the demo app working. 

## **Step 2 – Enabling WebAuthn for Passwordless, Phishing-Resistant MFA**

### Implementation

Note: Any project structure is based on the used cli command from above

We’ll be using the WebAuthn Recipe, [more information at the quickstart guide](https://supertokens.com/docs/authentication/passkeys/initial-setup). First update the frontend, find the `config.tsx` file located in `/frontend/src/config.tsx`. 

* Import `WebAuthn` from the recipe  
* Update the `recipeList` for `SuperTokensConfig`  
* Update the `PreBuiltUIList` to include `WebauthnPreBuiltUI`

You're file should look like the following:



Frontend `config.tsx`

```javascript

import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

import WebAuthn from "supertokens-auth-react/recipe/webauthn"; // passkeys
import { WebauthnPreBuiltUI } from 'supertokens-auth-react/recipe/webauthn/prebuiltui'; // passkeys


export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        WebAuthn.init(),
        Session.init()
    ],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/dashboard";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [
    EmailPasswordPreBuiltUI,
    WebauthnPreBuiltUI,
];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};
```


Now we’ll update the backend. Find the `config.ts` file located in `/backend/config.ts`, and Import WebAuthn from the recipe


```javascript

import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";

import WebAuthn from "supertokens-node/recipe/webauthn"; // enables passkeys


export function getApiDomain() {
    const apiPort = process.env.VITE_APP_API_PORT || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    framework: "koa",
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://try.supertokens.com",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "SuperTokens Koa demo app",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    recipeList: [
        EmailPassword.init(),
        WebAuthn.init(),
        Session.init(), 
        Dashboard.init(), 
        UserRoles.init()
    ],
};
```


Navigate to http://localhost:3000/auth you’ll see a new option to use the passkey as an auth option


## Enforcing Phishing-Resistant MFA Policies

To enable mfa we’ll use the [MFA recipe](https://supertokens.com/docs/additional-verification/mfa/initial-setup) to require multi-factor authentication, currently mfa has the support for Email/SMS One-Time Password (OTP) or Time-based One-Time Password (TOTP). Just like above we'll be adding recipes to both the front and backend config files. 

Frontend adding mfa config.tsx

```javascript

import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

import WebAuthn from "supertokens-auth-react/recipe/webauthn"; // passkeys
import { WebauthnPreBuiltUI } from 'supertokens-auth-react/recipe/webauthn/prebuiltui'; // passkeys

// mfa
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import TOTP from "supertokens-auth-react/recipe/totp";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        WebAuthn.init(),
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
        }),
        MultiFactorAuth.init({ 
            firstFactors: ["webauthn", "emailpassword"]
        }),
        TOTP.init(),
        Session.init()
    ],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/dashboard";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [
    EmailPasswordPreBuiltUI,
    WebauthnPreBuiltUI,
    PasswordlessPreBuiltUI,
    MultiFactorAuthPreBuiltUI,
    TOTPPreBuiltUI
];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};


```

Backend adding mfa `config.tsx`

```javascript
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";

import WebAuthn from "supertokens-node/recipe/webauthn"; // enables passkeys

// mfa imports
import AccountLinking from "supertokens-node/recipe/accountlinking";
import MultiFactorAuth from "supertokens-node/recipe/multifactorauth";
import TOTP from "supertokens-node/recipe/totp";
import Passwordless from "supertokens-node/recipe/passwordless";

export function getApiDomain() {
    const apiPort = process.env.VITE_APP_API_PORT || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    framework: "koa",
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://try.supertokens.com",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "SuperTokens Koa demo app",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    recipeList: [
        EmailPassword.init(),
        WebAuthn.init(),
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
            flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
        }),
        AccountLinking.init({
            shouldDoAutomaticAccountLinking: async (newAccountInfo: AccountInfoWithRecipeId & { recipeUserId?: RecipeUserId }, user: User | undefined, session: SessionContainerInterface | undefined, tenantId: string, userContext: UserContext) => {
                if (session === undefined) {
                    // we do not want to do first factor account linking by default. To enable that,
                    // please see the automatic account linking docs in the recipe docs for your first factor.
                    return {
                        shouldAutomaticallyLink: false
                    };
                }
                if (user === undefined || session.getUserId() === user.id) {
                    // if it comes here, it means that a session exists, and we are trying to link the 
                    // newAccountInfo to the session user, which means it's an MFA flow, so we enable 
                    // linking here.
                    return {
                        shouldAutomaticallyLink: true,
                        shouldRequireVerification: false
                    }
                }
                return {
                    shouldAutomaticallyLink: false
                };
            }
        }),
        MultiFactorAuth.init({
            firstFactors: ["webauthn", "emailpassword"],
            override: {
                functions: (oI) => ({
                    ...oI,
                    getMFARequirementsForAuth: () => [
                        {
                            oneOf: [
                                MultiFactorAuth.FactorIds.TOTP,
                                MultiFactorAuth.FactorIds.OTP_EMAIL,
                                MultiFactorAuth.FactorIds.OTP_PHONE,
                            ],
                        },
                    ],
                }),
            },
        }),
        TOTP.init(),
        Session.init(), 
        Dashboard.init(), 
        UserRoles.init()
    ],
};


```

## Testing Your MFA Implementation

### Unit Tests
Let's add some unit tests to test the flow - Sign up, Session verification, Refreshing session tokens, and Logout. Create a test directory in the backend `/backend/__tests__`

Backend `auth-flow.test.ts`

```javascript

import SuperTokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { SessionContainerInterface } from 'supertokens-node/recipe/session/types';
import { User } from 'supertokens-node/types';

// Mock dependencies
jest.mock('supertokens-node', () => ({
  init: jest.fn(),
}));

jest.mock('supertokens-node/recipe/emailpassword', () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('supertokens-node/recipe/session', () => ({
  createNewSession: jest.fn(),
  getSession: jest.fn(),
  revokeAllSessionsForUser: jest.fn(),
}));

describe('Authentication Flow Tests', () => {
  // Comprehensive mock user data
  const mockUser: User = {
    id: 'test_st',
    emails: ['test@example.com'],
    timeJoined: Date.now(),
    isPrimaryUser: true,
    tenantIds: ['default'],
    phoneNumbers: [],
    thirdParty: null,
    loginMethods: [],
    webauthn: {
      credentialIds: ['mock-credential-id'],
    },
    toJson: () => ({
      id: 'test_st',
      emails: ['test@example.com'],
    }),
  };

  // Mock session container
  const createMockSessionContainer = (userId: string): SessionContainerInterface => ({
    revokeSession: jest.fn(),
    getSessionDataFromDatabase: jest.fn(),
    updateSessionDataInDatabase: jest.fn(),
    getUserId: () => userId,
    getAccessToken: () => 'mock-access-token',
    getHandle: () => 'mock-session-handle',
    getRecipeUserId: jest.fn().mockReturnValue({ getAsString: () => userId }),
    getTenantId: jest.fn().mockReturnValue('default'),
    getAccessTokenPayload: jest.fn().mockReturnValue({}),
    getAllSessionTokensDangerously: jest.fn().mockReturnValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }),
    mergeIntoAccessTokenPayload: jest.fn(),
    getTimeCreated: jest.fn().mockReturnValue(Date.now()),
    getExpiry: jest.fn().mockReturnValue(Date.now() + 3600000),
    assertClaims: jest.fn(),
    
    // Adding missing methods with mock implementations
    fetchAndSetClaim: jest.fn(),
    setClaimValue: jest.fn(),
    getClaimValue: jest.fn(),
    removeClaim: jest.fn(),
    attachToRequestResponse: jest.fn(),
  });

  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Utility function to create sign up/in response
  const createSuccessResponse = () => ({
    status: "OK" as const,
    user: mockUser,
    recipeUserId: {
      getAsString: () => mockUser.id,
    },
  });

  // Test 1: Sign Up
  test('should successfully sign up a new user', async () => {
    // Arrange
    const mockSignUpResponse = createSuccessResponse();
    const mockAlreadyExistsResponse = { 
      status: "EMAIL_ALREADY_EXISTS_ERROR" as const 
    };

    (EmailPassword.signUp as jest.Mock)
      .mockImplementation((tenantId, email, password) => {
        if (email === 'test@example.com') {
          return Promise.resolve(mockSignUpResponse);
        }
        if (email === 'existing@example.com') {
          return Promise.resolve(mockAlreadyExistsResponse);
        }
        throw new Error('Unexpected email');
      });

    const mockSession = createMockSessionContainer(mockUser.id);
    (Session.createNewSession as jest.Mock).mockResolvedValue(mockSession);

    // Act
    const signUpResult = await EmailPassword.signUp(
      'tenant-id', 
      'test@example.com', 
      'Test123!'
    );

    // Assert
    expect(signUpResult).toEqual(expect.objectContaining({
      status: "OK",
      user: expect.objectContaining({
        emails: expect.arrayContaining(['test@example.com'])
      })
    }));

    // Try signing up with existing email
    const existingEmailResult = await EmailPassword.signUp(
      'tenant-id', 
      'existing@example.com', 
      'Test123!'
    );

    expect(existingEmailResult).toEqual({
      status: "EMAIL_ALREADY_EXISTS_ERROR"
    });
  });

  // Test 2: Session Verification
  test('should get user session', async () => {
    // Arrange
    const mockSession = createMockSessionContainer(mockUser.id);

    (Session.getSession as jest.Mock).mockResolvedValue(mockSession);

    // Act
    const sessionResult = await Session.getSession(
      {} as any,  // req
      {} as any,  // res
      {}  // options
    );

    // Assert
    expect(sessionResult.getUserId()).toBe(mockUser.id);
    expect(Session.getSession).toHaveBeenCalled();
  });

  // Test 3: Revoking Sessions
  test('should revoke all sessions for a user', async () => {
    // Arrange
    const mockRevokeResponse: string[] = [mockUser.id];

    (Session.revokeAllSessionsForUser as jest.Mock).mockResolvedValue(mockRevokeResponse);

    // Act
    const revokeResult = await Session.revokeAllSessionsForUser(mockUser.id);

    // Assert
    expect(revokeResult).toEqual([mockUser.id]);
    expect(Session.revokeAllSessionsForUser).toHaveBeenCalledWith(mockUser.id);
  });

  // Test 4: Sign In
  test('should successfully sign in an existing user', async () => {
    // Arrange
    const mockSignInResponse = createSuccessResponse();
    const mockWrongCredentialsResponse = { 
      status: "WRONG_CREDENTIALS_ERROR" as const 
    };

    (EmailPassword.signIn as jest.Mock)
      .mockImplementation((tenantId, email, password) => {
        if (email === 'test@example.com') {
          return Promise.resolve(mockSignInResponse);
        }
        if (email === 'wrong@example.com') {
          return Promise.resolve(mockWrongCredentialsResponse);
        }
        throw new Error('Unexpected email');
      });

    const mockSession = createMockSessionContainer(mockUser.id);
    (Session.createNewSession as jest.Mock).mockResolvedValue(mockSession);

    // Act
    const signInResult = await EmailPassword.signIn(
      'tenant-id', 
      'test@example.com', 
      'Test123!'
    );

    // Assert
    expect(signInResult).toEqual(expect.objectContaining({
      status: "OK",
      user: expect.objectContaining({
        emails: expect.arrayContaining(['test@example.com'])
      })
    }));

    // Try signing in with wrong credentials
    const wrongCredentialsResult = await EmailPassword.signIn(
      'tenant-id', 
      'wrong@example.com', 
      'WrongPass123!'
    );

    expect(wrongCredentialsResult).toEqual({
      status: "WRONG_CREDENTIALS_ERROR"
    });
  });

  // Error Handling Tests
  describe('Error Scenarios', () => {
    test('should handle sign up failure', async () => {
      // Arrange
      const mockError = new Error('Sign up failed');
      
      (EmailPassword.signUp as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(EmailPassword.signUp(
        'tenant-id',
        'test@example.com', 
        'Test123!'
      )).rejects.toThrow('Sign up failed');
    });

    test('should handle session retrieval failure', async () => {
      // Arrange
      const mockError = new Error('Invalid session');
      
      (Session.getSession as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(Session.getSession(
        {} as any,  // req
        {} as any,  // res
        {}  // options
      )).rejects.toThrow('Invalid session');
    });
  });
});
```

Updates also need to be made to the `package.json` to include our test packages and to add the cmd `npm test`

`package.json`

```javascript

{
    "scripts": {
        "start": "npx vite-node ./main.ts",
        "lint": "eslint .",
        "build": "tsc",
        "test": "jest"
    },
    "dependencies": {
        "@koa/cors": "^5.0.0",
        "koa": "^2.15.3",
        "koa-router": "^12.0.0",
        "supertokens-node": "latest",
        "typescript": "^4.7.2"
    },
    "devDependencies": {
        "@eslint/js": "^9.17.0",
        "@types/jest": "^29.5.11",
        "@types/koa__cors": "^4.0.0",
        "@types/koa-router": "^7.4.4",
        "@types/node": "^20.11.0",
        "@types/node-fetch": "^2.6.11",
        "axios": "^1.6.2",
        "eslint": "^9.17.0",
        "globals": "^15.13.0",
        "jest": "^29.7.0",
        "node-fetch": "^2.7.0",
        "qs": "^6.11.2",
        "ts-jest": "^29.1.1",
        "typescript-eslint": "^8.18.1",
        "vite-node": "^2.1.8",
        "jest-mock": "^29.7.0",
        "@types/jest": "^29.5.11"
    }
}


```

Run `npm install` then `npm test` 

It's worth noting the unit tests we added are mocking the api calls. In an enterprise environment ideally there would also be a staging/canary environment that allows full live end-to-end testing for the service. 

### Logging and Metrics

Logging and Metrics are two important aspects every service should have. They help provide a clear picture into your system to better scale infra or track down a loose bug. 

Looking at `/backend/main.ts` we’ll track how many times a user has logged in, maybe this can provide an insight into strange user behavior to keep an eye out for: 

Backend `main.ts`

```javascript

import Koa from "koa";
import cors from "@koa/cors";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/koa";
import { getWebsiteDomain, SuperTokensConfig } from "./config";
import KoaRouter from "koa-router";
import { verifySession } from "supertokens-node/recipe/session/framework/koa";
import { SessionContext } from "supertokens-node/framework/koa";
import Multitenancy from "supertokens-node/recipe/multitenancy";

import { deleteUser } from "supertokens-node";

// basic structures to hold our metrics
interface AuthAttempt {
    time: string;
    userId: string;
    status: string;
}

const authLogs = {
    success: 0,
    recentAttempts: [] as AuthAttempt[]
};

supertokens.init(SuperTokensConfig);

const app = new Koa();

const router = new KoaRouter();

app.use(
    cors({
        origin: getWebsiteDomain(),
        allowHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })
);

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());

// This endpoint can be accessed regardless of
// having a session with SuperTokens
router.get("/hello", (ctx: SessionContext) => {
    ctx.body = "hello";
});

// An example API that requires session verification
router.get("/sessioninfo", verifySession(), (ctx: SessionContext) => {
    const userId = ctx.session!.getUserId();
    
    // Log successful authentication
    authLogs.success++;
    authLogs.recentAttempts.push({
        time: new Date().toISOString(),
        userId,
        status: "success"
    });
    
    ctx.status = 200;
    ctx.body = {
        userId,
        status: "ok",
        authStats: authLogs
    };
});

// This API is used by the frontend to create the tenants drop down when the app loads.
// Depending on your UX, you can remove this API.
router.get("/tenants", async (ctx: SessionContext) => {
    const tenants = await Multitenancy.listAllTenants();
    ctx.body = JSON.stringify({ tenants }, null, 4);
});

app.use(router.routes());

if (!module.parent) app.listen(3001, () => console.log("API Server listening on port 3001"));


```

Each recipe on the frontend `/frontend/src/config.tsx` has a `onHandleEvent` to help log what is currently happening in the system. 

Frontend `config.tsx`

```javascript

import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

import WebAuthn from "supertokens-auth-react/recipe/webauthn"; // passkeys
import { WebauthnPreBuiltUI } from 'supertokens-auth-react/recipe/webauthn/prebuiltui'; // passkeys

// mfa
import MultiFactorAuth from "supertokens-auth-react/recipe/multifactorauth";
import { MultiFactorAuthPreBuiltUI } from "supertokens-auth-react/recipe/multifactorauth/prebuiltui";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import TOTP from "supertokens-auth-react/recipe/totp";
import { TOTPPreBuiltUI } from "supertokens-auth-react/recipe/totp/prebuiltui";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        WebAuthn.init(),
        Passwordless.init({
            contactMethod: "EMAIL_OR_PHONE",
            onHandleEvent: (context) => {
                // Track session events
                if (context.action === "SUCCESS") {
                    if (context.createdNewSession) {
                        let user = context.user;
                        if (context.isNewRecipeUser && context.user.loginMethods.length === 1) {
                            // sign up success
                            console.log("sign up was a success")
                        } else {
                            // sign in success
                            console.log("sign in was a success - no second auth")
                        }
                    } else {
                        // during step up or second factor auth with email password
                        console.log("sign in was a success - second factor auth")
                    }
                }
            }
        }),
        MultiFactorAuth.init({ 
            firstFactors: ["webauthn", "emailpassword"]
        }),
        TOTP.init(),
        Session.init()
    ],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/dashboard";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [
    EmailPasswordPreBuiltUI,
    WebauthnPreBuiltUI,
    PasswordlessPreBuiltUI,
    MultiFactorAuthPreBuiltUI,
    TOTPPreBuiltUI
];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};


```

### How this setup prevents a phishing attack

Traditional authentication methods are vulnerable because they rely on shared secrets that can be intercepted. To illustrate how the WebAuthn implementation protects against these attacks, let's simulate a common phishing scenario and see how our SuperTokens \+ WebAuthn setup renders it ineffective.

In a typical phishing attack targeting traditional MFA:

1. An attacker creates a convincing clone of your login page  
2. They send users a link to this fake site (e.g., `my-legit-app-secure.com` instead of `mylegitapp.com`)  
3. When users enter credentials and MFA codes, the attacker captures them in real-time  
4. The attacker uses these stolen credentials to access the real site

Even with traditional MFA like SMS codes or authenticator apps, this attack works because the attacker can simply forward the stolen credentials and MFA codes to the legitimate service immediately after capturing them.

This isn't just theoretical protection. Remember the Cloudflare incident mentioned earlier? Their own security report explicitly stated that employees using FIDO2-based WebAuthn keys (the same standard we're implementing) remained protected while those using push notifications were compromised.

By requiring phishing-resistant MFA with WebAuthn as we've implemented, you're effectively removing phishing as a viable attack vector against your authentication system. Even if users are tricked into visiting a fake site, the browser's security model prevents the attack from succeeding.

## How SuperTokens Elevates Phishing-Resistant MFA

### Why Use SuperTokens Instead of Rolling Your Own?

Authentication seems straightforward on the surface—verify identity and grant access—but implementing it securely involves intricate technical challenges. Many developers underestimate these complexities until they encounter serious security issues in production.

Building your own authentication system from scratch requires managing numerous critical components:

1. **Security vulnerabilities**: Without specialized knowledge, your system could be vulnerable to common attacks like CSRF, XSS, session fixation, and credential stuffing  
2. **Compliance requirements**: Meeting standards like GDPR, HIPAA, SOC2, and other regulations requires domain expertise that's expensive to develop and maintain in-house  
3. **Ongoing maintenance**: Authentication isn't a "build once and forget" feature—it requires constant updates to address evolving security threats and browser compatibility issues  
4. **Developer resources**: Building robust authentication diverts valuable engineering time from your core product features and business logic  
5. **Edge cases**: Authentication has countless edge cases around account recovery, device management, and session handling that you'll need to solve

### SuperTokens' Advanced Security Features for Phishing-Resistant MFA

Modern authentication systems rely on tokens to maintain user sessions, but these tokens become prime targets for attackers. SuperTokens implements sophisticated session management that mitigates token theft.

SuperTokens implements automatic token rotation, significantly reducing the window of opportunity for attackers if a token is somehow compromised:

* Access tokens have short lifespans  
* Refresh tokens are automatically rotated with each use  
* The rotation system maintains session continuity while limiting exposure

### Seamless Integration with WebAuthn & FIDO2

SuperTokens' implementation creates a frictionless bridge between traditional authentication flows and phishing-resistant standards. This means users can authenticate using:

* Built-in biometrics (TouchID, FaceID, Windows Hello)  
* Platform authenticators (Android/Iphone fingerprint sensors)  
* External security keys (YubiKey, Titan Security Key)

### Flexible Architecture: Enforce MFA for Specific Users/Roles

SuperTokens provides granular control over authentication requirements without complex custom code. With Role-Based MFA Policies you can implement different security requirements based on user roles. This enables you to:

* Enforce hardware security keys for administrators  
* Require second factors only for sensitive operations  
* Implement different policies based on user risk profiles

SuperTokens makes it easy to require additional authentication for specific actions. This allows you to:

* Require additional factors for high-value transactions  
* Implement risk-based authentication policies  
* Verify identity before sensitive account changes

The system handles common edge cases like authenticator loss. This provides secure recovery options while maintaining security:

* Email/phone fallback mechanisms  
* Backup code generation for account recovery  
* Administrator-assisted recovery workflows

By leveraging SuperTokens' flexible architecture, you can implement authentication policies that balance security with usability, applying the appropriate level of protection based on user role, action sensitivity, and risk assessment.

In the next section, we'll explore how to deploy this phishing-resistant MFA system at scale and integrate it with existing infrastructure.

## Final Thoughts & Next Steps

### Taking Phishing-Resistant Authentication to the Next Level

For organizations with stringent security requirements, SuperTokens offers device attestation capabilities that can be leveraged for:

* Verifies authenticator is from a trusted manufacturer 
* Ensures hardware-backed key storage  
* Requires user verification (biometric or PIN)  
* Prevents credential cloning between devices

Device attestation enables security teams to enforce hardware security key policies and maintain an audit trail of registered authenticators—critical for regulated industries.

### Encouraging User Adoption: Making WebAuthn Onboarding Seamless

The most secure authentication is useless if users can't or won't use it. SuperTokens provides customizable UI components that guide users through adopting phishing-resistant authentication, making the entire process as low friction as possible.

Best practices for increasing adoption include:

* Explaining the possible costs that come with a phishing attack  
* Creating fallback mechanisms for lost devices  
* Gradually transitioning from traditional MFA to phishing-resistant options

## **Further Reading: SuperTokens Documentation**

The implementation we've explored is just the beginning. SuperTokens offers extensive documentation for advanced configurations:

* [WebAuthn Implementation Guide](https://supertokens.com/docs/authentication/passkeys/initial-setup) \- Detailed setup instructions  
* [Multi-factor Authentication](https://supertokens.com/docs/additional-verification/mfa/initial-setup) \- Advanced policies and flows  
* [User Roles and Permissions](https://supertokens.com/docs/userroles/introduction) \- Role-based authentication requirements

## **Conclusion**

By implementing phishing-resistant MFA with SuperTokens and WebAuthn, you've addressed one of the most persistent security vulnerabilities facing modern applications. This approach not only protects your users from sophisticated attacks but also improves their authentication experience.

The combination of SuperTokens' flexible architecture, WebAuthn's cryptographic security, and the FIDO2 standards creates a defense-in-depth strategy that eliminates entire categories of authentication attacks while providing the granular control needed to balance security with usability.

As phishing attacks continue to evolve in sophistication, this implementation ensures your authentication system remains resilient against current and future threats.

###
