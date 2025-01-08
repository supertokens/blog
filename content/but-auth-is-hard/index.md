---
title: '"BuT, aUtH iS HaRd"'
description: "No, it's not. It's boring, red-tapey, a solved problem... but don't call it hard as a blanket statement."
date: "2024-10-16"
cover: "but-auth-is-hard.png"
category: "featured"
author: "Darko Bozhinovski"
---

I'm "I've used MD5 to hash passwords in PHP" years old. Sure, it was a horrible idea, even back in [2012](https://security.stackexchange.com/questions/19906/is-md5-considered-insecure). But, back then, I don't remember considering auth "hard." It was a pretty straightforward ordeal by itself - get an email or a username, get a password, hash it (with MD5, as "god intended"), and if you were especially security conscious, [salt](<https://en.wikipedia.org/wiki/Salt_(cryptography)>) the password. Store all of that somewhere, usually in a database. Ta-da, signup done.

Nowadays, the narrative has changed. "Auth is hard" feels like an ever-present narrative that lies a HackerNews or Reddit click away. But is it really? IMO, The truth is, auth isn’t hard to build - anyone can learn it (and everyone in this line of work should learn the basics). The real challenge lies in the extras: MFA, user management, password resets, each of the hundreds of OAuth providers, and account merges from different providers. It’s death by a thousand cuts. Since auth is a solved problem, reinventing the wheel isn’t the best use of your time. But that doesn't mean "auth is hard" as a blanket statement is correct or even close to correct. You should experiment, understand the basics, and build from there. The complexity only grows with the scale (or potential scale) of what you're creating.

So, how hard can auth really be? Let's dig in.

![Pepperidge farm remembers...](/8zmj3k.jpg)

## In the days of yore...

Picking up where I left the story about PHP and md5, building a login functionality followed a similar set of steps; Get an email and a password, check for the existence of the email in your storage, hash the password together with the salt stored for that email, compare the resulting hash with the one stored in the database, and if it all works out fine, set a cookie via `setcookie` (we're still in PHP land here - not that the overall logic was too different in other ecosystems).

Signing out was even simpler - just invalidate the cookie on the server, and you're done. If the server doesn't see a cookie with the next request, you're not logged in. So doing authenticated routes was also a simple ordeal overall. Things could get hairy when it came to permissions, but more often than not, with the apps I had to build, we had just admins and users. Which was something you could simply store together with the user record or in a permissions table if you ever needed to expand the amount of roles you had for your app.

> Full disclosure—I work for [SuperTokens](https://supertokens.com). This piece, however, is borne out of personal frustration over an omnipresent narrative about how hard auth is as a blanket statement. In other words, I'm not trying to "sell you my thing." Use whatever you like.

---

## Roll your own - a "modern" take

### Email/password and Social auth

To get to where we are today, we'll start at the beginning... Surprising, I know. We can probably agree that these components are enough to make an email/password + social login PoC:

1. A server that handles routes - signup, sign-in, sign-out...
2. Some kind of storage to keep the user records (an in-memory array works, too)
3. Views - login, signup, and authenticated "dashboard" screens.
4. Handlers for social auth

Going with Express and Passport, since we're not going to reinventing wheels, we arrive at exactly 150 lines of very, very dull and repetitive code: https://github.com/supertokens/auth-express/blob/master/index.mjs. The next section will be surface-level explainer of what's going on in the code, so feel free to [skip ahead](#the-big-idea) if you're already familiar with the concepts. The express app is a PoC anyway.

Let's quickly dissect it:

#### Rendering stuff on screen

The way I see it, there are two ways to approach this - start with the rendering and move on to the auth route or the other way around. Mostly by chance, I ended up being an FE-heavy pleb (I can still do SQL, in case you were wondering), so I'll start with the "rendering stuff on-screen" approach.

Since this is a PoC, we're not gonna go all React-fancy. Plain ol' SSR with [ejs](https://ejs.co) will do just fine: https://github.com/supertokens/auth-express/tree/master/views

#### Adding routes

Based on some [passport.js](https://github.com/passport/todos-express-password/blob/master/package.json) examples, but simplified further, we need the following:

1. Some deps: `npm i passport passport-local express-session`. Let's briefly go over each:
   1. [Passport.js](https://www.passportjs.org/) - the OG auth middleware for express and node.
   2. [passport-local](https://www.passportjs.org/packages/passport-local/)- an authentication strategy for Passport; An authentication strategy in a module that handles the auth process for a specific auth method - in this case, a local login using a username (email) and password.
   3. [express-session](https://github.com/expressjs/session) - a middleware that manages session data, allowing you to store and persist user sessions between HTTP requests. It works by assigning a unique session ID to each client, which is stored in a cookie on the client side and used to retrieve session data on the server.
2. A place to store our users (the example linked above uses an in-memory array): https://github.com/supertokens/auth-express/blob/master/index.mjs#L13
3. Configuration for our passport instance and our LocalStrategy instance to handle incoming requests for user lookup: https://github.com/supertokens/auth-express/blob/master/index.mjs#L18
4. Initialize passport (https://github.com/supertokens/auth-express/blob/master/index.mjs#L60) and express-session (https://github.com/supertokens/auth-express/blob/master/index.mjs#L69).

Verbose, sure. Hard? I don't think so, at least not in the implement-it-as-a-toy sense.
But we moved past using email/password combos a while ago. Let's inspect how hard it is to add a social provider on top of what we have.

For an example provider here, I decided to go with GitHub for a simple reason—if you decide to fully follow along, it's one of the easiest providers to get started with (looking at you, Google).

> If you do decide to follow along fully, here's a link describing how to get those GitHub keys: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
> Oh, and BTW, the ones in the repo aren't valid, in case you were worried ;)

#### Integrating GitHub OAuth2 in our PoC

First off, we need one more dependency, `npm i passport-github2`. [passport-github2](https://www.passportjs.org/packages/passport-github2/) is an auth strategy for Passport, allowing us to integrate with GitHub's OAuth2 API.

Some handlers (https://github.com/supertokens/auth-express/blob/master/index.mjs#L122-L133) and configuration (https://github.com/supertokens/auth-express/blob/master/index.mjs#L29-L45) later, well, that's it. Complicated? Probably not. Red-tapey? You bet. Boring? Absolutely. Especially if you get to do it over and over again. It is a solved problem; reinventing wheels is often not the best use of one's time as we've established.

![What's your point?](/tenor-3826355393.gif)

## The big idea

By now, we can probably agree that Auth isn't hard to _build_. Ergo, it's not this magical thing that only white-bearded wizards who speak the mystical language of JWTs can understand and implement.

No, in fact, I'd argue that as a developer, one should understand the bare basics of how auth works. And I often see a narrative that claims otherwise - something to the tune of "trust me, bro, we can handle that for you". And sure, I agree that for the most part, rolling your own auth is a waste of time. But it's not that hard to build, and it's certainly not a mystical thing. Where it truly becomes hairy is with everything surrounding auth and the user experience.

Consider this - in the example above, we have a working auth thing. Sort-of. But here's what it can't do (also mentioned in the article opener):

- 2FA, MFA
- Password resets
- Each and every of the hundreds of OAuth providers with their specificity
- User management
- Account merges from different providers
- Cover all the possible edge cases and potential security holes
- ...and I can go on

We can probably implement each of these. And on its own, each piece may be considered simple. But it adds up. So, it's not necessarily the implementation—it's maintaining it, being responsible for it, staying up to date with the standards, security breaches, and so on. Plus, a show of hands—how many of you like reading RfCs? I don't imagine I'd see many raised hands if we were on a meetup.

My point is that auth isn't easy, taken as a whole. Sure, we can easily cobble something together for a PoC, as we did above. But it's not magical, it's not impossible to understand, and please, please don't say that it is. That line of thinking (and marketing), IMO, is damaging to the industry as a whole.

So, the natural follow-up question would be - when should you roll your own?

### Toy project, indie, and educational pursuits

...by all means. I'd even encourage it. You learn a lot by doing, so why not? If your indie/toy project or blog grows to have a considerable user base or following, switch it out to a service, a self-hosted solution, or something else. After all, you have a product at that point, and your time will undoubtedly be better spent building that product instead of maintaining auth.

### Startups

Generally, if you're building products, don't roll your own auth. It's reinventing a very boring and red-tapey wheel. You have plenty of options to choose from. Plus, you are building something, right? Why are we even having this conversation if your product isn't auth?

### Scaleups and above (however we choose to define them)

Don't. Same reason as startups - but it certainly applies more here.

You can probably see where I'm going with this. "Auth is hard" is, I'd say, a marketing pitch when used as a blanket statement. You can understand auth, you can build it, but it's boring, it's not fun to maintain, and it's a problem that's solved. Thus, it can be considered a commodity—one that you can pick off the shelf in whichever flavor you choose (some options below).

### The self-hosted and FOSS landscape

For the ones that are into owning their stack (as yours truly is), you have plenty of options to choose from, too:

_Auth libs_

- Passport.js, covered above in detail
- [Lucia](https://lucia-auth.com) - A simple and flexible authentication library for modern web applications, focusing on developer experience and ease of use.
- [Auth.js](https://authjs.dev) - A lightweight and customizable authentication library for Node.js, designed to be easily integrated into various frameworks and applications. Started off as a library for Next.

_Auth servers_

- [Keycloak](https://www.keycloak.org) - An open-source identity and access management server offering features like single sign-on (SSO), identity brokering, and user federation.
- [SuperTokens](https://supertokens.com) (see disclaimer above) - An open-source authentication solution providing pre-built features like session management, social login, and email/password authentication with a focus on security and simplicity.
- [FusionAuth](https://fusionauth.io) - A flexible authentication platform catering to developers, offering features like user management, multifactor authentication (MFA), and single sign-on (SSO).
- [Authelia](https://www.authelia.com) - An open-source authentication server providing multifactor authentication (MFA) and SSO, designed to secure applications using reverse proxies.

_Storage + Auth_

- [Supabase](https://supabase.com) - An open-source backend-as-a-service (BaaS) platform providing database, authentication, and real-time capabilities, designed as a Firebase alternative.
- [Pocketbase](https://pocketbase.io) - An open-source backend solution combining database, authentication, and file storage, aimed at simplifying the development of modern web and mobile applications.

So, even if you're not into using third-party software for Auth, you can just pick an open-source one off the shelf, depending on your needs and preferences and roll with that.

## The takeaway: auth is the "red tape" of dev

![Staaaaaaaaaaaaaaaaaaaaaaamp](/stamps.gif)

My "big" takeaway is to avoid reinventing wheels, especially if it's a solved problem, as auth is. Get educated about said wheels, experiment with them, build a toy wheel, and understand it. But please, please, don't sell it as this impossibly hard thing to understand and build. Educate, don't gatekeep.
