---
title: All you need to know about user session security
date: "2019-06-07"
description: "This article covers extensive conversations with over 70+ developers exploring different session management practices, identifying issues and converging on a solution to these issues. "
cover: "all-you-need-to-know-about-user-session-security.png"
category: "sessions, featured"
author: "Rishabh Poddar"
---

What follows is a 2 part series on session management — inspired by extensive conversations with over 70 developers and our own intensive research. We will explore different session management practices, identify issues and converge on a solution to these issues. Through it all, I hope to leave you with clarity on deciding how to manage user sessions (and auth tokens) for your application. In 20 minutes, we summarise all the important information it took us hundreds of hours to obtain and document.

This is part 1 in a two-part series on session management.

*Part 1: Introduction to session management, analysis of most commonly used session flows, and best practices*

*[Part 2](/blog/the-best-way-to-securely-manage-user-sessions): Analysis of a new, open source session flow that is secure and easy to integrate into existing systems — provided by [SuperTokens](https://supertokens.com)*

Specifically, in part 1, we cover

- [Why is session security important?](#why-is-session-security-important)
- [JWT vs Opaque access tokens]()
- [Common attacks on sessions]()
- [Detection vs Prevention of stolen auth tokens]()
- [Common ways of implementing session management flows]()
- [Best practices for attack mitigation]()

*Note: Do not confuse session management with OAuth, as the latter is a protocol designed only for the purpose of delegation. Session management, for the purpose of this article, is about how auth tokens are handled, stored and changed during an active session — whether it be for OAuth flows, or for server-client session flows.*


## Why is session security important?

Session security is an important consideration in the design of any system that requires communication between a server and a client. Improper security can lead to user accounts being vulnerable to unauthorized access. OWASP (Open Web Application Security Project — leading authority for security) considers the improper implementation of authorisation / authentication as the [second biggest risk](https://owasp.org/www-project-top-ten/2017/) to application security. Several notable hacks illustrate this point:


- The Docker hub database hack earlier this year resulted in stolen Github access tokens. [Source](https://www.trustedreviews.com/reviews/google-pixel-4)

- Gitlab had a vulnerability where all its user’s auth tokens were exposed in the URLs, had no expiry time and were susceptible to brute force attacks due to their short length. [Source](https://threatpost.com/session-hijacking-bug-exposed-gitlab-users-private-tokens/127747/)

- A software bug made it possible to steal access tokens — affecting 90 million Facebook accounts. [Source](https://about.fb.com/news/2018/09/security-update/)

- Youtube influencers’ accounts compromised for several days via session token theft to completely hijack their account and change their video content. The tokens were stolen via a malware installed on the victim’s computer. [Source](https://twitter.com/MarcoStyleNL/status/1192179230341251075?s=09)

It is tricky, time-consuming and expensive to correctly implement user session management. According to an [a16z](https://a16z.com/about/) operating partner (top tier VC) and former Box CSO (Chief Security Officer), **authentication and authorisation is the number one spending cost for organisations when it comes to their security budget.** [Source](https://www.youtube.com/watch?v=FdIW7BiCBtI&t=524s)

This is the tip of the iceberg but we hope it is enough for anyone to realize that they could be the next Titanic if they do not correct their course.