---
title: Adding login to your Next.js app using the app directory with SuperTokens
date: "2023-10-23"
description: "This blog explains how to setup email password and social login with SuperTokens using the app directory in Next.js."
cover: "adding-social-login-to-your-website-with-supertokens.png"
category: "programming"
author: "Nemi Shah"
---

Next.js has become a popular framework for building web applications. The framework recently introduced its [`app`](https://nextjs.org/docs/app/building-your-application/routing#the-app-router) directory as a future replacement to the current way of organising the project and creating pages and api routes.

This blog will cover how to setup email password and social login authentication with SuperTokens using the app directory in Next.js.

## (Recommended) Use `create-supertokens-app`

`create-supertokens-app` is a command line tool created by the SuperTokens team that lets you create new projects with SuperTokens already integrated. This is the fastest way to get started with SuperTokens. To use this tool, run the following command:

```bash
npx create-supertokens-app@latest
```

The tool will prompt you for your tech stack, you can choose between the app directory and the pages directory. 

The rest of this article is relevant only if you are adding SuperTokens to your app manually and if you have not used the tool mentioned above. If you used `create-supertokens-app`, the setup is already complete and you can continue building the rest of the application. To know details about Next.js integration with SuperTokens, refer to their [official documentation](https://supertokens.com/docs)

## Manually Setting up the Next.js project

Run the following command:

```bash
npx create-next-app <PROJECT_NAME>
```

`create-next-app` will prompt you to select details about your project, for the sake of this example we are:

- Using Typescript
- Using ESLint
- **Not** using Tailwind CSS
- **Not** using the `src/` directory
- Using the App router
- **Not** using import aliases

After the tool has finished, you should have a basic Next.js app setup. You can run the project with `npm run dev`.

## Installing and setting up SuperTokens

Install `supertokens-auth-react` and `supertokens-node` as node dependencies:

```bash
npm i supertokens-node supertokens-auth-react
```

In this example, we are going to be using the Social login + email password recipe of SuperTokens.

### Step 1: Initialise SuperTokens for our APIs

SuperTokens' node SDK provides a set of APIs that we can use for logging in our users and managing their sessions. We will follow the [quick setup guide](https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/setup/backend) to initialise the backend SDK. Create a `/app/config/appinfo.ts` file and add the following code to it:

```ts
export const appInfo = {
    appName: 'SuperTokens Next.js demo app',
    apiDomain: 'http://localhost:3000',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/api/auth',
    websiteBasePath: '/auth',
};
```

- `apiDomain` tells SuperTokens where the APIs are exposed from
- `websiteDomain` is the base URL of the frontend
- `apiBasePath` is the path at which the backend SDK exposes all its APIs
- `websiteBasePath` is the path where the frontend SDK will add its routes

Because Next.js serves both the frontend and backend on the same base URL, it is important to make sure that the `apiBasePath` and `websiteBasePath` are not the same.

Create a `/app/config/backend.ts` file and add the following code to it:

```ts
import SuperTokens from "supertokens-node";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appinfo";

export const backendConfig = (): TypeInput => {
    return {
        appInfo,
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        recipeList: [
            ThirdPartyEmailPassword.init({
                /**
                 * These are development credentials provided by SuperTokens, make sure
                 * to use your own credentials when you deploy to production.
                 */
                providers: [
                    {
                        config: {
                            thirdPartyId: "google",
                            clients: [{
                                clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                clientSecret: "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"
                            }]
                        }
                    }, 
                    {
                        config: {
                            thirdPartyId: "github",
                            clients: [{
                                clientId: "467101b197249757c71f",
                                clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                            }]
                        }
                    }, 
                    {
                        config: {
                            thirdPartyId: "apple",
                            clients: [{
                                clientId: "4398792-io.supertokens.example.service",
                                additionalConfig: {
                                    keyId: "7M48Y4RYDL",
                                    privateKey:
                                        "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                    teamId: "YWQCXGJRJL",
                                }
                            }]
                        }
                    },
                ],
            }),
            Session.init(),
        ],
    };
}

let initialized = false;
export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig());
    initialized = true;
  }
}
```

The `ThirdPartyEmailPassword` recipe adds email password and social login to our project and the `Session` recipe adds the functionality of managing users sessions and refreshing their sessions.

In our APIs we will use `ensureSuperTokensInit` to make sure SuperTokens is initialised before we use any functionality from the SDK.

Also modify the `dev` script in the `package.json` to:

```json
{
    "scripts": {
        "dev": "next dev -p 3000",
    },
}
```

We do this because in this example we want the project to run on port `3000`, if you want to keep the default port or use another port you can modify this script. Keep in mind that if you use a different port, you also need to modify the `apiDomain` and `websiteDomain` values inside the `/app/config/backend.ts` file.

### Step 2: Adding SuperTokens' API routes

The SuperTokens backend SDKs expose a set of API routes that we can use in our project, this makes it easier to add login to our app because we don't have to build this logic ourselves.

Start by creating a new file `/app/api/auth/[...path]/route.ts`. Adding `[...path]` as a folder makes sure that the `route.ts` file is called for all network calls made to the `/auth/*` paths. Add the following content to the `route.ts` file:

```ts
import { getAppDirRequestHandler } from 'supertokens-node/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { ensureSuperTokensInit } from '../../../config/backend';

ensureSuperTokensInit();

const handleCall = getAppDirRequestHandler(NextResponse);

export async function GET(request: NextRequest) {
  const res = await handleCall(request);
  if (!res.headers.has('Cache-Control')) {
    // This is needed for production deployments with Vercel
    res.headers.set(
      'Cache-Control',
      'no-cache, no-store, max-age=0, must-revalidate'
    )
  }
  return res;
}

export async function POST(request: NextRequest) {
  return handleCall(request);
}

export async function DELETE(request: NextRequest) {
  return handleCall(request);
}

export async function PUT(request: NextRequest) {
  return handleCall(request);
}

export async function PATCH(request: NextRequest) {
  return handleCall(request);
}

export async function HEAD(request: NextRequest) {
  return handleCall(request);
}
```

We call `ensureSuperTokensInit` to make sure SuperTokens is always initialised when any of the SuperTokens API routes are called. `getAppDirRequestHandler` is a helper function that the SuperTokens SDK provides, this adds request parsing, error handling etc so that we dont have to manually check for individual API results.

And thats it, the SuperTokens backend SDK is setup. To verify that we have set it up correctly you can open http://localhost:3000/api/auth/signup/email/exists?email=somerandomemail@email.com in your browser, if it is all working correctly you should see a response similar to:

```json
{"status":"OK","exists":false}
```

You can see the [full API spec](https://supertokens.com/docs/fdi) to know all the API routes that the SuperTokens backend SDKs expose.

### Step 3: Adding SuperTokens to the frontend

`supertokens-auth-react` provides a pre built UI that gets added as part of your project so that you dont have to build the login UI yourself. If you want to build your own UI you can use functions exposed by the SDK to interact with your APIs, either way you dont need to call the APIs exposed by the backend SDKs manually.

The full set of steps for initialising SuperTokens on the frontend can be found in the [official frontend setup guide](https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/setup/backend)

Create a `/app/config/frontend.ts` file and add the following code to it:

```ts
import ThirdPartyEmailPassword, {
    Google,
    Github,
    Apple,
} from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import Session from 'supertokens-auth-react/recipe/session';
import { appInfo } from './appinfo';
import { useRouter } from 'next/navigation';
import { SuperTokensConfig } from 'supertokens-auth-react/lib/build/types';

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
  {};

export function setRouter(
  router: ReturnType<typeof useRouter>,
  pathName: string,
) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyEmailPassword.init({
                signInAndUpFeature: {
                    providers: [
                        Google.init(),
                        Github.init(),
                        Apple.init(),
                    ],
                },
            }),
            Session.init(),
        ],
        windowHandler: (orig) => {
            return {
                ...orig,
                location: {
                    ...orig.location,
                    getPathName: () => routerInfo.pathName!,
                    assign: (url) => routerInfo.router!.push(url.toString()),
                    setHref: (url) => routerInfo.router!.push(url.toString()),
                },
            };
        },
    };
}
```

Create a `/app/components/supertokensProvider.tsx` file and add the following contents to it:

```tsx
'use client';
import React from 'react';
import { SuperTokensWrapper } from 'supertokens-auth-react';
import SuperTokensReact from 'supertokens-auth-react';
import { frontendConfig, setRouter } from '../config/frontend';
import { usePathname, useRouter } from 'next/navigation';

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

export const Providers: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  setRouter(useRouter(), usePathname() || window.location.pathname);

  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
```

We check for `window` not being undefined because we only want to initialise the SuperTokens React SDK on the client side. The `SuperTokensWrapper` component adds some context to the rest of our application so that we can access the session from anywhere. 

`SuperTokens` wrapper initialises a React context for sessions, because of this we make this component a client component by adding `'use client'` to the top of the file.

Modify the `/app/layout.tsx` file:

```tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SuperTokensProvider } from './components/supertokensProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={inter.className}>{children}</body>
      </SuperTokensProvider>
    </html>
  )
}
```

### Step 4: Adding SuperTokens routes to our frontend

Create a new `/app/auth/[[...path]]/page.tsx` file. Adding `[[...path]]` as a folder makes sure that the `page.tsx` file is served for all `/auth/*` routes and also ensures that the `/auth` route itself also serves the `page.tsx` file. Add the following content to the `page.tsx` file

```tsx
'use client';

import { useEffect } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import SuperTokens from 'supertokens-auth-react/ui';
import { ThirdPartyEmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/thirdpartyemailpassword/prebuiltui';

export default function Auth() {
  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  useEffect(() => {
    if (
      SuperTokens.canHandleRoute([ThirdPartyEmailPasswordPreBuiltUI]) === false
    ) {
      redirectToAuth({ redirectBack: false });
    }
  }, []);

  if (typeof window !== 'undefined') {
    return SuperTokens.getRoutingComponent([ThirdPartyEmailPasswordPreBuiltUI]);
  }

  return null;
}
```

`SuperTokens.canHandleRoute` returns true if SuperTokens exposes a component for the current browser url and `ThirdPartyEmailPasswordPreBuiltUI` are all the pre built UI components that can handle a specific set of routes. In this file we check if the current page can be handled by the SuperTokens SDK and return the relevant component from SuperTokens using `SuperTokens.getRoutingComponent`.

Now if you visit `http://localhost:3000/auth` in your browser, you can view the login page of our project and it should look like this:

![Login Page](./default-login.png)

Does not look the best but at least it works, lets modify the default next app styling to make it look better!

Modify `/app/globals.css`:

```css
html {
  height: 100%;
}
```

For the sake of this example we cleared everything because we will not need the additional styles.

The login page should not look like this:

![Styled Login Page](./default-login-styled.png)

And thats it! The frontend SDK is now setup and the `/auth` routes are handled by SuperTokens.

## Building our home page

Lets start by clearing the default home page content and styles in `/app/page.tsx` and `/app/page.module.css`

`/app/page.tsx`

```tsx
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      Hello World
    </main>
  )
}
```

`/app/page.module.css`

```css
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

In our project we want to do the following:
- Display the user's `userId` and `email` on the home page
- Only allow users who are logged in to view the home page
- Redirect to the `/auth` route if the visitor is not logged in or their session has expired

### Protecting your frontend routes

Start by creating a `/app/sessionUtils.ts` file and adding the following code to it:

```ts

import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Session, { SessionContainer, VerifySessionOptions } from "supertokens-node/recipe/session";
import { ensureSuperTokensInit } from '../config/backend';
import { PreParsedRequest, CollectingResponse } from "supertokens-node/framework/custom";
import { HTTPMethod } from "supertokens-node/types";

ensureSuperTokensInit();

export async function getSSRSession(
  req?: NextRequest,
  options?: VerifySessionOptions
): Promise<{
  session: SessionContainer | undefined;
  hasToken: boolean;
  hasInvalidClaims: boolean;
  baseResponse: CollectingResponse;
  nextResponse?: NextResponse;
}> {
  const query = req !== undefined ? Object.fromEntries(new URL(req.url).searchParams.entries()) : {};
  const parsedCookies: Record<string, string> = Object.fromEntries(
      (req !== undefined ? req.cookies : cookies()).getAll().map((cookie) => [cookie.name, cookie.value])
  );
  let baseRequest = new PreParsedRequest({
      method: req !== undefined ? (req.method as HTTPMethod) : "get",
      url: req !== undefined ? req.url : "",
      query: query,
      headers: req !== undefined ? req.headers : headers(),
      cookies: parsedCookies,
      getFormBody: () => req!.formData(),
      getJSONBody: () => req!.json(),
  });

  let baseResponse = new CollectingResponse();

  try {
      let session = await Session.getSession(baseRequest, baseResponse, options);
      return {
          session,
          hasInvalidClaims: false,
          hasToken: session !== undefined,
          baseResponse,
      };
  } catch (err) {
      if (Session.Error.isErrorFromSuperTokens(err)) {
          return {
              hasToken: err.type !== Session.Error.UNAUTHORISED,
              hasInvalidClaims: err.type === Session.Error.INVALID_CLAIMS,
              session: undefined,
              baseResponse,
              nextResponse: new NextResponse("Authentication required", {
                  status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
              }),
          };
      } else {
          throw err;
      }
  }
}
```

To know more about what `getSSRSession` does visit the [official documentation](https://supertokens.com/docs/thirdpartyemailpassword/nextjs/app-directory/session-helpers)

Create a `/app/components/tryRefreshClientComponent.tsx` file and add the following code:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Session from "supertokens-auth-react/recipe/session";
import SuperTokens from "supertokens-auth-react";

export const TryRefreshComponent = () => {
    const router = useRouter();
    const [didError, setDidError] = useState(false);

    useEffect(() => {
        void Session.attemptRefreshingSession()
            .then((hasSession) => {
                if (hasSession) {
                    router.refresh();
                } else {
                    SuperTokens.redirectToAuth();
                }
            })
            .catch(() => {
                setDidError(true);
            });
    }, []);

    if (didError) {
        return <div>Something went wrong, please reload the page</div>;
    }

    return <div>Loading...</div>;
};
```

This component will be used to refresh the session if the user's current session has expired. We use `Session.attemptRefreshingSession` to call the refresh endpoint, if the request fails we redirect back to the login route using `SuperTokens.redirectToAuth`.

Create a new `/app/components/userInformation.tsx` file:

```tsx
import { getSSRSession } from '../sessionUtils';
import { TryRefreshComponent } from './tryRefreshClientComponent';
import styles from '../../styles/Home.module.css';
import { redirect } from 'next/navigation'

export async function UserInformation() {
  const { session, hasToken } = await getSSRSession();

  if (!session) {
    if (!hasToken) {
      redirect('/auth');
    }
    return <TryRefreshComponent />;
  }

  return (
    <p className={styles.description}>
      Server side component got userId: {session.getUserId()}
    </p>
  );
}
```

UserInformation is a server side component. In this component we try to fetch session information using `getSSRSession` and if the user has a session we render the user id (we wll change this later). If the user does not have a session but a token exists we try to refresh the session, if no token exists then we redirect the user to the `/auth` route.

Modify `/app/page.tsx`

```tsx
import { UserInformation } from './components/userInformation'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <UserInformation />
    </main>
  )
}
```

Now if you try to open `http://localhost:3000/` it will redirect you to `/auth` because we dont have a valid session. But if you sign in to the website it will redirect you to the home page which should look like this:

![Home Page](./plain-home.png)

### Protecting your API routes

To fetch the user's email we need to make a network call. We need to make sure that only a user with an active session can fetch their information.

Start by modifying `/app/sessionUtils.ts`:

```ts
import { cookies, headers } from 'next/headers';

// ...

export async function withSession(
  request: NextRequest,
  handler: (session: SessionContainer | undefined) => Promise<NextResponse>,
  options?: VerifySessionOptions
) {
  let { session, nextResponse, baseResponse } = await getSSRSession(request, options);
  if (nextResponse) {
      return nextResponse;
  }

  let userResponse = await handler(session);

  let didAddCookies = false;
  let didAddHeaders = false;

  for (const respCookie of baseResponse.cookies) {
      didAddCookies = true;
      userResponse.headers.append(
          "Set-Cookie",
          serialize(respCookie.key, respCookie.value, {
              domain: respCookie.domain,
              expires: new Date(respCookie.expires),
              httpOnly: respCookie.httpOnly,
              path: respCookie.path,
              sameSite: respCookie.sameSite,
              secure: respCookie.secure,
          })
      );
  }

  baseResponse.headers.forEach((value, key) => {
      didAddHeaders = true;
      userResponse.headers.set(key, value);
  });

  if (didAddCookies || didAddHeaders) {
      if (!userResponse.headers.has("Cache-Control")) {
          // This is needed for production deployments with Vercel
          userResponse.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
      }
  }

  return userResponse;
}
```

The `withSession` is a utility function we will use in all our APIs that require sessions, it will get the session if it exists and then call the handler function which will be our actual API logic. To know more about what this function does visit the [official documentation](https://supertokens.com/docs/thirdpartyemailpassword/nextjs/app-directory/session-helpers)

Lets create a new API route for fetching the user information, create a new file `/app/api/user/route.ts`:

```ts
import { NextResponse, NextRequest } from 'next/server';
import { withSession } from '../../sessionUtils';
import SuperTokens from 'supertokens-node';

export function GET(request: NextRequest) {
  return withSession(request, async (session) => {
    if (!session) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    const userId = session.getUserId();
    const user = await SuperTokens.getUser(userId);
    
    if (user === undefined) {
        return NextResponse.json({
            email: "not found",
        })
    }

    return NextResponse.json({
      email: user.emails[0],
    });
  })
}
```

We are creating a GET API route for `/user`. This API calls `withSession` because we need an active session to be able to fetch the user's information. If a session does not exist we return with status `401`.

We use the session to get the user's user id and then fetch the user information from SuperTokens.

### Making network requests that require sessions

Now that we have session protection on our frontend route and API route, we need to actually make a network request to fetch the user's email. Modify the `/app/components/userInformation.tsx` file:

```tsx
import { getSSRSession } from '../sessionUtils';
import { TryRefreshComponent } from './tryRefreshClientComponent';
import styles from '../page.module.css';
import { redirect } from 'next/navigation'

export async function UserInformation() {
  const { session, hasToken } = await getSSRSession();

  if (!session) {
    if (!hasToken) {
      redirect('/auth');
    }
    return <TryRefreshComponent />;
  }

  const userEmailResponse = await fetch('http://localhost:3000/api/user', {
    headers: {
      Authorization: 'Bearer ' + session.getAccessToken(),
    },
  });

  let email = "";

  if (userEmailResponse.status !== 200) {
    email = "error with status " + userEmailResponse.status;
  } else {
    email = (await userEmailResponse.json()).email;
  }

  return (
    <p className={styles.description}>
      Server side component got userId: {session.getUserId()}<br/>
      Server side component got email: {email}
    </p>
  );
}
```

We use `session.getAccessToken()` to get the current access token of the user, we use this token to make a network request to our newly created API.

Now if you open the home route in your browser you should see something similar to this:

![Home Page With Email](./logged-in-home.png)

## Signing users out of the application

We also need to provide a way for users to sign out, luckily SuperTokens provides a very easy way to do this. First lets add a sign out button to the home page, create a new `/app/components/signOut.tsx` file:

```tsx
'use client'

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useRouter } from 'next/navigation'
import Session from "supertokens-auth-react/recipe/session";

export const SignOut = () => {
    const session = useSessionContext();
    const router = useRouter();

    if (session.loading === true) {
        return null;
    }

    const signOut = async () => {
        await Session.signOut();
        router.refresh();
    }

    return <button onClick={signOut}>Sign out</button>
}
```

This is a client component that will render a button to sign out if a session exists. We then use `Session.signOut()` to call the sign out API and then refresh the page. In this example we refresh the page because we want to demonstrate that the user would get redirected to the login page without a valid session, you can redirect to `/auth` directly if you prefer.

Add the `SignOut` component to the home page:

```tsx
return (
    <div>
        <div>
            <p className={styles.description}>
            Server side component got userId: {session.getUserId()}<br/>
            Server side component got email: {email}
            </p>
        </div>
        <SignOut/>
    </div>
);
```

## Conclusion

And thats it, our Next.js app has SuperTokens set up with frontend and api routes being exposed by the SDKs and we now have our custom API and frontend routes protected to require sessions.

This example was just a basic use case for what you can do with SuperTokens, to know more or to learn how to use other features and recipes of SuperTokens visit their [official SuperTokens documentation](https://supertokens.com/docs).

To learn more about Next.js visit the [Next.js documentation](https://nextjs.org/docs)