---
title: Should you use Express-session for your production app?
date: "2020-05-06"
description: "Being Node’s most popular session management library, express-session has its set of flaws– especially when it comes to security. This article will help you analyse the good and bad parts of it."
cover: "should-you-use-express-session-for-your-production-app.png"
category: "sessions"
author: "Rishabh Poddar"
---

While being Node’s most popular [session management](https://www.packetlabs.net/posts/session-management/) library, express-session has its set of flaws and weaknesses – especially when it comes to security. This article will analyse the good and bad parts of express-session so that you can make an informed decision for your next app. We will be using a point system where one point will be awarded for performing well on a metric, and one will be deducted for bad performance. At the minimum, we want a positive number at the end of the analysis (and the higher the number is, the better). Here are the metrics we will be using:

- [**Security**](#security): This is especially relevant because we’re talking about user session management.
- [**Scalability**](#scalability): Time and space costs. This is relevant because most API calls require session authentication.
- [**Reliability and Correctness**](#reliability-and-correctness): It is imperative that the library takes care of technical issues like keeping its state consistent despite network or server failures and taking care of synchronising its logic in a clustered environment.
- [**App User experience**](#app-user-experience): We want to use a library that can provide the right experience for your app users – for example, does the library enable a user to be logged in for weeks or months whilst also providing good security?
- [**Time to production**](#time-to-production): We will look at factors such as time to integrate the library into an app, available support, and ease of understanding of the library code.
- [**Maintenance cost**](#maintenance-costs): We will assess costs for runtime (RAM and processing power) and internal and external monetary costs.


## Security

![a woman holding blue folder with lock](./image243x-p-800.png)

For a background on why session security is important, read our [other blog post](/blog/all-you-need-to-know-about-user-session-security?s=se) (Facebook, Docker, Gitlab have all had session vulnerabilities in the past 2 years). Session attacks can occur across 3 attack vectors; the frontend, in transit (over the internet) or on the backend.


## Token theft via XSS:

In an XSS attack, an attacker can maliciously inject JavaScript into a website on the victim’s browser. The injected code reads and transmits session tokens to the attacker.

Exclusively using HttpOnly cookies to store auth tokens disallows any JavaScript running on the browser from reading them, preventing token theft via XSS. Both SuperTokens and express-session protect against this attack. We give one point here.

<span style="color: green;">**Score: 1**</span>


## Brute force

![hammering a lock](./image313x-p-800.png)

This attack can be solved easily by using long length tokens that have a high amount of entropy.

Express-session prevents this attack by default and hence receives a point.

<span style="color: green;">**Score: 2**</span>

## Token theft via Man in the middle attack:

![three humans holding there laptops](./image323x-p-800.png)

While this attack is mostly preventable using HTTPS, it can still be successfully executed – especially in corporate environments (Check out [this](https://mitmproxy.org/) tool) where access to the internet is controlled via an HTTPS proxy. As such, there is no full proof method to prevent this attack and we can only attempt to minimize the damage.

Express-session uses just one long lived access token (Session ID). Hence, for each API request, the frontend needs to send this one token to the backend for authentication purposes. If a MITM attack is being carried out, any request the app makes will expose this critical token to the attacker who can then use it to gain access to the victim’s account for a long period of time – potentially months.

Other solutions exist where two tokens are used – access and refresh tokens. These are more secure because the critical token (refresh token) is exposed very rarely. Hence, express-session loses a point.

<span style="color: red;">**Score: 1**</span>


## Session fixation:

The attack consists of inducing a user to authenticate themselves with a known session ID, and then hijacking the user-validated session by the knowledge of the used session ID.

Session fixation can be prevented by changing the auth tokens upon successful user login.
While express-session provides the regenerate function, it’s the developer’s responsibility to call this and make sure any session data is carried forward. Since many developers use passport JS (which doesn’t call this function – see [here](https://github.com/jaredhanson/passport/issues/192)) for login purposes, this attack vector goes unresolved.

Hence express-session loses a point.

<span style="color: red;">**Score: 0**</span>

## Data theft from database:

Express-session stores all session IDs in plain text. This means that if an attacker was to get hold of this information (and assuming that they also got hold of the secret key – which is quite probable if they have access to the db), they could easily hijack the session of all currently logged in users.

In comparison, other libraries like store the hashed version of session tokens in the database.

Express-session loses a point.

<span style="color: red;">**Score: -1**</span>


## CSRF (Cross-site Request Forgery):

Express-session does nothing to prevent this, nor does it do anything to “remind” developers about this problem. In comparison, other solutions enforce CSRF protection when verifying a session.

<span style="color: red;">**Score: -2**</span>


## Session hijacking:

There are two aspects to this attack:

- Preventing unauthorised access via token theft: In theory, it’s impossible to prevent this since the session tokens are being sent to an untrusted device (the app’s frontend). We can only minimise the probability of this event. The most prominent method to do so is to use frequently changing session tokens.

- Detecting token theft and taking appropriate action: Traditional methods of theft detection include methods like analysing IP address or device fingerprint changes. However, these methods lead to many false negatives and positives. The better way to do this is to use the concept of rotating refresh tokens as suggested by IETF in their [OAuth RFC](https://datatracker.ietf.org/doc/html/rfc6749#section-10.4). After detection, the session solution should allow for immediate or quick revocation of the affected session.

Express-session uses one long lived token and has no means to detect token theft. Below is the session flow for express-session:

![two images explaining auth flow](./image263x-p-800.png)

Clearly, Express-session loses a point here as well:

<span style="color: red;">**Score: -3**</span>

## Reliability and Correctness

Correctness means that the code works as expected in normal and edge case situations. Based on our evaluation, we found that express-session is not thread safe. The specific failure case is that it is possible to bring back a revoked user session in certain scenarios:

1. A user session already exists for user1
2. Let’s say we have two requests (A and B) sent at the same time from user1.
3. Request A, reaches the server first and gets the session object in its API.
4. After that, request B reaches the server and revokes this session.
5. Request A then (using its already obtained session object in step 3), modifies some session data and then saves that.
6. This results in the revoked session being alive again.

<span style="color: red;">**Score: -4**</span>

## App User experience

In the context of sessions, a good user experience means that we enable long lived sessions so that app users do not have to keep logging in repeatedly. Both Express-session and SuperTokens enable this, so it’s a tie.

<span style="color: green;">**Score: -3**</span>

## Time to production

![man sitting with his laptop on table](./image283x-p-800.png)

**Completeness:** Session management is tightly tied to user management. This means, given a session, one should be able to retrieve the associated user information, and given a user ID, one should be able to retrieve all the associated sessions. While express-session allows you to get user information given a session ID, going the other way around would require customisations. On the other hand, SuperTokens have both way bindings.

<span style="color: red;">**Score: -4**</span>


**Complexity in initial setup:** SuperTokens is more complex to set up than Express-session is, albeit for good reason – it adds more security and it also has more features. This point goes to express-session.

<span style="color: green;">**Score: -3**</span>

**Community support:** Since Express-Session is an older library and is being used by a lot of developers, it has great support and a big presence on sites such as StackOverflow. SuperTokens does not yet have equally good community support. Express-Session wins a point here.

<span style="color: green;">**Score: -2**</span>


## Maintenance costs

![humans trying to drill a computer](./image293x-p-800.png)

Can do something similar to time to production. Instead of a stopwatch, we show a spanner and servers

Express-session is a relatively simple library, which means that as apps scale, eventually, more and more work needs to be put into “scaling” / changing the session management system. Examples of changes are:

- Building infrastructure to be able to monitor / revoke sessions in real time from a dashboard.
- Quite often, the API layer is built using multiple frameworks (like NodeJS). Hence, a cost here is to build a library for another backend framework that is compatible with Express-sessions.
- Adding a caching layer to session to improve performance.
- Adding more functionality to the core session logic.
  - Enhancing security by revoking sessions based on changes in device fingerprints or IP addresses.
  - Syncing session data across a user’s devices.
  - Implementing different session timeouts for different user roles.
   
I realise that not all the above points will be of concern, but even if one of them does end up being true, that can add significant costs to an organisation / project simply because of how expensive developers are – especially one experienced enough to work on session security.

<span style="color: red;">**Score: -3**</span>

## Conclusion:

Express-session is a popular, widely used library. It is basic, functional and quick to setup – and for many applications, this is good enough. However, it seriously lacks in other important aspects. For many applications, security is rightfully an important consideration and express-session is far too basic. Aside from security, it lacks functionality and does not adequately consider race conditions. These factors become important as your app starts to scale.

After speaking to 100+ companies, we observed that close to 75% of startups and enterprises end up building a custom solution to manage user sessions. Many do it for the reasons highlighted above.


With a negative final score, it’s clear that Express-session is not optimal for production apps – especially ones that care about user security and will likely scale with time. If you feel that I have judged unfairly, or missed out an important metric, please do comment or send us an [email](mailto:team@supertokens.com).

There are many alternatives to Express-session and it is likely that you are considering building a custom solution. However, as an alternative to Express-session, we have built a secure, open source and feature complete solution called [SuperTokens](https://supertokens.com/). It is already being used by 100s of developers all. We’d love to hear your feedback on whether this is something you would use.


To learn more about Sessions, please visit our other blogs and our website:

- [All you need to know about user session security](/blog/all-you-need-to-know-about-user-session-security)
- [The best way to securely manage user sessions](/blog/the-best-way-to-securely-manage-user-sessions)


## Footnote:

*[1]*: Technically, OAuth is different from session management (in the context of this article). But the underlying mechanism through which access is maintained, is similar.