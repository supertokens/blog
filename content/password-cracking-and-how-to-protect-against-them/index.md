---
title: "Top Password Cracking Techniques and How to Protect Against Them 🔐"
description: "Learn the most common password cracking techniques used by hackers and practical strategies to secure your accounts from such threats."
date: "2025-01-27"
# cover: "passkey-authentication.png"
category: "featured"
author: "Maria Shimkovska"
---

Learn the most common password cracking techniques used by hackers and practical strategies to secure your accounts from such threats.

```toc
tight: true
toHeading: 3
```

## Understanding Password Cracking 🧑‍💻

**Password cracking** is the process of using tools, techniques, or software to try and uncover a password. It usually involves guessing or testing possible passwords, often by decrypting or exploiting weak password hashes. While password cracking can be used for legitimate purposes, like helping users recover lost passwords, it’s often used by malicious hackers that want to steal your password and gain unauthorized access to accounts. 

Password cracking can be done manually by guessing and typing passwords or automatically using software that runs algorithms to figure out the password.

Let’s explore some common techniques these supervillains use to crack your passwords. 🦹

## Common Password Cracking Techniques 🔍

### Guessing 🤔
An attacker may try to **guess** a password to gain access to a system. It’s probably the simplest way (granted can be difficult but not impossible) to figure out a password. This usually works better if a password is something personal like a loved one’s name or birthday. 

### Dictionary Attacks 📚
A **dictionary attack** is when an attacker uses a list of words to try and guess a password. They are a type of brute-force attack, which is when an attacker tries every possible password until they find the correct one. 

Dictionary attacks exploit people’s tendency to use and reuse simple and predictable passwords. 

### Brute Force Attacks 💥
A **brute force attack** is when an attacker tries every possible combination of character to guess a password. 

> **Note:** The difference between dictionary and brute force attacks is that dictionary attacks use a list of words to guess a password, while brute force attacks use a combination of characters. 

### Hybrid Attacks 📚+💥
A **hybrid attack** is when an attacker uses a combination (hybrid) of dictionary attacks and brute-force attacks to cover even more ground to guess a password. 

This is typically an effective attack because users often choose a predictable password, like a common word, and add some character or numbers to the end. 

### Rainbow Table Attacks 🌈
A **rainbow attack** is when an attacker uses a precomputed table of hashes to crack passwords. They use the table to match a password’s hash to a precomputed hash in the table, allowing them to recover the original password. 

They are faster than brute force attacks because they require less computational power than brute force attacks. 

> Note: It’s called a rainbow table because it contains the entire spectrum of possibilities. It ends up looking like a rainbow. 

### Phishing Attacks 🎣 
A phishing attack is when an attacker uses social engineering (deception to appear like a legitimate source) via email to aim the victims to divulge their passwords (or other sensitive information).

Types of phishing attacks: 
* **Spear phishing:** Attackers use personalized information about the victims to trick them. 
* **Whaling:** A type of spear phishing targeting high level executives. 
* **Smishing:** Phishing attacks carried via text messages. 
* **Vishing:** Phishing attacks carried via phone calls. 

### Credential Stuffing 🛠
**Credential stuffing** is when an attacker uses a list of leaked passwords (typically from data breaches) to try and gain access to other apps. They rely on the knowledge that users reuse their passwords, so they may have used those passwords on other apps. Sadly, they’re right. We do reuse our passwords. 

### Malware (Keylogging, Screen Scraping) ⌨️ 🖥️
**Malware** is just any computer program that is built for unethical purposes, like keylogging or screen scraping.

**Keylogging** is a type of malware an attacker uses that records your keystrokes without your knowledge. The information is then sent to the attacker who can use it to gain access to your accounts and sensitive information like your passwords or credit card numbers. 

**Screen scraping** is a type of malware which takes screenshots of an infected computer, enabling attackers to gain unauthorized access without using password cracking tools.  

### Shoulder Surfing and Visual Hacking 👀
**Shoulder surfing (visual hacking)** is a type of social engineering tactic an attacker uses where they literally look over someone’s shoulder to steal their personal information, like their passwords. It’s why grocery store workers tend to look away when you’re entering your credit card pin when you pay. It’s important to pay attention to your surroundings when entering your password and you’re in a public space.

## Modern Security Measures to Prevent Password Cracking 🛡️

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



