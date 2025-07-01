---
title: "Solving Auth for Everyone: The SuperTokens CLI Overhaul"
description: "We overhauled our CLI to be both a teaching tool and a real project starter—making it easier than ever to add auth to any stack, your way."
date: "2025-07-01"
cover: "cli-overhaul.png"
category: "featured"
author: "Darko Bozhinovski"
---

The `create-supertokens-app`, our CLI tool, has existed for quite a while now. It was originally created back in September 2020 to address a common problem faced at the time - show potential users a demo of how it works with their stack. In a sense, it was always an educational tool first - although, there wasn't anything stopping you from using it as a starter point for a project.
However, not many CLI tools out there are educational.

## The Problem

There's an UX expectation when you're faced with a CLI tool in webdev-land - they usually fall into one of two categories:

- **Utility tools**: think package managers, bundlers, image processors, etc.
- **Scaffold generators**: think create-react-app, vite, astro, etc.

Some CLI tools do both. But `create-supertokens-app`? We built it as a learning/demo tool - an obvious outlier. While it works as a learning tool, it can be confusing for users who have different expectations - and those users happen to be the majority.

When you name something create-something-app, people expect it to, you know, create apps they can actually use as starting points.

So we had a choice: keep explaining why our CLI is built with a different intention, or make it work the way people expect. Or, well, both - for the simple reason that some of our users are totally fine with the original idea. Plus, we still use it as a demo tool internally.

## The Vision: From Learning Tool to dual-purpose CLI... and beyond

The end goal isn’t subtle—we want to get to a world where you can run `supertokens add email-password` in any project and have auth just… work. 

No matter if you’re using Next.js, Express, Django, React, Vue, Angular or that weird custom setup you built at 2 AM using jQuery. No judgement, we'll support it too!

But getting there meant solving a list of more immediate problems:

1. Rethink it conceptually
2. Unify it across the tech choices - we currently support 20+ individual framework choices (and growing). But not all of them offered the same experience, and some were outdated or deprecated.
3. Reduce the amount of code repetition across frameworks - we have separate auth config files per framework (7 per framework, to be exact, which amounts to ~140 in total). Those files were ~90% similar between each other - sounds like a problem that can be put in a template, right?

## The Three-Phase Approach (Or: How to Rebuild Without Breaking Everything... mostly)

As with any refactor/rewrite project, you need a plan. Of course, the plan has no chance of surviving past the first few weeks, but you still need it for the sake of clarity. We decided to take a three-phase approach in order not to break anything while also making sure that we're getting closer to the end goal. The original plan looked something like this:

- **Phase 1 - Make things consistent per-framework:** Each framework choice must come with a predefined set of routes, auth configurations and screens. Each framework choice must use the latest version of SuperTokens and the latest version of the framework itself. This comes with a nasty side-effect - breaking changes are on us. But, we're willing to take the risk and put in the work to maintain them.

- **Phase 2 - Abstract repetitive patterns:**This is where the real fun begins. We realized that we could reduce all config files to 5 + 2 + 1. One for each of our SDKs (the 5), two for each of their shared configs (one for the frontend frameworks and one for the backend) and finally one containing common SuperTokens/port/routes configuration shared among all of them. More on this in the next section.

- **Phase 3 - The dot on the horizon:** What if, instead of going the `create-supertokens-app` route, we went the `supertokens add email-password` route? In a framework of your choice? In an already existing project you need auth for? Let me expand on it - this is the theoretical final stage of this grand (and fun!) project. Ideally, we'd bring SuperTokens to you and automate the process as much as possible. So far, we managed to successfully complete phases 1 and 2. We have ideas for how to make phase 3 a reality, and we're R&D-ing them. Read on for the details!

### Phase 1: Consistency is King and Queen

**Reality Check**: We had 20 different boilerplate options across backends, frontends, and full-stack setups. Each one was slightly different. Different routes, different configs, different css, different markup. Not too great, right?


What We Did to fix it:

- Standardized every single route across all 20 options
- We made sure every frontend has the same set of screens (/, /auth, /dashboard)
- Unified all backend routes (/auth/*, /hello, /sessioninfo, /tenants)
- We changed each of the configs repeated across the frameworks to be as identical to each other as possible.

Overall, phase 1 wasn't that hard. It was fairly easy to distribute the workload, and the brunt of it was done within two weeks. Phase 2, however, was a bit more interesting.

## Phase 2: Codegen and a "compiler"


The big goal of phase two was to reduce the amount of repeated config code as much as possible and make sure each of the configs repeated across the frameworks are as identical to each other as possible. This would, in theory solve two problems:

1. It would reduce the mental overhead when trying to understand the codebase.
2. It would make adding new authentication methods and customizations easier, since they would be done in a single place.

At this point, we were faced with a choice - we had to generate (config) code for three programming languages (Python, Go and TypeScript) while keeping in mind that we have separate configuration for frontend and backend. And on top of that, we have a react and a non-react (our universal web-js) sdk. The seemingly easier way was to generate the code via template strings. Which is what we did, and fair enough, it works. But, given half a chance to go back and go the AST route, I would have done that instead.

![AST Codegen meme image](TODO.png)

We built a "compiler" that generates the code described above - and I'm putting that in quotes, because it's not really a compiler in the traditional sense. It's more of a code generator that takes in a set of rules and generates config code based on those rules. The rules are (currently) defined in a bunch of objects, but I'm looking into moving them to a DSL in phase 3.

The problem with template strings is that they are not type safe, and they lead to some "fun-to-debug" runtime errors. While ASTs are deterministic - you know exactly what the output will be, and you can catch errors at compile time. This makes the code more reliable. Additionally, the "easier to maintain" hypothesis turned out only half-true because of our choice to use string templates - sure, they are centralized, but you're still dealing with string interpolation which is again, susceptible to the issues described above.

To put it in practical terms, here's why I consider this phase a success - Instead of maintaining separate configuration files for each of our 20+ combinations, we built a system that compiles configs based on user choices. Pick Node.js + React? You get Node SDK configs and React SDK configs. Pick Python + Vue? Different output, same source of truth. We managed to centralize the config generation logic in such a way that it is easy to simply drop in a new codegen tool and simply replace the logic with an AST-based approach.


> **See it in action** </br>
The current published version of `create-supertokens-app` is the results of everything we did up to phase 2. Give it a spin by running `npx create-supertokens-app@latest`.

![cli video](video.mp4)

### Phase 3: The Real Fun Begins
As we've established, no plan survives first contact with the "enemy" - still though, planning is essential. With that said, here's our plan for phase 3:

- Move over to a DSL and AST-based codegen for the configurations, replacing the string-based approach
- Alias `supertokens` to `create-supertokens-app`
- Modularize the CLI interface; E.g. allow for `supertokens create --frontend react --backend node --firstfactors emailpassword` while opening the way for `supertokens add email-password`.

As you can probably tell, this is a significant undertaking, and we're pretty early in the process. This list above is subject to change, due to the fairly ambitious nature of the project.


## Why This Matters (Beyond Making My Life Easier)

In my opinion, auth (both of them) is one of those things that is a solved problem, even a boring one. Considering that, we shouldn't invest a ton of time into it (usually), and ideally focus on the problem we're trying to solve. In a way, this project is a part of our "auth for everyone" mission - own it, integrate it as you see fit, customize it when and if you need it.

The goal isn’t to replace your existing setup - it’s to bring SuperTokens to you instead of making you adapt to SuperTokens.
This is part of our launch week at SuperTokens.

 If you want to try the new CLI or have thoughts on where we should take it next, let us know.
