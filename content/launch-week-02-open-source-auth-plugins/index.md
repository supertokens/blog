---
title: "SuperTokens Launch Week 02: 7 Open-Source Auth Plugins" 
date: "2025-10-10"
description: "Open-source auth plugins you’ll reuse: profiling, banning, CAPTCHA, tenancy tools, and telemetry. React/Node ready. "
cover: "launch-week-02-open-source-auth-plugins.png"
category: "programming"
author: "Darko Bozhinovski"
---


We just wrapped up **SuperTokens Launch Week 02** — five days of shipping new tools to solve some of the most common and time-consuming problems in authentication.

The vision is simple: a world where you can run a single command and have auth just work, regardless of your stack. This week was a step in that direction.

If you missed it, here’s a full breakdown.

---

## The Problem: You Keep Building the Same Things Over and Over

Authentication isn’t just about logging in. It’s often about managing the entire user lifecycle — profile pages, moderation tools, bot protection, and routing logic for multi-tenant apps.  

These are solved problems, yet we find ourselves rebuilding them for almost every new project. It’s repetitive, distracting, and keeps you from focusing on your core product.  
We want to eliminate that waste.

---

## The Solution: A New Set of SuperTokens Plugins

This week, we expanded beyond core authentication to deliver an ecosystem of **easy-to-use, open-source plugins**. Each one tackles a problem developers face repeatedly.

Here’s what we shipped:

---

### 🧩 Day 1: The Profile Family of Plugins

Stop building user profile pages from scratch.  
This plugin family gives you a ready-to-go, customizable profile page and a **progressive profiling system** to gather user info over time without overwhelming them at sign-up.

**Check them out here:**
- [Progressive Profiling](https://supertokens.com/docs/post-authentication/user-management/progressive-profiling)

---

### 🤖 Day 2: The Captcha Plugin

Spambots are a constant headache.  
Our **Captcha plugin** makes it trivial to add **hCaptcha**, **reCAPTCHA**, or another provider to your SuperTokens forms — just configure and go.

**Check them out here:**
- [Captcha Plugin](https://supertokens.com/docs/additional-verification/captcha)

---

### 🚫 Day 3: The User Banning Plugin

Every community needs moderation.  
This plugin lets you **ban bad actors instantly** — no custom moderation code required.

**Check them out here:**
- [User Banning](https://supertokens.com/docs/post-authentication/user-management/user-banning)

---

### 🏢 Day 4: The Tenant Management Family of Plugins

For SaaS and B2B apps, multi-tenancy is often messy.  
We shipped two plugins to simplify it:

- **Tenant Discovery:** Handles routing users to the right tenant automatically.  
- **Tenant Self-Management:** Makes tenant setup and maintenance far easier.

**Check them out here:**
- [Tenant Discovery](https://supertokens.com/docs/authentication/enterprise/tenant-discovery)

---

### 🔍 Day 5: The OpenTelemetry Plugin

Finally, we brought **deep observability** to your auth layer.  
Our **OpenTelemetry plugin** gives you a behind-the-scenes look at the SuperTokens SDK — allowing you to **trace flows, monitor performance, and debug issues with precision**.

**Check it out here:**
- [OpenTelemetry Plugin](https://supertokens.com/docs/deployment/telemetry)

---

## Why This Matters

Authentication should be a solved problem.  
Our goal is to bring **SuperTokens to your stack**, not force your stack to bend around us. These plugins abstract away the boilerplate so you can focus on building what makes your product unique.

This is just the beginning.  
We’re already working on the next wave of plugins — and we can’t wait to see what you build with them.

---

Thanks for following along with our first Launch Week.  
We can’t wait to see what you build.