---
title: 7 Ways To Revoke JWT Tokens
date: "2024-08-15"
description: "Learn how to maintain a JWT token blacklist / deny list using an in-memory data cache"
cover: "revoking-access-with-a-jwt-blacklist.png"
category: "programming"
author: "Dejan Lukic"
---

## Table of Contents

1. [Introduction](#why-revoking-jwt-tokens-can-be-challenging)
2. [A Word or Two About JSON Web Tokens (JWTs)](#a-word-or-two-about-json-web-tokens-jwts)
3. [7 Ways to Revoke JWT Tokens](#7-ways-to-revoke-jwt-tokens)
4. [How to Make Access Token Management Easier](#how-to-make-access-token-management-easier)
5. [Risks of Improper Access Token Management](#risks-of-improper-access-token-management)
6. [Conclusion](#conclusion)

## Why Revoking JWT Tokens Can Be Challenging

JSON Web Tokens (JWT) are a fundamental part of modern web authentication and authorization systems, particularly in applications where secure and efficient user authentication is critical. Due to their stateless nature, JWTs are widely adopted, but managing and revoking these tokens presents unique challenges that developers must carefully address to maintain the security and integrity of their systems.

This article delves into seven effective strategies for revoking JWT tokens, ensuring secure access management while navigating the complexities associated with JWTs.

### A Word or Two About JSON Web Tokens (JWTs)

JWT tokens, or JSON Web Tokens, are self-contained tokens used in authentication systems to securely transmit information between parties. These tokens include a payload that carries claims, such as the user’s ID, roles, or other relevant details about the user's data, and are signed using a secret key.

The signed JWT is then sent to the client and used in subsequent requests, typically passed in the Authorization header. This stateless nature makes JWTs a popular choice for authentication in distributed systems, as it removes the need for maintaining a server-side session state.

However, the statelessness of JWTs also poses significant challenges when it comes to revocation. Unlike traditional session-based authentication, where sessions can be invalidated by removing them from the server, JWTs remain valid until their expiration (`exp`) time, which is embedded within the token’s payload.

This expiry time ensures that the token is valid only for a specified period, but it can be problematic when a user’s account is compromised. Since the token cannot be easily invalidated across all endpoints without a centralized mechanism, any delay in detecting and revoking the token can result in unauthorized access to the user's data.

Additionally, in distributed systems where multiple services or microservices rely on the same JWT access token, revocation becomes even more complex. Each service must recognize and enforce the revocation, which can be challenging without a shared state or revocation strategy. This complexity is further compounded when integrating with identity providers that issue JWTs as part of OAuth 2.0 or OpenID Connect protocols. It is recommended to refer to platform-specific documentation (docs) or GitHub repositories to implement best practices for revoking JWTs in such relatively complex environments.

## 7 Ways to Revoke JWT Tokens

Effectively revoking JWT tokens requires implementing strategies that accommodate their stateless design while ensuring security. Here are seven methods to revoke JWT tokens, each with its pros and cons.

### Token Blacklisting

**How It Works:**

Token blacklisting is a widely used method to revoke JWT tokens. This approach involves maintaining a server-side blacklist containing identifiers, such as the `jti` claim or a user ID, of tokens that should be considered invalid.

When a token is presented at an API endpoint, the server checks the blacklist to determine whether the token has been revoked. This list can be stored in a database or in an in-memory store like Redis, which allows for quick lookups.

**Pros:**

- **Granular Control:** Token blacklisting provides the ability to revoke specific tokens without affecting others, offering fine-grained control over user sessions.
- **Compatibility:** This method can be integrated with various backend systems and identity providers, making it a versatile solution for developers who follow guidelines and examples from GitHub or similar platforms.

**Cons:**

- **Scalability Issues:** As the number of blacklisted tokens increases, the performance of blacklist lookups may degrade, especially if stored in a database.
- **Stateful Requirement:** Blacklisting necessitates maintaining a server-side state, which conflicts with the stateless nature of JSON Web Tokens.

**Example in Node.js:**

```javascript
const redis = require('redis');
const client = redis.createClient();

function blacklistToken(jti) {
  client.set(jti, 'revoked', 'EX', 3600); // Expiry set for 1 hour
}

function isTokenRevoked(jti, callback) {
  client.get(jti, (err, reply) => {
    callback(reply === 'revoked');
  });
}

// Middleware to check token blacklist
function checkBlacklist(req, res, next) {
  const token = req.headers['authorization'];
  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);

  isTokenRevoked(decoded.jti, (isRevoked) => {
    if (isRevoked) {
      return res.status(401).send('Token has been revoked');
    }
    next();
  });
}
```

In this example, a JWT token's `jti` (JWT ID) is stored in Redis when the token is revoked. The middleware checks if the token's `jti` exists in Redis before processing the request.

### Token Expiration and Short Lifespan

**How It Works:**

Setting a short lifespan (the `exp` parameter) for JWT tokens can mitigate the risks associated with needing to revoke them. By configuring JWTs with a short expiration time, you reduce the window of opportunity for an attacker to use a compromised token.

Once the token reaches its expiry, it becomes invalid, and the user must obtain a new JWT access token, typically through re-authentication or using a refresh token.

**Pros:**

-   **Reduced Exposure:** Short-lived tokens minimize the risk associated with compromised tokens by ensuring they are only valid for a limited time.
-   **Maintains Statelessness:** This approach retains the stateless nature of JWTs as no server-side storage is required for token management.

**Cons:**

-   **User Experience Impact:** Users may need to authenticate more frequently, potentially leading to a frustrating user experience.
-   **No Immediate Revocation:** This method does not provide a way to immediately revoke tokens, which can be a drawback if a user's account is compromised.

**Example in Node.js:**

```ts
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { userId: user.id, roles: user.roles };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}
```

In this example, JWTs are generated with a 15-minute expiration time. Users must frequently refresh their tokens, reducing the risk associated with compromised tokens.

### Rotating Secrets

**How It Works:**

JWT tokens are signed with a secret key that verifies their authenticity. By periodically rotating this secret key, you can invalidate all existing tokens signed with the old key. This method is particularly useful when you need to revoke a large number of tokens simultaneously, such as after a security incident or when changing your authentication strategy.

**Pros:**

-   **High Security:** Regularly rotating secrets add an extra layer of security, making it more difficult for attackers to exploit a compromised key.
-   **Wide Impact:** Secret rotation invalidates all tokens at once, which is effective in scenarios where a large-scale revocation is necessary.

**Cons:**

-   **Complex Key Management:** Rotating secrets requires careful management to avoid invalidating legitimate tokens inadvertently.
-   **Token Recreation:** After a key rotation, clients must obtain new JWTs signed with the updated key, which can complicate client-side and backend interactions.

**Note:** Doing secret management on your own is challenging and can open you to security vulnerabilities, so most auth services handle this on your behalf.

### Token Versioning

**How It Works:**

Token versioning involves assigning a version number to each JWT issued, which is then stored in the database alongside the user's account information. When a token needs to be revoked, the version number is incremented in the database, rendering all previous tokens invalid. The next time the user tries to authenticate, they must present a token with the updated version.

**Pros:**

-   **Selective Revocation:** Token versioning allows for targeted revocation based on the user's account status or other criteria.
-   **Flexibility:** This method can be integrated with various identity providers and authentication systems, offering a flexible solution.

**Cons:**

-   **Increased Complexity:** Managing token versions adds complexity to the backend, requiring additional logic to validate token versions.
-   **Database Dependency:** This approach relies on database lookups to validate token versions, which can introduce latency, especially if not optimized for in-memory checks.

**Example in Node.js (+ MongoDB):**

```ts
const mongoose = require('mongoose');

// Define User schema with tokenVersion field
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  tokenVersion: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);

function generateToken(user) {
  const payload = { userId: user.id, tokenVersion: user.tokenVersion };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

async function invalidateUserTokens(userId) {
  await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
}

// Middleware to check token version
async function checkTokenVersion(req, res, next) {
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId);
  if (user.tokenVersion !== decoded.tokenVersion) {
    return res.status(401).send('Token version is invalid');
  }
  next();
}
```
In this example, the user's `tokenVersion` is stored in the database. When a token is revoked, the `tokenVersion` is incremented, and the middleware checks if the presented token is still valid.

### User Logout and Forced Token Invalidation

**How It Works:**

When a user logs out, their JWT token can be invalidated by marking it as such on the server or by expiring the session. This method ensures that the token cannot be used to access protected resources after logout. In systems that support OAuth 2.0 or OpenID Connect, this might involve notifying the identity provider to revoke the token at the source.

**Pros:**

-   **Immediate Effect:** The token is immediately invalidated, providing a prompt security response.
-   **User-Controlled:** Users can take control of their session's security by actively logging out.

**Cons:**

-   **Statefulness:** Forced token invalidation requires maintaining a server-side state, which conflicts with the stateless nature of JWTs.
-   **Implementation Complexity:** Implementing this method can be challenging in systems that rely on stateless JWTs, especially in distributed environments with multiple endpoints.

**Example: User Logout and Forced Token Invalidation in Node.js**

```ts
const express = require('express');
const jwt = require('jwt-simple');
const redis = require('redis');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.json());
const redisClient = redis.createClient();
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key
const PORT = 3000;

// Configure email transport for notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Replace with your email
    pass: 'your_email_password'   // Replace with your email password
  }
});

// Middleware to verify JWT and check session
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('No token provided');
  }
  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    const sessionId = decoded.sessionId;
    redisClient.get(sessionId, (err, sessionData) => {
      if (err || !sessionData) {
        return res.status(401).send('Invalid token');
      }
      req.user = decoded; // Attach user info to request
      next();
    });
  } catch (e) {
    res.status(401).send('Failed to authenticate token');
  }
}

// Endpoint for user login (simulated)
app.post('/login', (req, res) => {
  const { username, email } = req.body;
  const sessionId = `${username}-${Date.now()}`; // Generate a unique session ID
  const token = jwt.encode({ sessionId }, SECRET_KEY, 'HS256');
  redisClient.set(sessionId, JSON.stringify({ username, email }), 'EX', 3600); // Store session with 1-hour expiry
  res.json({ token });
});

// Endpoint for user logout
app.post('/logout', verifyToken, (req, res) => {
  const sessionId = req.user.sessionId;
  redisClient.del(sessionId, (err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    // Notify user about session expiration
    redisClient.get(sessionId, (err, sessionData) => {
      if (!err && sessionData) {
        const userEmail = JSON.parse(sessionData).email;
        const mailOptions = {
          from: 'your_email@gmail.com',
          to: userEmail,
          subject: 'Session Expired',
          text: 'Your session has been terminated. If you did not request this, please contact support.'
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    });
    res.send('Logged out successfully');
  });
});

// Protected endpoint
app.get('/protected', verifyToken, (req, res) => {
  res.send(`Hello ${req.user.sessionId}, you have access to this protected resource`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
### Token Revocation Lists

**How It Works:**

A Token Revocation List (TRL) operates similarly to a blacklist but is often implemented as a centralized or distributed service that can be queried to determine if a token has been revoked. This method is especially effective in large-scale distributed systems where multiple services and endpoints need to recognize and enforce token revocation.

**Pros:**

-   **Scalability:** A TRL can be designed to handle high loads in distributed environments, ensuring that all services consistently enforce token revocation.
-   **Centralized Management:** By centralizing token revocation, this method simplifies the management and enforcement of revocation policies.

**Cons:**

-   **Latency:** Querying a TRL can introduce latency, especially if the revocation list is not stored in an in-memory database or is not optimized for fast lookups.
-   **Complexity:** Implementing and maintaining a TRL requires careful design to ensure scalability and reliability across distributed services.

**Implementation Tip:**

When designing a TRL, consider using in-memory data stores like Redis or distributed caching systems to reduce latency. Additionally, ensure that your system can handle large-scale requests by implementing load balancing and failover mechanisms.

**Example of Implementing a Simple TRL in Node.js:**

```ts
let trustedRevocationList = [];

function updateRevocationList(newList) {
  trustedRevocationList = newList;
}

function isTokenRevoked(jti) {
  return trustedRevocationList.includes(jti);
}

// Middleware to check TRL
function checkRevocationList(req, res, next) {
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (isTokenRevoked(decoded.jti)) {
    return res.status(401).send('Token has been revoked');
  }
  next();
}

// Example of updating TRL (this would typically be done periodically)
setInterval(() => {
  // Fetch the latest TRL from a trusted source
  const latestTRL = fetchTrustedRevocationList();
  updateRevocationList(latestTRL);
}, 60000); // Update every 60 seconds
```

### Refresh Tokens for Long-Lived Sessions

**How It Works:**

In scenarios where long-lived sessions are necessary, using refresh tokens in conjunction with JWTs provides a secure way to manage token expiry and revocation. The refresh token is stored securely on the server and is used to generate new JWT access tokens when the previous one expires. If a user's account is compromised, the refresh token can be revoked, preventing the issuance of new JWT access tokens.

**Pros:**

-   **Increased Security:** This method enhances security by limiting the lifespan of JWT access tokens while providing a mechanism for immediate revocation through the refresh token.
-   **Flexible Control:** Allows for the revocation of individual sessions without affecting others, providing a granular approach to session management.

**Cons:**

-   **Complexity:** Managing refresh tokens adds complexity to the backend and client-side logic, as well as potential storage challenges if multiple refresh tokens are issued.
-   **No Immediate Revocation for Access Tokens:** Revoking the refresh token does not immediately invalidate the existing JWT access token, leaving a short window of vulnerability.

**Example in Node.js:**

```ts
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

// Simulated in-memory refresh token store
let refreshTokenStore = {};

function generateToken(user) {
  const payload = { userId: user.id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = uuid.v4();

  // Store refresh token server-side
  refreshTokenStore[refreshToken] = user.id;

  return { accessToken, refreshToken };
}

function refreshAccessToken(refreshToken) {
  const userId = refreshTokenStore[refreshToken];
  if (!userId) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return newAccessToken;
}

function revokeRefreshToken(refreshToken) {
  delete refreshTokenStore[refreshToken];
}

// Middleware example for refreshing access tokens
function refreshTokenMiddleware(req, res, next) {
  const { refreshToken } = req.body;

  try {
    const newAccessToken = refreshAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).send('Invalid or expired refresh token');
  }
}
```


## How to Make Access Token Management Easier

Effective access token management is crucial for maintaining the security of your application. Here are some best practices to simplify the process:

-   **Use Refresh Tokens:** As mentioned, refresh tokens can provide an effective way to manage and revoke JWTs. Ensure they are securely stored, either on the client-side or in Redis, and frequently rotated to prevent misuse.
-   **Minimize Token Lifespan:** Short-lived tokens reduce the impact of a compromised token. Pair them with refresh tokens to balance security and usability, configuring the `exp` parameter appropriately.
-   **Ensure Secure Storage:** Store tokens securely, whether in cookies with the `HttpOnly` and `Secure` flags or in secure client-side storage mechanisms like local storage.
-   **Monitor for Suspicious Activity:** Implement monitoring and notifications for unusual token usage patterns, such as tokens being used from multiple locations.
-   **Automate Token Management:** Use tools like SuperTokens to handle JWT creation, validation, and revocation. This can streamline your authentication process and reduce the risk of errors.

For more on creating JWTs and securing user sessions, see our [docs on JWT Creation](https://supertokens.com/docs/microservice_auth/jwt-creation) and our guide on [Using JWTs for User Sessions](https://supertokens.com/blog/are-you-using-jwts-for-user-sessions-in-the-correct-way). You can also explore how to configure secure tokens in Node.js with backend tools like Redis for in-memory storage.

## Risks of Improper Access Token Management

Failing to properly manage and revoke JWT tokens can lead to serious security risks:

-   **Unauthorized Access:** Compromised tokens can grant unauthorized access to your application, leading to data breaches and other security incidents.
-   **Token Theft:** If tokens are not securely stored on the client-side, they can be stolen and used maliciously.
-   **Replay Attacks:** Attackers can reuse a stolen token to gain unauthorized access if tokens are not properly managed.
-   **Poor User Experience:** Improper token management can lead to unnecessary logouts or difficulties accessing services.
-   **Legal Implications:** In regulated industries like fintech, failing to manage tokens properly can result in compliance violations, leading to legal penalties.

For a comprehensive guide on implementing secure authentication practices, check out our articles on [OAuth 2.0 vs. JWT](https://supertokens.com/blog/oauth-vs-jwt) and [Passwordless Login](https://supertokens.com/blog/a-guide-to-implementing-passwordless-login). You can also find code examples on GitHub for integrating these practices in your Node.js applications.

## Conclusion

Revoking JWT tokens is a crucial aspect of securing modern web applications. While the stateless nature of JWTs presents challenges, the methods discussed above offer effective strategies for maintaining secure access management. Whether through token blacklisting, rotating secrets, or using refresh tokens, implementing a robust revocation strategy is essential to protecting your application and users' data.

There are a ton of intricacies while building a robust authentication solution with JWTs. Keeping up with best practices and the most secure standards, while keeping up-to-date with the latest threat vectors, is hard to say the least.

Unless you're building a personal project, learning, or have an extremely niche use case that is not supported by auth providers, it is better to offload the headache to a service instead.

Easily manage user access with [SuperTokens](https://supertokens.com/product) and take the hassle out of JWT management. Start securing your application today.