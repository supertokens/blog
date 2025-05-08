---
title: "How to Integrate SuperTokens with Supabase (And Why You Might Choose It Over Clerk)"
date: "2025-05-07"
description: "🧩 Looking for an auth solution that’s open-source, self-hostable, and highly customizable? Here's how to set up SuperTokens with Supabase in a Next.js app—and when it’s the smarter choice over Clerk."
# cover: "integrate-supertokens-with-supabase.png"
category: "programming"
author: "Maria Shimkovska"
---

Welcome back! 👋

In Part I, we used Clerk to get a fast, sleek authentication system running in our Mermaid diagramming app. Clerk’s plug-and-play components are great when you want to ship quickly.

But what if your app needs more control? <br />
What if you need to self-host your auth, define custom logic, or support multiple tenants?

Welcome to Part II—where we swap Clerk for SuperTokens, a powerful alternative for developers who want full control over authentication and session management without losing their minds.

## 📖 What You’ll Learn
In this guide, you'll: 
* Set up SuperTokens in your Next.js app
* Connect it to Supabase for storing-specific data
* Compare the developer experience to Clerk 
* Customize auth flows and learn how SuperTokens gives you more control 

As with Part I, we'll use the [**Mermaid Charting App**]() as our demo project. 

## 🧠 What is SuperTokens?

[**SuperTokens**](https://supertokens.com/) is an open-source authentication solution that gives developers full flexibility over how they implement auth. You can self-host it or use their managed service.

It gives you:
* Secure, server-side **session handling**
* Customizable sign-in / sign-up flows
* First-class support for **Next.js**
* Full control over your user DB

SuperTokens can be configured in password, social login, or passwordless mode—or even combine them in hybrid flows.

In this guide, we’ll integrate SuperTokens with Supabase to protect and persist user-created Mermaid diagrams, just like we did with Clerk.

## 💬 Why SuperTokens
SuperTokens is a developer-first authentication that can be self-hosted or managed through the SuperTokens Cloud. It's open-source, privacy-conscious, and gives you deeper control over the authentication stack. 

Here is what makes SuperTokens stands out.

### ⚖️ SuperTokens vs Clerk (Quick Recap)

| Feature                    | Clerk                 | SuperTokens                     |
|----------------------------|------------------------|----------------------------------|
| Hosted or Self-Hosted      | Hosted (SaaS)          | Self-host or Managed            |
| UI Components              | Prebuilt & polished    | Prebuilt or build your own                  |
| Customization              | Moderate               | Full control                    |
| Session Management         | Built-in               | Fine-grained                    |
| Magic Links, Passwordless  | ✅                     | ✅ (fully customizable)         |
| Social Login               | ✅                     | ✅                              |
| Pricing                    | Free tier, usage-based | Open source, optional managed plans |
| GDPR/Compliance            | Data stored externally | Full control over data residency |

If you need advanced logic, ownership of your user data, or compliance with stricter regulations (e.g. healthcare, government, EU), SuperTokens is the better fit.

## 🗺️ App Architecture Overview
Here’s the high-level setup:
* **SuperTokens = Auth and Session Management**
* **Supabase = Data Storage**
* **Next.js = Frontend + API Routes**
* **Row-Level Security (RLS) = Data isolation per user**

We’ll store Mermaid charts in Supabase, each associated with the user’s unique ID from SuperTokens.

Let’s dive in. 🧵

## 🔗 How SuperTokens + Supabase Work Together
The architecture is similar to Clerk and Supabase - but with more explicit control at each step. 
1. **SuperTokens handles authentication and session tokens.**
2. **Your app extracts the user ID from the token**, then uses that ID to interact with Supabase. 
3. **Supabase uses Row Level Security (RLS)** to make sure users only access their own data. 

Just like with Clerk, we use a custom SQL helper in Supabase to parse the JWT's `sub` field (*which holds the user ID*).

## 🔧 Setting Up SuperTokens

### 1. Install Dependencies

```bash 
# Backend (API routes)
npm install supertokens-node

# Frontend (React components)
npm install supertokens-auth-react

# Next.js adapter
npm install supertokens-nextjs
```

### 2. Initialize SuperTokens in `pages/api/auth/[...path].ts`
SuperTokens handles auth through an API route catch-all. Here's the boilerplate setup:

```javascript 
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { middleware } from "supertokens-node/framework/express";
import { superTokensRouter } from "supertokens-node/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
  await superTokensNextWrapper(
    async (next) => {
      await superTokensRouter(req, res);
    },
    req,
    res
  );
}
```

You'll also need to initialize the backend logic in a separate config file.

### 3. Create config/backendConfig.ts

```javascript 
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";

SuperTokens.init({
  appInfo: {
    appName: "Mermaid Chart App",
    apiDomain: "http://localhost:3000",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/api/auth",
  },
  supertokens: {
    connectionURI: "https://try.supertokens.com", // Replace with your own instance if self-hosting
  },
  recipeList: [
    EmailPassword.init(), 
    Session.init(), 
  ],
});
```
Then call this config from your custom server or middleware.

### 4. Add Auth Components in Your Frontend
SuperTokens includes prebuilt UI for login and signup:

```javascript 
import { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

function App() {
  return (
    <SuperTokensWrapper>
      <EmailPassword.SignInAndUp />
    </SuperTokensWrapper>
  );
}
```

You can fully override the UI if you want to. 

## Connecting SuperTokens with Supabase
Supabase needs to know who is accessing data. Since we’re not using Supabase Auth, we need to:
1. Extract the user ID from the SuperTokens session token.
2. Send it in a JWT or as part of a secure API call.
3. Apply RLS policies based on that ID.

### 1. Create the `charts` Table

```sql
create table charts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id text not null,
  created_at timestamptz default now()
);
```

### 2. Enable RLS and Add Policies

```sql 
alter table charts enable row level security;

create policy "Users can read their charts"
on charts for select
using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert their charts"
on charts for insert
with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

### 3. Include JWT in API Calls

When your frontend makes requests to Supabase, include the user’s ID from SuperTokens. This can be passed securely via your Next.js API routes:

```javascript 
import { getSession } from "supertokens-node/recipe/session/framework/express";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const userId = session.getUserId();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("charts")
    .insert([{ content: req.body.content, user_id: userId }]);

  res.status(error ? 500 : 200).json({ success: !error });
}
```

## 🧠 Why This Approach Works
With SuperTokens and Supabase: 
* You manage auth **server-side** (no external redirects)
* You **own all user data**
* RLS ensures privacy per user 
* You can build any auth flow you want: **SSO**, **magic links**, **multi-factor**, and more.

## 💻 GitHub Repo and Code Example
Want to see the whole setup? Check out the full working demo here:<br />
[GitHub: Mermaid Chart App with SuperTokens + Supabase]()

## Final Thoughts: Which Should You Use?
**Choose Clerk if:**
* You want to ship fast with beautiful, hosted UI.
* You prefer a fully managed SaaS auth provider.
* You're okay with vendor lock-in for convenience.

**Choose SuperTokens if:**
* You need full control over auth and sessions.
* You want to self-host or stay GDPR-compliant.
* You’re building complex auth flows (multi-tenant, B2B, etc.)

Thanks for following this two-part guide! 🎉