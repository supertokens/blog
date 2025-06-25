---
title: "How to Integrate Clerk with Supabase (Plus another option for the curious)"
date: "2025-06-21"
description: "🔐 Learn how to integrate Clerk with Supabase for powerful authentication and database management in your Next.js applications - with step-by-step tutorial and code examples."
cover: "integrate-clerk-with-supabase.png"
category: "programming"
author: "Maria Shimkovska"
---

In this guide, we’ll walk through integrating Clerk with Supabase step-by-step. We start with a basic, no-auth Next.js app and gradually add authentication and secure, user-specific data storage using Clerk for auth and Supabase for data. You’ll end up with a diagram editor where each user can save and retrieve their own diagrams.

**What You’ll Learn**
* Set up Clerk authentication in a Next.js app
* Connect Clerk and Supabase (using the updated 2025 integration)
* Configure Row-Level Security (RLS) for user-specific access
* See it all come together in a diagram editor where authenticated users save and load their own charts

We begin with a simple “no-auth” editor (users can draw and preview Mermaid diagrams, but nothing is saved). Then we layer on Clerk and Supabase. Clerk provides sign-in flows, session tokens, and user IDs. Supabase holds the diagrams and enforces per-user data access via RLS. 

Finally, we’ll introduce SuperTokens as an alternative in Part II, showing how it can offer more control (especially for session management) while still working with Supabase. Clerk is great out of the box if you want a quick, managed solution, but SuperTokens is worth a look if you need advanced extensibility or self-hosting.

## How Clerk and Supabase Work Together

In this integration, Clerk and Supabase take on two distinct roles:

* **Clerk handles authentication and user identity** <br />It provides everything needed to securely sign users in like login flows, session management, and user IDs. Each user gets a unique userId (the `sub` claim in Clerk’s JWT) that stays the same across sessions.

* **Supabase handles data storage and access control** <br />We use Supabase to store content (in our example, each user’s saved Mermaid chart) and to enforce fine-grained access rules. Supabase’s Row-Level Security (RLS) policies make sure users only see and modify their own data, even though everyone’s data lives in the same database.

### How the Integration Flow Works

1. **User signs in with Clerk**<br /> Clerk verifies their credentials and returns a JWT (JSON Web Token) containing the user’s unique ID (`sub` claim)
2. **Your app sends the JWT to Supabase**<br /> You configure the Supabase client to include Clerk’s token on each request. Supabase sees the token and uses it to identify the user.
3. **Supabase enforces RLS policies** <br />For example, if we have a charts table with a user_id column, RLS policies can be written like:
    ```sql
    -- Only allow a user to see rows where user_id matches their ID from Clerk
    policy "Users can access their own charts"
    on charts
    for all
    using (auth.uid() = user_id);
    ```

> **RLS ensures each user sees only their own data, even in a shared database.**

**This works because**
* Authentication is fully managed by Clerk out of the box.
* User data is stored in Supabase and automatically tied to individual user identities.
* Row-Level Security (RLS) policies enforce strict access control, preventing users from viewing or altering data that isn't theirs.

## Clerk and Supabase Integration: Project Overview

🐙 **[View the full demo on GitHub](https://github.com/meems1996/mermaid-charting-app)** - this Next.js example shows Clerk + Supabase in action.

### App Features:
* **MermaidJS Editor**. A live editor to write and render Mermaid diagrams.
* **Clerk Authentication**. Sign-up/sign-in UI components and session handling.
* **Supabase Storage**. Save and retrieve diagrams in a secure database.
* **Row-Level Security**. Supabase policies ensure each user’s data is private.

**Initial State:** The app starts as a simple, stateless editor. Users can draw and preview diagrams, but nothing is saved – as soon as the page reloads, the content is lost.

**With Clerk + Supabase:** After adding Clerk, users must sign in. Then, with Supabase connected, each user can save their diagram, and it will reappear the next time they log in. Each saved chart is tagged with that user’s Clerk user ID, and RLS guarantees no user can see another’s charts. This turns the tool into a full multi-user app with persistent, private data.

### What You’ll Build
We’ll enhance the basic editor by adding:
1. **Clerk Authentication:** Add Clerk to the Next.js app. Users can sign up and sign in (or sign out). After login, they see personalized content.
2. **Supabase Integration:** Configure Supabase so that each signed-in user can save their diagrams to the database. Supabase will use the Clerk user ID (from the JWT) to scope the data. RLS policies enforce that users only access their own data.

By the end, you’ll have a working diagram editor where each user signs in, sees their own saved charts, and nothing else.

![alt text](image.png)

## Setting Up Clerk 
Let’s start by integrating Clerk for authentication. Clerk provides a powerful auth-as-a-service with pre-built React components, so most of this is straightforward setup.

### 1. Sign Up for Clerk 
Go to Clerk’s website and create an account. After signing up, log in to the Clerk dashboard, where you can manage your applications and auth settings.

### 2. Create a New Clerk Application
In your Clerk dashboard:
1. Click **Create Application** and give it a name (e.g. *Mermaid Visualizer*).
2. Choose your auth methods. (For simplicity, we'll enable only the email authentication method in this demo.)
3. Clerk will then guide you to install its SDK and configure your app.

### 3. Install the Clerk SDK 
In your project directory, install Clerk’s Next.js SDK:

```bash 
# If you're using npm 
npm install @clerk/nextjs

# If you're using yarn 
yarn add @clerk/nextjs

# If you're using pnpm
pnpm add @clerk/nextjs
```

This SDK gives you React components (like `SignInButton`) and server helpers for middleware.

### 4. Set your Clerk API keys
Add these keys to your `.env` file, or create the file if it doesn't exist. 

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
```

### 5. Update `middleware.ts`
Update your middleware file, or create one at the **root** of your project, or the **src/** directory if you're using a src/ directory structure.

The `clerkMiddleware` helper enables authentication and is where you'll configure your protected routes.

```javascript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

### 6. Add ClerkProvider and the SignUp/SignIn Buttons

To enable Clerk throughout your app, you’ll use the ClerkProvider in your layout.tsx file.

Here’s what to do:
* **Import the necessary components** from `@clerk/nextjs`.
* **Wrap your app** with `ClerkProvider` to make Clerk’s features available globally.
* Use `SignedOut` to wrap the `SignInButton` and`SignUpButton`. These will only appear when the user is signed out.
* Use `SignedIn` to wrap both the `UserButton` and your app’s content. These will only show when the user is signed in.

```javascript{4-12, 36, 41-45, 47-51, 56}
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 🔐 Clerk components for authentication flows
import {
  ClerkProvider, // Wraps your app to provide authentication context
  SignInButton, // Renders a sign-in button that opens Clerk's sign-in modal
  SignUpButton, // Renders a sign-up button that opens Clerk's sign-up modal
  SignedIn, // Conditionally renders children *only* if the user is signed in
  SignedOut, // Conditionally renders children *only* if the user is signed out
  UserButton, // Displays the user's avatar with a dropdown for account management
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ ClerkProvider wraps the entire app, enabling access to auth state and Clerk components
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <header className="p-5">

          {/* 👋 Show these only when the user is signed out */}
          <SignedOut>
            <SignInButton /> {/* Opens a modal for users to sign in */}
            <SignUpButton /> {/* Opens a modal for users to create an account */}
          </SignedOut>

          {/* 🙌 Show these only when the user is signed in */}
          <SignedIn>
            <UserButton /> {/* Shows user profile options like sign out */}
            {children}  {/* Show the app content only to signed-in users */}
          </SignedIn>
          
        </header>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

🎉 And that’s it! You’ve now set up Clerk for user authentication in your app. Users can sign in, sign up, and see personalized content based on their auth state.

### 7. Run Your Project and Get Your First User
Start your dev server:
```bash
# If you're using npm 
npm run dev

# If you're using yarn 
yarn dev

# If you're using pnpm
pnpm dev
```

Once it’s running, head to `http://localhost:3000` in your browser. You should see your app with sign-in and sign-up options. Go ahead and register—this will create your first authenticated user.

Next up, we'll connect Supabase and set it up to store user-specific data like saved Mermaid charts.

## Setting Up Supabase with Clerk
To integrate Supabase with your Next.js project and secure user-specific data using Clerk authentication, follow these steps: 

### 1. Create a Supabase Project
* Visit [supabase.com](https://supabase.com/) and sign up for a free account.
* Once inside the dashboard, click **“New Project”**.
* Choose a **Project Name** (e.g. *Mermaid Visualizer*), select the **closest region** for your users, and set a strong password (you can use the “Generate Password” feature).
* Save this password in your password manager.

### 2. Install Supabase Client
Install the Supabase JavaScript client in your project:
```bash
npm install @supabase/supabase-js
```

### 3. Connect Clerk to Supabase (New 2025 Flow)
As of April 2025, Supabase has updated its integration method with Clerk from JWT templates to native third-party support, which simplifies setup and improves security.

1. **Configure Clerk for Supabase:** In your Clerk dashboard, navigate to API Keys and enable Supabase compatibility.
2. **Add Clerk as a Third-Party Auth Provider in Supabase:** In Supabase, go to **Authentication > Providers > External OAuth** and select **Clerk**. You’ll need to input the **Issuer URL** and **JWKS endpoint** from Clerk (Clerk’s docs or connect page will show you what values to use).

### 4. Set Up Row-Level Security (RLS) with Clerk
By default, Supabase uses its own `auth.uid()` method, which doesn't work when using Clerk. To fix that, we'll extract the authenticated user's ID from the Clerk-provided JWT.

#### Create a Helper Function for Clerk IDs
In Supabase’s SQL Editor, paste the following:

```sql
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  )::text;
$$ LANGUAGE SQL STABLE;
```
This function safely retrieves the authenticated Clerk user ID from the incoming JWT token.

#### Create the `charts` Table
Run the following SQL to create a table and enable RLS with Clerk support: 

```sql
create table if not exists charts (
  id UUID default gen_random_uuid() primary key,
  content text not null,
  user_id text not null,
  created_at timestamptz default now()
);
```

#### Add RLS Policies (the Right Way for Clerk)

```sql
alter table charts enable row level security;

create policy "Users can insert their own charts"
  on charts
  for insert
  with check (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

create policy "Users can view their own charts"
  on charts
  for select
  using (
    user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );
```

#### Common Pitfall: `auth.uid()` Returns NULL
If you previously used this:
```sql
USING (auth.uid()::text = user_id)
```

...it won't work with Clerk. Why? 
* `auth.uid()` is only available if you're using **Supabase Auth**, which we’re not.
* Clerk user IDs are strings like `"user_2w2a6PJC4T4BfXDsg72AQsLNEyU"`, which are not UUIDs.
* This mismatch causes errors like:
    ```text
    invalid input syntax for type uuid: "user_..."
    ```

**The Fix:**
Use this pattern instead: 

```sql
current_setting('request.jwt.claims', true)::json->>'sub'
```
This safely extracts the sub field (i.e. the Clerk user ID) from the JWT, allowing you to scope data per user, securely and correctly.

## Integrating Clerk and Supabase in Next.js

Clerk and Supabase work together seamlessly to manage authentication and user-specific data in your Next.js app. Here’s how the integration functions:
1. **Authentication with Clerk**: When a user logs in, Clerk authenticates them and generates a unique user ID and session token.
2. **Data Storage with Supabase**: That user ID is used to store and retrieve data (e.g. Mermaid charts) in the Supabase database, scoped to the logged-in user.

Let’s break down how to implement this integration in code:

### Middleware for Clerk Authentication
The `middleware.ts` file ensures that all routes requiring authentication are protected by Clerk. It intercepts requests and verifies the session before allowing access:

```javascript 
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js|png|svg)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Supabase Provider with Clerk Session Token
In order to securely access Supabase on behalf of the authenticated user, we initialize a Supabase client using the session token provided by Clerk:

```javascript 
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
      accessToken: () => session?.getToken() 
    }
  );

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}
```

## Code Walkthrough 
You can explore the full codebase in the [GitHub repository](https://github.com/meems1996/mermaid-charting-app).

### Saving Charts
The `handleSave` function stores a Mermaid chart in your Supabase database, associating it with the currently logged-in user:

```javascript 
const handleSave = async () => {
  if (!supabase || !user) return;

  const { data, error } = await supabase
    .from('charts')
    .insert({ content: code, user_id: user.id });

  if (error) console.error('Error saving chart:', error);
};
```

### Fetching Charts
The `fetchCharts` function retrieves all charts for the authenticated user, ordered by creation time:

```javascript 
const fetchCharts = async () => {
  const { data, error } = await supabase
    .from('charts')
    .select('content')
    .order('created_at', { ascending: false });

  if (data) setSavedCharts(data.map((item) => item.content));
};
```

### Challenges and Solutions
* **Session Management**: <br />*Challenge:* Ensure Clerk’s session is available before initializing Supabase. <br />*Solution:* Use useEffect to wait for the session before creating the Supabase client.
* **Error Handling**: <br />*Challenge:* Errors when saving or fetching data can disrupt the UX.<br />*Solution:* Implement error checks and show clear feedback to the user.

## What About Session Security? (The Hidden Risk No One Talks About)

So far, Clerk + Supabase covers authentication (who the user is) and data access rules. But one aspect often overlooked is **session security**. Common risks include:

- **Stolen Tokens:** If an attacker somehow obtains a user's refresh token or access token (via XSS, device theft, etc.), they can impersonate that user until the token expires.
- **Replay Attacks:** Without proper handling, someone could reuse an old valid refresh token to continue a session indefinitely.
- **Session Hijacking:** If your system only allows a single session per user, an attacker who logs in on one device can knock out other sessions, and vice versa.

Clerk and Supabase handle basic sessions well (Clerk rotates refresh tokens, etc.), but these advanced threats can still be concerns. This is where SuperTokens shines. It’s designed with **advanced session security** features.

## How SuperTokens Fixes This Problem

**SuperTokens** puts session security at the forefront. Compared to Clerk or vanilla Supabase Auth, SuperTokens offers:

* **Self-hosted & fully customizable:** You can self-host SuperTokens (or use the cloud hosting option). Because it’s open source, you have full control. This means you aren’t locked into a vendor.
* **Advanced session management:** Out of the box, SuperTokens uses short-lived access tokens and rotating refresh tokens. Each time a refresh token is used, a new one is issued and the old one is invalidated. This one-time-use refresh scheme means a stolen refresh token is useless after first use.
* **Token theft detection & rotation:** SuperTokens can detect if a refresh token is being reused (an anomaly indicating theft) and revoke all sessions for that user immediately.
* **Granular session revocation:** You can revoke individual device sessions. For instance, SuperTokens provides backend functions like `Session.revokeSession(sessionHandle)` or `Session.revokeAllSessionsForUser(userId)`, letting you target a specific session or wipe all of a user’s sessions

These features directly mitigate the risks above:
* **Stolen token → short expiry & rotation:** Even if an access token is stolen, it will expire quickly. If a refresh token is stolen, SuperTokens will notice its reuse and invalidate it, limiting damage to minutes.
* **Replay attacks → token rotation:** Reusing a refresh token triggers detection. The user’s session can be revoked immediately, so replayed tokens get caught.
* **Hijacking → per-device logout:** Users can log out of one device without logging out everywhere, since sessions are separate. An attacker in one session can be locked out while others stay intact.

By design, SuperTokens “belongs in the backend” of your auth flow. You can still use Clerk’s or your own front end if you wish, but swap in SuperTokens on the server to handle sessions. In short, SuperTokens fixes session management in a way many providers don’t.

## How SuperTokens Handles Session Security (In Practice)
Here’s a quick comparison of how these threats are handled:

| Threat                | Risk Without Protection                                  | SuperTokens Defense                                                                                                                           |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Token Theft**       | Attacker reuses a stolen refresh token indefinitely.     | Short-lived access tokens + rotating refresh tokens. If a refresh token is stolen and reused, SuperTokens detects the anomaly and revokes it. |
| **Session Hijacking** | Logging out all devices if a user is compromised on one. | Per-session tokens: SuperTokens lets you revoke a single session handle (device) or all sessions for a user, avoiding a blanket logout.       |
| **Replay Attacks**    | A stolen refresh token could be saved and replayed.      | Refresh tokens are one-time-use. Reuse triggers detection; old tokens are invalidated.                                                        |



[Learn more about how SuperTokens handles these threats.](https://supertokens.com/docs/post-authentication/session-management/security)

## Clerk vs. Supabase vs. SuperTokens

| Feature                             | Clerk 🧰   | Supabase 🗄️    | SuperTokens 🛡️    |
| ----------------------------------- | ---------- | --------------- | ------------------ |
| **Pre-Built UI Components**         | ✅ Yes      | ❌ No            | ✅ Yes (optional)   |
| **Custom Auth Flows**               | ⚠️ Limited | ⚠️ Limited      | ✅ Full flexibility |
| **Session Management**              | ⚠️ Basic   | ⚠️ Basic        | ✅ Advanced         |
| **Self-Hosting**                    | ❌ No       | ✅ Yes (via CLI) | ✅ Yes              |
| **Token Theft Detection**           | ❌ No       | ❌ No            | ✅ Yes              |
| **Fine-Grained Session Revocation** | ❌ No       | ❌ No            | ✅ Yes              |

* **Pre-Built UI:** Clerk and SuperTokens both offer ready-made login/signup UI components. Supabase itself does not include UI (it’s just a backend service). For example, SuperTokens’ docs explicitly mention using their pre-built UI components (or you can choose a custom UI).
* **Custom Flows:** Clerk allows some configuration, but SuperTokens lets you override everything. You can inject your own logic into any part of the auth flow.
* **Session Security:** Clerk and Supabase provide basic session handling, but SuperTokens is designed for security. As discussed above, it offers rotating tokens, theft detection, and per-session revocation.
* **Self-Hosting:** Supabase is open-source so you can self-host it via the Supabase CLI or Cloud.

In short, SuperTokens stands out for its flexibility and security. It gives devs full control over auth logic and sessions without sacrificing convenience (it also has pre-built UIs and a simple integration).

## Custom Auth Flows with SuperTokens
SuperTokens lets you override every piece of the logic—perfect for apps with unique flows or compliance requirements.

Example: Add custom sign-in behavior:

```javascript
override: {
  functions: (original) => ({
    ...original,
    signInUp: async (input) => {
      // Custom logic here
    }
  })
}
```
You can also build your own UI, or start with theirs and customize as needed.

* [See how to override core logic](https://supertokens.com/docs/references/frontend-sdks/function-overrides)
* [Build your own UI](https://supertokens.com/docs/quickstart/frontend-setup)

## Should You Use Clerk, SuperTokens, or Both?
There’s no one-size-fits-all answer, but here are some guidelines:

* Choose Clerk if you want a fully managed auth solution with beautiful, drop-in UI components and minimal setup. Clerk covers most common use cases out of the box.
* Choose SuperTokens if you need ultimate control over auth and sessions. For example, if you must self-host, enforce custom token lifetimes, or build a very custom workflow, SuperTokens gives you that flexibility.
* Use Both in a hybrid approach. You might love Clerk’s React components and user experience, but still want SuperTokens’ session security. You can start with Clerk handling UI and signup, and then integrate SuperTokens behind the scenes for session issuance (or vice versa). SuperTokens even provides migration guides from other systems, so you can gradually swap parts out.

Because SuperTokens is open-source, you can try it risk-free alongside Clerk. For example, you could use Clerk for login/signup UI, but configure Supabase (or your backend) to accept SuperTokens’ tokens for session validation, leveraging SuperTokens’ defenses.

## Migrating from Clerk to SuperTokens
[If you want to move from Clerk to SuperTokens](https://supertokens.com/docs/migration/overview), you don’t need to rip everything out. You can migrate gradually:
* Start by having SuperTokens manage the session (tokens) while still using Clerk’s front end.
* Swap out Clerk’s session cookie with SuperTokens’ cookies under the hood.
* Replace one signup/signin flow at a time with SuperTokens recipes.

SuperTokens provides guides on migrating from other auth systems, making the process smoother.

## Clerk + Supabase Is a Great Start, But SuperTokens Takes You Further
To summarize, the Clerk + Supabase integration we built gives you:
* A complete app with secure user sign-in
* Personalized data storage (each user only sees their charts)
* Row-Level Security enforcing data isolation

This is elegant and suitable for many projects. Clerk handles auth beautifully, and Supabase handles data. But if your project has higher security needs or unusual requirements, SuperTokens can take you further. With SuperTokens, you can finely tune session lifetimes, detect stolen tokens, revoke individual sessions, and even self-host everything.

In **Part II** of this series, we’ll swap Clerk out for SuperTokens in our app and show how to achieve similar functionality (login UI, user-specific data, RLS) with maximum control over sessions.

Regardless of which tools you choose, you now have a solid blueprint: Clerk (or another provider) for authentication, Supabase for data storage, and well-configured RLS to tie it all together. By adding SuperTokens into the mix, you gain an extra layer of security and flexibility.