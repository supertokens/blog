---
title: "Prompt Injection Attacks on LLMs: The Hidden AI Phishing Threat"
date: "2025-08-03"
description: "Prompt injection attacks can trick LLMs into phishing users. Learn how invisible HTML is being weaponized—and how to protect your app’s auth flows."
cover: "gemini-phishing-attacks.png"
category: "programming"
author: "Joel Coutinho"
---

Phishing attacks capitalize on the strategic principal of attacking the weakest link in a system to compromise its security... Humans, and although AI has been an extremely powerful tool it isn't infallible. In this blog we look at "prompt injections" a newer type of vulnerability submitted by a group of security analysts that enables attackers to hide malicious instructions in emails which gets appended to the summary of Gemini's "Summarize this email" feature.

## What Are Prompt Injection Attacks on LLMs?

**Prompt injection** is a technique where adversaries embed malicious instructions or misleading context into the input an LLM receives—causing it to behave in ways its developers never intended.

### Types of Prompt Injection

- **User-to-Model Injection:** A classic method where users directly type hidden or manipulative instructions in chat prompts.
- **Content Injection via Web Scraping:** Injecting prompts into text that LLMs ingest while summarizing or indexing websites.
- **Invisible HTML-Based Injection:** Perhaps the sneakiest form—using styles like white text on a white background or `font-size: 0px` to hide prompts inside web content.

### Types of Prompt Injection

- **User-to-Model Injection:** A classic method where users directly type hidden or manipulative instructions in chat prompts.
- **Content Injection via Web Scraping:** Injecting prompts into text that LLMs ingest while summarizing or indexing websites.
- **Invisible HTML-Based Injection:** Perhaps the sneakiest form—using styles like white text on a white background or `font-size: 0px` to hide prompts inside web content.

### Why This Matters

LLMs don’t understand *intent*. If a prompt is present—visible or not—it becomes part of the model’s context. This means:

- They may hallucinate UI elements like login portals or buttons.
- They can echo malicious or misleading links.
- Users might trust these outputs because they appear system-generated.

In essence, attackers can use prompt injection to turn trusted LLMs into phishing relays.

---

## Invisible HTML: How Phishing Enters Through the Backdoor

### What Is Invisible HTML?

Invisible HTML refers to text that is:

- Styled as white-on-white (e.g., `color: white; background: white`)
- Hidden using `display: none`, `opacity: 0`, or `visibility: hidden`
- Rendered off-screen via absolute positioning or `left: -9999px`
- Embedded with zero-size fonts or using `<noscript>`, `<style>`, etc.

To a human, it’s unreadable. To a machine, it’s just part of the document.

### How LLMs Ingest Web Content

Most LLMs rely on:

- Crawlers that pull HTML content from the web.
- Summarization pipelines that condense and compress context before response generation.
- Few defenses against steganographic prompt injection in HTML.

### Examples in the Wild

- **Invisible Reset Links:** A website embeds `Click here to reset your password: https://phishing.ai/login` in white text. The LLM summarizes it—and generates a clickable “reset” link for the user.
- **Fake Session Warnings:** An attacker includes an invisible prompt like `ALERT: Your session has expired. Click here to re-authenticate.`—and the LLM reproduces this in a response.
- **Link Injection via FAQs:** Malicious prompts inside `<div style="display:none">` within FAQ pages can lead the LLM to hallucinate “official” links that are anything but.

### Why It's So Dangerous

The LLM is acting in good faith, simply repeating the content it sees. The illusion of trust is what makes this threat so effective.

---

## From Curiosity to Catastrophe: The Phishing Risk Explained

### How Prompt Injection Leads to Phishing

1. A prompt instructs the LLM to say something like:
   > "For security reasons, click [this link] to verify your session."
2. The LLM obliges—injecting the link into its answer.
3. Users click, believing it's a legitimate instruction from a trusted AI assistant.
4. They’re phished.

### Who’s at Risk?

- **End-Users**: Especially those unfamiliar with how LLMs work.
- **Developers**: Coding assistants might suggest malicious packages or URLs.
- **Support Teams**: Using AI to generate help desk responses? Prompt injection could instruct them to take dangerous actions.

### Why This Is Hard to Detect

- There’s no malware or executable payload.
- The prompt *looks* like regular HTML.
- Logging systems may miss invisible or off-screen content.
- It’s entirely data-driven—pure manipulation via content.

---

## Securing AI Interfaces: What Developers Can Do Today

LLMs are not security-aware. Your app must be.

### ✅ Validate LLM Outputs

- Never render raw LLM suggestions into your frontend without checks.
- Wrap any output that contains links or formatting with sanitizer layers.
- Treat AI responses like user input: untrusted by default.

### 🧼 Strip or Inspect HTML

- Before summarization or ingestion, sanitize hidden HTML elements.
- Remove zero-size fonts, offscreen elements, or suspicious `<div>`s.

### 🔧 Fine-Tune LLM Behavior

- Limit formatting capabilities in your prompts (e.g., disable HTML rendering).
- Rein in LLM autonomy in HTML-rich or security-sensitive contexts.

### 📜 Audit Prompt Chains

- Log where prompts come from—was it user input? Web content? A prior AI step?
- Include metadata and history to trace injected behavior.

### 🧠 Consider RAG

Retrieval-Augmented Generation (RAG) enables you to:

- Control the knowledge base the LLM accesses.
- Prevent prompt injection by using validated sources only.
- Strip out unsafe formatting from indexed content.

---

## How SuperTokens Hardens Auth Workflows Against AI-Phishing Risks

Even if an LLM gets tricked, your authentication workflows shouldn’t.

Here’s how SuperTokens protects against the fallout from these attacks:

### 🔐 Session Verification Tied to Origin

- Even if users click on a fake login link, sessions can be locked to specific origins.
- Auth tokens will fail validation if redirected from an unknown domain.

### 🔗 Magic Link Controls

- Limit links to single-use with short expiry.
- Bind the magic link’s validity to your domain or origin context.

### 🛡️ Anti-CSRF & JWT Claims Verification

- Prevents token reuse or tampering—even if the link is intercepted or AI-generated.
- Claims checks ensure that links align with user sessions and device fingerprints.

### 🧾 Audit Logs & Access Control

- Track where requests originate from.
- Spot AI-generated anomalies in login or reset behavior.

### 🏠 Self-Hosted Option

- Eliminate exposure to LLM-scraped endpoints by hosting the auth system yourself.
- Avoid leaking URLs that could be used in prompt injection setups.

---

## Real-World Scenarios: How This Could Unfold

### Scenario 1: A Phishing Email Augmented by ChatGPT