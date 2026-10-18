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


## Defense in Depth: The Data Access Layer Pattern

The fixed page at the end of the last section still had one weak spot. It queried the database itself, and it was safe only because someone remembered to call `verifySession()` first. The next page someone writes might not.

A Data Access Layer (DAL) removes the need to remember. It's a server-only module that owns every read and write, and every function in it checks the session before it touches data. Pages, Server Actions, and Route Handlers call the DAL instead of the database, so a check that's missing at the edge doesn't turn into a leak. The Next.js team [recommends this pattern](https://nextjs.org/blog/security-nextjs-server-components-actions) for new projects. This section builds the full module.

### The Rules

- **Only the DAL touches the database.** Pages and actions import functions like `getMyInvoices()`, never the database client.
- **Every exported function checks the session itself.** No function assumes its caller already did.
- **Ownership lives in the query.** Reads and writes filter by the signed-in user's ID, so a guessed or leaked record ID finds nothing.
- **Only DTOs leave.** Functions return the fields the UI needs and nothing else, because anything a Server Component passes to a Client Component is serialized into the payload the browser downloads.
- **The DAL decides, the caller responds.** The DAL throws a typed error, and each context turns it into the right response: a redirect, an error result, or a `401`.

### The Session Module

The examples assume sign-in created a row in a `session` table and set a signed cookie carrying that row's ID. The session strategy section covers that side. They use a Prisma-style client, but the structure doesn't depend on the ORM.

```ts
// lib/dal/session.ts
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

export type Session = {
  sessionId: string
  userId: string
  role: 'member' | 'admin'
}

export class AuthError extends Error {
  constructor(readonly status: 401 | 403) {
    super(status === 401 ? 'Authentication required' : 'Not allowed')
    this.name = 'AuthError'
  }
}

function signingKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

// The only provider-specific code in the DAL. Swap this body for your auth library.
async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get('session')?.value
  if (!token) return null

  let sessionId: string
  try {
    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ['HS256'] })
    if (typeof payload.sid !== 'string') return null
    sessionId = payload.sid
  } catch {
    return null // bad signature, expired token, or malformed cookie
  }

  // The signature proves we issued the cookie. The database proves it still counts.
  const record = await db.session.findUnique({
    where: { id: sessionId },
    select: { userId: true, expiresAt: true, revokedAt: true, user: { select: { role: true } } },
  })
  if (!record || record.revokedAt || record.expiresAt <= new Date()) return null

  return { sessionId, userId: record.userId, role: record.user.role }
}

// Deduplicated within a render, so ten components cost one lookup
export const getSession = cache(readSession)

// Pages and layouts: send signed-out users to the login page
export async function verifySession(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

// Data functions: fail closed with a status the caller can translate
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) throw new AuthError(401)
  return session
}

export async function requireRole(role: Session['role']): Promise<Session> {
  const session = await requireSession()
  if (session.role !== role) throw new AuthError(403)
  return session
}
```

Key implementation decisions:

- **`readSession()` is the authoritative check.** A valid signature isn't enough. The session row has to exist, be unexpired, and not be revoked, so signing out everywhere or banning a user takes effect on the next request. Proxy keeps its cheap signature-only check for redirects.
- **The role comes from the database, not the token.** A demoted admin loses access on their next request instead of whenever a token happens to expire.
- **Only token problems mean "signed out."** A database outage throws and surfaces as a 500 instead of quietly logging everyone out.
- **`cache()` only dedupes within a render.** A page that makes ten DAL calls does one session lookup. Server Actions and Route Handlers aren't part of a render pass, so each DAL call there runs its own lookup.

The four exported helpers differ only in what happens when there's no valid session:

| Function | With no valid session | Use it in |
|----------|-----------------------|-----------|
| `getSession()` | Returns `null` | UI that branches, like a header with a "Sign in" link |
| `verifySession()` | Redirects to `/login` | Pages and layouts |
| `requireSession()` | Throws `AuthError(401)` | DAL data functions |
| `requireRole()` | Throws `AuthError(401)` or `AuthError(403)` | DAL functions that need a role |

### The Data Functions

```ts
// lib/dal/invoices.ts
import 'server-only'
import { db } from '@/lib/db'
import { requireRole, requireSession } from './session'

// The only invoice fields that ever leave the DAL
const invoiceFields = {
  id: true,
  number: true,
  amountCents: true,
  status: true,
  dueDate: true,
} as const

export type InvoiceDTO = {
  id: string
  number: string
  amountCents: number
  status: 'draft' | 'sent' | 'paid'
  dueDate: Date
}

export async function getMyInvoices(): Promise<InvoiceDTO[]> {
  const { userId } = await requireSession()
  return db.invoice.findMany({
    where: { userId },
    select: invoiceFields,
    orderBy: { dueDate: 'desc' },
  })
}

export async function getInvoice(invoiceId: string): Promise<InvoiceDTO | null> {
  const { userId } = await requireSession()
  // Ownership lives in the query, so another user's invoice ID finds nothing
  return db.invoice.findFirst({
    where: { id: invoiceId, userId },
    select: invoiceFields,
  })
}

export async function markInvoicePaid(invoiceId: string): Promise<boolean> {
  const { userId } = await requireSession()
  const { count } = await db.invoice.updateMany({
    where: { id: invoiceId, userId, status: 'sent' },
    data: { status: 'paid' },
  })
  return count === 1
}

export async function getOverdueInvoices(): Promise<InvoiceDTO[]> {
  await requireRole('admin')
  return db.invoice.findMany({
    where: { status: 'sent', dueDate: { lt: new Date() } },
    select: invoiceFields,
  })
}
```

```ts
// lib/dal/index.ts
export { AuthError, getSession, verifySession, type Session } from './session'
export { getInvoice, getMyInvoices, getOverdueInvoices, markInvoicePaid } from './invoices'
```

`invoiceFields` is the DTO in practice: an allowlist of columns. Adding a `stripeCustomerId` or `internalNotes` column later doesn't quietly ship it to the browser. `getInvoice()` returns `null` for an invoice that belongs to someone else, which tells a curious user nothing about whether it exists. And `requireSession()` and `requireRole()` stay out of the index file, so app code can only reach data through a function that already checks.

### Calling the DAL from Every Context

The same functions work in all three server contexts. What changes is how each one responds to an `AuthError`.

```tsx
// app/dashboard/invoices/page.tsx
import { getMyInvoices, verifySession } from '@/lib/dal'
import { InvoiceList } from './invoice-list'

export default async function InvoicesPage() {
  await verifySession() // signed-out users get a redirect, not an error page
  const invoices = await getMyInvoices() // checks again, using the cached lookup
  return <InvoiceList invoices={invoices} />
}
```

```ts
// app/dashboard/invoices/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { AuthError, markInvoicePaid } from '@/lib/dal'

export async function markPaid(invoiceId: unknown) {
  // Arguments come from the client, whatever the call site's types say
  if (typeof invoiceId !== 'string') return { ok: false, error: 'Invalid invoice' }

  try {
    const updated = await markInvoicePaid(invoiceId)
    if (!updated) return { ok: false, error: 'Invoice not found' }
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, error: error.message }
    throw error
  }

  revalidatePath('/dashboard/invoices')
  return { ok: true }
}
```

```ts
// app/api/invoices/route.ts
import { AuthError, getMyInvoices } from '@/lib/dal'

export async function GET() {
  try {
    return Response.json(await getMyInvoices())
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    throw error
  }
}
```

The page redirects, the action returns a result the form can display, and the Route Handler answers with a `401` instead of the 307 redirect from the first section. The allow-or-deny decision happens once, in the DAL, and none of the three call sites can skip it. The sections on each context go deeper, including bearer tokens for Route Handlers that mobile clients call.

If you've turned on the experimental [`authInterrupts`](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts) flag, `unauthorized()` and `forbidden()` from `next/navigation` can replace `AuthError` in pages and Route Handlers. A typed error works today, without a flag.

### Keeping the DAL the Only Way In

Two guards turn the rules into build errors. The first is `import 'server-only'` at the top of every DAL file, which fails the build if a Client Component imports it (install it with `npm install server-only`). The second is a lint rule that stops app code from importing the database client directly:

```js
// eslint.config.mjs
export default [
  // ...your existing config
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/lib/db', '**/lib/db'],
          message: 'Read and write data through @/lib/dal so every query checks the session.',
        }],
      }],
    },
  },
]
```

With that rule on, the fixed page from the last section fails lint, because it imports `db` directly. That's the point. It was safe only as long as everyone remembered the check.

A request for invoice data now passes four checks. Proxy turns signed-out users away early. The page redirects anyone Proxy missed. The DAL refuses anyone the page missed. The ownership filter refuses requests for someone else's invoices. Proxy or the page can fail and the worst outcome is a confusing error page. The DAL is the layer that can't fail, which is why every function in it checks for itself and why it's the only code allowed near the database.

Proxy decides where a request goes. The DAL decides what it gets.
