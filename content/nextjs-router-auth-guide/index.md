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
