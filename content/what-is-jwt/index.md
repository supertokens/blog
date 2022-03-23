---
title: What is a JWT? Understanding JSON Web Tokens 
date: "2022-03-24"
description: "Learn about JWTs, their pros & cons, and how they work."
cover: "TODO.png"
category: "session"
author: "SuperTokens Team"
---

JWTs or JSON Web Tokens are most commonly used to identify an authenticated user. They are issued by an authentication server and are consumed by the client-server (to secure its APIs).

Looking for a breakdown for JSON Web Tokens (JWTs)? You’re in the right place. We will cover:
- What is a JWT?
- Structure of a JWT
- JWT claim conventions
- How do they work (using an example)?
- Pros and Cons of JWTs
- Common issues during development
- Further reading material

## What is a JWT?
JSON Web Token is an open industry standard used to share information between two entities, usually a client (like your app’s frontend) and a server (your app’s backend).

They contain JSON objects which have the information that needs to be shared. Each JWT is also signed using cryptography (hashing) to ensure that the JSON contents (also known as JWT claims) cannot be altered by the client or a malicious party.

For example, when you sign in with Google, Google issues a JWT which contains the following claims / JSON payload:

```json
{
    "iss": "https://accounts.google.com",
    "azp": "1234987819200.apps.googleusercontent.com",
    "aud": "1234987819200.apps.googleusercontent.com",
    "sub": "10769150350006150715113082367",
    "at_hash": "HK6E_P6Dh8Y93mRNtsDB1Q",
    "email": "jsmith@example.com",
    "email_verified": "true",
    "iat": 1353601026,
    "exp": 1353604926,
    "nonce": "0394852-3190485-2490358",
    "hd": "example.com"
}
```

Using the above information, a client application that uses sign-in with Google, knows exactly who the end-user is.

### What are Tokens and why is it needed?
You may be wondering why the auth server can’t just send the information as a plain JSON object and why it needs to convert it into a "token".

If the auth server sends it as a plain JSON, the client application’s APIs would have no way to verify that the content they are receiving is correct. A malicious attacker could, for example, change the user ID (`sub` claim in the above example JSON), and the application’s APIs would have no way to know that that has happened.

Due to this security issue, the auth server needs to transmit this information in a way that can be verified by the client application, and this is where the concept of a "token" comes into the picture.

To put it simply, a token is a string that contains some information that can be verified securely. It could be a random set of alphanumeric characters which point to an ID in the database, or it could be an encoded JSON that can be self-verified by the client (known as JWTs).

## Structure of a JWT
A JWT contains three parts:
- **Header**: Consists of two parts:
    - The signing algorithm that’s being used.
    - The type of token, which, in this case, is mostly "JWT".
- **Payload**: The payload contains the claims or the JSON object.
- **Signature**: A string that is generated via a cryptographic algorithm that can be used to verify the integrity of the JSON payload.

![JWT_Structure](./jwt-structure.png)

We will make our own JWT from scratch later on in this post!

## JWT claim convention
You may have noticed that in the JWT (that is issued by Google) example above, the JSON payload has non-obvious field names. They use `sub`, `iat`, `aud` and so on:
- **iss**: The issuer of the token (in this case Google)
- **azp** and **aud**: Client IDs issued by Google for your application. This way, Google knows which website is trying to use its sign in service, and the website knows that the JWT was issued specifically for them.
- **sub**: The end user’s Google user ID
- **at_hash**: The hash of the access token. The OAuth access token is different from the JWT in the sense that it’s an opaque token. The access token’s purpose is so that the client application can query Google to ask for more information about the signed in user.
- **email**: The end user’s email ID
- **email_verified**: Whether or not the user has verified their email.
- **iat**: The time (in milliseconds since epoch) the JWT was created
- **exp**: The time (in milliseconds since epoch) the JWT was created
- **nonce**: Can be used by the client application to prevent replay attacks.
- **hd**: The hosted G Suite domain of the user

The reason for using these special keys is to follow an industry convention for the names of important fields in a JWT. Following this convention enables client libraries in different languages to be able to check the validity of JWTs issued by any auth servers. For example, if the client library needs to check if a JWT is expired or not, it would simply look for the `iat` field.

## How do they work (using an example)
The easiest way to explain how a JWT works is via an example. We will start by creating a JWT for a specific JSON payload and then go about verifying it:

### 1) Create a JSON
Let's take the following minimal JSON payload:

```json
{
    "userId": "abcd123",
    "expiry": 1646635611301
}
```

### 2) Create a JWT signing key and decide the signing algorithm

First, we need a signing key and an algorithm to use. We can generate a signing key using any secure random source. For the purpose of this post, let's use:
- Signing key: `NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c=`
- Signing algorithm: `HMAC + SHA256`, also known as `HS256`.

### 3) Creating the "Header"
This contains the information about which signing algorithm is used. Like the payload, this is also a JSON and will be appended to the start of the JWT (hence the name header):

```json
{
    "typ": "JWT",
    "alg": "HS256"
}
```

### 4) Create a signature
- First, we remove all the spaces from the payload JSON and then base64 encode it to give us `eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ`. You can try pasting this string in an [online base64 decoder](https://www.base64decode.org/) to retrieve our JSON.
- Similarly, we remove the spaces from the header JSON and base64 encode it to give us: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`.
- We concatenate both the base 64 strings, with a `.` in the middle like `<header>.<payload>`, giving us `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ`. There is no special reason to do it this way other than to set a convention that the industry can follow.
- Now we run the `Base64 + HMACSHA256` function on the above concatenated string and the secret to give us the signature:

    ```text
    Base64URLSafe(
        HMACSHA256("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ", "NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c=")
    )

    Results in:
    3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
    ```
    
    We base64 encode it only as an industry convention.

### 5) Creating the JWT
Finally, we append the generated secret like `<header>.<body>.<secret>` to create our JWT:

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
```

### 6) Verifying the JWT
Once the client sends the JWT back to the server, the server does the following steps:
- Fetches the header part of the JWT (`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`).
- Does base64 decoding on it to get the plain text JSON: `{"typ":"JWT","alg":"HS256"}`
- Verifies that the `typ` field's value is `JWT` and the `alg` is `HS256`. If not, it would reject the JWT.
- Fetches signing secret key and runs the same `Base64URLSafe(HMACSHA256(...))` operation as step number (4) on the header and body of the incoming JWT. Note that if the incoming JWT's body is different, this step will generate a different signature than in step (4).
- Checks that the generated signature is the same as the signature from the incoming JWT. If it's not, then the JWT is rejected.
- We base64 decode the body of the JWT (`eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ`) to give us `{"userId":"abcd123","expiry":1646635611301}`.
- We reject the JWT if the current time (in milliseconds) is greater than the JSON's `expiry` time (since the JWT is expired).

We can trust the incoming JWT only if it passes all of the checks above.

## Pros and Cons of JWTs
There are quite a few advantages to using a JWT:
- **Secure**: JWTs are digitally signed using either a secret (HMAC) or a public/private key pair (RSA or ECDSA) which safeguards them from being modified by the client or an attacker.
- **Stored only on the client**: You generate JWTs on the server and send them to the client. The client then submits the JWT with every request. This saves database space.
- **Efficient / Stateless**: It’s quick to verify a JWT since it doesn’t require a database lookup. This is especially useful in large distributed systems.

However, some of the drawbacks are:
- **Non-revocable**: Due to their self-contained nature and stateless verification process, it can be difficult to revoke a JWT before it expires naturally. Therefore, actions like banning a user immediately cannot be implemented easily. That being said, there is a way to maintain [JWT deny / black list](https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist), and through that, we can revoke them immediately.
- **Dependent on one secret key**: The creation of a JWT depends on one secret key. If that key is compromised, the attacker can fabricate their own JWT which the API layer will accept. This in turn implies that if the secret key is compromised, the attacker can spoof any user’s identity. We can reduce this risk by changing the secret key from time to time.

To summarize, a JWT is most useful for large-scale apps that don’t require actions like immediately banning of a user.

## Common issues during development

### JWT Rejected
This error implies that the verification process of a JWT failed. This could happen because:
- The JWT has expired already
- The signature didn’t match - this implies that either the signing keys have changed, or that the JSON body has been manipulated.
- Other claims do not check out. For example, in the case of the Google JWT example above, if the JWT was generated for App1, but was sent to App2, App2 would reject it (since the `aud` claim would point to App1’s ID).

### JWT token doesn’t support the required scope
The claims in a JWT can represent the scopes or permissions that a user has granted. For example, the end-user may only have agreed that the application can read their data, but not modify it. However, the application may be expecting that the user agrees to modify the data as well. In this case, the scope required by the app is not what’s in the JWT.

### JWT Decode failed
This error can arise if the JWT is malformed. For example, the client may be expecting the JWT is base64 encoded, but the auth server did not bas63 encode it.

## Further reading material
Overall, the topic of JWTs is vast. If you would like to learn more about them, do explore these topics:
- [Different types of JWTs](https://medium.facilelogin.com/jwt-jws-and-jwe-for-not-so-dummies-b63310d201a3)
- [Revoking a JWT](https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist)
- [Using JWTs in OAuth (Open ID)](https://openid.net/connect/)

At [SuperTokens](https://supertokens.com), we provide an open-source auth solution that aims to abstract away all the complexities of using a JWT. We take care of creating, verifying, and updating them. Furthermore, we [automatically mitigate some of the cons](https://supertokens.com/blog/the-best-way-to-securely-manage-user-sessions) mentioned above.