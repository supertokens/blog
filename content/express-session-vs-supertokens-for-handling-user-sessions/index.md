---
title: Express-session vs SuperTokens for handling user sessions
date: "2020-06-11"
description: "This article will be comparing SuperTokens to Node’s most popular session management library– express-session. Learn more about the comparison based on different security and performance metrics."
cover: "express-session-vs-supertokens-for-handling-user-sessions.png"
category: "sessions"
author: "Advait Ruia"
---

This article will be comparing SuperTokens to Node’s most popular [session management](https://www.packetlabs.net/posts/session-management/) library – express-session. The comparison will be done using a point system, where a point will be awarded to a library’s score if it performs well in a given metric. Here are the metrics we will be using:

- Security: This is especially relevant because we’re talking about user session management.
- Scalability: Time and space costs. This is relevant because most API calls require session authentication.
- Reliability and Correctness: It is imperative that the library takes care of technical issues like keeping its state consistent despite network or server failures and taking care of synchronising its logic in a clustered environment.
- App User experience: We want to use a library that can provide the right experience for your app users – for example, does the library enable a user to be logged in for weeks or months whilst also providing good security?
- Time to production: We will look at factors such as time to integrate the library into an app, available support, and ease of understanding of the library code.
- Maintenance cost: We will assess costs for runtime (RAM and processing power) and internal and external monetary costs.