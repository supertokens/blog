---
title: "CORS Errors Explained: Every Browser Error Message and How to Fix It"
description: "Look up your exact CORS error message, see what causes it and fix it. Tested Express, Next.js and Nginx configs, plus preflight, credentials and debugging tips."
date: "2025-07-20"
updated: "2026-11-23"
cover: "cors_errors.png"
category: "cors errors, development tips, best practices"
author: "Maurice Saldivar"
---

**A CORS error means the browser blocked your JavaScript from reading a cross-origin response because the server didn't send the right `Access-Control-Allow-*` headers. The request usually reached the server. Fix it on the server: return `Access-Control-Allow-Origin` with your exact frontend origin, answer `OPTIONS` preflights with a 2xx, and add `Access-Control-Allow-Credentials: true` when sending cookies.**

*Last updated 23 November 2026. Error messages captured from Chromium 156 and checked against [MDN's Firefox CORS error reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors). Config snippets tested with Express 5.3 and `cors` 2.8.6, Next.js 16.4 and Nginx 1.30.*

## Table of Contents

- [What is a CORS error and why does it happen?](#what-is-a-cors-error-and-why-does-it-happen)
- [CORS error lookup table: message, cause, fix](#cors-error-lookup-table-message-cause-fix)
- [Common CORS errors in detail](#common-cors-errors-and-what-they-mean)
- [Fix CORS in Express](#nodejs--express-with-the-cors-package)
- [Fix CORS in Next.js](#nextjs-route-handlers-proxy-and-nextconfig-headers)
- [Fix CORS in Nginx](#nginx-reverse-proxy)
- [CORS and authentication](#cors-and-authentication)
- [Debugging CORS issues](#debugging-cors-issues)
- [Frequently Asked Questions](#frequently-asked-questions)

## What Is a CORS Error and Why Does It Happen?

### What Is CORS?

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that controls whether JavaScript running on one website can access resources from another. For a deeper introduction, see [What is Cross-Origin Resource Sharing (CORS)?](https://supertokens.com/blog/what-is-cross-origin-resource-sharing). It relaxes the **Same-Origin Policy (SOP)** — the browser's fundamental security boundary that prevents one site from reading data belonging to another.

An **origin** is defined by three components:

- **Protocol** — `http://` vs. `https://`
- **Domain** — `example.com` vs. `api.example.com`
- **Port** — `:3000` vs. `:8080`

Any difference in these components makes a request *cross-origin*, which requires explicit permission from the target server.

```javascript
// Same-origin requests (no CORS needed)
fetch('/api/users')                        // Relative URL
fetch('https://myapp.com/api/data')        // Matches protocol, domain, and port

// Cross-origin requests (CORS required)
fetch('https://api.myapp.com/users')       // Different subdomain
fetch('http://myapp.com/api/users')        // Different protocol
fetch('https://myapp.com:8080/api/users')  // Different port
```

The Same-Origin Policy exists to prevent malicious websites from silently reading your data from other sites — like your email, banking details, or session tokens.

### What Triggers a CORS Error?

A CORS error occurs when your browser blocks a response because the server didn't include the required permission headers. Here's what typically happens:

1. Your frontend at `http://localhost:3000` makes a request to `https://api.yourservice.com`
2. The browser detects a cross-origin request
3. The request is sent to the server
4. The server responds **without** CORS headers
5. The browser blocks JavaScript from reading the response
6. A CORS error appears in the console

> **Critical insight:** The request often completes successfully on the server. CORS doesn't prevent requests — it prevents your JavaScript from *reading* the response. This distinction matters when debugging issues like duplicate database records despite seeing a console error.

### CORS Preflight and Simple Requests

The browser categorizes HTTP requests into two types for CORS purposes.

**Simple requests** proceed without a preflight check:
- Methods: `GET`, `HEAD`, or `POST`
- No custom headers
- `Content-Type` limited to `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`

> **Terminology note:** The term "simple requests" comes from the older CORS spec. The current [Fetch Standard](https://fetch.spec.whatwg.org/) doesn't use this term, but browser behavior remains the same: these requests are sent directly, and the browser checks the `Access-Control-Allow-Origin` response header afterward.

**Preflighted requests** require an `OPTIONS` check first:
- Any method other than `GET`, `HEAD`, or `POST`
- Custom headers like `Authorization` or `X-API-Key`
- `POST` with `Content-Type: application/json`

Here's the full preflight flow:

```http
# 1. Browser sends preflight (OPTIONS)
OPTIONS /api/users HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# 2. Server grants permission
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Vary: Origin

# 3. Browser sends actual request
POST /api/users HTTP/1.1
Origin: http://localhost:3000
Content-Type: application/json

{"name": "New User"}

# 4. Server responds (must include CORS headers again)
HTTP/1.1 201 Created
Access-Control-Allow-Origin: http://localhost:3000

{"id": 123, "name": "New User"}
```

This two-step process explains why JSON API calls appear slower in browsers than in Postman — browsers complete the preflight first, while tools like Postman bypass CORS entirely.

---

## CORS Error Lookup Table: Message, Cause, Fix

Find the message from your browser console in the first column. Chrome and Edge (and other Chromium browsers) print it after "Access to fetch at '…' from origin '…' has been blocked by CORS policy:". Firefox prints a shorter "Reason:" line, linked here to MDN's page for it.

| Error message | What it means | Fix |
|---|---|---|
| **Chrome/Edge:** "No 'Access-Control-Allow-Origin' header is present on the requested resource."<br>**Firefox:** [CORS header 'Access-Control-Allow-Origin' missing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowOrigin) | The response has no `Access-Control-Allow-Origin` header. Often it's an error page (404, 500) from a server or proxy that doesn't add CORS headers to errors. | Return `Access-Control-Allow-Origin: <your frontend origin>` on every response, including errors (in Nginx, use `always`). |
| **Chrome/Edge:** "Response to preflight request doesn't pass access control check: It does not have HTTP ok status."<br>**Firefox:** [CORS preflight channel did not succeed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSPreflightDidNotSucceed) | The `OPTIONS` preflight got a non-2xx response, usually 401/403 from auth middleware, 404 or 405 because no route handles `OPTIONS`, or a 500. | Answer `OPTIONS` with 204 before authentication runs. Don't require auth on preflights; browsers never send credentials with them. |
| **Chrome/Edge:** "Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource."<br>**Firefox:** [CORS header 'Access-Control-Allow-Origin' missing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowOrigin) | The preflight returned 2xx but without CORS headers, for example an automatic `OPTIONS` response from your framework. | Make your CORS middleware run for `OPTIONS` requests and add the headers there. |
| **Chrome/Edge:** "The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'."<br>**Firefox:** [Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials) | You're sending cookies (`credentials: 'include'` or `withCredentials: true`), and the server answers `*`. | Reflect the exact origin from an allow-list instead of `*`, and add `Vary: Origin`. |
| **Chrome/Edge:** "The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'."<br>**Firefox:** [expected 'true' in CORS header 'Access-Control-Allow-Credentials'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMIssingAllowCredentials) | The origin is allowed, but the server didn't opt in to credentials. | Add `Access-Control-Allow-Credentials: true` (in the `cors` package: `credentials: true`). |
| **Chrome/Edge:** "Request header field x-api-key is not allowed by Access-Control-Allow-Headers in preflight response."<br>**Firefox:** [missing token 'xyz' in CORS header 'Access-Control-Allow-Headers' from CORS preflight channel](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowHeaderFromPreflight) | Your request sends a header (here `X-API-Key`) that the preflight response doesn't list. | Add the header to `Access-Control-Allow-Headers`, or stop sending it. |
| **Chrome/Edge:** "Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response."<br>**Firefox:** [Did not find method in CORS header 'Access-Control-Allow-Methods'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMethodNotFound) | The preflight response doesn't list the method you're using. | Add the method to `Access-Control-Allow-Methods`. |
| **Chrome/Edge:** "Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request." | The `OPTIONS` request got a 301/302/307/308, typically HTTP→HTTPS, a trailing-slash redirect or a redirect to a login page. | Call the final URL directly (correct scheme, host and trailing slash), and don't redirect `OPTIONS` requests. |
| **Chrome/Edge:** "The 'Access-Control-Allow-Origin' header has a value 'https://app.example.com' that is not equal to the supplied origin."<br>**Firefox:** [CORS header 'Access-Control-Allow-Origin' does not match 'xyz'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSAllowOriginNotMatchingOrigin) | The server allows a different origin. Common causes: `www` vs no `www`, `http` vs `https`, a different port, or a cached response for another origin. | Add the exact origin (scheme + host + port) to the allow-list and send `Vary: Origin`. |
| **Chrome/Edge:** "The 'Access-Control-Allow-Origin' header contains multiple values '…, …', but only one is allowed."<br>**Firefox:** [Multiple CORS header 'Access-Control-Allow-Origin' not allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMultipleAllowOriginNotAllowed) | Two layers both add the header (say, Nginx and your app), or you put a comma-separated list in it. | Set CORS headers in exactly one place, and send a single origin per response. |

---

## Common CORS Errors and What They Mean

### "No 'Access-Control-Allow-Origin' header is present"

The most common CORS error. The server processed the request but didn't include the header that authorizes your origin to read the response.

```javascript
fetch('https://api.coolservice.com/data')
  .then(res => res.json())
  .then(data => console.log(data))

// Error:
// Access to fetch at 'https://api.coolservice.com/data' from origin
// 'http://localhost:3000' has been blocked by CORS policy:
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

For servers you control:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});
```

For third-party APIs, you'll need a **proxy server** or the API must natively support CORS.

### "Method not allowed by Access-Control-Allow-Methods"

The server accepts cross-origin requests, but not the HTTP method you're using.

```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer token' }
})

// Error:
// Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
```

Common causes: missing `OPTIONS` endpoint handler, or incomplete method list in the CORS configuration.

### "Credentialed requests not supported" (wildcard + credentials conflict)

This error appears when you send cookies or auth headers cross-origin but the server uses a wildcard origin.

```javascript
fetch('https://api.example.com/profile', {
  credentials: 'include'
})

// Error:
// The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*'
// when the request's credentials mode is 'include'.
```

When credentials are involved, the server must:
- Specify an **exact origin** (not `*`)
- Include `Access-Control-Allow-Credentials: true`

```javascript
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
res.header('Access-Control-Allow-Credentials', 'true');
```

This is a hard browser rule: `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` will always be rejected. Any server misconfigured this way exposes sensitive user data.

### CORS Errors in Fetch vs. Axios

Fetch and Axios handle CORS failures differently:

```javascript
// Fetch — generic, unhelpful error message
fetch('https://api.example.com/data')
  .catch(error => {
    console.log(error.message); // "Failed to fetch" (no detail)
  });

// Axios — structured error information
axios.get('https://api.example.com/data')
  .catch(error => {
    if (error.response) {
      console.log('Server error:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.message);
    }
  });
```

Also note: Axios automatically sets `Content-Type: application/json` on requests with a body, which triggers a preflight. Any interceptors that add custom headers will also trigger preflight. Check your Axios configuration if requests fail even on seemingly "simple" endpoints.

---

## How to Fix CORS Errors: Backend Configuration

CORS is fundamentally a **server-side configuration problem**. Frontend workarounds can help during development, but production requires proper backend setup.

### Setting CORS Headers Manually

```javascript
// Exact origin (required for credentialed requests)
res.header('Access-Control-Allow-Origin', 'https://app.example.com');

// Allowed methods
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

// Allowed request headers
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

// Allow cookies and auth headers
res.header('Access-Control-Allow-Credentials', 'true');

// Cache the preflight result (seconds). Chromium caps this at 7200 (2 hours),
// Firefox at 86400 (24 hours).
res.header('Access-Control-Max-Age', '7200');

// IMPORTANT: Tell caches that responses vary by origin
res.header('Vary', 'Origin');
```

> **Why `Vary: Origin` matters:** When your server dynamically reflects the requesting origin (rather than using `*`), you must include `Vary: Origin` in your responses. Without it, CDNs and shared caches may serve a response with one origin's `Access-Control-Allow-Origin` to a different origin — which either breaks CORS or creates a security hole.

### Node.js / Express with the `cors` Package

This works with Express 5 (the current major version) and Express 4:

```javascript
// server.js (Express 5 + cors 2.8)
const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = new Set([
  "https://app.example.com",
  "http://localhost:3000",
]);

const corsOptions = {
  origin(origin, callback) {
    // Requests with no Origin header (curl, server-to-server) aren't CORS requests.
    // Allowed origins get their origin reflected back; anything else gets no CORS headers.
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true, // sends Access-Control-Allow-Credentials: true
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 7200, // Chromium caps preflight caching at 2 hours anyway
};

// Before your routes. This also answers OPTIONS preflights with 204,
// so you don't need app.options("*") (that path syntax throws in Express 5).
app.use(cors(corsOptions));

app.get("/api/profile", (req, res) => res.json({ name: "Ada" }));
app.delete("/api/items/:id", (req, res) => res.sendStatus(204));

app.listen(4000);
```

Two things that trip people up:

- **`app.options('*', cors())` crashes Express 5** with `Missing parameter name at index 1: *`, because Express 5's router no longer accepts a bare `*`. You don't need it: `app.use(cors(...))` already answers preflights for every route.
- **Rejecting with `callback(new Error(...))` turns a blocked origin into a 500.** Passing `false` instead just omits the CORS headers, so the browser blocks the response and your logs stay clean.

The `cors` package adds `Vary: Origin` automatically when it reflects an origin. Checked with curl, the config above returns:

```http
OPTIONS /api/items/1   Origin: http://localhost:3000
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Vary: Origin
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Max-Age: 7200
```

### Next.js: Route Handlers, Proxy and `next.config` Headers

Next.js gives you three places to set CORS headers. Pick one per route, not all three, or you'll get the "multiple values" error.

**1. In a Route Handler** (App Router). Best when only a few routes are called cross-origin. Export an `OPTIONS` handler for the preflight and add the headers to each response:

```typescript
// app/api/data/route.ts
const allowedOrigins = ["https://app.example.com", "http://localhost:3000"];

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: "Origin" };
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return headers;
}

// Answers the browser's preflight
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request.headers.get("origin")),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "7200",
    },
  });
}

export async function GET(request: Request) {
  return Response.json(
    { message: "hello" },
    { headers: corsHeaders(request.headers.get("origin")) },
  );
}
```

**2. In `proxy.ts`** (called `middleware.ts` before Next.js 16). Best for a whole group of API routes. It answers preflights before they reach a route, and adds headers to everything else:

```typescript
// proxy.ts (called middleware.ts before Next.js 16)
import { NextResponse, type NextRequest } from "next/server";

const allowedOrigins = ["https://app.example.com", "http://localhost:3000"];

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = allowedOrigins.includes(origin);

  // Preflight: answer it here, before it reaches a route
  if (request.method === "OPTIONS") {
    const headers: Record<string, string> = { Vary: "Origin" };
    if (isAllowed) {
      Object.assign(headers, {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "7200",
      });
    }
    return new NextResponse(null, { status: 204, headers });
  }

  // Actual request: let it through, then add the CORS headers
  const response = NextResponse.next();
  response.headers.set("Vary", "Origin");
  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return response;
}

export const config = { matcher: "/api/:path*" };
```

On Next.js 15 or earlier, name the file `middleware.ts` and the function `middleware`.

**3. In `next.config` headers.** Simplest, but static: you can allow only one fixed origin, because the config can't read the request's `Origin`. Fine for a single known frontend without cookies:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/public/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://app.example.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

All three were tested on a production build (`next build && next start`) with curl. If your frontend calls an API on another domain only to dodge CORS, a [`rewrites()` proxy](#what-actually-works-dev-proxy) that makes the request same-origin is often simpler than any of these.

### Nginx (Reverse Proxy)

If Nginx sits in front of your app, you can handle CORS there. Use a `map` as the allow-list, answer preflights directly, and add `always` so the headers are also sent on error responses:

```nginx
# Allow-list: map the request's Origin to itself if allowed, else to "".
# (map goes in the http {} context; conf.d/*.conf files are included there.)
map $http_origin $cors_origin {
    default                     "";
    "https://app.example.com"   $http_origin;
    "http://localhost:3000"     $http_origin;
}

server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        # Preflight: answer it here, don't pass it to the app.
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin      $cors_origin always;
            add_header Access-Control-Allow-Credentials "true" always;
            add_header Access-Control-Allow-Methods     "GET, POST, PUT, DELETE" always;
            add_header Access-Control-Allow-Headers     "Content-Type, Authorization" always;
            add_header Access-Control-Max-Age           7200 always;
            add_header Vary                             Origin always;
            return 204;
        }

        # Actual request. "always" keeps the headers on 4xx/5xx responses too,
        # so the browser shows your API's real error instead of a CORS error.
        add_header Access-Control-Allow-Origin      $cors_origin always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Vary                             Origin always;

        proxy_pass http://app:4000;
        # If the app also sets CORS headers, strip them so they aren't duplicated:
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Credentials;
    }
}
```

Why each piece matters:

- **When `$cors_origin` is empty, Nginx doesn't send the header at all**, so disallowed origins are blocked by the browser.
- **Without `always`**, `add_header` only applies to 2xx and 3xx responses. A 404 or 500 from your app then arrives without CORS headers, and the browser reports a CORS error instead of the real one.
- **`add_header` directives aren't inherited** into a block that has its own `add_header`. That's why the preflight branch repeats every header.
- **`proxy_hide_header`** prevents the "multiple values" error when the upstream app sets CORS headers too.

Tested with `nginx -t` and curl on Nginx 1.30.7 in front of the Express app above.

### Flask (Python)

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Flask-CORS answers preflights and reflects allowed origins (with Vary: Origin).
# Don't also set CORS headers in an after_request hook: you'd send them twice.
CORS(
    app,
    origins=["https://app.example.com", "http://localhost:3000"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE"],
)
```

### Django (Python)

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://app.example.com",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'x-csrftoken',
]
```

### Spring Boot (Java)

```java
// Don't add @EnableWebMvc in Spring Boot: it switches off Boot's MVC auto-configuration.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://app.example.com", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## Frontend Considerations

### What Doesn't Work

**Adding CORS headers on the frontend has no effect.** CORS headers are server responses — the browser ignores them if you try to set them in a `fetch()` call:

```javascript
// This does nothing — CORS headers belong on the server
fetch('https://api.example.com/data', {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})
```

**`no-cors` mode makes responses unreadable.** You can send the request, but JavaScript cannot access the response body:

```javascript
fetch('https://api.example.com/data', { mode: 'no-cors' })
  .then(response => response.json()) // Throws — response is "opaque"
```

### What Actually Works: Dev Proxy

Route your frontend through a local proxy during development so requests appear same-origin:

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*'
      }
    ];
  }
};
```

---

## CORS and Authentication

Authentication adds extra complexity to CORS because credentials require stricter rules.

### Why Credentials Change Everything

When you send cookies or HTTP auth headers cross-origin (using `credentials: 'include'`), the browser enforces two additional rules:

1. `Access-Control-Allow-Origin` must be an **exact origin**, never `*`
2. The server must return `Access-Control-Allow-Credentials: true`

```javascript
// Frontend
fetch('https://api.example.com/profile', {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
});
```

```javascript
// Backend
res.header('Access-Control-Allow-Origin', 'https://app.example.com'); // Exact origin
res.header('Access-Control-Allow-Credentials', 'true');
```

### Cookie Configuration for Cross-Origin Auth

For cross-origin cookies to work at all, they must be set with `SameSite=None` and `Secure`:

```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,        // HTTPS required
  sameSite: 'none'     // Required for cross-origin
});
```

> **Browser note:** Safari is notably stricter about cross-origin cookies than Chrome or Firefox. If your auth flows work in Chrome but fail in Safari, this is usually the cause. Third-party cookie restrictions in Safari's ITP (Intelligent Tracking Prevention) can block credentialed CORS requests even with correct headers.

Getting this cookie configuration right by hand is error-prone, which is one reason many teams reach for a dedicated session-management layer. [SuperTokens](https://supertokens.com) sets its session cookies' `SameSite` and `Secure` flags based on your website and API domains (see [session security settings](https://supertokens.com/docs/post-authentication/session-management/security)), and `supertokens.getAllCORSHeaders()` returns the extra headers your CORS config must allow. The [quickstart shows the CORS setup](https://supertokens.com/docs/quickstart#23-add-the-supertokens-apis-and-configure-cors) for each backend framework. If you're weighing cookies against other storage options, see [Cookies vs. `localStorage` for sessions](https://supertokens.com/blog/cookies-vs-localstorage-for-sessions-everything-you-need-to-know) and [how session-based authentication works](https://supertokens.com/blog/session-based-authentication).

---

## Security Best Practices

### 1. Never Use Wildcard Origins in Production

`Access-Control-Allow-Origin: *` disables all the security benefits of CORS for that endpoint. Any website can read responses from your API.

```javascript
// Environment-aware origin whitelist
const allowedOrigins = {
  production: ['https://app.yourcompany.com', 'https://www.yourcompany.com'],
  staging:    ['https://staging.yourcompany.com'],
  development: ['http://localhost:3000', 'http://localhost:3001']
};

app.use(cors({
  origin: (origin, callback) => {
    const env = process.env.NODE_ENV || 'development';
    const allowed = allowedOrigins[env];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS rejected: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  }
}));
```

**Exception:** Public, read-only APIs with no user data or authentication can safely use `*`.

### 2. Limit Methods and Headers to What You Need

Only allow the HTTP methods and headers your application actually uses. Every additional method or header is additional attack surface.

```javascript
// Too permissive — avoid in production
res.header('Access-Control-Allow-Methods', '*');

// Better — list only what's needed
res.header('Access-Control-Allow-Methods', 'GET, POST');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

If `DELETE` is allowed but not needed, an attacker could potentially trigger deletion via a CSRF attack.

### 3. Always Set `Vary: Origin`

When dynamically reflecting the requesting origin (the most common production pattern), include `Vary: Origin` to prevent cache poisoning:

```javascript
// When reflecting origin dynamically, always add Vary
if (allowedOrigins.includes(req.headers.origin)) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Vary', 'Origin');
}
```

Without this, a CDN may cache a response with `Access-Control-Allow-Origin: https://app.example.com` and serve it to a request from a different origin.

### 4. Log and Monitor CORS Rejections

Blocked requests may indicate misconfiguration or active probing:

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS' || req.headers.origin) {
    const allowed = isAllowedOrigin(req.headers.origin);
    if (!allowed) {
      console.warn('[CORS Rejected]', {
        origin: req.headers.origin,
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
      });
    }
  }
  next();
});
```

### 5. Consider `Sec-Fetch-*` Headers as a Defense Layer

Modern browsers send `Sec-Fetch-Site`, `Sec-Fetch-Mode`, and `Sec-Fetch-Dest` headers on requests to HTTPS (and localhost) URLs. These headers are set by the browser and cannot be forged by JavaScript, making them a useful complement to CORS for server-side request validation:

```javascript
app.use((req, res, next) => {
  const fetchSite = req.headers['sec-fetch-site'];
  // 'same-origin', 'same-site', 'cross-site', or 'none' (direct navigation)
  if (fetchSite === 'cross-site' && req.method !== 'GET') {
    // Consider additional validation for cross-site non-GET requests
  }
  next();
});
```

This isn't a CORS replacement, but a complementary layer alongside CSRF tokens and Content Security Policy.

---

## Debugging CORS Issues

### Browser Developer Tools

Open the **Network tab** and look for:

- `OPTIONS` requests before your main request (preflight)
- The response headers on the OPTIONS request — these show what the server actually allows
- The presence or absence of `Access-Control-Allow-Origin` on the actual response

```
# Healthy flow
OPTIONS /api/users   204          (preflight approved)
POST    /api/users   201          (request succeeded)

# CORS failure
OPTIONS /api/users   CORS error   (preflight rejected; the POST is never sent)
```

> **Note:** The browser *console* shows the specific reason (see the [lookup table](#cors-error-lookup-table-message-cause-fix)), but your JavaScript doesn't get it: `fetch` just rejects with `TypeError: Failed to fetch`. That's deliberate, so scripts can't probe other sites. Use the console message and the Network tab's response headers to debug.

### Testing with `curl`

Simulate a preflight request without a browser:

```bash
curl -X OPTIONS https://api.production.com/users \
  -H "Origin: https://app.production.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v 2>&1 | grep -i "access-control"
```

Expected output:
```
access-control-allow-origin: https://app.production.com
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: content-type, authorization
```

### Infrastructure Checklist

Production CORS failures are often caused by infrastructure, not application code:

- **CDNs** may strip or cache CORS headers incorrectly (Cloudflare, CloudFront, etc.)
- **Load balancers** may block `OPTIONS` requests
- **Reverse proxies** (nginx, Apache) may need explicit pass-through configuration
- **Missing environment variables** may cause the server to fall back to a wrong origin list

Always test with `curl` directly against your origin server and then again through your CDN to isolate where headers are being dropped.

### Enhanced Debug Logging

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS' || req.headers.origin) {
    console.log('[CORS Debug]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      origin: req.headers.origin,
      requestedMethod: req.headers['access-control-request-method'],
      requestedHeaders: req.headers['access-control-request-headers'],
    });
  }
  next();
});
```

---

## Emergency Fix and Production Verification

### Emergency Fix (Temporary Only)

If production is broken and you need to buy time:

```javascript
app.use((req, res, next) => {
  console.warn('EMERGENCY CORS MODE — REMOVE BEFORE NEXT DEPLOY');

  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
```

Tighten this immediately once the immediate incident is resolved.

### Production Deployment Verification Script

```bash
#!/bin/bash
API_DOMAIN="https://api.example.com"
FRONTEND_DOMAIN="https://app.example.com"

echo "=== Testing preflight ==="
curl -s -X OPTIONS "$API_DOMAIN/api/test" \
  -H "Origin: $FRONTEND_DOMAIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -I | grep -i "access-control\|vary"

echo ""
echo "=== Testing actual request ==="
curl -s -X GET "$API_DOMAIN/api/health" \
  -H "Origin: $FRONTEND_DOMAIN" \
  -I | grep -i "access-control\|vary"
```

---

## CORS Quick Reference

### All CORS Response Headers

| Header | Purpose | Required? |
|--------|---------|-----------|
| `Access-Control-Allow-Origin` | Which origins can access the response | Always |
| `Access-Control-Allow-Methods` | Allowed HTTP methods (preflight response) | For preflighted requests |
| `Access-Control-Allow-Headers` | Allowed request headers (preflight response) | For custom headers |
| `Access-Control-Allow-Credentials` | Whether cookies/auth are allowed | For credentialed requests |
| `Access-Control-Max-Age` | How long to cache the preflight result (seconds; Chromium caps at 7200, Firefox at 86400) | Optional but recommended |
| `Access-Control-Expose-Headers` | Which response headers JS can read | When using non-standard headers |
| `Vary: Origin` | Signals that responses differ by origin | When reflecting dynamic origins |

### Developer Checklist

**Before shipping to production:**

- [ ] No wildcard `*` origins on authenticated or credentialed endpoints
- [ ] `Vary: Origin` header set on all responses that reflect a dynamic origin
- [ ] `OPTIONS` preflight handled correctly for all relevant routes
- [ ] `Access-Control-Allow-Credentials: true` only where cookies/auth are needed
- [ ] Allowed methods and headers scoped to only what your app uses
- [ ] CORS rejection events are logged
- [ ] Configuration tested against your CDN or reverse proxy, not just the app server
- [ ] Cookie `SameSite=None; Secure` set if using cross-origin session cookies
- [ ] Cross-browser tested (especially Safari for credentialed flows)

---

## Summary

CORS is not a bug to bypass — it's a browser security mechanism working exactly as designed. Every CORS error is telling you that a server hasn't explicitly authorized the cross-origin access being requested.

The key principles:

- **CORS is server-configured.** No frontend workaround substitutes for proper server headers.
- **Credentials change the rules.** Wildcard origins are forbidden when cookies or auth headers are involved.
- **Reflect origins dynamically, then `Vary`.** Don't echo `req.headers.origin` back without also setting `Vary: Origin`.
- **Infrastructure matters.** CDNs, load balancers, and proxies can silently strip or cache CORS headers.
- **Preflight must succeed.** `OPTIONS` requests must be handled for any non-simple cross-origin request.

With correct configuration, CORS becomes an ally rather than an obstacle — enforcing the right trust boundaries while letting your legitimate cross-origin traffic flow freely.

## Frequently Asked Questions

### Why does my request work in Postman or curl but fail in the browser?
CORS is enforced by browsers, not servers. Postman and curl don't apply the Same-Origin Policy, so they show the response no matter which headers the server sends. In a browser, JavaScript on another origin can only read the response if the server returns the right Access-Control-Allow-Origin header.

### Can I fix a CORS error from the frontend?
No. CORS headers have to come from the server that sends the response. Setting Access-Control-Allow-Origin on your fetch request does nothing, and mode: 'no-cors' gives you an opaque response you can't read. If you don't control the API, call it through your own backend or a same-origin proxy such as a Vite proxy or Next.js rewrites.

### Is it safe to allow all origins with a wildcard?
Only for public, read-only data that needs no cookies or auth. A wildcard lets any website read the response, and browsers reject it entirely when the request includes credentials. For anything user-specific, return the exact origin from an allow-list and add Vary: Origin.

### Why is there an OPTIONS request before my POST?
That's the CORS preflight. Browsers send it before cross-origin requests that use methods other than GET, HEAD or POST, custom headers such as Authorization, or a Content-Type like application/json. The server must answer it with a 2xx status and the matching Access-Control-Allow-* headers, or the real request is never sent.

### Does a CORS error mean the request didn't reach the server?
Not necessarily. For simple requests, the server receives and processes the request, and the browser only blocks your JavaScript from reading the response. So a blocked POST can still create a record. For preflighted requests, a failed preflight means the real request is never sent.

### How do I allow multiple origins?
Access-Control-Allow-Origin takes exactly one origin. To allow several, keep an allow-list on the server, check the request's Origin header against it, and echo back the matching origin. Add Vary: Origin so caches don't serve one origin's response to another.

## Related reading

- [What Is Cross-Origin Resource Sharing (CORS)?](https://supertokens.com/blog/what-is-cross-origin-resource-sharing)
- [HTTP Error Codes: 401 vs. 403](https://supertokens.com/blog/http-error-codes-401-vs-403)
- [What Is a 502 Bad Gateway Error and How to Fix It](https://supertokens.com/blog/what-is-502-bad-gateway-error)
- [Cookies vs. `localStorage` for Sessions](https://supertokens.com/blog/cookies-vs-localstorage-for-sessions-everything-you-need-to-know)
- [OAuth vs JWT: Key Differences Explained](https://supertokens.com/blog/oauth-vs-jwt)
- [Session-Based Authentication: How It Works](https://supertokens.com/blog/session-based-authentication)