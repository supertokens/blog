---
title: How do I add authentication to a Next.js app with SuperTokens?
description: "Learn how to add authentication to your Next.js app. Step-by-step guide on login, signup, and sessions with SuperTokens."
date: "2026-09-09"
cover: "TODO.png"
category: "next.js, auth, guide"
author: "Maurice Saldivar"
---


# How do I add authentication to a Next.js application?

Authentication is a solved problem in most frameworks. In Next.js it keeps getting re-solved, because the framework splits your application across more execution contexts than almost anything else in mainstream web development. Server components, client components, middleware, and route handlers all need to know who the user is, and each one reads cookies and validates sessions differently. A session hook that works in a client component won't run in a server component. Middleware defaults to the edge runtime, where plenty of Node libraries won't load. Layer in the App Router and Pages Router split, SSR hydration, and aggressive caching on platforms like Vercel, and "add a login page" quietly becomes an architecture decision.

You have three realistic paths. Build auth yourself and own token rotation, CSRF protection, and refresh logic forever. Hand it to a managed provider and accept per-user pricing and vendor lock-in. Or run an open source framework inside your own stack.

SuperTokens takes the third path. It's an open source, extensible auth framework: a core service you can self-host for free, backend and frontend SDKs that embed directly into your Next.js codebase, and prebuilt UI for login, signup, and session management. Your user data stays in your database, and recipe overrides let you customize almost any part of the flow.

This guide walks through adding authentication to a Next.js app with SuperTokens: setup, login, signup, and sessions. If you're specifically on the App Router, our companion walkthrough, [Adding login to your Next.js app using the App Directory and SuperTokens](https://supertokens.com/blog/adding-login-to-your-nextjs-app-using-the-app-directory-and-supertokens), goes deeper on that pattern.

## What do I need before adding authentication to my Next.js app?

Not much. If you've shipped anything with Next.js before, you probably have everything on this list already.

**Node.js and a Next.js project.** Install the current LTS release of Node.js; recent Next.js versions enforce a minimum runtime and refuse to start on anything older. If you don't have a project yet, `npx create-next-app@latest` scaffolds one in under a minute. SuperTokens supports both the App Router and the Pages Router. The examples in this guide use the App Router.

**Working React and Next.js knowledge.** You don't need to be an expert, but you should be comfortable with components, hooks, and the difference between client and server components. Authentication in Next.js lives exactly at that boundary, so knowing which side of `'use client'` your code runs on will save you real debugging time. If you can write a route handler under `app/api/`, you know enough.

**Environment variables for your SuperTokens config.** SuperTokens needs a connection URI pointing at a core instance, an API key if your core requires one, and OAuth credentials for any social providers you add. Put them in `.env.local`, which Next.js loads automatically:

```bash
# .env.local
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.io
# Only needed for the managed service or a self-hosted core with API keys enabled
SUPERTOKENS_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

The `try.supertokens.io` core is a free shared instance meant for development. It works for this guide, but swap in your own self-hosted core or a managed instance before production. One Next.js-specific warning: anything prefixed with `NEXT_PUBLIC_` gets bundled into the browser. Your API key and client secrets should never carry that prefix.

## How do I install SuperTokens in my Next.js project?

One command covers it:

```bash
npm install supertokens-node supertokens-auth-react supertokens-web-js nextjs-cors
```

Starting a project from scratch instead? `npx create-supertokens-app@latest` scaffolds a Next.js app with all of this wired up. If you're adding auth to an existing codebase, it's worth knowing what each package does, because the split mirrors where authentication work actually happens.

**`supertokens-node` is the backend SDK.** It runs inside your route handlers under `app/api/`, exposes the auth endpoints (sign up, sign in, sign out, session refresh) so you never write them by hand, and verifies sessions in server components and protected API routes. It's also the only piece that talks to the SuperTokens core, which means your connection URI and API key stay server-side.

**`supertokens-auth-react` is the frontend SDK.** It renders the prebuilt login and signup UI, tracks session state in the browser, and refreshes tokens transparently when they expire. You'll initialize it once in a client component and mostly forget it exists.

The other two are supporting cast. `supertokens-web-js` is the lower-level browser SDK that `supertokens-auth-react` builds on: npm pulls it in automatically as a peer dependency, but yarn and pnpm want it listed explicitly, and it's the package you'd reach for if you build a fully custom UI. `nextjs-cors` sets CORS headers on your API routes, which matters if your frontend and API ever live on different domains and costs nothing when they don't.

In most stacks the backend and frontend SDKs live in separate repositories. Next.js is the exception: everything installs into one project, because the framework serves your React code and your API routes from the same codebase. Note what that command does not install: the SuperTokens core. The core is a standalone service, not an npm dependency. During development, the shared `try.supertokens.io` instance fills that role; in production, your connection URI points at a core you run in Docker or a managed instance.

## How do I configure authentication on the backend?

The backend in this case is not a separate server. It's three files inside your Next.js project, and the SuperTokens SDK does the heavy lifting in all of them.

**First, the shared app info.** Both SDKs need to agree on where things live, so this config gets its own file:

```ts
// app/config/appInfo.ts
export const appInfo = {
  appName: 'my-next-app',
  apiDomain: 'http://localhost:3000',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/api/auth',
  websiteBasePath: '/auth',
}
```

One rule matters here: `apiBasePath` and `websiteBasePath` cannot be the same. Next.js serves your frontend and your API from one domain, and if both paths collide, routing breaks in ways that are annoying to debug.

**Second, the backend config.** This is where you pick your auth method and connect to the core:

```ts
// app/config/backend.ts
import SuperTokens from 'supertokens-node'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { TypeInput } from 'supertokens-node/types'
import { appInfo } from './appInfo'

export const backendConfig = (): TypeInput => ({
  framework: 'custom',
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo,
  recipeList: [EmailPassword.init(), Session.init()],
  isInServerlessEnv: true,
})

let initialized = false
export function ensureSuperTokensInit() {
  if (!initialized) {
    SuperTokens.init(backendConfig())
    initialized = true
  }
}
```

Recipes are how SuperTokens packages auth methods. `EmailPassword.init()` gives you credential-based signup and login. Prefer magic links or OTPs instead? Swap it for `Passwordless.init({ contactMethod: 'EMAIL', flowType: 'MAGIC_LINK' })` and nothing else in this file changes. `Session.init()` stays either way: recipes prove who the user is, sessions remember it.

The other flags are Next.js survival gear. `framework: 'custom'` and `isInServerlessEnv: true` tell the SDK it's running in serverless functions rather than a long-lived Express server, and the `ensureSuperTokensInit` guard stops double initialization across cold starts and hot reloads.

**Third, the catch-all route handler.** This single file mounts every auth endpoint:

```ts
// app/api/auth/[...path]/route.ts
import { getAppDirRequestHandler } from 'supertokens-node/nextjs'
import { NextRequest } from 'next/server'
import { ensureSuperTokensInit } from '../../../config/backend'

ensureSuperTokensInit()

const handleCall = getAppDirRequestHandler()

export async function GET(request: NextRequest) {
  const res = await handleCall(request)
  if (!res.headers.has('Cache-Control')) {
    res.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
  }
  return res
}

export async function POST(request: NextRequest) {
  return handleCall(request)
}

// Export DELETE, PUT, PATCH, and HEAD the same way as POST.
```

Sign in, sign up, sign out, session refresh: all of them now exist under `/api/auth`, and you wrote none of them. The `Cache-Control` header is not optional decoration either. Vercel caches GET responses in production, and a cached session refresh will hand back stale tokens until your app is stuck in a 401 loop.

That's the entire backend. `POST /api/auth/signup` already works; there's just no UI calling it yet.

## How do I set up SuperTokens in the frontend?

The frontend config is the mirror image of what you just wrote, with one Next.js-specific complication: `SuperTokens.init` can only run in the browser, and the App Router renders everything on the server first. Three files handle it.

**The config function.** Same `appInfo`, same recipe pairing, plus a routing bridge:

```tsx
// app/config/frontend.tsx
import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { SuperTokensConfig } from 'supertokens-auth-react/lib/build/types'
import { useRouter } from 'next/navigation'
import { appInfo } from './appInfo'

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } = {}

export function setRouter(router: ReturnType<typeof useRouter>, pathName: string) {
  routerInfo.router = router
  routerInfo.pathName = pathName
}

export const frontendConfig = (): SuperTokensConfig => ({
  appInfo,
  recipeList: [EmailPasswordReact.init(), SessionReact.init()],
  windowHandler: (original) => ({
    ...original,
    location: {
      ...original.location,
      getPathName: () => routerInfo.pathName!,
      assign: (url) => routerInfo.router!.push(url.toString()),
      setHref: (url) => routerInfo.router!.push(url.toString()),
    },
  }),
})
```

Importing the shared `appInfo` is how the frontend learns to send auth calls to `/api/auth`. The recipe list mirrors the backend: `EmailPasswordReact` renders the login UI, `SessionReact` tracks session state in the browser. Keep both sides matched. A frontend initialized with a recipe the backend never mounted will call endpoints that don't exist, and the resulting 404s won't explain themselves. The `windowHandler` block exists because SuperTokens redirects users after login with `window.location` by default, which triggers full page reloads. Bridging it to Next's router keeps navigation client-side.

**The provider.** A client component that initializes the SDK exactly once, in the browser only:

```tsx
// app/components/supertokensProvider.tsx
'use client'
import React from 'react'
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react'
import { usePathname, useRouter } from 'next/navigation'
import { frontendConfig, setRouter } from '../config/frontend'

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig())
}

export const SuperTokensProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  setRouter(useRouter(), usePathname() || window.location.pathname)
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>
}
```

The `typeof window` check is doing real work. This module still gets evaluated during server rendering, and without the guard, `init` would run where no browser exists. `SuperTokensWrapper` is a React context provider: everything inside it can read session state.

**The root layout.** Wrap once and every page inherits auth:

```tsx
// app/layout.tsx
import { SuperTokensProvider } from './components/supertokensProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body>{children}</body>
      </SuperTokensProvider>
    </html>
  )
}
```

Backend and frontend now agree on paths, recipes, and sessions. What's missing is a page that actually renders the login form.

## How do I add login and signup pages to my app?

You don't build two pages. The prebuilt `SignInAndUp` component renders both forms and handles switching between them, so login and signup ship as one file:

```tsx
// app/auth/page.tsx
'use client'
import { SignInAndUp } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'

export default function AuthPage() {
  return <SignInAndUp />
}
```

Placement is not a style choice. This page lives at `app/auth/page.tsx` because `/auth` is the `websiteBasePath` you set in `appInfo`, and the SDK routes through that path on its own. When an unauthenticated user hits a protected route, SuperTokens redirects them here without you writing a redirect. The `'use client'` directive stays, too: the prebuilt UI is browser-rendered React, and the App Router needs to be told.

One tradeoff worth knowing. A single page at `/auth` covers login and signup, but the other prebuilt screens expect subroutes: password reset lives at `/auth/reset-password`, for example. If you want the full flow, replace this file with the catch-all routing page at `app/auth/[[...path]]/page.tsx` from the [SuperTokens docs](https://supertokens.com/docs), which serves every prebuilt screen under one path.

The prebuilt UI is a starting point, not a cage. You can restyle it through theme config on the recipe init, override individual React components while keeping the form logic (swap the header, inject your own fields), or discard it entirely and build custom UI on `supertokens-web-js` against the same backend. Most teams ship the prebuilt version first and override incrementally.

Run `npm run dev`, open `localhost:3000/auth`, and create an account. Signup works, login works, and a session now exists. Which raises the real question: how does the rest of your app know about it?

## How do I protect pages with authentication?

Protection happens in two places, and they do different jobs. The client-side guard controls what renders. The backend check controls what data leaves your server. You want both, because only one of them is a security boundary.

**Backend routes: `withSession`.** Any route handler can demand a valid session before doing work. Here's an `/api/dashboard` endpoint that only answers to logged-in users:

```ts
// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withSession } from 'supertokens-node/nextjs'
import { ensureSuperTokensInit } from '../../config/backend'

ensureSuperTokensInit()

export function GET(request: NextRequest) {
  return withSession(request, async (err, session) => {
    if (err) {
      return NextResponse.json(err, { status: 500 })
    }
    if (!session) {
      return new NextResponse('Authentication required', { status: 401 })
    }
    return NextResponse.json({ userId: session.getUserId() })
  })
}
```

Three outcomes, handled in order: an SDK error, a missing or expired session, or a verified user. By the time your callback runs, the tokens are already validated, and `session.getUserId()` hands you the identity for database queries.

**Client pages: `useSessionContext`.** For the `/dashboard` page itself, the session hook reads state from the `SuperTokensWrapper` you added earlier:

```tsx
// app/dashboard/page.tsx
'use client'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { redirectToAuth } from 'supertokens-auth-react'

export default function Dashboard() {
  const session = useSessionContext()

  if (session.loading) return null

  if (!session.doesSessionExist) {
    redirectToAuth()
    return null
  }

  return <p>Signed in as {session.userId}</p>
}
```

The `loading` check is not ceremony. Session state starts unresolved on first render, and TypeScript will correctly refuse to let you read `doesSessionExist` before you handle it. If you'd rather not hand-roll the redirect, wrap the page in `<SessionAuth>` from the same package and it manages both the loading state and the bounce to `/auth`.

Keep the layers straight. Anyone with dev tools open can render your dashboard shell. What they can't do is make `withSession` hand over data without valid tokens. Guard the UI for experience; guard the API for real.

## How do I test my Next.js app with authentication enabled?

Start the dev server and walk the whole flow, including the parts that are supposed to fail:

```bash
npm run dev
```

1. **Sign up.** Open `localhost:3000/auth` and create an account. The prebuilt flow starts a session on signup, so you land back in the app already logged in. No separate login step needed.

2. **Check the session exists.** Open dev tools and look at the cookies for `localhost:3000`. You'll find `sAccessToken` and `sRefreshToken`, set by the SDK without a line of cookie code on your side.

3. **Visit the protected page.** Go to `/dashboard`. It renders your user ID. Hit `/api/dashboard` too: JSON with the same ID, verified server-side by `withSession`.

4. **Test the failure path.** This is the check most people skip. Open an incognito window and go straight to `/dashboard`: you should bounce to `/auth`. Request `/api/dashboard` without cookies: 401. If either one lets you through, a guard is missing.

5. **Confirm sessions run themselves.** Reload the page: still signed in. Leave the tab open past token expiry: the SDK refreshes access tokens in the background through `/api/auth/session/refresh`, and your only evidence is that nothing broke.

To test logout, call `signOut()` from `supertokens-auth-react/recipe/session` behind a button, then confirm `/dashboard` bounces again.

Five checks, all passing, and you wrote no login form, no auth endpoints, and no refresh logic.

## Why should I use SuperTokens instead of other auth providers?

The fair question after any tutorial. You just wired one framework into your app; here's why it was this one.

**You own the stack.** SuperTokens is open source under Apache 2.0, and the core runs wherever you want it: a Docker container next to your app, your Kubernetes cluster, or their managed cloud when you'd rather not operate it. User data lives in your own PostgreSQL or MySQL database, which changes the exit math entirely. Leaving a managed provider means export tickets and password reset campaigns. Leaving SuperTokens means pointing something else at tables you already own. There's also no per-MAU pricing cliff waiting for you at scale.

**Recipes cover the auth methods you'll actually ship.** Email password, passwordless OTPs and magic links, social and enterprise SSO, MFA: each is a recipe, and you've already seen what adopting one costs. Adding passwordless to this app is an edit to `recipeList` on each side, not a migration.

**Extensibility is the default, not an enterprise tier.** Every API the SDK exposes can be overridden, so custom signup logic or extra validation slots in without forking anything. Plugins layer on cross-cutting concerns like CAPTCHA and rate limiting as installable units.

The tradeoffs are real. Self-hosting means the auth service is yours to keep healthy, and providers like Auth0 still win on enterprise feature breadth. But if you want auth that lives in your stack, on your terms, at a price that doesn't scale against your own growth, that's exactly the trade SuperTokens makes.

## Where can I learn more about Next.js authentication with SuperTokens?

Three places, depending on what you need next.

For a deeper pass at the App Router specifically, read [Adding login to your Next.js app using the App Directory and SuperTokens](https://supertokens.com/blog/adding-login-to-your-nextjs-app-using-the-app-directory-and-supertokens). It walks the same integration with more attention to server components and session handling during SSR, which matters once your app leans hard on server rendering.

The [SuperTokens docs](https://supertokens.com/docs) are where the recipes live. Passwordless flows, social login, MFA, UI overrides, self-hosting the core with Docker: each one builds on the config files you already have.

And the [supertokens-core repo on GitHub](https://github.com/supertokens/supertokens-core) is the project itself. Read the source, file issues, or study the architecture before you self-host. Open source means the answer to "what does this actually do" lives in the code, not behind a support ticket.


