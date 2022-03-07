---
title: "OAuth vs JWT Token: A comparison"
date: "2022-03-07"
description: "Learn about the difference between JWT Token and OAuth 2.0 protocol"
cover: "TODO.png"
category: "sessions"
author: "SuperTokens Team"
discord_button_id: "discord_oauth_vs_jwt"
---

OAuth 2.0 is a protocol that is used to authenticate users via a third party auth provider, whereas a JWT Token (or just JWT) is a string / token that is used to assert a certain JSON payload information about its holder.

In fact, a JWT is exchanged during the OAuth 2.0 protocol, so let's first understand a JWT

## What is a JWT Token

A JWT is a string that contains a JSON payload which can be trusted by the server. The contents of the payload assert some properties about its holder. For example, if the JSON content is:
```json
{
    "userId": "abcd123"
}
```

We know that the user / client holding this JWT has the user ID of `"abcd123"`. Now you may wonder that the client could easily change the contents of this JSON and then send it to the server, and that way, they can spoof being any user. This is where the process of signing and verifying a JWT comes into the picture.

### Signing and verifying a JWT
When the server creates a JWT, they take the JSON, and [hash](https://en.wikipedia.org/wiki/Hash_function) it along with some secret that only the server knows. This produces a random string known as the JWT signature. The properties of this signature are:
1) If the JSON content changes, the signature changes.
2) Only the entity that knows the secret key can create a valid signature.
3) Given a JSON, without the secret key, it is very difficult to guess its valid signature.

The verification process is as follows:
- The generated signature is appended into the JWT and is sent to the client. 
- The client has to send the same JWT (which contains its signature) to the server. 
- The server can take the JSON from the incoming JWT, and regenerate the signature with its secret key.
- If the regenerated signature is the same as what's in the incoming JWT, then the server can trust the JWT.

There are several algorithms that can be used to sign a JWT:
- HMAC + SHA256
- RSASSA-PKCS1-v1_5 + SHA256
- ECDSA + P-256 + SHA256

Whichever algorithm is used, information about that is also encoded in the JWT.

### Example of a JWT's creation, signing and verification process

### 1) Create a JSON

Let's take the following JSON:
```json
{
    "userId": "abcd123",
    "expiry": 1646635611301
}
```
Notice that we have also added an `expiry` field (in milliseconds since epoch). We will see how this field is used during the verification process.

### 2) Create a JWT signing key and decide the signing algorithm
First, we need a signing key and an algorithm to use. We can generate a signing key using any secure random source. For the purpose of this post, let's use:
- Signing key[^1]: `NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c=`
- Signing algorithm: "HMAC + SHA256" or `HS256`.

### 3) Creating the "Header"
This contains the information about which signing algorithm is used. Like the payload, this is a also a JSON and will be appended to the start of the JWT (hence the name header):
```json
{
    "typ": "JWT",
    "alg": "HS256"
}
```

### 4) Create a signature
- First we remove all the spaces from the payload JSON and then base64 encode it to give us `eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ`. You can try pasting this string in [an online base64 decoder](https://www.base64decode.org/) to retrieve our JSON.
- Similarly, we remove the spaces from the header JSON and base64 encode it to give us: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`.
- We concatenate both the base 64 strings, with a `.` in the middle like `<header>.<payload>`, giving us `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ`. There is no special reason to do it this way other than to set a convention that the industry can follow.
- Now we run the Base64 + HMACSHA256 function on the above concatenated string and the secret to give us the signature:
    ```text
    Base64URLSafe(
        HMACSHA256("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ", "NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c=")
    )

    Results in:
    3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
    ```
    We base64 encode it only as a industry convention.

### 5) Creating the JWT
Finally, we append the generated secret like `<header>.<body>.<secret>` to create our JWT:        

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhYmNkMTIzIiwiZXhwaXJ5IjoxNjQ2NjM1NjExMzAxfQ.3Thp81rDFrKXr3WrY1MyMnNK8kKoZBX9lg-JwFznR-M
```

[^1]: Please do not use this key in your application, since this is public