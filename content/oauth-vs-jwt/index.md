---
title: "OAuth vs JWT (JSON Web Tokens) Token: An In-Depth Comparison"
date: "2022-03-07"
description: "Learn about the difference between JWT Token and OAuth"
cover: "oauth_vs_jwt.png"
category: "sessions"
author: "SuperTokens Team"
discord_button_id: "discord_oauth_vs_jwt"
---

Implementing authentication implies understanding many confusing terms and protocols so that one can make the correct design decisions for their application.

The most common protocol for authentication is known an OAuth 2.0. Another very common term is "JWT", or JSON Web token. In this article, we will explore how these concepts differ, and when to use which.

## What is OAuth?
On a high level, OAuth is a protocol that is used to authenticate a user via an authentication server. As part of the protocol, it issues a token called JWT which can be used by the client application to verify the identity of the user that authenticated themselves.

Visually, the process looks like this:

![OAuth_JWT_Flow](./flow_oauth_vs_jwt.png)

### When to use OAuth?
This protocol is meant to be used when your application (the "Client") needs to authenticate the end user (the "Resource Owner") using an authentication provider (the "Authorization Server"). For example, when you implement Sign in wih Google, you are using the OAuth 2.0 protocol.

### Pros of OAuth
- **It's an accepted industry standard**. This means that:
    - Most authentication services will understand this protocol.
    - Enables ready made auth solutions that you can plug into your application.
    - Has well tested client libraries in almost all languages and web frameworks.
- **Decoupling of code**: Your client application code is not affected by the authentication code.
- **Secure**: Due to its widespread nature, you can be rest assured that all security edge cases have been thought about by industry experts.

### Cons of OAuth
- **Complicated to understand**. There are several OAuth flows:
    - Authorization code grant flow with client secret
    - Authorization Code Flow with PKCE
    - Client Credentials Flow
    - Resource Owner Password Flow
    - Implicit Flow (which is now deprecated)
    - Device Authorization Flow
    Deciding which flow is right for you can be a challenge. Sometimes, you may even need to use multiple flows.
- **Low end user privacy**: The auth server knows all the sites that the end user has logged in into. For example, when a site uses Sign in with Google, Google would be able to keep track of when that site's users are signing in or are active.
- **Overkill in certain situations**: If you are building a simple webapp that has one frontend and backend, then you don't need the OAuth protocol. However, a lot of online tutorials and ready made auth solutions force you to implement this.
- **No enforcement of the protocol**: Different auth providers (like sign in with google, apple, github etc..) will implement slightly different variations of the protocol. This prevents a fully plug & play integration system.
- **No session management solution**: Once the user is authenticated, the auth server simply returns a JWT which can be consumed by your application (as well will see later). However, after that step, the OAuth protocol doesn't provide any support for specifying how to maintain the authenticated session between your app's frontend and backend - this is totally up to the developer.

## What is a JWT?
A JWT is a string that contains a JSON payload which can be trusted and be verified by the server. The contents of the payload assert some properties about its holder. For example, if the JSON content is:
```json
{
    "userId": "abcd123"
}
```
We know that the user / client holding this JWT has the user ID of `"abcd123"`.

Now you may wonder that the client could easily change the contents of this JSON and then send it to the server, and that way, they can spoof being any user. This is where the process of signing and verifying a JWT comes into the picture.

### Signing and verifying a JWT
When the server creates a JWT, they take the JSON, and hash it along with some secret that only the server knows. This produces a random string known as the JWT signature. The properties of this signature are:
- If the JSON content changes, the signature changes.
- Only the entity that knows the secret key can create a valid signature.
- Given a JSON, without the secret key, it is very difficult to guess its valid signature.

Due to the above, we can see that a client which doesn't know the signing secret, can't generate a valid signature.

The verification process is as follows:
- The generated signature is appended into the JWT and is sent to the client.
- The client has to send the same JWT (which contains its signature) to the server.
- The server can take the JSON from the incoming JWT, and regenerate the signature with its secret key.
- If the regenerated signature is the same as what’s in the incoming JWT, then the server can trust the JWT.

There are several algorithms that can be used to sign a JWT:
- HMAC + SHA256
- RSASSA-PKCS1-v1_5 + SHA256 (This is most commonly used in the OAuth protocol)
- ECDSA + P-256 + SHA256

Whichever algorithm is used, information about that is also encoded in the JWT. Overall, a JWT looks like:

<pre class="language-text"><code><span style="color: #ff0000">{header containing the algorithm}</span>.<span style="color: #00ff00">{JSON body}</span>.<span style="color: #ffff00">{JWT signature}</span>
</code></pre>

An example JWT:
<pre class="language-text"><code><span style="color: #ff0000">eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9</span>.<span style="color: #00ff00">eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ</span>.<span style="color: #ffff00">3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M</span>
</code></pre>

### When to use a JWT?
Use them whenever you want to transmit some information to an untrusted client, in such a way that that client can verify the information contained in the payload themselves.

From the context of an auth server, an untrusted client is the application that the user is trying to user. From the context of the application's backend, an untrusted client is the frontend code.

### Pros of using a JWT
- **Self-contained**: The JWT can contain the user's details. So you don't need to query a database / auth server for that information on each request.
- **Secure**: JWTs are digitally signed which safeguards them from being modified by the client or an attacker.
- **Stored only on the client**: You generate JWTs on the server and send them to the client. The client then submits the JWT with every request. This saves database space.
- **Efficient**: It’s quick to verify a JWT, because it doesn’t require a database lookup.

### Cons of using a JWT
- **Can't revoke them** without putting in a lot of extra engineering effort
- **Bottlenecked on keeping one secret safe**: Ig the signing key is compromised, the attacker can use that to create their own valid JWTs. This would allow them to spoof the identity of any user an application.

## Better together: How to use OAuth and JWT together

When the authentication server successfully verifies a user's credentials then need to transmit the user details to the client application. Furthermore, the client application should be able to verify those details themselves efficiently. This is where a JWT is used. 

The OAuth server will send a JWT to the client via one of the OAuth flows mentioned above containing the end user's information. The JWT will be signed by the OAuth server (using the RSA algorithm). There are two keys that are involved in this signing algorithm:
- **Private key**: Used to generate a the JWT signature. This key is only known by the auth server
- **Public key**: Used to verify a signature. This key can be known by anyone who whishes to verify the JWT signature. The Auth server broadcasts these keys publicly.

An important property of these keys is that it's impossible to derive the private key if we only know the public key. This way, the client application can fetch the public key from the OAuth server and verify the issued JWT.

A typical JSON payload in the JWT sent by the OAuth server looks like (Example from sign in with Google[^1]):
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
    "hd": "example.com",
}
```
- `iss`: This is the issuer of the token (in this case Google)
- `azp` and `aud`: Client IDs issued by Google for your application. This way, google knows which website is trying to use its sign in service, and the website knows that the JWT was issued specifically for them.
- `sub`: The end user's Google user ID
- `at_hash`: This is the hash of the access token. The OAuth access token is different than the JWT in the sense that it's an opaque token[^2]. The access token's purpose is so that the client application can query Google to ask for more information about the signed in user.
- `email`: The end user's email ID
- `email_verified`: Weather or not the user has verified their email.
- `iat`: The time (in milliseconds since epoch) the JWT was created
- `exp`: The time (in milliseconds since epoch) the JWT was created
- `nonce`: Can be used by the client application to prevent replay attacks.
- `hd`: The hosted G Suite domain of the user

As you can see, there is a lot of information transmitted from the OAuth server (Google in this case), to the client application. And since this is all in a JWT, the client application can verify the contents of this JSON and know that no one has manipulated this content.

It's worth mentioning that some of the fields in the above JSON payload are specific to Google (like `hd`). Other providers have different content.

## Conclusion
We see that comparing OAuth to JWT is like comparing oranges to apples. They both are meant for different purposes, and in fact, a JWT is used as part of the OAuth protocol.

At [SuperTokens](https://supertokens.com), we provide an auth solution that mitigates most of the cons of using OAuth and a JWT:
- We encourage the use of OAuth [only when really needed](https://supertokens.com/blog/oauth-2-vs-session-management)
- We offer a way to [revoke JWTs / access token easily](https://supertokens.com/blog/revoking-access-with-a-jwt-blacklist) without reducing the verification efficiency.
- We offer a [secure session management solution](https://supertokens.com/blog/the-best-way-to-securely-manage-user-sessions) which is the missing piece in the OAuth protocol.


[^1]: https://developers.google.com/identity/protocols/oauth2/openid-connect
[^2]: A random, meaningless string that doesn't contain any JSON payload. It's essentially an entry into a database.