---
title: "How to Integrate Clerk with Supabase (+ One Better Choice)"
date: "2025-04-18"
description: "Learn how to seamlessly integrate Clerk's authentication with Supabase's database services to enhance user management and security in your applications."
cover: ""
category: "programming"
author: "Maria Shimkovska"
---

Combining Supabase with Clerk allows you to take advantage of both Supabase's powerful database capabilities and Clerk's authentication features, prebuilt components, and webhooks. 

In this guide, we are going to: 
* 📘 Go over the fundamentals of Clerk and Supabase
* 🛠 Show you how to use them together to build an application
* ⚖️ Discuss the pros and cons of using Clerk for your authentication needs
* 🤗 Talk about an exciting alternative. 

Before we dive in, here’s a quick video demo of the app we’ll be building onto—starting with no authentication or persistence, just to show the baseline experience. 

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/YOpxWr5WU4Hc9T2JEAXY" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

<br />

🧜‍♀️ The app is a [**MermaidJS**](https://github.com/mermaid-js/mermaid) **visualizer**, where you can write Mermaid code to generate graphs, and eventually save them once we add persistence. Without user authentication and a database the charts are visible to everyone and the saved charts disappear once we reload. 

![alt text](image.png)

We’ll be combining the strengths of both Clerk and Supabase to bring the app to life:
* 🔐 Clerk will handle authentication and user management, so people can sign up, log in, and have their own accounts.
* 🗄️ Supabase will store each user’s charts and make sure they’re linked to their accounts—so users only see their saved graphs, not anyone else’s.

By the end, we’ll go from a simple, ephemeral demo to a fully authenticated app with persistent, user-specific data. Let’s get into it 👇

## 🧩 What is Clerk? 

[**Clerk**](https://clerk.com/) is a developer-friendly authentication service that helps you add sign-up, sign-in, and user management to your app with minimal effort. It comes with prebuilt UI components, robust APIs, and support for modern auth features like social logins, multi-factor authentication, and webhooks.

Instead of building your own auth flows from scratch, Clerk lets you plug in secure, customizable components—so you can focus on building your product, not re-inventing login.

## 🗄️ What is Supabase? 

[**Supabase**](https://supabase.com/) is an open-source backend-as-a-service that gives you a full Postgres database, real-time subscriptions, storage, and auth—right out of the box. It’s like Firebase, but with SQL and a developer experience that doesn’t make you want to flip a table. 

With Supabase, you get powerful tools like row-level security, instant APIs, and a slick dashboard—all built on top of technologies you already know and love. It's fast, flexible, and plays really nicely with frameworks like Next.js, React, and more.

Basically, it’s your app’s backend without the backend headaches.

## Setting Up Clerk 🔐
To get started with Clerk, follow these simple steps to set up authentication in your app.

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/AnOxQNnud4HnDbJP94ev" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

### 1. Sign Up for Clerk 
First, head over to Clerk's website and sign up for an account. You’ll need to provide your email and create a password. Once you're in, you'll be taken to the Clerk dashboard, where you'll manage your app’s authentication settings.

### 2. Create a New Application
1. In your Clerk dashboard, click on the **Create Application** button.
2. Choose a name for your app (e.g., *Mermaid Visualizer*).
3. Choose the authentication methods from a list.
    - In this demo, we are selecting just the Email authentication method for simplicity.
4. Clerk will generate a set of steps to follow to continue setting up Clerk in your application: 
    - Install `@clerk/mextjs`
    - Set your Clerk API keys
    - Update `middleware.ts`
    - Add `ClerkProvider` to your app
    - Create your first user

### 3. Install Clerk SDK 
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
Add these keys to your `.env` or create the file if it doesn't exist. 

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET
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

### 6. Add `ClerkProvider` and the `SignUp/SignIn` Buttons

In the `layout.tsx` file, import and initialize Clerk like so:

```javascript{4-11, 34, 39-42, 44-45, 47, 52}
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
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
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <header className="p-5">

          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
            {children}
          </SignedIn>
          
        </header>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

This will display the sign-up and sign-in forms automatically! Clerk handles all the UI and backend auth logic for you.

With these steps, you've set up Clerk for user authentication in your app! 🎉

### 7. Run Your Project and Get Your First User

```bash
# If you're using npm 
npm run dev

# If you're using yarn 
yarn dev

# If you're using pnpm
pnpm dev
```

Then, visit your app's homepage at `http://localhost:3000` and sign up to create your first user.

In the next section, we’ll dive into how to set up Supabase to handle storing user-specific data like your graphs. Ready to roll?

## Setting Up Supabase

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/a2VexfxNR8imzVJ8Q4mJ" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

**Supabase Architecture**
1. The user signs in with Clerk and receives a JWT
2. User requests data from the client 
3. Supabase checks the JWT against Clerk to verify its authenticity
4. Data goes through the Data API to the database 
5. Database returns requested data
6. API sends data to the client

### Steps to get started 
You can visit [**Supabase's official documentation**](https://supabase.com/docs/guides/auth/third-party/clerk) on the subject, but we will break down the steps for our project in this section. As of April 1 2025, Supabase changed how they integrate with Clerk from JWT template to a native integration approach for enhanced security. 

There are two steps to get started to connect Clerk and Supabase together: 
1. Configure your Clerk instance for Supabase compatibility
2. Add a new Third-Party integration with Clerk in your Supabase dashboard

Now that you've set up your project, it's time to get to work.

#### Set up RLS policies using Clerk session token data

#### Create a SQL query that checks the user's Clerk ID
Create a function named `requesting_user_id()` that will parse the Clerk user ID from the authentication token. This function will be used to set the default value of user_id in a table and in the RLS policies to ensure the user can only access their data.

1. In the sidebar of your Supabase dashboard, navigate to SQL Editor. This is where you will run all your SQL queries for the rest of this guide. Paste the following into the editor:

```sql
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;
```

#### Create a charts table to handle all the saved charts 

```sql
-- Create the charts table with Clerk user support
create table charts (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  user_id text not null,
  created_at timestamptz default now()
);

-- Enable row-level security right away
alter table charts enable row level security;

-- Allow users to insert only their own charts
create policy "Users can insert their own charts"
  on charts
  for insert
  with check (user_id = auth.uid()::text);

-- Allow users to view only their own charts
create policy "Users can view their own charts"
  on charts
  for select
  using (user_id = auth.uid()::text);

-- Optional: allow deleting only their own charts
create policy "Users can delete their own charts"
  on charts
  for delete
  using (user_id = auth.uid()::text);
```

🧪 (**Test it out**) After running this script:
* Log in as a user through Clerk
* Insert a chart with `user_id = user.id` in your app
* Try querying charts — you’ll only see your own

#### Common issue with setting up Clerk and Supabase 
🛠️ What Was the Problem?

In the original Supabase Row-Level Security (RLS) policies, I used:

```sql
USING (auth.uid()::text = user_id)
```

This approach works when using Supabase Auth, where auth.uid() returns the UUID of the currently authenticated user.

However, in this project, we're using Clerk for authentication — not Supabase Auth. Clerk user IDs are strings like:

```text
"user_2w2a6PJC4T4BfXDsg72AQsLNEyU"
```

**This caused two issues:**
1. auth.uid() returns NULL because there is no Supabase Auth context.
2. Supabase attempted to treat the Clerk user ID (user_...) as a UUID, which resulted in the following error:

```bash
invalid input syntax for type uuid: "user_2w2a6PJC4T4BfXDsg72AQsLNEyU"
```

To fix this, we updated the RLS policies to read the Clerk user ID directly from the JWT passed into Supabase:

```sql
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
```

**This line works as follows:**
* current_setting('request.jwt.claims', true) retrieves the full JWT claims from the request context.
* ::json->>'sub' extracts the sub claim, which contains the authenticated Clerk user's ID.
* This ID is then compared against the user_id column in the database.

By doing this, Supabase enforces RLS policies based on the Clerk-authenticated user, even though Supabase Auth is not being used.

So the creating table is 

```sql
create table IF NOT EXISTS charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  user_id text NOT NULL,
  created_at timestamptz default now()
);

-- Enable row-level security right away
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;

-- Allow users to insert only their own charts
create policy "Users can insert their own charts"
  on charts
  for insert
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow users to view only their own charts
create policy "Users can view their own charts"
  on charts
  for select
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow users to delete only their own charts
create policy "Users can delete their own charts"
  on charts
  for delete
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
```



## Sources: 
* [**Open Source Auth with login and secure sessions**](https://supabase.com/partners/integrations/supertokens)
* [**Clerk and Supabase**](https://supabase.com/partners/integrations/clerk)
* [**Integrate Supabase with Clerk**](https://clerk.com/docs/integrations/databases/supabase)
* [**JavaScript Client Library**](https://supabase.com/docs/reference/javascript/introduction)
