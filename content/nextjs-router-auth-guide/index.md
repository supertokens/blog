---
title: "Next.js App Router authentication complete guide"
description: "Learn how to secure Next.js App Router authentication after CVE-2025-29927, across Server Components, Server Actions, and Route Handlers, using SuperTokens."
date: "2025-08-18"
cover: "TODO.png"
category: "nextjs, authentication, guide"
author: "Maurice Saldivar"
---

## Why App Router Changes Authentication

In March 2025, the Next.js team disclosed [CVE-2025-29927](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw), a critical (CVSS 9.1) authorization bypass in middleware. A request carrying one internal header, `x-middleware-subrequest`, set to the right value, skipped middleware entirely and went straight to the route behind it. Self-hosted apps from Next.js 11.1.4 onward were exposed until they upgraded to a fixed release.

For any app that checked sessions in middleware and nowhere else, that header turned every protected route into a public one. The bug was in Next.js. How much it exposed came down to architecture.

Middleware-only authentication is an easy design to fall into. One file sits in front of every route, runs before anything renders, and looks like a complete perimeter. It's also a single point of failure, and the App Router gives that single point more ground to cover. In the Pages Router, server code lived in a short list of places, mainly `getServerSideProps` and API routes. The App Router spreads it across the component tree. That's the real shift in Next.js App Router authentication: every place that runs server code needs its own check.

### Where Auth Checks Run

**Proxy runs first, but only where its matcher points.** Next.js 16 renamed `middleware.ts` to [`proxy.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) without changing its job. It's the fastest place to turn away a signed-out user and the easiest check to lose: a path outside the matcher skips it, and so does every Server Action called on that path.

**Server Components fetch data while they render.** Pages and layouts read cookies and query the database in the same function, with no API layer in between where a guard used to sit. A check at the top of a page protects that page's output and nothing else, and a check in a layout doesn't re-run on client-side navigation between the pages under it.

**Server Actions are POST endpoints.** Calling one sends a POST request to the current page with a `Next-Action` header that identifies the function. Anyone who can send that request can run the action, whether or not your UI shows the button. That's why the [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication) says to treat Server Actions like public-facing API endpoints. A [page-level auth check](https://nextjs.org/docs/app/guides/data-security) doesn't cover the actions defined on that page.

**Route Handlers answer any client.** A `route.ts` file is a plain HTTP endpoint. Mobile apps, webhooks, and other services call it directly, often with an `Authorization` header instead of a cookie, and no page or layout runs in front of it. The only check a Route Handler can count on is its own.

### Why the Checks Drift Apart

Each of these runs at a different moment, has different control over the response, and needs to fail in a different way. A check that's correct in one can be wrong in the next.

| Context | Triggered by | Can set cookies | Failure response |
|---------|--------------|-----------------|------------------|
| **Proxy** | Any request its matcher covers | Yes | Redirect pages to login, `401` for API paths |
| **Server Component** | Rendering a page or layout | No | `redirect()` to login, render nothing protected |
| **Server Action** | A POST with a `Next-Action` header | Yes | Throw or return an error before touching data |
| **Route Handler** | Any HTTP request to its path | Yes | `401` or `403`, not a redirect |

The last two columns are where shared helpers break. Server Components can't set cookies, because HTTP can't add them once a response starts streaming, so a page that finds an expired access token can't refresh it in place. And a `verifySession()` helper that calls `redirect('/login')` is right for a page. In a Route Handler, the same helper answers a mobile client with a 307 redirect to an HTML login page instead of a 401 the client can act on.

The runtime split made this worse. Until Next.js 15.2, middleware could only run on the Edge runtime, which supports a subset of Node.js APIs and rules out most traditional database drivers. A common result was a JWT signature check in middleware and a database-backed check, or none, everywhere else. Those two checks can disagree. A signature check can't see revocation, so a session you revoke after a password change keeps passing it until its access token expires.

Proxy runs on Node.js in Next.js 16, but the Next.js authentication guide still limits it to reading the cookie, with no database calls, because it runs on every matched route, prefetches included. That split, a fast optimistic check up front and an authoritative check behind it, is the design Next.js recommends. What you control is whether every request path reaches the authoritative one.

That's the architecture this guide builds. Proxy stays as a fast first line that turns away signed-out users. A [Data Access Layer](https://nextjs.org/blog/security-nextjs-server-components-actions) becomes the one place every Server Component, Server Action, and Route Handler goes to read the session and touch data. A bypassed Proxy or a forgotten page check then doesn't expose what's behind it. The architecture sections stay provider-neutral, and the final section maps each layer onto SuperTokens.

## CVE-2025-29927: What the Middleware Bypass Actually Was

Most write-ups stop at the header name. The mechanism is worth a few minutes, because it shows exactly which code held up and which didn't.

### How the Bypass Worked

Middleware can make its own `fetch` calls, including to routes in the same app. Without a guard, a middleware that fetches its own app would run again on that request, and again on the next one. Next.js prevented the loop with an internal header. Every request middleware sent out carried `x-middleware-subrequest`, a colon-separated list of the middleware that had already run. When a request arrived carrying it, Next.js knew middleware had been there and skipped running it again.

The flaw was in who it believed. Next.js read the header from every incoming request, including ones from the internet, and had no way to tell its own subrequests from a client that set the header itself. This is the check, trimmed, from Next.js 15.1.7:

```ts
// packages/next/src/server/web/sandbox/sandbox.ts (Next.js 15.1.7, comments added)
export const run = withTaggedErrors(async function runWithTaggedErrors(params) {
  const runtime = await getRuntimeContext(params)
  // Read straight from the incoming request, whoever sent it
  const subreq = params.request.headers[`x-middleware-subrequest`]
  const subrequests = typeof subreq === 'string' ? subreq.split(':') : []

  const MAX_RECURSION_DEPTH = 5
  const depth = subrequests.reduce(
    (acc, curr) => (curr === params.name ? acc + 1 : acc),
    0
  )

  if (depth >= MAX_RECURSION_DEPTH) {
    // Tell the router middleware finished, without ever running it
    return {
      waitUntil: Promise.resolve(),
      response: new runtime.context.Response(null, {
        headers: {
          'x-middleware-next': '1',
        },
      }),
    }
  }
  // ...the middleware function only runs past this point
```

`params.name` is the middleware's module path, `middleware` or `src/middleware`. Once the header named it enough times, Next.js returned `x-middleware-next: 1`, the same signal a middleware sends when it calls `NextResponse.next()`. The middleware function never executed. Its redirects, rewrites, header changes, and Content Security Policy were all skipped, and the request went on to the page as if middleware had approved it.

The matching rule changed over the years. Before 12.2, middleware lived in `pages/_middleware` files. From 12.2 through 14.1, one match against the file name was enough to skip it, and 14.2 added the recursion counter above. Every version made the same mistake: it took the client's word for it.

### Affected Versions and the Fix

Security researchers Rachid and Yasser Allam reported the bug on February 27, 2025. Fixed releases shipped between March 17 and March 23, and the [advisory](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) went public on March 21.

| Release line | Vulnerable versions | Patched in |
|--------------|---------------------|------------|
| 15.x | 15.0.0 to 15.2.2 | 15.2.3 |
| 14.x | 14.0.0 to 14.2.24 | 14.2.25 |
| 13.x | 13.0.0 to 13.5.8 | 13.5.9 |
| 12.x | 12.0.0 to 12.3.4 | 12.3.5 |
| 11.x | 11.1.4 | None. Upgrade, or strip the header |

Self-hosted apps running `next start` or `output: 'standalone'` were exposed. Apps on Vercel, Netlify, and Cloudflare Workers weren't, because routing on those platforms runs in a separate layer in front of the app, and static exports don't run middleware at all. Vercel's [postmortem](https://vercel.com/blog/postmortem-on-next-js-middleware-bypass) covers the timeline in detail.

The fix left the recursion check alone. It changed whether the header can be trusted. At startup, each Next.js server generates a random ID and attaches it to its own subrequests as `x-middleware-subrequest-id`. Before routing, any incoming request that doesn't carry the matching ID has its `x-middleware-subrequest` header deleted:

```ts
// packages/next/src/server/lib/server-ipc/utils.ts (Next.js 15.2.3)
// If this request didn't origin from this session we filter
// out the "x-middleware-subrequest" header so we don't skip
// middleware incorrectly
if (
  header === 'x-middleware-subrequest' &&
  headers['x-middleware-subrequest-id'] !==
    (globalThis as any)[Symbol.for('@next/middleware-subrequest-id')]
) {
  delete headers['x-middleware-subrequest']
}
```

That fix needed one follow-up. [CVE-2025-30218](https://github.com/vercel/next.js/security/advisories/GHSA-223j-4rm8-mrmf), published April 2, 2025, found that middleware sent the new ID with every outgoing `fetch`, including requests to third-party hosts, so the secret the fix depended on could end up on someone else's server. The floor for both CVEs is 12.3.6, 13.5.10, 14.2.26, or 15.2.4.

If you're stuck on an unpatched version, the advisory's workaround is to stop external requests carrying `x-middleware-subrequest` from reaching Next.js. On nginx, that's one line:

```nginx
location / {
  # Never forward the internal header from outside traffic
  proxy_set_header x-middleware-subrequest "";
  proxy_pass http://127.0.0.1:3000;
}
```

### It Wasn't the Last Bypass

CVE-2025-29927 tends to get told as a one-off. It wasn't. In May 2026, Next.js fixed four more ways to reach a protected route without middleware or Proxy running, and in July it fixed a fifth:

- **[CVE-2026-44575](https://github.com/vercel/next.js/security/advisories/GHSA-267c-6grr-h53f):** `.rsc` and segment-prefetch variants of an App Router URL resolved to the same page without matching the middleware rule. Fixed in 15.5.16 and 16.2.5.
- **[CVE-2026-45109](https://github.com/vercel/next.js/security/advisories/GHSA-26hh-7cqf-hhc6):** the fix for 44575 didn't cover `middleware.ts` built with Turbopack. Fixed in 15.5.18 and 16.2.6.
- **[CVE-2026-44574](https://github.com/vercel/next.js/security/advisories/GHSA-492v-c6pp-mqqv):** crafted query parameters changed the dynamic route value a page saw while the path middleware matched stayed the same. Fixed in 15.5.16 and 16.2.5.
- **[CVE-2026-44573](https://github.com/vercel/next.js/security/advisories/GHSA-36qx-fr4f-26g5):** in Pages Router apps with i18n, locale-less `/_next/data` requests skipped middleware and returned protected page data. Fixed in 15.5.16 and 16.2.5.
- **[CVE-2026-64642](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24):** App Router apps built with Turbopack and a single configured locale could be reached around Proxy. Fixed in 16.2.11.

The four with published details share a shape: Proxy and the router read the same request differently. Vercel's [May 2026 release notes](https://vercel.com/changelog/next-js-may-2026-security-release) say those advisories "cannot be reliably blocked at the WAF layer" and call patching the only complete mitigation. The workaround the advisories give is consistent: enforce authorization in the page or route itself instead of relying on middleware alone.

### The Pattern That Stayed Safe

Here's the difference in code. A common middleware-only setup verifies the session in Proxy and forwards the user ID to pages in a request header:

```ts
// proxy.ts (middleware.ts before Next.js 16)
import { NextResponse, type NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const session = await decrypt(request.cookies.get('session')?.value)
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Forward the verified user ID to the page
  const headers = new Headers(request.headers)
  headers.set('x-user-id', String(session.userId))
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

The page trusts that header:

```tsx
// app/dashboard/invoices/page.tsx
// WRONG: assumes Proxy ran and set x-user-id
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { InvoiceList } from './invoice-list'

export default async function InvoicesPage() {
  const userId = (await headers()).get('x-user-id')!
  const invoices = await db.invoice.findMany({ where: { userId } })
  return <InvoiceList invoices={invoices} />
}
```

With the bypass, Proxy never runs, so the page reads whatever `x-user-id` the attacker sent. That's worse than a skipped login check: anyone can read any user's invoices by sending that user's ID. Stripping client-sent copies of the header inside Proxy, which some examples do, doesn't help, because the code doing the stripping is the code that didn't run. The same thing happens on a fully patched app the day someone adds a route the matcher doesn't cover.

The version that held up checks the session where the data is read:

```tsx
// app/dashboard/invoices/page.tsx
// CORRECT: verifies the session itself, whether or not Proxy ran
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { InvoiceList } from './invoice-list'

export default async function InvoicesPage() {
  // Redirects to /login when the session cookie is missing or invalid
  const { userId } = await verifySession()
  const invoices = await db.invoice.findMany({ where: { userId } })
  return <InvoiceList invoices={invoices} />
}
```

Under the same bypass, this page redirects to `/login`. Three things changed:

- The session check runs where the data is read, so it holds no matter how the request arrived.
- The user ID comes from the verified session, never from a request header.
- Proxy keeps its job as a fast redirect for signed-out users. It just stops being the only thing between a request and the database.

The next section builds `verifySession()` out into a full Data Access Layer.

You can test for this whole class of bug without reproducing any CVE. In a test environment, remove a protected route from your Proxy matcher, then load the page and call its Server Actions and Route Handlers directly. If anything protected comes back, a Proxy bypass would hand it out too.

A bug in Proxy should cost you a redirect, not your users' data.
