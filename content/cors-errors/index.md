---
title: Fixing CORS Errors What They Are and How to Resolve Them
description: "Learn what causes CORS errors, how they impact your web app, and how to fix them securely with proper headers and backend configurations."
date: "2025-07-20"
cover: "cors_errors.png"
category: "cors errors, development tips, best practices"
author: "Maurice Saldivar"
---

# Fixing CORS Errors: What They Are and How to Resolve Them
A comprehensive guide to learning how to find, debug, and fix CORS errors in your web applications.

## What Is a CORS Error and Why Does It Happen?

CORS errors are one of the most common stumbling blocks in modern web development. Your API works perfectly in Postman, but the moment you try to fetch data from your frontend, the browser blocks the request with a cryptic error message.

### Definition of CORS

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that controls whether JavaScript running on one website can access resources from another website. It extends the Same-Origin Policy, which serves as the browser's fundamental trust boundary.

An origin consists of three parts:

- **Protocol**: `http://` vs `https://`
- **Domain**: `example.com` vs `api.example.com`
- **Port**: `:3000` vs `:8080`

Any difference in these components triggers a cross-origin request, which requires explicit permission from the server.

```javascript
// Same origin requests 
fetch('/api/users')                          // Relative URL
fetch('https://myapp.com/api/data')         // Same protocol, domain, port

// Cross-origin requests
fetch('https://api.myapp.com/users')        // Different subdomain
fetch('http://myapp.com/api/users')         // Different protocol  
fetch('https://myapp.com:8080/api/users')   // Different port
```

The Same-Origin Policy exists to prevent malicious websites from reading sensitive data from other sites. Without it, any website could access your Gmail, initiate bank transfers, or steal session tokens.

### What Triggers a CORS Error?

A CORS error occurs when your browser blocks a response because the server didn't include the required permission headers. Here's the typical sequence:

1. Your frontend at `http://localhost:3000` makes a request to `https://api.yourservice.com`
2. The browser detects a cross-origin request
3. The request is sent to the server
4. The server responds without CORS headers
5. The browser blocks JavaScript from accessing the response
6. A CORS error appears in the console

The crucial detail: the request often completes successfully on the server. CORS doesn't prevent the request, it prevents your JavaScript from reading the response. This distinction matters when debugging issues like duplicate database entries despite console errors.

### CORS Preflight and Actual Requests

Browsers categorize HTTP requests into two types for CORS purposes:

**Simple Requests** proceed without preflight:
- GET, HEAD, or POST methods
- Limited headers (Accept, Content-Language, Content-Type with restrictions)
- Content-Type must be `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`

**Preflighted Requests** require permission first:
- Any other HTTP method (PUT, DELETE, PATCH)
- Custom headers like `Authorization` or `X-API-Key`
- POST with `Content-Type: application/json`

Here's the preflight flow:

```bash
# Browser sends preflight
OPTIONS /api/users HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# Server responds with permissions
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization

# Browser sends actual request
POST /api/users HTTP/1.1
Origin: http://localhost:3000
Authorization: Bearer your-token-here
Content-Type: application/json

{"name": "New User"}

# Server includes CORS headers with response
HTTP/1.1 201 Created
Access-Control-Allow-Origin: http://localhost:3000

{"id": 123, "name": "New User"}
```

This preflight process explains why JSON API calls appear slower in browsers than in Postman, browsers must complete the permission check first, while Postman skips CORS entirely.

## Common Types of CORS Errors and Their Meaning

### No "Access-Control-Allow-Origin" header

This error means the server didn't include the header that authorizes your origin to access the response.

```javascript
fetch('https://api.coolservice.com/data')
  .then(res => res.json())
  .then(data => console.log(data))

// Error:
// Access to fetch at 'https://api.coolservice.com/data' from origin 
// 'http://localhost:3000' has been blocked by CORS policy: 
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

The server processed your request but didn't include the required header. Your browser discards the response before JavaScript can access it.

For servers you control:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});
```

For external APIs, you'll need a proxy server or the API must support CORS.

### "Method not allowed by Access-Control-Allow-Methods"

The server accepts some HTTP methods but not the one you're using.

```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer token'
  }
})

// Error:
// Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
```

This occurs during preflight when the server's `Access-Control-Allow-Methods` header doesn't include your method. Common causes include missing OPTIONS endpoints or incomplete method lists.

### "Credentialed requests not supported"

This error appears when sending cookies or authentication headers cross-origin with incorrect server configuration.

```javascript
fetch('https://api.example.com/profile', {
  credentials: 'include'
})

// Error:
// The value of the 'Access-Control-Allow-Origin' header in the response 
// must not be the wildcard '*' when the request's credentials mode is 'include'.
```

Credentialed requests require:
- Specific origin (not wildcard)
- `Access-Control-Allow-Credentials: true`

```javascript
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
res.header('Access-Control-Allow-Credentials', 'true');
```

### CORS Errors in Fetch vs. Axios

Fetch and Axios handle CORS differently:

```javascript
// Fetch - generic error messages
fetch('https://api.example.com/data')
  .catch(error => {
    console.log(error.message);  // "Failed to fetch"
  });

// Axios - more detailed error handling
axios.get('https://api.example.com/data')
  .catch(error => {
    if (error.response) {
      console.log('Server responded with error:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.message);
    }
  });
```

Key differences:
1. Fetch provides generic "Failed to fetch" for network errors including CORS
2. Axios automatically sets `Content-Type: application/json`, triggering preflight
3. Axios interceptors can add headers that unexpectedly trigger preflight

## How to Fix CORS Errors (Frontend & Backend)

CORS is fundamentally a server-side configuration. Frontend workarounds exist for development, but production requires proper backend setup.

### Set Proper Headers on the Server:

**Access-Control-Allow-Origin**

```javascript
// Development
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

// Production with multiple origins
const allowedOrigins = ['https://app.example.com', 'https://beta.example.com'];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.header('Access-Control-Allow-Origin', origin);
}
```

**Access-Control-Allow-Methods**

```javascript
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
```

**Access-Control-Allow-Headers**

```javascript
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
```

**Access-Control-Allow-Credentials**

```javascript
res.header('Access-Control-Allow-Credentials', 'true');
```

**Access-Control-Max-Age**

```javascript
res.header('Access-Control-Max-Age', '86400');
```

### Enable CORS in Node.js/Express


```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://app.example.com',
      'https://admin.example.com',
      'http://localhost:3000'
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
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
app.options('*', cors(corsOptions));
```


### Configuring CORS in Other Backends

### Flask

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
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response
```

### Django

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
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

### Spring Boot

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

### Frontend Considerations

What doesn't work, adding CORS headers to fetch requests has no effect:

```javascript
fetch('https://api.example.com/data', {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})
```

The `no-cors` mode prevents reading responses:

```javascript
fetch('https://api.example.com/data', {
  mode: 'no-cors'
})
.then(response => response.json())
```

What actually works, using a proxy during development:

```javascript
// Vite config
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

Ensure correct request configuration:

```javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

## SuperTokens and CORS Configuration

Authentication adds complexity to CORS because credentials require stricter security rules. SuperTokens simplifies most of this, but understanding the underlying mechanics prevents configuration issues.

### Why CORS Matters for Auth Flows

SuperTokens uses httpOnly cookies for session management, which immediately impacts CORS requirements:

```javascript
fetch('https://api.example.com/auth/session/verify', {
  method: 'GET',
  credentials: 'include'
})
```

With credentials, CORS rules become stricter:
- No wildcard origins allowed
- `Access-Control-Allow-Credentials` must be `true`
- Origins must match exactly

### Authentication Headers Trigger Preflight

```javascript
fetch('https://api.example.com/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'rid': 'emailpassword',
    'st-auth-mode': 'cookie'
  },
  credentials: 'include',
  body: JSON.stringify({ email, password })
})
```

### How SuperTokens Handles CORS

SuperTokens automatically manages CORS for its authentication endpoints:

```javascript
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.com",
  },
  appInfo: {
    appName: "MyApp",
    apiDomain: "https://api.example.com",
    websiteDomain: "https://app.example.com",
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    Session.init({
      cookieSameSite: "none",
      cookieSecure: true,
    })
  ]
});
```

SuperTokens derives CORS settings from `appInfo`, but only for its own routes. Your API endpoints need separate configuration.

### Common CORS Pitfalls with SuperTokens

Mismatched Domains:

```javascript
supertokens.init({
  appInfo: {
    apiDomain: "http://localhost:8080",
    websiteDomain: "http://localhost:3000"
  }
});
```

Cookie Configuration:

```javascript
Session.init({
  cookieSameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  cookieSecure: process.env.NODE_ENV === "production"
})
```

API Route Configuration:

```javascript
app.use(cors({
  origin: ["https://app.example.com", "http://localhost:3000"],
  credentials: true
}));
```

## Secure Implementation Example

Express Setup:

```javascript
import express from 'express';
import cors from 'cors';
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import { middleware, errorHandler } from "supertokens-node/framework/express";

const app = express();

const apiDomain = process.env.API_DOMAIN || "http://localhost:8080";
const websiteDomain = process.env.WEBSITE_DOMAIN || "http://localhost:3000";
const isProduction = process.env.NODE_ENV === "production";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "MySecureApp",
    apiDomain,
    websiteDomain,
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    Session.init({
      cookieSameSite: isProduction ? "none" : "lax",
      cookieSecure: isProduction,
      antiCsrf: "VIA_TOKEN",
    })
  ]
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [websiteDomain];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'rid', 'st-auth-mode'],
};

app.use(cors(corsOptions));
app.use(middleware());

app.get('/api/user/profile', 
  Session.verifySession(),
  async (req, res) => {
    const userId = req.session.getUserId();
    res.json({ userId, profile: "..." });
  }
);

app.use(errorHandler());
```

Frontend Configuration:

```javascript
import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    appName: "MyApp",
    apiDomain: "http://localhost:8080",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [Session.init()]
});

async function fetchUserData() {
  const response = await fetch(`${API_URL}/user/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}
```

## Best Practices for Secure CORS Handling

### Avoid Wildcard Origins in Production

Using `Access-Control-Allow-Origin: *` in production eliminates the security benefits of CORS.

```javascript
const allowedOrigins = {
  production: ['https://app.yourcompany.com', 'https://www.yourcompany.com'],
  staging: ['https://staging.yourcompany.com'],
  development: ['http://localhost:3000', 'http://localhost:3001']
};

const corsOptions = {
  origin: function (origin, callback) {
    const env = process.env.NODE_ENV || 'development';
    const allowed = allowedOrigins[env];
    
    if (!origin) return callback(null, true);
    
    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS rejected origin: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  }
};
```

Exception: truly public, read-only APIs can use wildcards:

```javascript
app.get('/api/public/weather', cors({ origin: '*' }), (req, res) => {
  res.json({ temperature: 72, conditions: 'sunny' });
});
```

### Control Credentials Carefully

Credentials enforce stricter CORS rules:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST'],
  exposedHeaders: ['X-Total-Count']
};

const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.NODE_ENV === 'production' ? '.example.com' : undefined
};
```

### Whitelist Only Necessary Origins

```javascript
class CORSWhitelist {
  constructor() {
    this.origins = new Map([
      ['production', new Set([
        'https://app.example.com',
        'https://www.example.com'
      ])],
      ['staging', new Set([
        'https://staging.example.com'
      ])],
      ['development', new Set([
        'http://localhost:3000'
      ])]
    ]);
  }

  isAllowed(origin, environment = process.env.NODE_ENV) {
    const allowedForEnv = this.origins.get(environment);
    return allowedForEnv ? allowedForEnv.has(origin) : false;
  }
}

const whitelist = new CORSWhitelist();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.isAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  }
}));
```

### Monitor Preflight Requests

```javascript
app.options('*', (req, res, next) => {
  const preflightData = {
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'no-origin',
    method: req.headers['access-control-request-method'],
    headers: req.headers['access-control-request-headers'],
    path: req.path
  };
  
  if (!req.headers.origin) {
    console.info('Preflight without origin:', preflightData);
  } else if (!whitelist.isAllowed(req.headers.origin)) {
    console.warn('Rejected preflight:', preflightData);
  }
  
  next();
});
```

## Debugging CORS Issues in Production

Production CORS issues often stem from infrastructure rather than application code. The browser's Network tab provides crucial debugging information.

### Using Browser Developer Tools

The Network tab reveals the complete request/response cycle:

```bash
# Healthy CORS flow
OPTIONS /api/users     204    2ms    (preflight)
POST    /api/users     201    45ms   (actual request)

# Failed CORS flow
POST    /api/users     ---    0ms    (CORS error - no preflight)
```

Key indicators to check:
1. Missing OPTIONS requests indicate server preflight handling issues
2. Response headers show what CORS headers the server actually sent
3. Timing information reveals if responses were received but blocked

### Server Log Analysis

```bash
# Healthy preflight
[2024-01-15 14:23:45] OPTIONS /api/users 204 2ms
[2024-01-15 14:23:45] POST /api/users 201 45ms

# Common production issues
[2024-01-15 14:23:45] POST /api/users 500 "Method not allowed"
[2024-01-15 14:23:45] OPTIONS /api/users 401 "Unauthorized"
```

Enhanced logging for debugging:

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS' || req.headers.origin) {
    console.log('[CORS Debug]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      origin: req.headers.origin,
      headers: {
        'access-control-request-method': req.headers['access-control-request-method'],
        'access-control-request-headers': req.headers['access-control-request-headers'],
      }
    });
  }
  next();
});
```

### Testing Tools

Test actual browser behavior with curl:

```bash
# Simulate preflight
curl -X OPTIONS https://api.production.com/users \
  -H "Origin: https://app.production.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Look for these headers in response
< access-control-allow-origin: https://app.production.com
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
< access-control-allow-headers: content-type, authorization
```

Common production-specific issues:
- CDNs stripping CORS headers
- Load balancers blocking OPTIONS
- Reverse proxies changing paths
- Missing environment variables

## Summary and Developer Checklist

### Core CORS Principles

1. **CORS is server-configured** - Frontend workarounds don't fix production issues
2. **Credentials change the rules** - No wildcards, explicit origins required
3. **Infrastructure matters** - CDNs, load balancers, and proxies affect CORS
4. **Preflight is critical** - OPTIONS must work for complex requests

### Developer CORS Checklist

#### Server Headers
```javascript
res.header('Access-Control-Allow-Origin', 'https://app.example.com');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Max-Age', '86400');
```

#### Origin Configuration
```javascript
const ALLOWED_ORIGINS = {
  development: ['http://localhost:3000'],
  staging: ['https://staging.example.com'],
  production: ['https://app.example.com']
};

function getAllowedOrigin(req) {
  const origin = req.headers.origin;
  const env = process.env.NODE_ENV || 'development';
  const allowedOrigins = ALLOWED_ORIGINS[env] || [];
  
  if (!origin) return '*';
  if (allowedOrigins.includes(origin)) return origin;
  
  console.warn(`CORS: Rejected origin ${origin}`);
  return false;
}
```

#### Credential Handling
```javascript
// Frontend
fetch(url, { credentials: 'include' });

// Backend
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Allow-Origin', specificOrigin);

// Cookies
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none'
});
```

#### Preflight Handling
```javascript
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', getAllowedOrigin(req));
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  res.header('Access-Control-Max-Age', '86400');
  
  res.sendStatus(204);
});
```

### Production Deployment Verification

```bash
#!/bin/bash
# CORS verification script

API_DOMAIN="https://api.example.com"
FRONTEND_DOMAIN="https://app.example.com"

# Test preflight
echo "Testing preflight..."
curl -s -X OPTIONS "$API_DOMAIN/api/test" \
  -H "Origin: $FRONTEND_DOMAIN" \
  -H "Access-Control-Request-Method: POST" \
  -I | grep -i "access-control"

# Test actual request
echo "Testing actual request..."
curl -s -X GET "$API_DOMAIN/api/health" \
  -H "Origin: $FRONTEND_DOMAIN" \
  -I | grep -i "access-control"
```

### Emergency Production Fix

When production fails and you need immediate resolution:

```javascript
app.use((req, res, next) => {
  console.warn('EMERGENCY CORS MODE - TEMPORARY ONLY');
  
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});
```

Then gradually restrict based on actual requirements.

### Final Recommendations

- Test CORS configuration early in development
- Log CORS requests and rejections in production
- Understand your infrastructure's impact on headers
- Use specific origins instead of wildcards
- Keep authentication flows simple to minimize CORS complexity

With proper understanding and configuration, CORS becomes a powerful security ally rather than a development obstacle.