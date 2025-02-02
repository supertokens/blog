---
title: "Top Password Cracking Techniques and How to Protect Against Them 🔐"
description: "Learn the most common password cracking techniques used by hackers and practical strategies to secure your accounts from such threats."
date: "2025-01-27"
# cover: "passkey-authentication.png"
category: "featured"
author: "Maria Shimkovska"
---

You'd think your password is safe, right? After all, you added a capital letter, a number, an even an exclamation point at the end. So what could possibly go wrong? 

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

Password cracking can be done manually by guessing and typing random passwords or automatically using software that runs algorithms to figure out the password by trying out many possible combinations.

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
* In 2014 Apple upped its iCloud security because of what is believed to have been a [brute force attack](https://www.tripwire.com/state-of-security/password-brute-force-attacks-threaten-millions-of-app-users) on its users, specifically celebrity accounts. 
* In 2021, T-Mobile discovered a [massive data breach](https://www.atg.wa.gov/news/news-releases/ag-ferguson-files-lawsuit-against-t-mobile-massive-data-breach) on their accounts, impacting more than 79 million consumers, because of weak passwords protecting accounts that held important user data. 

#### Protecting Against Brute-Force & Guessing Attacks 
✅ Use long and complex passwords with a mix of letters, numbers, and symbols. </br>
✅ Enable 2-Factor Authentication (2FA)</br>
✅ Avoid using personal information for your passwords.</br>
✅ Use a password manager to generate and store strong passwords.</br>

### Dictionary Attacks 📚
A **dictionary attack** is when an attacker uses a list of words to try and guess a password. They are a type of brute-force attack, which is when an attacker tries every possible password until they find the correct one. 

Dictionary attacks exploit people’s tendency to use and reuse simple and predictable passwords. A lot of dictionary attack word lists also include leaked passwords that people have used (and probably still do).

#### Dictionary Attack Example 
A hacker may want to break into a social media account. They will have a list of words to try, and then try a combination of those words. Unlike a brute force attack where the attacker will try every character combination like `password123`, `password124`, `password125`, in a dictionary attack they may try something like `mypassword`, `password`, `mybestpassword`, or `mysupersecretpassword`. They may also try to substitute some letters with alternative numbers like using `3` for `e` or using `@` for `a`. 

#### Infamous Examples of Real World Dictionary Attacks 
* In 2013 Adobe suffered a massive data breach that indicated it may have been a dictionary attack. Around 153 million user records were stolen, making it one of the biggest data breaches involving a software company. 

#### Protecting Against Dictionary Attacks
✅ Use randomly generated passwords with a mix of letters, numbers, and symbols.</br>
✅ Enable 2-Factor Authentication </br>

> **Note:** The difference between dictionary and brute force attacks is that dictionary attacks use a list of words to guess a password, while brute force attacks use a combination of characters.

### Hybrid Attacks 📚+💥
A **hybrid attack** is when an attacker uses a combination (hybrid) of dictionary attacks and brute-force attacks to cover even more ground to guess a password. 

This is typically an effective attack because users often choose a predictable password, like a common word, and add some character or numbers to the end. 

#### Protecting Against Hybrid Attacks
✅ Use randomly generated and long passwords with a combination of letters, numbers, and symbols. </br>

### Rainbow Table Attacks 🌈
A **rainbow attack** is a type of cyber attack where our cybervillains compare the hashes they stole to precomputed hashes they have from a table. This lets them reconstruct the original password and find out what it is in plaintext. The plaintext password is then used to gain unauthorized access to an account. They are faster than brute force attacks because they require less computational power than brute force attacks. 

> **Note:** It’s called a rainbow table because it contains the entire spectrum of possibilities. It ends up looking like a rainbow. 

#### Infamous Examples of Real World Rainbow Attacks 
* In 2012, hackers infiltrated LinkedIn and stole over 110 million hashed passwords. The main reason why the breach was considered unsafe for users despite the passwords being hashed was because the encryptions were weak. 

#### Protecting Against Rainbow Table Attacks
✅ In addition to hashing passwords, make sure they are salted as well. A salt is a random string of data added before the hashing process which results in different hashes even if the passwords are the same in plaintext. </br>
✅ Enforce strong passwords.</br>
✅ Change your passwords somewhat regularly (you can decide what regular is to you, but make sure you change them up). </br>

### Phishing Attacks 🎣 
A phishing attack is when an attacker uses social engineering (deception to appear like a legitimate source) via email to aim the victims to divulge their passwords (or other sensitive information).

Types of phishing attacks: 
* **Spear phishing:** Attackers use personalized information about the victims to trick them. 
* **Whaling:** A type of spear phishing targeting high level executives. 
* **Smishing:** Phishing attacks carried via text messages. 
* **Vishing:** Phishing attacks carried via phone calls. 

#### Infamous Examples of Real World Phishing Attacks 
* Between 2013 and 2015 Google and Facebook had pretty nasty attacks that cost them about $100 million. The attackers pretended to be someone else, a supplier they trusted, and requested invoices that were then paid by both companies. 
* In 2020, there was a smishing campaign which used the United States Post office as a front for the cyberattack. The attackers send text messages to people telling them to click on a link with important information about upcoming deliveries. As a result, the link was actually used to steal their Google credentials. **This attack is still widely used today.**

#### Protecting Against Phishing Attacks
✅ Educate users about phishing emails. </br>
✅ Don't share your passwords with people. They are yours to keep. It's between you and your password manager. </br>

### Credential Stuffing 🛠
**Credential stuffing** is when an attacker uses a list of leaked passwords (typically from data breaches) to try and gain access to other apps the users may be signed up for. Attackers rely on the knowledge that users reuse their passwords, so they may have used those passwords on other apps. Sadly, they’re right. We do reuse our passwords.

Credential stuffing attacks are particularly dangerous because of the volume of data breaches. 

#### Infamous Examples of Real World Credential Stuffing Attacks 
* In late 2016, hackers accessed Uber's private GitHub repository using compromised employee credentials and found AWS keys that allowed them to steal data from millions of users and drivers. 

#### Protecting Against Credential Stuffing Attacks
✅ Don't reuse passwords. Use unique passwords for each account. </br>
✅ Enable 2-factor Authentication. </br>
✅ Enforce password changes. </br>


### Malware (Keylogging, Screen Scraping) ⌨️ 🖥️
**Malware** is just any computer program that is built for unethical purposes, like keylogging or screen scraping.

**Keylogging** is a type of surveillance malware an attacker uses that records your keystrokes without your knowledge. The information is then sent to the attacker who can use it to gain access to your accounts and sensitive information like your passwords or credit card numbers. 

**Screen scraping** is a type of malware which takes screenshots of an infected computer, enabling attackers to gain unauthorized access without using password cracking tools.  

#### Infamous Examples of Real World Malware Attacks 
* 

#### Protecting Against Malware Attacks
✅ Keep notice if your browser is more sluggish than normal. A sluggish browser could be a sign of malware. Another signs to keep looking for are if your cursor is disappearing, if there is lag in mouse movement, or delayed keystrokes between typing.</br>
✅ Make sure you have a good antivirus program.</br>
✅ Malware can be installed via your hardware too so make sure your computers are in a safe space. Don't leave them unattended in public.</br>

### Shoulder Surfing and Visual Hacking 👀
**Shoulder surfing (visual hacking)** is a type of social engineering tactic an attacker uses where they literally look over someone’s shoulder to steal their personal information, like their passwords. It’s why grocery store workers tend to look away when you’re entering your credit card pin when you pay. It’s important to pay attention to your surroundings when entering your password and you’re in a public space.

#### Infamous Examples of Real World Shoulder Surfing Attacks 
* 

#### Protecting Against Shoulder Surfing Attacks
✅ </br>
✅ </br>

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
* Use a random string of lowercase and uppercase letters, numbers, and symbols.
* You can create a memorable  phrase of 4-7 unrelated words called “passphrase”. Passphrases are often used in physical cryptowallets (example: **Caterpillar Orange Socks Running Ocean Beard Coffeemug**). You can use spaces to strengthen the passphrase, as shown in the example.  
3. **Make them unique**
* Use a different password for every account. 
* Don't reuse your password, please. 🙏

> You can test the strength of your password using tools like [**PasswordMonster**](https://www.passwordmonster.com/), to see how long a password may take to crack. As a precaution, don’t actually put your real password in. Your password is just for you, and you should never blindly trust websites. 

### Multi-Factor Authentication (MFA) 💳
**Multi-Factor Authentication (MFA)** is an authentication method that requires more than two forms of identity verification before allowing a user access to an account or network.

Popular additional verifications are: 
* One-time passcodes (OTPs)
* Time-based one-time passcodes (TOTP)
* Biometric verification
* Push notifications

> MFA can often be confused with 2FA (Two-Factor Authentication), because they are similar. 2FA can be considered a type of MFA, requiring just two verification methods instead of one. If you want to read more about the differences between them we have an [article](https://supertokens.com/blog/mfa-best-practices) covering that. 

### Password Managers 🗝️

Remembering strong passwords is not possible. Especially since you need a different one for every account you have. 🤯  

That’s why you can use a **password manager**, like 1Password or LastPass, to store them. A password manager is an app on your phone or computer that stores your passwords for you in an encrypted vault.

Another benefit that password managers provide is that they can generate random passwords for you so you won’t even need to come up with them yourself. 👏

> **Bonus:** They will even let you know if you have reused a password or if your password is weak. How nice!

### Rate-Limiting and Lockout Mechanisms 🛑
**Rate-limiting** is a technique that controls the number of requests that can be made to a network. It’s used to protect systems against malicious attacks like Denial-of-Service, and from overloading a system.

**Lockout mechanism**  is a security feature that locks a user’s account after a certain number of incorrect password attempts. Accounts are usually locked after 3 to 5 unsuccessful attempts to login. It’s used to prevent brute force and automated attacks.

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

Phew! That was a lot. Let’s take a closer look at the tools and features SuperTokens provides to enhance account security: 

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
SuperTokens integrates with MFA to provide an additional layer of security. By requiring multiple forms of verification, such as email or SMS-based one-time passwords (OTPs), MFA ensures that even if a password is compromised, unauthorized access is still prevented. This approach strengthens account protection and makes it significantly harder for attackers to breach accounts. 💪

### Session Management
SuperTokens securely manages session tokens to protect against threats like session hijacking and fixation. By implementing measures such as access token blacklisting, anti-csrf (cross-site request forgery), token rotation, and cookie consent, it ensures that user sessions remain secure. This prevents attackers from stealing or reusing tokens to gain unauthorized access. 🔒

## Common Misconceptions About Password Security
Here are some myths about password security:
* **"Long passwords are always secure"** – It’s a common misconception that long passwords are safe. It’s important to note that passwords need to be randomized and include a combination of characters, numbers, and special characters in order to be more secure.
* **“Password strength is not important if I reset them often”** - When people reset their passwords, they tend to use a variation of their old ones. This still leaves you vulnerable to password cracking. Changing passwords often will only protect accounts if the new ones are strong and unique. 
* **“I don’t need MFA if my password is strong”** - While much harder to do, strong passwords can still be compromised. It’s important to implement MFA when possible. 
* **"Biometrics replace passwords"** –Passwords are still essential. People don’t always trust providing their biometrics like facial recognition or fingerprints. Also, not all devices support biometric authentication, for example logging to your social media account from your web browser on your computer.

## Tools to Strengthen Password Security
To strengthen password security, one of the most effective tools to use is a password manager. They generate and store strong and unique passwords for each account, making managing them seamless. Popular choices of password managers are 1Password, Bitwarden, Keeper, Dashlane, and Nordpass. You can read more about each in [CNET’s “Best Password Manager 2025”](https://www.cnet.com/tech/services-and-software/best-password-manager/) review. 

Additionally there are tools to check if your information has been leaked, like Have I Been Pwned and Google’s Password Checkup. Password managers also have integrated tools that check and inform you if your passwords have been compromised.

## Conclusion
Password security is one of the most critical aspects of safeguarding personal information and organizational data. Understanding how passwords can be cracked (hacked) and the techniques used by attackers is the first step in building a robust defense. 

By adopting best practices like using strong and unique passwords, enabling MFA, and leveraging tools like password managers, you can significantly reduce your exposure to password-related attacks. Ultimately, staying informed and proactive is key to ensuring the safety of your systems. 


