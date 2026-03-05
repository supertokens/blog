---
title: Fixing CORS Errors What They Are and How to Resolve Them
description: "Learn what causes CORS errors, how they impact your web app, and how to fix them securely with proper headers and backend configurations."
date: "2025-07-20"
cover: "cors_errors.png"
category: "cors errors, development tips, best practices"
author: "Maurice Saldivar"
---

## What Is a CORS Error and Why Does It Happen?

### What Is CORS?

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that controls whether JavaScript running on one website can access resources from another. It extends the **Same-Origin Policy (SOP)** — the browser's fundamental security boundary that prevents one site from reading data belonging to another.

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

// Cache preflight for 24 hours (reduces OPTIONS round-trips)
res.header('Access-Control-Max-Age', '86400');

// IMPORTANT: Tell caches that responses vary by origin
res.header('Vary', 'Origin');
```

> **Why `Vary: Origin` matters:** When your server dynamically reflects the requesting origin (rather than using `*`), you must include `Vary: Origin` in your responses. Without it, CDNs and shared caches may serve a response with one origin's `Access-Control-Allow-Origin` to a different origin — which either breaks CORS or creates a security hole.

### Node.js / Express with the `cors` Package

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://app.example.com',
      'https://admin.example.com',
      'http://localhost:3000'
    ];

    // Allow server-to-server requests (no origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Explicitly handle preflight for all routes
app.options('*', cors(corsOptions));
```

### Flask (Python)

```python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://app.example.com"], supports_credentials=True)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ['https://app.example.com', 'http://localhost:3000']:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Vary'] = 'Origin'
    return response
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
@Configuration
@EnableWebMvc
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

Modern browsers send `Sec-Fetch-Site`, `Sec-Fetch-Mode`, and `Sec-Fetch-Dest` headers with every request. These headers are set by the browser and cannot be forged by JavaScript, making them a useful complement to CORS for server-side request validation:

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
OPTIONS /api/users   204   2ms    (preflight approved)
POST    /api/users   201   45ms   (request succeeded)

# CORS failure
POST    /api/users   ---   0ms    (blocked before preflight even sent)
```

> **Note:** CORS errors in the browser console don't show the specific cause for security reasons. The Network tab is the only reliable place to see the actual headers exchanged.

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
| `Access-Control-Max-Age` | How long to cache the preflight result (seconds) | Optional but recommended |
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