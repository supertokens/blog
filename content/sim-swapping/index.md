---
title: "SIM Swapping Is Hijacking Your User Accounts: How to Shut It Down"
date: "2025-02-15"
description: "Learn about SIM swapping scams, their impact on personal security, and effective strategies to safeguard your mobile identity."
cover: "sim-swapping.png"
category: "featured"
author: "Maria Shimkovska"
---

Let's play a game. 🎯

What do Twitter founder Jack Dorsey and actress Chloe Moretz have in common? 

...

Yep. Both were victims of a cyber attack called a **SIM swapping**. 😬

From spamming to phishing scams and identity theft, cybercriminals sure know how to keep themselves busy. But the one scam they just can't seem to get enough of right now is **SIM swapping** &mdash; a sneaky trick where they hijack a user's SIM card and take over their phone number. So any calls or texts they receive go to the attacker instead. 

**Understanding how SIM swapping works &mdash; and how to prevent it &mdash; is essential to keeping your users' accounts and data safe.**

After all, scammers don’t just hack phones &mdash; they pose as the victim to fool mobile providers and gain access to their most important accounts. 😑

Time to spot the faker and stop the threat.

```toc
tight: true
toHeading: 3
```

## What is a SIM Card? 
A **SIM (Subscriber Identity Module)** is a small card that **connects a phone to a mobile network**. 📶📲

It holds important details such as the user's phone number, contacts, and other data. This information allows users to make calls, send texts, and use mobile data. It's removable and transferable to other phones.

Alternatively, **eSIMs are embedded Subscriber Identity Modules** &mdash; SIM cards that are built into a phone. 🔒📲

**Because the SIM is tied to the user's account, moving it to another phone transfers their mobile services to that device.**

## What is SIM Swapping and Why Should Your Business Care? 

**SIM Swapping** (also referred to as **SIM hijacking** or **port-out fraud**) is a fraud technique where scammers transfer a victim's phone number to a new SIM card under their control. It's a type of account takeover. 
 
**This allows scammers to receive communications associated with the phone number, including those that let them access social media profiles, banking, and other accounts.**

Cybervillains may target users who have valuable social media or financial accounts. This is how Jack Dorsey, the founder of Twitter (now X), [**got his account hacked in 2019**](https://www.nytimes.com/2019/09/05/technology/sim-swap-jack-dorsey-hack.html). 

## How SIM Swapping Works
SIM swapping attacks can be summed up in three main steps:

1. **The attacker will gather information about the victim**. They collect details that can help impersonate the victim during identity verification. This data may come from: 
- Social media accounts
- Data leaks
- Anywhere else your and your users data is available (e.g, the dark web, yellow pages, personal websites, blogs)
- Phishing and other social engineering tactics

2. **The attacker contacts the victim's phone company, pretending to be the victim**. Using the information they gathered, they answer security questions to convince the carrier to transfer the victim's phone number to their own SIM card. Once the carrier processes the request, the victim's phone will lose service.

3. **The attacker gains access to text messages and contacts**. This could lead to further attacks because they can intercept passwords, emails, and even **Two-Factor Authentication codes**. 

![A chart showing how SIM swapping works generally](sc.png)

## Consequences of SIM Swap Attacks
If an attacker takes control of a user's phone number, they could:
- **Steal money from bank accounts**
- **Make unauthorized payments**
- **Apply for loans in the victim's name**
- **Access personal information** via email or social media
- **Lock users out** of their accounts by changing passwords
- **Impersonate the victim** to deceive others

## 3 Signs That a User Is the Victim of a SIM Swap Attack
Recognizing the following signs can help your users catch a SIM swap attack early and minimize the damage:

1. **They can't make calls or send texts**. This can be a sign of a cellular provider outage, but it can also mean a SIM swap attack is in progress. Users should check for outages and act accordingly.

2. **They are locked out of their accounts**. Attackers often change account passwords to delay recovery. Users should be encouraged to reset passwords quickly.

3. **They notice unauthorized transactions**. This could signal a SIM swap attack, and users should notify their bank immediately.

## Are eSIM Cards More Secure Than Physical SIM Cards? 🤔
Many people question whether eSIMs are more secure than physical SIM cards. eSIMs offer some advantages, especially in case of phone loss, as they can be quickly disabled.

In a **traditional SIM attack**, an attacker would need physical access to a user's phone to steal their SIM card and insert it into their own device.

With **eSIMs**, there’s no physical card to steal. However, scammers can still perform a **SIM swapping attack** by convincing a mobile carrier to transfer a victim's number to their device &mdash; and with the rise of social engineering *(especially enhanced by AI)*, impersonating people has become easier than ever.

At the end of the day, neither eSIMs nor physical SIMs are automatically more secure. The key to protecting your users lies in proactive security measures &mdash; like enabling **two-factor authentication that does not rely on SMS**, using **strong passwords**, and being cautious with what information is shared online.

## Are SIM Swapping Attacks on the Rise? 
Yes, [**experts claim that these attacks are not only on the rise, but are also becoming more sophisticated**](https://www.radware.com/blog/application-protection/the-rise-of-ai-driven-cyber-attacks-implications-for-modern-security/#:~:text=AI%2DDriven%20Social%20Engineering%20Attacks,performing%20actions%20that%20compromise%20security.). Which is not surprising &mdash; especially with advancements in AI. Emerging AI capabilities can significantly enhance social engineering tactics, making SIM swapping attacks more effective and harder to detect. AI tools can:
- **Generate convincing messages:** Attackers can use AI to craft highly personalized phishing messages, mimicking writing styles or using context-specific language to deceive victims.
- **Automate reconnaissance:** AI can quickly gather publicly available data (e.g., social media profiles) to build detailed profiles of targets, improving the credibility of fake requests.
- **Impersonate voices:** AI-powered voice synthesis can convincingly mimic someone’s voice, making fraudulent phone calls more believable during identity verification attempts.
- **Bypass traditional security checks:** Attackers may use AI to predict or guess security questions based on harvested data.

[**The Federal Bureau of Investigation issued an announcement**](https://www.ic3.gov/PSA/2022/PSA220208) in 2022 to inform the public and mobile carriers of the rise of these attacks. They said that they received 320 complaints related to SIM swapping attacks between January 2018 and December 2020 , and that number jumped to 1,611 in just 2021 &mdash; although many believe these numbers are underestimated because a lot of SIM swapping attacks are not reported. 

##  Why SMS 2FA Is No Longer Enough

SIM swapping renders SMS-based authentication useless for protecting sensitive data. But it goes beyond that. SMS-based authentication is vulnerable by design.

### The Weaknesses of SMS-Based Authentication
- **Vulnerable to malware:** [**According to Ashish Malhotra**](https://securityintelligence.com/whats-wrong-with-sms-authentication-two-ibm-experts-weigh-in-on-the-nist-recommendation/) &mdash; an IBM authentication expert &mdash; many phones are susceptible to malware, where users unwittingly download malware that monitors their text messages, including any OTPs (One Time Passwords) that are used in 2FA. 
- **Standard SMS messages are not encrypted:** This makes your users' OTPs much easier to intercept and steal. SMS messages rely heavily on the mobile network providers and what security they choose to implement. Users are not often aware of what they should look for in a mobile provider and assume that their messages are safer than they actually are. 
- **Signaling System 7 (SS7) attacks:** SS7 is a protocol that allows phone networks to exchange information needed for call routing and text messaging. Attackers can exploit vulnerabilities in SS7 to intercept SMS messages, including OTPs. Since this protocol is fundamental to mobile networks worldwide, it's challenging to secure without major infrastructure updates.

##  The Right Authentication Strategy: Moving Beyond SMS 2FA

Implement these three pillars to protect your users:

#### Pillar 1 &mdash; Implement Stronger Two-Factor Authentication (2FA) Alternatives
- **FIDO2/WebAuthn Authentication**: Device-based authentication eliminates reliance on SMS.
- **TOTP (Time-Based One-Time Passwords) with an Authenticator App**:
- Apps like **Google Authenticator** and **Authy** remove carrier dependence.
- Attackers need physical access to the user’s device to generate 2FA codes.

#### Pillar 2 &mdash; Require Multi-Factor Authentication (MFA) for High-Risk Actions
- Enforce **MFA for sensitive transactions** (password changes, fund transfers, adding new devices).
- Use **risk-based authentication** to prompt extra verification only when login behavior seems suspicious.

#### Pillar 3 &mdash; Implement Robust Session Management
- **Limit session lifetimes**: Prevent long-lived sessions from being exploited.
- **Auto-log out users when a phone number or device change is detected**.
- **Use SuperTokens to handle secure, scalable session management.**

## How SuperTokens Helps Secure Authentication Against SIM Swapping
Not everything is grim. SuperTokens provides tools that help businesses minimize the risk of SIM swapping attacks.

**If you are ready to take action and make your business more secure, here is how SuperTokens is ready to help.**

### SuperTokens Secure Authentication Alternatives
1. **Passwordless Authentication:** Magic links and biometric authentication eliminate SMS-based risks.
2. **Adaptive MFA:** Risk-based authentication detects abnormal login patterns and adds an extra verification layer.
3. **Session Hijack Detection:** If a SIM swap occurs, SuperTokens detects mismatched device fingerprints and terminates unauthorized sessions.

### Seamless Integration for Scalable CIAM Security
SuperTokens integrates seamlessly into existing authentication flows, without disrupting the user experience. Its API-first architecture ensures compatibility with OAuth 2.0, OpenID Connect, and enterprise SSO solutions, providing flexibility for various authentication needs. Additionally, SuperTokens offers a lower-cost alternative to proprietary CIAM solutions while allowing full customization.

## Implement These Best Practices to Block SIM Swap Attacks
1. Ditch SMS 2FA as the default authentication method.
2. Enforce strong MFA (TOTP, WebAuthn) across high-risk actions.
3. Monitor and auto-flag unusual login behaviors.
4. Use secure session management tools like SuperTokens.
5. Educate users on social engineering risks.

## Final Thoughts: Secure Your Authentication System Before It’s Too Late
Unfortunately, businesses can no longer rely on SMS-based authentication to protect user accounts. But with tools like SuperTokens, you can protect your users from SIM swapping and other account takeovers.

Start by upgrading your authentication system today &mdash; your users' security depends on it.