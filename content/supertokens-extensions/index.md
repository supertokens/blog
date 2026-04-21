---
title: "SuperTokens Extensions: Customize Auth Your Way"
date: "2025-06-30"
description: "Discover how SuperTokens Extensions bring modular, reusable, and powerful customization to authentication with a new plugin-based system."
cover: "supertokens-extensions.png"
category: "programming"
author: "Joel Coutinho"
---

> *It’s like config overrides on steroids—with actual reuse and structure.* - Internal Tester

Today, we’re launching something we’ve been quietly working on for months: the SuperTokens Extensions System —our new plugin-based customization layer designed to make authentication extensibility powerful, consistent, and *finally* reusable.

## Why we built it?

SuperTokens has always been flexible. Need to override a function? Go ahead. Want to tweak a recipe? Dive into the config. But as teams scale and customizations pile up, this model breaks down fast. Logic gets tangled inside initialization files. Sharing overrides becomes impossible. And worse, you end up re-implementing the same tweaks across projects.

We asked ourselves: what if customizations could be **modular**, **shareable**, and **cleanly separated**?

That’s what Extensions aim to solve.

## What are SuperTokens Extensions?

Think of Extensions as plugins, but for auth.

They let you:

- Override any function, API, or UI component in SuperTokens
- Inject custom routes or interface logic
- Intercept and transform configurations
- Define inter-plugin dependencies and compatibility

No more wrestling with sprawling config files. With Extensions, you write code once, and reuse it everywhere.

```ts

SuperTokens.init({

// ...

experimental: {

plugins: [emailDeliveryPlugin, captchaPlugin, auditLogger],

},

});
```


## 🧪 Testing the System: What We Learned

We invited developers—both seasoned SuperTokens users and complete newcomers—to put the system through its paces. Here's what we learned from their feedback:

### ✅ What Worked

- **Basic overrides are rock solid**: Testers were able to override `signIn`, `signUp`, and other functions cleanly, using the new plugin structure.

- **Before/After execution pattern** felt natural and powerful.

“It gives me the opportunity to do something before triggering a function and also after.” - Internal Tester

- **Clean separation of logic**: Developers appreciated moving override logic out of `SuperTokens.init` and into self-contained plugins. One tester remarked that it made the config "more readable and maintainable."

- **Initial setup via CLI was smooth for most users**:

    > “Straightforward and convenient.” – Internal Tester

## Next Steps: The things we need to improve on

Despite the positive response, the launch surfaced a few key pain points:

### 1. Documentation Needs Work

- The initial guide suggested a trial by fire approach of “Try implementing a plugin”. This was not a real guide—it’s but more of a prompt.

- Multiple testers internal testers found our examples too complex with no proper onboarding.

- Inconsistency in terminology led to confusion. Terms like “plugin” and “extension” were used interchangeably.

"It was a ‘draw the rest of the owl’ moment." – Internal Tester

**Fixes underway**:

- We’re working on focused “before/after” code examples

- We’ll simplify plugin examples and add step-by-step walkthroughs
 
- Terminology is being standardized across the docs

### 2. A better onboarding experience

Many users didn’t know what to build or how to start. Even though the system worked, the entry point wasn’t clear.

> “Without prior SuperTokens knowledge, I had no idea what a plugin should do.” – Internal Tester

We hear you—and we’re shipping onboarding tasks like:

- “Build a captcha plugin from scratch”

- “Log all failed sign-ins to a database”

- “Inject custom UI components for password reset”

### 3. Simplifying our example plugins

Testers reported that the example plugins were a little obtuse and followed a paradigm that didn't seem intuitive.

We’re rewriting these examples to match what people expect: concise, instructional, and minimal.


## 🔍 Dev Experience Scores

Here’s how testers scored the new system:

| Category                  | Avg. Score (out of 5) |
|--------------------------|------------------------|
| Initial Setup Experience | 3.8                    |
| Documentation Clarity    | 2.6                    |
| TypeScript Support       | 5.0                    |
| Error Handling           | 4.0                    |
| API Intuitiveness        | 3.9                    |
| API Flexibility          | 4.8                    |

## 🚧 What’s Next?

- 📚 Launching guided plugin tasks for common use cases

- 🛠️ Improving plugin typing and reference docs

- 📦 Publishing more plugins to showcase the system

- 🧪 Opening up for more real-world testing

---

## 🤝 Want to Help?

You can still be part of shaping this system. Whether you’re a power user or just curious, we’d love your feedback:

- Try building a plugin

- Integrate an existing one

- Tell us what’s confusing, broken, or awesome

You can find our quick get [started guide here](https://gist.github.com/DBozhinovski/5e0cacb90e3507eb1444b394e8432568)

Please reach out to us if you have any questions through Discord.

Let’s build the future of modular auth—together. 🔌