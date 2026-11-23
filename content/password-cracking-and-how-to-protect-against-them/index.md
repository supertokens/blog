---
title: "Top Password Cracking Techniques and How to Protect Against Them"
description: "How attackers crack passwords, how fast it really is on current GPUs, and how to defend against it, with current NIST SP 800-63B-4 password rules."
date: "2025-02-05"
updated: "2026-11-23"
cover: "password-cracking.png"
category: "featured"
author: "Maria Shimkovska"
---

**Password cracking is recovering passwords by guessing them, either online against a login page or offline against stolen password hashes. Attackers try leaked and common passwords first, then dictionary words with variations, then brute force. The best protection is a long, unique password from a password manager, plus MFA, breached-password checks and slow, salted hashing such as Argon2id or bcrypt.**

*Last updated 23 November 2026. Cracking speeds come from the [Hive Systems 2026 Password Table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) (July 2026) and a [hashcat benchmark of the NVIDIA RTX 5090](https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c) (February 2025). Password rules follow [NIST SP 800-63B-4](https://csrc.nist.gov/pubs/sp/800/63/b/4/final) (July 2025).*

You'd think your password is safe, right? After all, you added a capital letter, a number, and even an exclamation point at the end. So what could possibly go wrong? 

Well, quite a lot. Hackers aren't just guessing birthdays and pet names anymore. They have entire toolkits dedicated to cracking passwords faster than you could say "forgot my password". You'd think they have something better to do, but here we are. 

From brute force attacks to phishing scams and malware, these cybervillains have some pretty clever and sometimes very simple (but effective) ways to break into accounts. 

Let's dive into the world of password cracking! 🕵️‍♂️💻

```toc
tight: true
toHeading: 3
```

## Understanding Password Cracking 🧑‍💻

**Password cracking** is the process of using tools, techniques, or software to try and uncover a password. 

It usually involves guessing or testing possible passwords, often by decrypting or exploiting weak password hashes. While password cracking can be used for legitimate purposes, like helping users recover lost passwords, it’s often used by malicious hackers that want to steal your password and gain unauthorized access to accounts. 

There are two very different situations:

* **Online attacks** happen against a live login page. Every guess is a request to your server, so rate limiting, lockouts, bot detection and MFA can stop them.
* **Offline attacks** happen after a data breach, when the attacker has a copy of the stored password hashes. They can make guesses on their own hardware as fast as it allows, and nothing on your login page can slow them down. Here, the only defenses are how the passwords were hashed and how long and random they are.

Let’s explore some common techniques these cybervillains use to crack your passwords so we know how to get ahead of them. 🦹

![A cartoon penguin wearing sunglasses, typing intensely on a keyboard like a hacker, with a dramatic vibe](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDRiN2NhdTlmbjZmb3E1MDVwaWFzY2ZvaDEyeDIza2ozaTkwdGVvbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/w6TZfG2ab2w7hP241a/giphy.gif)

## Common Password Cracking Techniques 🔍

### Brute Force & Guessing Attacks 💥
A **brute force attack** is when an attacker tries every possible combination of character to guess a password. In contrast, **guessing** relies on manually attempting likely passwords, often personal information like pet names or birthdays. 

While brute force attacks test all possibilities, guessing is a simpler but sometimes very effective approach because people are not great at choosing secure passwords (although that is improving so take that cybervillains!)

#### Brute Force Attack Example 🔓
A hacker may want to break into an online banking account. They will use an automated tool that tries every possible combination of characters (e.g., `aa`, `ab`, `ac` ... or `123456`, `123457`, and so on). If your password is weak, like `password123`, the tool can crack it within seconds.

#### Guessing Attack Example 🤔
A hacker may target your social media account. They may know you love your dog, Sherlock Bones, and that he was born in 2017. So they will try passwords like `SherlockBones2017`, `ilovesherlockbones`, `SherlockBones17!`.

#### Infamous Examples of Real World Brute Force Attacks
* In August 2021, T-Mobile discovered a hacker in its internal network who exposed the personal information of more than 79 million consumers. Washington State's Attorney General later said that ["in some cases, T-Mobile used obvious passwords"](https://www.atg.wa.gov/news/news-releases/ag-ferguson-files-lawsuit-against-t-mobile-massive-data-breach) to protect accounts with access to customer data. 

#### Protecting Against Brute-Force & Guessing Attacks 
✅ Use long, random passwords. Length matters more than complexity: each extra character multiplies the work for the attacker. </br>
✅ Enable 2-Factor Authentication (2FA)</br>
✅ Avoid using personal information for your passwords.</br>
✅ Use a password manager to generate and store strong passwords.</br>

### Dictionary Attacks 📚
A **dictionary attack** is when an attacker uses a list of words to try and guess a password. They are a type of brute-force attack, which is when an attacker tries every possible password until they find the correct one. 

Dictionary attacks exploit people’s tendency to use and reuse simple and predictable passwords. A lot of dictionary attack word lists also include leaked passwords that people have used (and probably still do).

#### Dictionary Attack Example 
A hacker may want to break into a social media account. They will have a list of words to try, and then try a combination of those words. Unlike a brute force attack where the attacker will try every character combination like `password123`, `password124`, `password125`, in a dictionary attack they may try something like `mypassword`, `password`, `mybestpassword`, or `mysupersecretpassword`. They may also try to substitute some letters with alternative numbers like using `3` for `e` or using `@` for `a`. 

#### Infamous Examples of Real World Dictionary Attacks 
* In 2013, attackers stole about [153 million Adobe user records](https://haveibeenpwned.com/breach/Adobe). Adobe had encrypted the passwords with 3DES instead of hashing them, and stored users' password hints in plain text. Identical passwords produced identical encrypted values, so researchers could match them against the hints and the most common passwords, which is essentially a dictionary attack in reverse. 

#### Protecting Against Dictionary Attacks
✅ Use randomly generated passwords, or a passphrase of several random words.</br>
✅ Enable 2-Factor Authentication </br>
✅ If you run a service, reject common and breached passwords at sign-up (a "blocklist"), as NIST requires. </br>

> **Note:** The difference between dictionary and brute force attacks is that dictionary attacks use a list of words to guess a password, while brute force attacks use a combination of characters.

### Hybrid Attacks 📚+💥
A **hybrid attack** is when an attacker uses a combination (hybrid) of dictionary attacks and brute-force attacks to cover even more ground to guess a password. 

This is typically an effective attack because users often choose a predictable password, like a common word, and add some character or numbers to the end. 

#### Protecting Against Hybrid Attacks
✅ Use long, randomly generated passwords. Patterns like `Summer2026!` are the first thing hybrid attacks try. </br>

### Rainbow Table Attacks 🌈
A **rainbow table attack** is a type of cyber attack where our cybervillains compare the hashes they stole to a huge table of precomputed hashes. When a stolen hash matches, the table gives them the original password in plaintext, which they then use to log in. Rainbow tables trade storage for time: the hashing work was done in advance, so looking a hash up is much faster than cracking it from scratch.

> **Note:** Rainbow tables only work against **unsalted** hashes. A unique random salt per password means a precomputed table would have to be rebuilt for every single user, which makes them useless. 

#### Infamous Examples of Real World Rainbow Attacks 
* In 2012, hackers broke into LinkedIn and stole password hashes. About 6.5 million were posted online that year, and in 2016 a set of [117 million emails and passwords from the same breach](https://krebsonsecurity.com/2016/05/as-scope-of-2012-breach-expands-linkedin-to-again-reset-passwords-for-some-users/) was offered for sale. LinkedIn had stored the passwords as **unsalted SHA-1** hashes, a fast hash with no salt, so many were cracked quickly. 

#### Protecting Against Rainbow Table Attacks
✅ Hash passwords with a slow, salted password hashing algorithm (Argon2id, scrypt or bcrypt). A salt is a random string added before hashing, so the same password gives different hashes for different users. Learn more in [password hashing and salting](https://supertokens.com/blog/password-hashing-salting).</br>
✅ Use long, unique passwords.</br>

### Phishing Attacks 🎣 
A **phishing attack** is when an attacker uses social engineering (deception to appear like a legitimate source) via email to aim the victims to divulge their passwords (or other sensitive information).

Types of phishing attacks: 
* **Spear phishing:** Attackers use personalized information about the victims to trick them. 
* **Whaling:** A type of spear phishing targeting high level executives. 
* **Smishing:** Phishing attacks carried via text messages. 
* **Vishing:** Phishing attacks carried via phone calls. 

#### Infamous Examples of Real World Phishing Attacks 
* Between 2012 and 2014, a man sent phishing emails that looked like they came from Apple or Google, asking for usernames and passwords. He got into at least 50 iCloud and 72 Gmail accounts, many belonging to celebrities, and was [sentenced to 18 months in prison](https://www.justice.gov/usao-mdpa/pr/lancaster-county-man-sentenced-18-months-federal-prison-hacking-apple-and-google-e-mail) in 2016. This was part of the 2014 "celebgate" photo leaks, which were first rumored to be a brute force attack on iCloud but came from phishing. 

#### Protecting Against Phishing Attacks
✅ Educate users about phishing emails. </br>
✅ Use phishing-resistant MFA such as passkeys, which only work on the real website. See [phishing-resistant MFA](https://supertokens.com/blog/phishing-resistant-mfa). </br>
✅ Don't share your passwords with people. They are yours to keep. It's between you and your password manager. </br>

### Credential Stuffing 🛠
**Credential stuffing** is when an attacker uses a list of leaked passwords (typically from data breaches) to try and gain access to other apps the users may be signed up for. Attackers rely on the knowledge that users reuse their passwords, so they may have used those passwords on other apps. Sadly, they’re right. We do reuse our passwords.

Credential stuffing attacks are particularly dangerous because of the volume of data breaches. 

#### Infamous Examples of Real World Credential Stuffing Attacks 
* In late 2016, hackers accessed Uber's private GitHub repository using compromised employee credentials and found AWS keys that allowed them to steal data from millions of users and drivers. 
* In 2024, attackers logged in to more than 100 companies' Snowflake cloud database accounts using passwords stolen by infostealer malware, some from infections dating back to 2020. According to [Mandiant's investigation](https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion), the accounts didn't have MFA, so a valid username and password was all the attackers needed. Read more in [What is credential stuffing?](https://supertokens.com/blog/what-is-credential-stuffing) 

#### Protecting Against Credential Stuffing Attacks
✅ Don't reuse passwords. Use unique passwords for each account. </br>
✅ Enable 2-factor Authentication. </br>
✅ If you run a service, check new passwords against breached-password lists and rate-limit login attempts. Force a password change only when there's evidence it was compromised. </br>


### Malware (Keylogging, Screen Scraping) ⌨️ 🖥️
**Malware** is just any computer program that is built for unethical purposes, like keylogging or screen scraping.

**Keylogging** is a type of surveillance malware an attacker uses that records your keystrokes without your knowledge. The information is then sent to the attacker who can use it to gain access to your accounts and sensitive information like your passwords or credit card numbers. 

**Screen scraping** is a type of malware which takes screenshots of an infected computer, enabling attackers to gain unauthorized access without using password cracking tools.  

#### Infamous Examples of Real World Malware Attacks 
* Researchers at [HYAS Labs created BlackMamba](https://www.darkreading.com/endpoint-security/ai-blackmamba-keylogging-edr-security), a smart proof-of-concept malware that changes its code each time it runs, making it invisible to most security systems. It works like a keylogger, stealing sensitive information. Once the data is stolen, attackers can use common and trusted collaboration apps like Microsoft Teams to send the stolen information. While not an incident yet, it shows how AI can have the ability to create pretty scary malware. 
* Infostealer malware is now one of the main sources of stolen passwords. In the 2024 Snowflake campaign described above, [Mandiant found](https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion) that most of the credentials the attackers used came from earlier infostealer infections, often on personal computers.

#### Protecting Against Malware Attacks
✅ Keep notice if your browser is more sluggish than normal. A sluggish browser could be a sign of malware. Another signs to keep looking for are if your cursor is disappearing, if there is lag in mouse movement, or delayed keystrokes between typing.</br>
✅ Make sure you have a good antivirus program.</br>
✅ Be wary of opening unexpected attachments.</br>
✅ Malware can be installed via your hardware too so make sure your computers are in a safe space. Don't leave them unattended in public.</br>
✅ Embrace 2-Factor Authentication.</br>

### Shoulder Surfing and Visual Hacking 👀
**Shoulder surfing (visual hacking)** is a type of social engineering tactic an attacker uses where they literally look over someone’s shoulder to steal their personal information, like their passwords. It’s why grocery store workers tend to look away when you’re entering your credit card pin when you pay. While it may sound like something out of a cartoon, shoulder surfing can also be done from a longer distance using binoculars. 

#### Infamous Examples of Real World Shoulder Surfing Attacks 
* In 2018, a [Los Angeles man got convicted](https://www.justice.gov/usao-cdca/pr/la-man-convicted-atm-shoulder-surfing-allowed-him-withdraw-cash-after-bank-customers) of 3 counts of aggravated identity theft for using stolen PINs to make fraudulent ATM withdrawals from elderly Bank of America customers. The man used a **"shoulder surfing"** technique, secretly watching victims enter their PINs and then withdrawing cash when they left without ending their sessions. 

#### Protecting Against Shoulder Surfing Attacks
✅ Pay attention to your surroundings when you enter sensitive information like passwords.</br>
✅ Make sure you have stars(*****) enabled when entering a password and you are in a public place. </br>
✅ Don't talk about confidential information on the phone in public spaces. </br>
✅ Lock your devices when you leave them. </br>

## How Fast Can a Password Be Cracked Today? ⏱️

How long a password survives an offline attack depends on three things: **how it was hashed**, **how long and random it is**, and **whether it's already in a breach list**.

### Hive Systems 2026 Password Table

Hive Systems publishes a yearly table of how long a randomly generated password takes to brute force. The [2026 edition (published 14 July 2026)](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) assumes passwords hashed with **bcrypt at work factor 10**, attacked by **16 rented NVIDIA RTX 5090 GPUs**:

| Randomly generated password | Time to crack (bcrypt, 16 × RTX 5090) |
|---|---|
| 8 characters, lowercase letters only | About 2 weeks |
| 8 characters, upper and lowercase letters, numbers and symbols | 132 years |

Hive notes that the 8-character, all-character-types figure has dropped from 225 years (2024, re-run at the same settings) to 164 years (2025) to 132 years (2026), because GPUs keep getting faster. Hive also found that a $30,000 NVIDIA H200 AI accelerator was no better, and usually worse, at cracking passwords than the RTX 5090 gaming card.

> **Important:** These times only apply to **randomly generated** passwords that **have never appeared in a breach**. Hive cracked a bcrypt-protected, symbol-heavy password from its own table (`o#mA24ft`) in about three seconds on a single RTX 5090, once predictable guesses were tried first. Attackers always try common and leaked passwords before brute force.

### Why the hashing algorithm matters most

The same password can fall in seconds or survive for centuries depending on how the website stored it. The table below uses the [hashcat benchmark of a single RTX 5090](https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c) (hashcat 6.2.6, February 2025) to work out how long it takes to try **every** possible password. "Any kind" means any of the 95 printable keyboard characters. On average, an attacker finds the password in about half that time.

| Hash and speed | 8 lowercase | 8 of any kind | 12 of any kind | 16 lowercase |
|---|---|---|---|---|
| **NTLM**<br>340.1 billion/s | Under 1 sec | 5.4 hours | ~50,000 years | ~4,000 years |
| **MD5**<br>220.6 billion/s | Under 1 sec | 8.4 hours | ~78,000 years | ~6,300 years |
| **SHA-256**<br>28.4 billion/s | 7.4 sec | 2.7 days | ~600,000 years | ~49,000 years |
| **bcrypt**, work factor 10<br>~9,500/s* | ~254 days | ~22,000 years | Not feasible | Not feasible |

*\*The benchmark measured bcrypt at work factor 5 (304.8 thousand guesses per second). Each +1 in work factor doubles the work, so work factor 10 is 32 times slower. That matches Hive's measured speed of about 8,700 per GPU.*

Three lessons from these numbers:

1. **Fast hashes (MD5, SHA-1, SHA-256, NTLM) are not for passwords.** They're designed to be fast, which is exactly what an attacker wants.
2. **Length beats complexity.** Sixteen lowercase letters hold out far longer than eight characters with symbols, and they're easier to type.
3. **Random beats clever.** `P@ssw0rd2026!` looks complex but sits near the top of every attacker's guess list.

## What NIST SP 800-63B-4 Says About Passwords 📏

In July 2025, the US National Institute of Standards and Technology published the final [SP 800-63B-4](https://csrc.nist.gov/pubs/sp/800/63/b/4/final), its digital identity guidelines. Many companies and governments follow it. If you build a login system, these are the key password rules (from [Section 3.1.1.2](https://pages.nist.gov/800-63-4/sp800-63b.html)):

| Rule | What NIST says |
|---|---|
| Minimum length | At least **15 characters** when the password is the only factor; at least **8** when it's used with MFA |
| Maximum length | Allow at least **64 characters** |
| Characters | Accept all printable ASCII characters, spaces and Unicode |
| Composition rules | **Do not** require mixes like "one uppercase, one number, one symbol" |
| Periodic changes | **Do not** force users to change passwords on a schedule. Force a change only if there's evidence of compromise |
| Blocklist | **Check** new passwords against a list of common, expected and breached passwords |
| Hints and security questions | **Do not** allow password hints or "What was your first pet's name?" questions |
| Password managers | **Allow** password managers, autofill and paste |
| Failed attempts | Limit consecutive failed attempts on one account to **no more than 100** ([Section 3.2.2](https://pages.nist.gov/800-63-4/sp800-63b.html)) |
| Storage | Use a salted, slow password hashing scheme. Salts must be at least 32 bits |

In short: **length over complexity, no forced rotation, and screening against breached passwords.** For everyday users, [CISA](https://www.cisa.gov/secure-our-world/use-strong-passwords) recommends passwords of at least 16 characters that are random and unique, stored in a password manager.

## Modern Security Measures to Prevent Password Cracking 🛡️
Don't lose hope. While cybervillains are clever and sneaky, so are we. They can attack and we can protect. Here are some ways you can stay several steps ahead of any cyber criminal out there. 

### Strong Password Policies 🔑
Almost all of the password cracking techniques covered can be prevented by a strong password. What is a strong password then? 

According to [America’s Cyber Defense Agency](https://www.cisa.gov/secure-our-world/use-strong-passwords), a strong password is long, random, and unique with a password manager.

> Avoid simple passwords like pet names and birthdays. Usually easy to remember passwords tend to be weak. Weak passwords are very easy to crack.

You can strengthen your passwords using these steps: 
1. **Make them long**
* At least 16 characters, but longer passwords are more secure.
2. **Make them random**
* Let a password manager generate a random password for you.
* You can create a memorable  phrase of 4-7 unrelated words called “passphrase”. Passphrases are often used in physical cryptowallets (example: **Caterpillar Orange Socks Running Ocean Beard Coffeemug**). You can use spaces to strengthen the passphrase, as shown in the example.  
3. **Make them unique**
* Use a different password for every account. 
* Don't reuse your password, please. 🙏

> Online "password strength" checkers can give you a rough idea, but never type your real password into one. Your password is just for you, and you should never blindly trust websites. 

### Multi-Factor Authentication (MFA) 💳
**Multi-Factor Authentication (MFA)** is an authentication method that requires two or more forms of identity verification before allowing a user access to an account or network. Even a cracked password isn't enough to log in.

Popular additional verifications are: 
* One-time passcodes (OTPs)
* Time-based one-time passcodes (TOTP)
* Biometric verification
* Push notifications
* Passkeys and security keys, which are phishing-resistant (see [what are passkeys?](https://supertokens.com/blog/what-are-passkeys))

> MFA can often be confused with 2FA (Two-Factor Authentication), because they are similar. 2FA is a type of MFA that uses exactly two verification methods. If you want to read more about the differences between them we have an [article](https://supertokens.com/blog/mfa-best-practices) covering that. 

### Password Managers 🗝️
Remembering strong passwords is not possible. Especially since you need a different one for every account you have. 🤯  

That’s why you can use a **password manager**, like 1Password or Bitwarden, to store them. A password manager is an app on your phone or computer that stores your passwords for you in an encrypted vault.

Another benefit that password managers provide is that they can generate random passwords for you so you won’t even need to come up with them yourself. 👏

> **Bonus:** They will even let you know if you have reused a password or if your password is weak. How nice!

### Rate-Limiting and Lockout Mechanisms 🛑
**Rate-limiting** is a technique that controls the number of requests that can be made to a network. It’s used to protect systems against malicious attacks like Denial-of-Service, and from overloading a system.

**Lockout mechanism** is a security feature that locks a user’s account after a certain number of incorrect password attempts. It’s used to prevent brute force and automated attacks. Be careful with very low limits: an attacker can deliberately lock real users out. NIST sets **100** consecutive failed attempts as the upper limit (lower limits are allowed), and suggests bot-detection challenges, increasing wait times after failures and risk-based checks so attackers can't easily lock real users out.

### Session Management 🔒 
**Session hijacking** is a major security risk where attackers take over user sessions by stealing or guessing session tokens, bypassing even multi-factor authentication (MFA). This gives them access to accounts, leading to data theft, financial loss, and damage to reputation.

**Good session management** can help prevent this. Using encrypted session tokens, setting shorter session times, and ensuring secure login methods are effective ways for organizations to reduce risks and protect against such attacks.

### Monitoring Accounts and Alerting Users 🚨
**Monitoring** users accounts for suspicious activity and alerting them when something seems wrong is another important measure to keep your systems secure. To do so you can: 
* Keep track of how many failed logins accounts have, which can indicate that someone is trying to gain unauthorized access. 
* Monitor if someone is logging in from a new location, which can indicate that someone who is not the user has logged in. 
* Monitor if someone is logging in from a new device, which can indicate that (once again) someone is trying to gain unauthorized access. 

In all of these cases you need to inform the user, whether or not the accounts have actually been hacked. If the user is in a new location and they are logging in for the first time, the alert may be triggered and you may inform them. They can simply ignore the alert if they are the right person. 

### Monitoring Your GitHub For Leaked Passwords 🥸
Ok, so people make mistakes and sometimes accidents happen. It’s not unheard of for developers to sometimes push sensitive information to GitHub and not notice. Monitoring your repositories for sensitive information will help mitigate that by changing the passwords before they get hacked. 

### Pen Testing 🖋️💻
**Penetration testing (pen testing)** is a security practice where ethical hackers (cybersecurity experts) attempt to hack into a system (with permission!!!) to assess its security and check where it might be vulnerable, before hackers find the vulnerabilities first. 

Pen testers are hired to check for password vulnerabilities where the testers will employ the same tactics hackers would. They would then report to the company and provide them with a detailed report of their findings. 

### Consistent Training 👩‍🏫
Even with all the tools and techniques we explored, at the end of the day the weakest link is people. **Training** employees and users on the importance of password hygiene is vital to prevent password cracking. Something as simple as leaving your laptop unattended can be a security risk. Which is why some companies require users to log out of their computers before leaving their desks.

## How SuperTokens Protects Against Password Cracking
Phew! That was a lot. Let’s take a closer look at the tools and features SuperTokens provides to enhance account security. Most of the detection features below are part of the [SuperTokens attack protection suite](https://supertokens.com/docs/additional-verification/attack-protection-suite/introduction).

### Slow, Salted Password Hashing
SuperTokens hashes passwords with **bcrypt** by default (work factor 11, one step above Hive's assumption), and you can switch to **Argon2** and tune it to your hardware. See [password hashing in SuperTokens](https://supertokens.com/docs/authentication/email-password/password-hashing).

### Brute Force Attack Detection
Tracks repeated actions like login attempts or password resets. If too many attempts happen in a short time, it blocks them to protect accounts from attackers.

### Password Breach Detection
Checks passwords against a database of leaked passwords to see if they've been leaked before. This helps keep accounts safe by avoiding weak passwords.

### New Device Detection
Recognizes when a user logs in from a new and previously unseen device. This helps find possible unauthorized logins.

### Device Count Tracking
Monitors the number of unique devices associated with a user account. This helps spot unusual account use. 

### Requester Detection
Identifies and remembers devices and requester details, even if they try to hide. This helps track the same device across multiple login attempts for better security.

### Multi-Factor Authentication (MFA)
**SuperTokens** [supports MFA](https://supertokens.com/docs/additional-verification/mfa/introduction) to provide an additional layer of security. By requiring multiple forms of verification, such as TOTP authenticator apps, email or SMS one-time passwords (OTPs), or passkeys, MFA ensures that even if a password is compromised, unauthorized access is still prevented. This approach strengthens account protection and makes it significantly harder for attackers to breach accounts. 💪

### Session Management
**SuperTokens** securely manages session tokens to **protect against threats like session hijacking and fixation**. By implementing measures such as access token blacklisting, anti-csrf (cross-site request forgery), token rotation, and cookie consent, it ensures that user sessions remain secure. This prevents attackers from stealing or reusing tokens to gain unauthorized access. 🔒

## Common Misconceptions About Password Security
Here are some myths about password security:
* **"Complexity rules make passwords strong"** – Rules like "one uppercase letter, one number, one symbol" mostly produce predictable passwords like `Password1!`. NIST now says services **should not** impose composition rules. Length and randomness matter far more.
* **"Long passwords are always secure"** – Length helps a lot, but a long password that is a famous quote, song lyric or a password you've used before can still be guessed. Long **and** random (or several random words) is the goal.
* **“Changing my password every few months keeps me safe”** - When people are forced to change passwords, they tend to make small, predictable changes (`Spring2026!` → `Summer2026!`). NIST says services **should not** force periodic changes. Change a password when there's a reason to, such as a breach. 
* **“I don’t need MFA if my password is strong”** - While much harder to do, strong passwords can still be compromised. It’s important to implement MFA when possible. 
* **"Biometrics replace passwords"** –Passwords are still essential. People don’t always trust providing their biometrics like facial recognition or fingerprints. Also, not all devices support biometric authentication, for example logging to your social media account from your web browser on your computer.

## Tools to Strengthen Password Security
To strengthen password security, one of the most effective tools to use is a password manager. They generate and store strong and unique passwords for each account, making managing them seamless. Popular choices of password managers are 1Password, Bitwarden, Keeper, Dashlane, and Nordpass. You can compare them in [CNET’s best password manager review](https://www.cnet.com/tech/services-and-software/best-password-manager/). 

Additionally there are tools to check if your information has been leaked, like Have I Been Pwned and Google’s Password Checkup. Password managers also have integrated tools that check and inform you if your passwords have been compromised.

## Frequently Asked Questions

### How long does it take to crack an 8-character password?
It depends on how the password was stored. According to the Hive Systems 2026 Password Table, a random 8-character password using all character types takes about 132 years to brute force when hashed with bcrypt, using 16 RTX 5090 GPUs. If the same password was stored with a fast hash like MD5, one RTX 5090 can try every possibility in about 8 hours. If it has appeared in a breach, it can be guessed in seconds.

### How long should my password be?
CISA recommends at least 16 characters, and NIST SP 800-63B-4 requires services to accept at least 15 characters when a password is used on its own. Longer is better, as long as it's random and unique. A password manager makes long random passwords easy.

### Should I change my passwords regularly?
Not on a fixed schedule. NIST SP 800-63B-4 says services should not force periodic password changes, because people respond with small, predictable changes. Change a password right away if it has been exposed in a breach, if you reused it elsewhere, or if you suspect someone else knows it.

### What is the best way to store passwords in a database?
Use a slow, salted password hashing algorithm, never plain text, encryption or a fast hash like MD5 or SHA-256. OWASP recommends Argon2id (for example with 19 MiB of memory, 2 iterations and a parallelism of 1), or bcrypt with a work factor of at least 10 for older systems.

### Does MFA stop password cracking?
MFA doesn't stop a password from being cracked, but it stops a cracked password from being enough to log in. Phishing-resistant methods like passkeys and security keys give the strongest protection, because they can't be typed into a fake website.

### What is the difference between online and offline password cracking?
Online cracking means guessing against a live login page, where rate limiting, lockouts and MFA can stop it. Offline cracking happens after attackers steal a database of password hashes and guess on their own hardware, where only strong hashing and long, random passwords help.

## Conclusion
Password security is one of the most critical aspects of safeguarding personal information and organizational data. Understanding how passwords can be cracked (hacked) and the techniques used by attackers is the first step in building a robust defense. 

By adopting best practices like using long and unique passwords, enabling MFA, and leveraging tools like password managers, you can significantly reduce your exposure to password-related attacks. Ultimately, staying informed and proactive is key to ensuring the safety of your systems. 

## Related Reading
- [Password Hashing and Salting Explained](https://supertokens.com/blog/password-hashing-salting)
- [What Is Credential Stuffing?](https://supertokens.com/blog/what-is-credential-stuffing)
- [MFA Best Practices](https://supertokens.com/blog/mfa-best-practices)
- [Phishing-Resistant MFA](https://supertokens.com/blog/phishing-resistant-mfa)
- [Passkeys vs Passwords](https://supertokens.com/blog/passkeys-vs-passwords)
