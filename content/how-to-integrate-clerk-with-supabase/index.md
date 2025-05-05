---
title: "How to Integrate Clerk with Supabase (+ One Better Choice)"
date: "2025-04-18"
description: "Learn how to seamlessly integrate Clerk's authentication with Supabase's database services to enhance user management and security in your applications."
cover: ""
category: "programming"
author: "Maria Shimkovska"
---

**Picture this:** You're building the next big thing. Your app idea is brilliant. Your UI design is pixel-perfect. Your code is *chef's kiss* beautiful. 

But then comes the dreaded question: <br />
**"How do I handle authentication AND database stuff without losing my mind?"** 😭

Let's face it, if you want users to be able to use your app with accounts and be able to save their data, you will need authentication and a database. Without these two working together, your users might as well be anonymous ghosts shouting into the void. Not exactly the personalized experience we're aiming for today, right?

But with so many authentication options available, how do you choose the right one for your Supabase-powered app?

To help you make this decision, we've created a comprehensive two-part guide:

* **Part I:** Integrating Clerk for authentication with Supabase for database management in a Next.js project
* **Part II:** (Coming soon) Using the same base app and Supabase project but implementing SuperTokens as the authentication service

By following both guides, you'll be able to compare these powerful authentication approaches side-by-side and choose the best fit for your project.

We'll use a [**Mermaid**](https://mermaid.js.org/) powered charting app as our example throughout both guides—a tool that allows users to create, save, and manage diagrams securely.

**In Part I, we'll:** 
* 📘 Get friendly with the basics of Clerk and Supabase
* 🛠 Combine their powers to build a secure, data-driven application
* ⚖️ Evaluate the pros and cons of Clerk for your authentication needs
* 🤗 Discover an exciting alternative that might be an even better fit (spoiler alert: there is one!)

Let’s make authentication and database management actually *enjoyable*. 

But before we dive in, we’ll start with a quick overview of the app. First, we’ll look at a version with no authentication or persistence -- just to set the baseline. Then, we’ll layer on features and explore how each addition improves the experience.

## 💻 Project Overview 

**[Check out the GitHub repository for the demo app here.](https://github.com/meems1996/mermaid-charting-app)**


The Mermaid Charting App is a **Next.js**-based tool that integrates **Clerk** and **Supabase** to provide the following features:

* **MermaidJS Editor**: A real-time editor for creating diagrams using Mermaid syntax.
* **Authentication with Clerk**: Users can sign in or sign up, and their sessions are managed securely.
* **Chart Storage with Supabase**: Authenticated users can save their diagrams to a Supabase database and retrieve them later.
 
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/YOpxWr5WU4Hc9T2JEAXY" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

<br />

🧜‍♀️ The app is a [**MermaidJS**](https://github.com/mermaid-js/mermaid) **visualizer**, where you can write Mermaid code to generate graphs, and eventually save them once we add persistence. Without user authentication and a database the charts are visible to everyone and the saved charts disappear once we reload. 

We’ll be combining the strengths of both Clerk and Supabase to bring the app to life:
1. 🔐 Clerk will handle authentication and user management, so people can sign up, log in, and have their own accounts.
2. 🗄️ Supabase will store each user’s charts and make sure they’re linked to their accounts—so users only see their saved graphs, not anyone else’s.

![alt text](image.png)

By the end, we’ll go from a simple, ephemeral demo to a fully authenticated app with persistent, user-specific data. Let’s get into it 👇

## 🧩 What is Clerk? 

[**Clerk**](https://clerk.com/) is a developer-friendly authentication service that helps you add sign-up, sign-in, and user management to your app with minimal effort. It comes with prebuilt UI components, robust APIs, and support for modern auth features like social logins, multi-factor authentication, and webhooks.

Instead of building your own auth flows from scratch, Clerk lets you plug in secure, customizable components—so you can focus on building your product, not re-inventing login.

In this project, Clerk is used to authenticate users and provide a unique user ID, which is essential for associating user-specific data in the database.

## 🗄️ What is Supabase? 

[**Supabase**](https://supabase.com/) is an open-source backend-as-a-service that gives you a full Postgres database, real-time subscriptions, storage, and auth—right out of the box. It’s like Firebase, but with SQL and a developer experience that doesn’t make you want to flip a table. 

With Supabase, you get powerful tools like row-level security, instant APIs, and a slick dashboard—all built on top of technologies you already know and love. It's fast, flexible, and plays really nicely with frameworks like Next.js, React, and more.

Basically, it’s your app’s backend without the backend headaches.

In this project, Supabase is used to store and retrieve user-specific Mermaid charts. Each chart is tied to a user ID provided by Clerk, ensuring secure and personalized data management.

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

Use the `ClerkProvider` in your `layout.tsx` file to enable Clerk across your app.

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

To integrate Supabase into your project, follow these steps:
1. **Create a Supabase Account**: Sign up at Supabase.com and create a new project.
2. **Install Supabase**: Add the Supabase package to your project:

```bash
npm install @supabase/supabase-js
```

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

## Integrating Clerk and Supabase in Next.js

The integration between Clerk and Supabase works as follows: 
1. **Authentication with Clerk**: When a user logs in, Clerk provides a unique user ID.
2. **Data Storage with Supabase**: The user ID is used to associate charts with the logged-in user in the Supabase database.

Here’s how the integration is implemented.

### Middleware for Clerk
The middleware.ts file ensures that Clerk handles authentication for protected routes:

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

### Supabase Provider
The SupabaseProvider initializes a Supabase client with the user’s session token:

```javascript 
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { accessToken: () => session?.getToken() }
  );

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}
```

## Code Walkthrough 
### Saving Charts
The handleSave function saves a Mermaid chart to the Supabase database:

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
The fetchCharts function retrieves charts for the logged-in user:

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
* **Session Management**: Ensure Clerk’s session is available before initializing Supabase.
    * Solution: Use useEffect to wait for the session before creating the Supabase client.
* **Error Handling**: Handle errors gracefully when saving or fetching data.
    * Solution: Add error checks and display user-friendly messages.

## Conclusion
By integrating Clerk and Supabase, you can build secure and scalable applications with ease. Clerk handles authentication, while Supabase manages user-specific data. This combination is ideal for projects like the Mermaid Charting App, where personalized user experiences are key

## Further Reading
Clerk Documentation
Supabase Documentation
Next.js Documentation
MermaidJS Documentation
