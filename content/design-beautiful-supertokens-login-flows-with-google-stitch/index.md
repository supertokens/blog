---
title: "How to Use Google Stitch to Design Beautiful SuperTokens Login Flows"
description: "In this guide, you'll learn how to use Google Stitch — Google's AI-powered UI design tool — to rapidly prototype and generate custom login screen designs, then translate those designs into real SuperTokens customizations using CSS overrides and React component overrides. No design background required."
date: "2026-03-30"
cover: "google-stitch-supertokens.png"
category: "general"
author: "Joel Coutinho"
---


```toc
tight: true
toHeading: 3
```


Your login page is the first thing users see. It sets the tone for your entire product — yet for most developers, it's an afterthought: a default form dropped in from a library, unstyled and generic. SuperTokens makes it easy to get authentication working fast, but customizing those login screens into something that feels truly *yours* has traditionally required significant front-end investment.

Google Stitch changes that equation.

In this guide, you'll learn how to use Google Stitch — Google's AI-powered UI design tool — to rapidly prototype and generate custom login screen designs, then translate those designs into real SuperTokens customizations using CSS overrides and React component overrides. No design background required.

---

## What Is Google Stitch?

Google Stitch is an AI-native UI design tool launched at Google I/O 2025 as a Google Labs experiment. Powered by Gemini 2.5 Pro, Stitch lets you describe an interface in plain English (or upload a sketch or wireframe), and it generates a complete, styled UI — including front-end code — in seconds.

Key features include:

- **Prompt-to-UI generation:** Describe your login screen and Stitch renders it instantly
- **Image-to-UI:** Upload a rough wireframe or sketch and Stitch converts it to a polished design
- **Multiple variants:** Generate several layout options to compare
- **Paste to Figma:** Export designs directly into Figma for further collaboration
- **Front-end code export:** Get clean HTML/CSS (or JSX) ready to use in your project
- **Interactive prototypes:** Stitch together multiple screens and click "Play" to preview the full user journey
- **AI-native canvas:** An infinite canvas that lets you iterate from wireframe to working prototype in one place

Stitch is currently free through Google Labs at [stitch.withgoogle.com](https://stitch.withgoogle.com), making it accessible to developers and startups without a dedicated design team.

---

## Why Customizing Your SuperTokens Login UI Matters

SuperTokens is an open-source, developer-first authentication platform that gives you full control over your auth stack — from session management to login flows. Its pre-built UI gets you authenticated users in minutes, but the default interface uses generic styling that rarely matches a production product's brand identity.

Studies consistently show that a polished, on-brand login experience increases user trust, reduces drop-off, and improves conversion rates during onboarding. When your login page looks like an out-of-the-box library component, it subtly signals that the product isn't fully baked.

SuperTokens gives you two powerful paths for customization:

1. **CSS overrides** via the `style` property on any recipe — ideal for color, typography, spacing, and branding tweaks without touching component logic
2. **React component overrides** via `AuthRecipeComponentsOverrideContextProvider` — for replacing entire UI sections with your own components

Google Stitch helps you figure out *what* to build before you write a single line of CSS.

---

## The Workflow: Stitch → Design → SuperTokens

Here's the end-to-end process this guide will walk you through:

```
Describe your brand/UI in Stitch
        ↓
Generate login screen variants
        ↓
Export HTML/CSS or paste to Figma
        ↓
Translate styles to SuperTokens CSS overrides
        ↓
(Optional) Convert major structural changes to React component overrides
```

---

## Step 1: Generate Your Login Screen Design in Google Stitch

### Getting Started

Visit [stitch.withgoogle.com](https://stitch.withgoogle.com) and sign in with your Google account. No installation needed — Stitch runs entirely in the browser.

### Writing an Effective Prompt

The quality of your output depends heavily on your prompt. Be specific about:

- **Layout type** (centered card, split-screen, full-page gradient)
- **Color palette** (specific hex codes or general direction like "navy and white, clean SaaS aesthetic")
- **Form elements** (email input, password field, social login buttons, "remember me" checkbox)
- **Typography style** (modern sans-serif, minimal, bold)
- **Brand personality** (enterprise, consumer app, developer tool)

**Example prompt for a SaaS login page:**

> "Design a login page for a developer tool SaaS called DevFlow. Use a dark navy (#0F172A) background with a centered white card. The card should have email and password inputs with subtle border-radius, a bright indigo (#6366F1) sign-in button, a divider line that says 'or continue with', and GitHub and Google social login buttons below. Include a 'Forgot password?' link and a 'Don't have an account? Sign up' link at the bottom. Clean, minimal, professional."

### Using Image Inputs

If you already have a rough wireframe — even a hand-drawn sketch — you can upload it to Stitch. It processes the image and renders a polished digital UI based on your visual structure. This is particularly useful if you have stakeholder mockups you need to implement quickly.

### Generating Variants

Stitch allows you to generate multiple layout variants from the same prompt. Use this to compare different approaches — for example, a centered card vs. a split-screen layout with a product hero image on one side.

Iterate using the chat sidebar: "Make the button color more vibrant," "Add a logo placeholder at the top," "Remove the 'remember me' checkbox and add a Terms of Service link instead."

---

## Step 2: Export the Design

Once you're satisfied with your design, you have two export options:

### Option A: Export HTML/CSS Code

Click **Export** and select the HTML/CSS option. Stitch generates structured front-end code based on your design. This code won't be production-ready as-is, but it's an excellent reference for:

- Exact color values, font sizes, and spacing
- Component structure and element hierarchy
- Button and input styling patterns

### Option B: Paste to Figma

If you work with a design team or want to refine further before implementing, use the **Paste to Figma** option. This exports the design into your Figma workspace where you can apply your full design system, share for review, and extract design tokens.

---

## Step 3: Apply the Design to SuperTokens — CSS Overrides

SuperTokens' pre-built UI components expose `data-supertokens` attributes on every stylable element. You can target these attributes with plain CSS in the `style` property of your recipe configuration.

### Finding the Right Selectors

Open your app's `/auth` page in a browser, then use DevTools to inspect any component. You'll see attributes like `data-supertokens="button"`, `data-supertokens="input"`, `data-supertokens="container"`, etc. These are your CSS hooks.

### Applying Global Styles

The top-level `style` property in your `SuperTokens.init()` call applies styles globally across all recipes:

```javascript
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
  appInfo: {
    apiDomain: "https://api.yourapp.com",
    appName: "DevFlow",
    websiteDomain: "https://yourapp.com",
  },
  // Global style overrides applied to all SuperTokens UI
  style: `
    /* Page background */
    [data-supertokens~=page] {
      background-color: #0F172A;
      font-family: 'Inter', sans-serif;
    }

    /* The white card container */
    [data-supertokens~=container] {
      background-color: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
      padding: 40px;
      max-width: 420px;
    }

    /* Input fields */
    [data-supertokens~=input] {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      font-size: 15px;
      padding: 12px 16px;
      color: #1E293B;
    }

    [data-supertokens~=input]:focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      outline: none;
    }

    /* Primary button */
    [data-supertokens~=button] {
      background-color: #6366F1;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.01em;
      padding: 12px;
      transition: background-color 0.2s ease;
    }

    [data-supertokens~=button]:hover {
      background-color: #4F46E5;
    }

    /* Links */
    [data-supertokens~=link] {
      color: #6366F1;
      font-weight: 500;
    }

    /* Error messages */
    [data-supertokens~=generalError] {
      background-color: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 8px;
      color: #DC2626;
      padding: 12px;
    }

    /* Header text */
    [data-supertokens~=headerTitle] {
      color: #1E293B;
      font-size: 24px;
      font-weight: 700;
    }

    [data-supertokens~=headerSubtitle] {
      color: #64748B;
      font-size: 14px;
    }
  `,
  recipeList: [
    EmailPassword.init(),
    Session.init(),
  ],
});
```

### Applying Styles per Recipe

You can also scope styles to a specific recipe — useful when your sign-in and sign-up flows have slightly different visual needs, or when you want to style the password reset form differently:

```javascript
EmailPassword.init({
  resetPasswordUsingTokenFeature: {
    enterEmailForm: {
      style: `
        [data-supertokens~=container] {
          background-color: #F8FAFC;
          border: 2px solid #E2E8F0;
        }
      `,
    },
  },
})
```

### Overriding Fonts

By default, SuperTokens uses Arial. Override it globally using the container selector:

```javascript
style: `
  [data-supertokens~=container] {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }
`
```

> **Tip:** Load your desired font via a `<link>` tag in your HTML head *before* injecting the SuperTokens style string so it's available when the component renders.

---

## Step 4: Structural Changes with React Component Overrides

CSS overrides cover the vast majority of visual customization. But sometimes you need to restructure the UI itself — add your logo above the form, inject a marketing banner, replace the header entirely, or add a custom footer with legal links. For these cases, SuperTokens provides React component overrides.

### Adding a Logo Above the Login Form

```javascript
import React from "react";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { AuthRecipeComponentsOverrideContextProvider } from "supertokens-auth-react/ui";
import YourLogo from "./assets/logo.svg";

function App() {
  return (
    <SuperTokensWrapper>
      <AuthRecipeComponentsOverrideContextProvider
        components={{
          AuthPageHeader_Override: ({ DefaultComponent, ...props }) => {
            return (
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "24px"
                }}>
                  <img src={YourLogo} alt="DevFlow" height={36} />
                </div>
                <DefaultComponent {...props} />
              </div>
            );
          },
        }}
      >
        {/* Your app routes here */}
      </AuthRecipeComponentsOverrideContextProvider>
    </SuperTokensWrapper>
  );
}
```

### Replacing the Sign-Up Form Header

```javascript
import { EmailPasswordComponentsOverrideProvider } from "supertokens-auth-react/recipe/emailpassword";

function App() {
  return (
    <SuperTokensWrapper>
      <EmailPasswordComponentsOverrideProvider
        components={{
          EmailPasswordSignUp_Override: ({ DefaultComponent, ...props }) => {
            return (
              <div>
                <div style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  padding: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "8px",
                  color: "white"
                }}>
                  <h2 style={{ margin: 0, fontSize: "18px" }}>
                    Join 10,000+ developers
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.9 }}>
                    Free forever. No credit card required.
                  </p>
                </div>
                <DefaultComponent {...props} />
              </div>
            );
          },
        }}
      >
        {/* ... */}
      </EmailPasswordComponentsOverrideProvider>
    </SuperTokensWrapper>
  );
}
```

---

## Step 5: Customizing Social Login Buttons

If you're using the ThirdParty recipe (Google, GitHub, etc.), you can style social login buttons to match the Stitch-generated design:

```javascript
import SuperTokens from "supertokens-auth-react";
import ThirdParty, { Github, Google } from "supertokens-auth-react/recipe/thirdparty";

SuperTokens.init({
  // ...
  recipeList: [
    ThirdParty.init({
      style: `
        [data-supertokens~=providerButton] {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          background-color: #FFFFFF;
          color: #1E293B;
          font-weight: 500;
          font-size: 14px;
          padding: 11px 16px;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        [data-supertokens~=providerButton]:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
        }

        [data-supertokens~=divider] {
          color: #94A3B8;
          font-size: 13px;
        }
      `,
      signInAndUpFeature: {
        providers: [
          Github.init(),
          Google.init(),
        ],
      },
    }),
  ],
});
```

---

## Step 6: Designing the Full Auth Flow in Stitch

One of Stitch's most powerful features is the ability to design *multiple screens* and stitch them together into an interactive prototype. For a complete SuperTokens integration, consider designing all of these screens in one Stitch session:

**Screens to design:**
- Sign-in page
- Sign-up page
- "Forgot password" — email entry screen
- Password reset — new password entry screen
- Email verification — "check your inbox" screen
- Two-factor authentication / OTP entry screen (if using MFA)

Use Stitch's Agent Manager to work on multiple screen variants in parallel. Once you have your core screens, use the interactive prototype feature (click "Play") to walk through the full user journey before writing any code.

This gives you — and your stakeholders — a clear visual target before implementation begins, dramatically reducing back-and-forth during development.

---

## Design Patterns That Work Well with SuperTokens

Based on the customization capabilities of SuperTokens' pre-built UI, here are patterns that are especially well-suited to implementation:

**Centered card on dark background** — The default SuperTokens layout is a centered card, so dark backgrounds on the outer container (`[data-supertokens~=page]`) are trivially easy to implement and look professional.

**Split-screen with brand imagery** — Use a React component override to wrap the SuperTokens `AuthPage` in a two-column layout. The left column renders your brand image/illustration; the right column renders the SuperTokens form.

**Glassmorphism / frosted card** — Apply `backdrop-filter: blur()` and `background: rgba(255,255,255,0.1)` to the container selector for a modern glass-card effect on top of a gradient or image background.

**Progressive multi-step sign-up** — Use SuperTokens' custom UI approach (bypassing the pre-built UI entirely) in combination with Stitch-designed individual step screens for maximum control over step-by-step onboarding flows.

---

## Practical Tips

**Start with CSS, not component overrides.** The majority of visual changes — colors, fonts, spacing, borders, shadows — are achievable with CSS alone. Reserve component overrides for structural additions (logos, banners, custom footers).

**Use browser DevTools as your guide.** The `data-supertokens` attribute system is your map. Inspect any element on the `/auth` route to find the right selector before targeting it in CSS.

**Design mobile-first.** SuperTokens' pre-built UI is responsive, but your custom styles may not be by default. Test your Stitch-inspired styles at 375px viewport width before releasing.

**Check Stitch's code export, don't copy it verbatim.** Stitch generates HTML/CSS that's useful as a visual reference and for extracting design tokens (colors, font sizes, border radii), but it won't map directly to SuperTokens' component structure. Use it as a spec, not a paste target.

**Keep your style string in a separate file.** As your styles grow, it's cleaner to define your override styles in a dedicated `authStyles.ts` file and import the string into your `SuperTokens.init()` call.

```javascript
// authStyles.ts
export const authPageStyles = `
  [data-supertokens~=page] { background-color: #0F172A; }
  [data-supertokens~=container] { border-radius: 12px; }
  /* ... more styles */
`;

// App.tsx
import { authPageStyles } from "./authStyles";
SuperTokens.init({ style: authPageStyles, ... });
```

---

## A Note on Going Fully Custom

If the pre-built UI customization approach still feels too constrained — for instance, if your design requires a fundamentally different page structure or you're using a framework that doesn't support React pre-built UI — SuperTokens fully supports building a completely custom UI using the `supertokens-web-js` SDK. In that workflow, you implement your own form components from scratch and call SuperTokens' headless API methods directly, giving you 100% control over markup and styling.

Stitch is equally useful in that scenario: design your custom forms in Stitch, export the HTML/CSS, and rebuild them as native React (or Vue/Angular/Svelte) components that call SuperTokens' underlying functions.

---

## Summary

Google Stitch removes the blank-canvas problem from auth UI design. In a few minutes, you can go from a text description of your brand to a complete, styled login page with variants, interactive prototypes, and exportable front-end code — all for free.

Paired with SuperTokens' flexible CSS override and React component override system, this workflow means you can ship a polished, branded authentication experience without a dedicated designer or weeks of front-end work.

**The process at a glance:**

1. Describe your login screen in Google Stitch at [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Iterate with the chat sidebar until your design is right
3. Export HTML/CSS to extract your design tokens (colors, spacing, typography)
4. Paste those values into SuperTokens' `style` property, targeting `data-supertokens` selectors
5. Use React component overrides for structural additions like logos or marketing banners
6. Test across screen sizes and iterate

Authentication is a trust signal. A login page that looks like your product — not like a generic library — makes a real difference. Now you have the tools to build one fast.

---

## Resources

- [SuperTokens Pre-Built UI Docs](https://supertokens.com/docs/quickstart/frontend-setup)
- [Changing Style via CSS — SuperTokens](https://supertokens.com/docs/references/frontend-sdks/prebuilt-ui/changing-style)
- [Override React Components — SuperTokens](https://supertokens.com/docs/references/frontend-sdks/prebuilt-ui/override-react-components)
- [Custom UI Guide — SuperTokens](https://supertokens.com/docs/quickstart/frontend-setup)
- [Google Stitch](https://stitch.withgoogle.com)
- [Google Stitch Announcement — Google Developers Blog](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/)