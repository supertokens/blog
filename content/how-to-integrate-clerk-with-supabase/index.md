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

Before we dive in, here’s a quick video demo of the app we’ll be building—starting with no authentication or persistence, just to show the baseline experience.

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/YOpxWr5WU4Hc9T2JEAXY" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"></iframe></div>

<br />

🧜‍♀️ The app is a [**MermaidJS**](https://github.com/mermaid-js/mermaid) **visualizer**, where you can write Mermaid code to generate graphs, and eventually save them once we add persistence.

We’ll be combining the strengths of both tools to bring the app to life:
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

### 1. Sign Up for Clerk 
First, head over to Clerk's website and sign up for an account. You’ll need to provide your email and create a password. Once you're in, you'll be taken to the Clerk dashboard, where you'll manage your app’s authentication settings.

### 2. Create a New Application
* In your Clerk dashboard, click on the “Create App” button.
* Choose a name for your app (e.g., "MermaidJS Visualizer").
* Clerk will generate an API key and frontend API for your app, which we’ll need in the next steps.

### 3. Install Clerk SDK 
To integrate Clerk into your project, you'll need to install the Clerk SDK. Open your terminal and run the following command:

```bash 
# If you're using npm 
npm install @clerk/clerk-sdk@latest

# If you're using yarn 
yarn add @clerk/clerk-sdk@latest
```

### 4. Set Up Clerk in Your App
In your app’s main entry file (e.g., index.js or App.js), import and initialize Clerk like so:

```javascript
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-sdk-react';

const clerkFrontendApi = 'YOUR_CLERK_FRONTEND_API'; // Get this from your Clerk dashboard

function App() {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      {/* Your App components go here */}
    </ClerkProvider>
  );
}

export default App;
```

Replace `'YOUR_CLERK_FRONTEND_API'` with the Frontend API key you got from the Clerk dashboard.

### 5. Add Sign-Up and Sign-In Components
Clerk comes with prebuilt components that you can plug right into your app for a seamless sign-up and sign-in experience. For example, add the `SignUp` and `SignIn` components like this:

```javascript
import { SignUp, SignIn } from '@clerk/clerk-sdk-react';

function AuthPage() {
  return (
    <div>
      <h2>Sign Up</h2>
      <SignUp />
      <h2>Sign In</h2>
      <SignIn />
    </div>
  );
}
```

This will display the sign-up and sign-in forms automatically! Clerk handles all the UI and backend auth logic for you.

### 6. Set Up Redirects
After users sign in or sign up, you’ll want to redirect them to another page in your app. Clerk makes this easy. Use the `RedirectToSignIn` component for users who aren’t authenticated:

```javascript
import { RedirectToSignIn } from '@clerk/clerk-sdk-react';

function ProtectedPage() {
  if (!user) {
    return <RedirectToSignIn />;
  }

  return <div>Welcome to your protected content!</div>;
}
```

This ensures that only authenticated users can access specific pages.

With these steps, you've set up Clerk for user authentication in your app! 🎉

In the next section, we’ll dive into how to set up Supabase to handle storing user-specific data like your graphs. Ready to roll?

## Set Up Supabase 

## Sources: 
* [**Open Source Auth with login and secure sessions**](https://supabase.com/partners/integrations/supertokens)
* [**Clerk and Supabase**](https://supabase.com/partners/integrations/clerk)
* [**Integrate Supabase with Clerk**](https://clerk.com/docs/integrations/databases/supabase)
* [**JavaScript Client Library**](https://supabase.com/docs/reference/javascript/introduction)
