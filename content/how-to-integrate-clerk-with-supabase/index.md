---
title: "How to Integrate Clerk with Supabase (+ One Better Choice)"
date: "2025-05-06"
description: "🔐 Learn how to seamlessly integrate Clerk's authentication with Supabase's database services to enhance user management and security in your applications."
cover: "integrate-clerk-with-supabase.png"
category: "programming"
author: "Maria Shimkovska"
---

**Picture this:** You’re building the next big thing.  <br />The idea? Brilliant. The UI? Perfect. The code? On point.

Then reality hits: <br />
**"How do I handle authentication *and* database stuff without losing my mind?"** 😭

If your app needs accounts and saved user data (and let’s face it, it probably does), you need authentication and a database working together. Without that, your users are just anonymous ghosts shouting into the void—not exactly the personalized experience you’re aiming for.

Let’s say you’ve already picked Supabase for your backend (great choice). Supabase is an excellent choice for backend infrastructure with its real-time database and ease of use, but you still need an authentication solution.

This two-part guide walks you through two popular options—**Clerk** and **SuperTokens**—so you can see how they compare in real projects.

* **Part I:** How to integrate **Clerk** with **Supabase** in a **Next.js** app if you want to ship quickly using beautiful out of the box components.
* **Part II:** How to swap in **SuperTokens** as an alternative auth solution if you’re looking for more control, self-hosting, customizable flows, and advanced features like multi-tenancy, passwordless login, and seamless session management—all while staying fully in charge of your user data.

**Table of Contents:** 
```toc
tight: true
toHeading: 3
```

## 📖 What You'll Learn

By the end, you’ll be able to compare both approaches side-by-side and choose what fits your project best.

To ground this tutorial, we'll use a simple [**Mermaid**](https://mermaid.js.org/) diagramming app as our running example—a tool that lets users create, save, and manage diagrams securely.

**In Part I, You'll:** 
* 📘 Learn the basics of Clerk and Supabase
* 🛠 Combine them to build a secure, data-driven app
* ⚖️ Weigh the pros and cons of using Clerk for authentication
* 🤗 Get a sneak peek at an alternative: SuperTokens

Let’s make auth and data storage actually enjoyable. <br /> First, we’ll look at a stripped-down version of the app—no auth, no persistence—so you can see the baseline. Then we’ll layer in features and see how each one improves the experience.

## 🔗 How Clerk and Supabase Work Together

Clerk and Supabase handle two essential—but separate—parts of your app:

* **Clerk = Auth & Identity** <br />Clerk manages everything about who the user is: their credentials, session, and identity. When someone signs in, Clerk gives them a unique userId.

* **Supabase = Data Storage & Rules** <br />Supabase stores and retrieves the actual user content—like saved diagrams. But crucially, it doesn’t know who a user is unless you connect the dots.

Here’s how the connection works:

1. **Clerk handles authentication.**<br /> When a user signs in, Clerk generates a session and provides a secure, unique identifier (`userId`).
2. **You send that `userId` to Supabase** when saving or retrieving data. <br />This happens in your client or server code—any time you store or fetch data, you include the user’s ID.
3. **Supabase enforces access rules using Row Level Security (RLS).** <br />With RLS enabled, you write SQL policies that make sure users can only read/write rows that belong to their userId.
    For example:

    ```sql
    policy "Users can access their own charts"
    on charts
    for all
    using (auth.uid() = user_id);
    ```

> Note: Row-Level Security (RLS) is a security feature that ensures users can only access their own data, even if multiple users are using the same database.

This setup means:
* Users must be logged in to interact with data.
* Every saved chart is associated with a specific user.
* Users can only see or update their own charts.

It’s a clean separation of concerns:
* Clerk handles who a user is.
* Supabase handles what they can access.

Together, they make it easy to build secure, personalized apps—without needing to spin up your own authentication or backend from scratch.

## 💻 Project Overview 

🛠️ **[Check out the GitHub repository for the demo app here.](https://github.com/meems1996/mermaid-charting-app)**


The Mermaid Charting App is a **Next.js**-based tool that integrates **Clerk** and **Supabase** to provide the following features:

* **MermaidJS Editor**: An interactive editor for generating diagrams from Mermaid syntax.
* **Authentication with Clerk**: Users can sign in or sign up, and their sessions are managed securely.
* **Chart Storage with Supabase**: Authenticated users can save their diagrams to a Supabase database and retrieve them later.

🧜‍♀️ In the video below, you’ll see the core features of the app in action -- writing and rendering a Mermaid chart, and saving it to your Saved Charts section. At this stage, the app **doesn’t** include authentication or persistence. That means anyone can view charts, and saved work vanishes when the page reloads. 

This baseline helps demonstrate the value Clerk and Supabase bring to the table as we layer in authentication and data persistence.
 
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/YOpxWr5WU4Hc9T2JEAXY" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

<br />

We’ll combine Clerk and Supabase to bring this app to life:
1. 🔐 **Clerk** will manage user authentication and user sessions, allowing people to sign up, log in, and have personalized accounts.
2. 🗄️ **Supabase** will store charts and associate them with the authenticated user—so each person only sees their own saved diagrams.

![alt text](image.png)

By the end of this guide, we’ll have evolved from a stateless prototype to a secure, fully featured app with persistent, user-specific data.

## 🧩 What is Clerk? 

[**Clerk**](https://clerk.com/) is a developer-friendly authentication service that makes it easy to add sign-up, sign-in, and user management to your app. 

Compared to SuperTokens, Clerk offers a more out-of-the-box experience with its UI components. However, SuperTokens provides more control over authentication flows and session management, which can be crucial for applications with specific security requirements.

In this guide, we’ll use Clerk to authenticate users and assign each one a unique user ID. That ID is key—it lets us store and retrieve each user's charts individually in Supabase.

In Part II of this guide, we'll use SuperTokens instead to show you how SuperTokens can easily integrate with Supabase.

## 🗄️ What is Supabase? 

[**Supabase**](https://supabase.com/) is an open-source backend-as-a-service that provides a PostgreSQL database, authentication, real-time subscriptions, and auto-generated APIs. It's designed to help developers build scalable applications quickly.

Supabase's authentication system can be integrated with third-party providers like Clerk. However, it's important to note that while Supabase handles data storage and basic authentication, it relies on external services for advanced user management and session security.

> **Bonus:** Supabase’s row-level security makes it easy to enforce per-user access rules—so your users only ever see their own data.

It’s fast, flexible, and works seamlessly with frameworks like Next.js and React.

Basically, it’s your app’s backend—without the backend headaches.

In this project, Supabase stores and retrieves each user's Mermaid charts. Every saved chart is linked to the unique user ID provided by Clerk. This setup ensures data is private, secure, and only visible to the right user.

## ⚙️ Setting Up Clerk 
To get started with Clerk, follow these simple steps to set up authentication in your app.

### 1. Sign Up for Clerk 
First, head over to [Clerk's website](https://clerk.com/) and sign up for an account. You’ll need to provide your email and create a password. Once you're in, you'll be taken to the Clerk dashboard, where you'll manage your app’s authentication settings.

### 2. Create a New Application
1. In your Clerk dashboard, click on the **Create Application** button.
2. Choose a name for your app (e.g., *Mermaid Visualizer*).
3. Choose the authentication methods from a list.
    - In this demo, we are selecting just the Email authentication method for simplicity.

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/AnOxQNnud4HnDbJP94ev" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

<br />

Clerk will generate a set of steps to follow to continue setting up Clerk in your application.

### 3. Install the Clerk SDK 
To integrate Clerk into your project, you'll need to install the Clerk SDK. Open your terminal and run the following command:

```bash 
# If you're using npm 
npm install @clerk/nextjs

# If you're using yarn 
yarn add @clerk/nextjs

# If you're using pnpm
pnpm add @clerk/nextjs
```

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

Next up: we'll connect Supabase and set it up to store user-specific data like saved Mermaid charts.

## ⚙️ Setting Up Supabase with Clerk
To integrate Supabase with your Next.js project and secure user-specific data using Clerk authentication, follow these steps: 

### 1. Create a Supabase Project
* Visit [supabase.com](https://supabase.com/) and sign up for a free account.
* Once inside the dashboard, click **“New Project”**.
* Choose a **Project Name** (e.g. *Mermaid Visualizer*), select the **closest region** for your users, and set a strong password (you can use the “Generate Password” feature).
* Save this password in your password manager.

📹 Need a quick demo? Here’s a walkthrough:
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/a2VexfxNR8imzVJ8Q4mJ" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

### 2. Install Supabase Client
Install the Supabase JavaScript client in your project:
```bash
npm install @supabase/supabase-js
```

### 3. Connect Clerk to Supabase (Updated 2025 Flow)
As of April 2025, Supabase has updated its integration method with Clerk from JWT templates to native third-party support—which simplifies setup and improves security.

Here's what to do: 
1. **Configure Clerk for Supabase:** In your Clerk dashboard, navigate to API Keys and enable Supabase compatibility.
2. **Add Clerk as a Third-Party Auth Provider in Supabase:** In Supabase, go to Authentication > Providers > External OAuth and select Clerk.

Follow Supabase's updated [Clerk integration guide](https://supabase.com/docs/guides/auth/third-party/clerk) for exact values to paste (like issuer and JWKS URL).

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

#### 🐛 Common Pitfall: `auth.uid()` Returns NULL
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

## 🧬 Integrating Clerk and Supabase in Next.js

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

## 💻 Code Walkthrough 
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

## 🕵️‍♂️ What About Session Security? (The Hidden Risk No One Talks About)

Clerk and Supabase handle authentication and data storage effectively. However, **session security is often overlooked**. Potential risks include:

- **Stolen Tokens:** If access tokens are compromised, unauthorized users can gain access.
- **Replay Attacks:** Attackers can reuse valid tokens to impersonate users.
- **Session Hijacking:** Without proper session management, attackers can hijack active sessions.

These vulnerabilities highlight the need for **robust session management** solutions.

## 🔐 How SuperTokens Fixes This Problem

**SuperTokens** addresses session security concerns with features like:

- **Self-Hosted Authentication and Session Management:** Gives developers full control over user sessions.
- **Token Theft Detection and Refresh Token Rotation:** Mitigates risks associated with stolen tokens.
- **Fine-Grained Session Revocation:** Allows users to log out from individual devices, enhancing security.

By integrating **SuperTokens with Supabase**, developers can achieve a **more secure and flexible authentication system**.  

## 🤼 Comparing Clerk, Supabase, and SuperTokens

| Feature                             | Clerk 🧰          | Supabase 🗄️        | SuperTokens 🛡️       |
|-------------------------------------|-------------------|--------------------|------------------------|
| Pre-Built UI Components             | ✅ Yes            | ❌ No              | ✅ Yes                  |
| Custom Authentication Flows        | ⚠️ Limited        | ⚠️ Limited         | ✅ Full Flexibility    |
| Session Management                 | ⚠️ Basic          | ⚠️ Basic           | ✅ Advanced            |
| Self-Hosting Capability             | ❌ No             | ✅ Yes             | ✅ Yes                 |
| Token Theft Detection               | ❌ No             | ❌ No              | ✅ Yes                 |
| Fine-Grained Session Revocation     | ❌ No             | ❌ No              | ✅ Yes                 |

SuperTokens stands out in session management and security, offering features not natively available in Clerk or Supabase.

## 🤔 Should You Use Clerk, SuperTokens, or Both?
* **Use Clerk** if you prefer a fully managed solution with pre-built UI components for quick setup.
* **Use SuperTokens** if you require advanced session management, self-hosting, and enhanced security features.
* **Use Both** if you want the ease of Clerk's UI components combined with SuperTokens' robust session security.

By integrating both, you can leverage the strengths of each platform to build a secure and user-friendly application.

## Conclusion
Integrating Clerk with Supabase provides a solid foundation for authentication and data management. However, for applications where session security is paramount, incorporating SuperTokens can address potential vulnerabilities.

**Stay tuned for Part 2, where we'll explore how to swap in SuperTokens for enhanced session management and security.**