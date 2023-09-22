---
title: Should you use Express-session for your production app?
date: "2020-05-06"
description: "Being Node’s most popular session management library, express-session has its set of flaws– especially when it comes to security. This article will help you analyse the good and bad parts of it."
cover: "should-you-use-express-session-for-your-production-app.png"
category: "sessions"
author: "Rishabh Poddar"
---

While being Node’s most popular [session management](https://www.packetlabs.net/posts/session-management/) library, express-session has its set of flaws and weaknesses – especially when it comes to security. This article will analyse the good and bad parts of express-session so that you can make an informed decision for your next app. We will be using a point system where one point will be awarded for performing well on a metric, and one will be deducted for bad performance. At the minimum, we want a positive number at the end of the analysis (and the higher the number is, the better). Here are the metrics we will be using:

