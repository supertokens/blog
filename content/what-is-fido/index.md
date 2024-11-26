---
title: What is FIDO
date: "2024-09-20"
description: "In this post, we’ll take you on a journey through the world of passkeys, breaking down their technical foundations and exploring how they work. We'll also look at the role of the FIDO2 and WebAuthn standards in shaping a future where passwords are no longer needed. "
cover: "what-is-fido.png"
category: "programming"
author: "Dejan Lukic"
---

- [Introduction](#introduction)
- [The End of the Password Era: Why Password-Based Authentication is Obsolete](#the-end-of-the-password-era-why-password-based-authentication-is-obsolete)
- [Passkeys: What Are They and How Do They Work?](#passkeys-what-are-they-and-how-do-they-work)
- [The FIDO Alliance: Pioneering the Shift Toward Passwordless Authentication](#the-fido-alliance-pioneering-the-shift-toward-passwordless-authentication)
- [How FIDO2 Works: A Technical Breakdown with Examples](#how-fido2-works-a-technical-breakdown-with-examples)
- [The FIDO2 Workflow: Registration and Authentication](#the-fido2-workflow-registration-and-authentication)
- [Conclusion](#conclusion)
## Introduction

The era of relying solely on passwords for online authentication is rapidly fading, and for good reason. What was once a trusted security measure has become a significant weak point in today’s already too complex digital world. With cyberattacks evolving in sophistication and scale, the vulnerabilities of password-based systems are clearer than ever. 
You’ve seen countless examples of data breaches, phishing schemes, and stolen credentials affecting millions of users and countless companies. 

These threats have made it evident that passwords alone are no longer enough to keep our online identities and sensitive information safe. The growing demand for more secure, user-friendly authentication methods has led to exciting innovations like passkeys.

Passkeys offer a promising alternative to traditional passwords, providing a more secure and seamless way for users to authenticate without relying on easily compromised credentials. Among the most significant advancements in this field is the native support for passkeys in browsers. This marks a critical step toward the broader adoption of passwordless authentication, bringing cutting-edge security technology to the everyday user. 

However, behind this technological shift is an even larger force: the FIDO Alliance. The FIDO Alliance is a global consortium dedicated to revolutionizing online authentication, aiming to eliminate passwords altogether and replace them with stronger, more secure alternatives built on public-key cryptography.

In this post, we’ll take you on a journey through the world of passkeys, breaking down their technical foundations and exploring how they work. We'll also look at the role of the FIDO2 and WebAuthn standards in shaping a future where passwords are no longer needed. 


## The End of the Password Era: Why Password-Based Authentication is Obsolete

Passwords have been a mainstay of digital security for decades, but the cracks in this approach have widened in recent years. With users often opting for simple, easy-to-guess passwords, and frequently reusing them across multiple platforms, the risks are obvious. A single breach can open the door to multiple services, with attackers taking advantage of widespread credential reuse. In fact, credential stuffing, where stolen credentials are used to gain access to multiple services, has become a leading threat vector.

The [2023 Verizon Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/) revealed that more than 81% of data breaches were tied to weak or stolen passwords. The limitations of traditional authentication methods have sparked a race toward alternative solutions that can provide secure authentication without the pitfalls of passwords.

### Key Issues with Passwords:

- Weak Passwords: Users often choose passwords that are easy to remember but also easy for attackers to crack.

- Password Reuse: A significant number of users reuse the same password across multiple platforms, making a single breach potentially devastating.

- Phishing Attacks: Phishing remains one of the most effective tactics for stealing passwords. Even sophisticated users can fall victim to well-crafted phishing schemes.

Given these challenges, it's clear why businesses and developers are looking for password management alternatives. Enter passkeys, which eliminate the need for passwords and offer a more secure, user-friendly solution.

## Passkeys: What Are They and How Do They Work?

Passkeys represent a complete shift in authentication, moving away from the outdated, vulnerable model of passwords to a system rooted in robust public-key cryptography. This approach eliminates the reliance on shared secrets like passwords, which are susceptible to a range of cyberattacks, and replaces them with a cryptographic key pair that drastically improves security.

By utilizing a public-private key pair, passkeys offer a more secure and reliable method of verifying user identities, effectively addressing many of the security weaknesses associated with traditional passwords.

### Key Characteristics of Passkeys

- Public-Private Key Pair: The foundation of passkey authentication lies in the creation of a cryptographic key pair. When a user registers for a service, such as a website or app, their device generates a public-private key pair. The public key is sent to the server and stored securely, while the private key remains protected on the user's device---never shared or transmitted. This separation ensures that even if the server is compromised, the private key, which is essential for authentication, remains safe on the user's device. This model is crucial to enhancing security while preserving user privacy.

- Secure Challenge-Response Authentication: During the authentication process, rather than relying on a password that could be intercepted or guessed, the system uses a secure challenge-response mechanism. When a user attempts to log in, the server generates a cryptographic challenge and sends it to the user's device. The device, using its securely stored private key, signs this challenge and sends the signed response back to the server. The server then verifies the signature using the stored public key associated with that user. This entire process happens without exposing any sensitive information, ensuring that the user can authenticate without revealing anything that could be stolen or replicated by attackers. This form of public-key cryptography adds an extra layer of protection by ensuring the integrity and security of the login process.

- **Phishing Resistance:** One of the most notable security advantages of passkeys is their built-in resistance to phishing attacks. In traditional password-based systems, users can be tricked into entering their credentials on malicious websites designed to look like legitimate ones, handing over their passwords to attackers. However, with passkeys, there are no passwords involved in the authentication process. This eliminates the risk of phishing entirely, as attackers cannot trick users into revealing their credentials. Even if an attacker were to gain access to a user's public key---which is freely stored on the server---it would be useless without the corresponding private key that remains securely locked on the user's device. Without access to the private key, an attacker cannot forge the necessary cryptographic signatures to bypass the authentication process.

- **Device-Based Authentication and Security**: A significant benefit of the passkey system is that the private key is tied to the user's device, whether it's a smartphone, laptop, or hardware token. The private key never leaves the device, and authentication requires either biometric verification (such as a fingerprint or facial recognition) or a local PIN to unlock the key for signing the authentication challenge. This method ensures that even if a user's device is lost or stolen, the passkey remains secure, as the biometric data or PIN is required to access it. This type of device-based authentication greatly reduces the attack surface compared to traditional passwords, which can be used from any device by simply knowing the right combination of characters.

- **Protection Against Credential Theft**: Traditional authentication systems rely on secrets (passwords) that can be reused, stolen, or guessed, making them vulnerable to attacks such as credential stuffing, where attackers use stolen credentials from one service to access accounts on another. With passkeys, there is no such risk of credential reuse. The public-private key pair is unique to each service, meaning that even if one service's public key is compromised, it cannot be used to access accounts on another platform. This approach not only mitigates the risks associated with password reuse but also strengthens overall account security by ensuring that each authentication event is unique and service-specific.

The adoption of passkeys signals a new era of secure authentication, where the weaknesses of passwords---such as being easy to guess, susceptible to phishing, and difficult to manage---are replaced by a more reliable and secure method based on public-key cryptography. This shift represents not just an incremental improvement in security but a fundamental change in how we think about online authentication.

### Biometric Authentication and Device-Based Login:

One of the most significant advancements in passwordless authentication with passkeys is the integration of biometric authentication. Rather than relying on traditional passwords, users can securely store their passkeys on devices like smartphones or laptops and authenticate using their biometric data---such as a fingerprint or facial recognition. This method streamlines the entire login process, making it faster, more secure, and eliminating the need for password memorization or frequent password resets. By leveraging built-in biometric sensors, passkeys provide a seamless experience that reduces friction for users while maintaining high levels of security.

From a technical standpoint, biometric authentication works in tandem with the public-private key pair system that underpins passkey technology. Once a user registers a passkey with a service, the private key is securely stored on their device, and the user's biometric data or local PIN is used to unlock the key for future authentication events. Since the private key never leaves the device and the biometric data is processed locally, the risk of interception or theft is significantly reduced. This design ensures that even if a malicious actor gains access to the public key, it is useless without the corresponding private key and biometric verification, adding another layer of security.

The device-based approach to passkey authentication is a game-changer, particularly in the context of passwordless login. Because the private key storage is tied to a specific device, authentication can only occur on that device, significantly reducing the attack surface. This device-bound authentication ensures that even if attackers compromise a server, they cannot use the public key to impersonate a user. Additionally, this architecture paves the way for more secure and user-friendly implementations of multifactor authentication (MFA) and two-factor authentication (2FA). By integrating biometric authentication or local PIN-based authentication as a second factor, systems can add layers of security without introducing the inconvenience typically associated with traditional MFA methods.

This biometric device-based model also facilitates smoother adoption of passwordless login across platforms and devices. Since users are not required to remember complex passwords, the authentication process becomes both more secure and user-friendly. The need for frequent password changes or resets---a common source of frustration for users---becomes obsolete, enhancing the overall user authentication experience. Furthermore, the ability to authenticate across multiple devices using the same passkey strengthens the security framework while providing a consistent, low-friction experience for users.\
In terms of security, this system not only improves phishing resistance by eliminating the possibility of credential theft but also mitigates the risk of man-in-the-middle attacks. Attackers cannot gain access to the authentication process without physical access to the user's device and biometric verification, making it a highly secure solution in today's evolving authentication ecosystem. As a result, the combination of public-key cryptography and biometric authentication in passkeys represents a significant leap forward in reducing reliance on traditional password management while ensuring a secure and efficient login experience for users.

## Google Chrome's Native Support for Passkeys

The integration of passkeys into Google Chrome marks a significant milestone in the shift toward passwordless authentication. By incorporating support for WebAuthn, a key element of the FIDO2 standard, Google has made passwordless login far more accessible for everyday users. This native support simplifies authentication by allowing users to log in with passkeys stored on their devices, using biometrics like fingerprints or face recognition, rather than traditional passwords. This step by Google not only enhances phishing resistance but also strengthens overall Chrome security features, making secure public-key cryptography a standard for web-based authentication across a wide range of platforms and services.

> Chrome isn't the only browser supporting passkeys, but is one of the most used ones.

### Chrome Security Features Supporting Passkeys:

- **Biometric Authentication**: Chrome allows users to authenticate using their device's biometric capabilities, such as fingerprint scanning or face recognition, for a more secure and user-friendly login experience.

- **Cross-Platform Compatibility**: Google Chrome passkeys are designed to work across various platforms, including Windows, macOS, iOS, Android, and Linux, ensuring a consistent experience regardless of the device.

- **Seamless Authentication Process**: With passkeys, users no longer need to manage or remember complex passwords. Instead, they authenticate via biometrics or PIN-based authentication directly on their device.

This native support by Chrome makes it easier for developers to integrate passkeys into their web applications. For more on Chrome's approach to secure login and its growing list of Chrome security features, explore this[ SuperTokens blog post](https://supertokens.com/blog).

## The FIDO Alliance: Pioneering the Shift Toward Passwordless Authentication

At the core of the passwordless revolution is the FIDO Alliance. Founded in 2012, the alliance aims to create more secure and scalable authentication standards by reducing the world's dependence on passwords. FIDO stands for Fast Identity Online, and its standards are built on public-key cryptography, ensuring secure, private, and convenient authentication methods.

### FIDO2: The Backbone of Modern Passwordless Authentication

The FIDO2 standard consists of two key components:

- **WebAuthn**: A browser-based API that allows web applications to integrate passwordless authentication using public-key cryptography. This technology forms the foundation for how modern browsers like Google Chrome support passkeys.

- **CTAP (Client to Authenticator Protocol)**: CTAP is a protocol that facilitates communication between a user's device and an external authenticator, such as a smartphone or a hardware security key. CTAP ensures that even external devices can be used for authentication, making it versatile and secure.

The widespread adoption of FIDO2 standards by tech giants like Google, Apple, and Microsoft has accelerated the global shift towards a future without passwords.

## How FIDO2 Works: A Technical Breakdown with Examples

FIDO2 represents a cutting-edge approach to secure, passwordless authentication. By leveraging public-key cryptography, it eliminates the need for shared secrets (like passwords) and introduces a more robust, phishing-resistant model for online authentication. Below, we'll walk through the registration and authentication process in detail, using both explanations and code-based examples to make the workflow clear.

### FIDO2's Key Components

At the heart of FIDO2 are two major technologies:

- **WebAuthn**: An API that allows browsers and websites to securely communicate and authenticate users without passwords.

- **CTAP (Client to Authenticator Protocol)**: Enables communication between devices (like smartphones or security keys) and browsers.

## The FIDO2 Workflow: Registration and Authentication

FIDO2 represents a cutting-edge approach to secure, passwordless authentication. By leveraging public-key cryptography, it eliminates the need for shared secrets (like passwords) and introduces a more robust, phishing-resistant model for online authentication. Below, we'll walk through the registration and authentication process in detail, using both explanations and code-based examples to make the workflow clear.

### Step 1: Key Pair Generation (Registration)

When a user registers for a website that supports FIDO2, their device generates a unique public-private key pair. This is the fundamental cryptographic mechanism that ensures security. The public key is shared with the server, while the private key remains securely stored on the user's device.

#### Registration Process (Pseudocode Example):

- **Step 1: User registers on a website**

```sh
user_device.generate_keypair()    # Public-private key pair is generated

public_key = user_device.public_key     # Public key is sent to the server

private_key = user_device.private_key   # Private key stays on the user's device
```

- **Step 2: Server stores the public key**

```sh
server.store_public_key(public_key)     # The server holds onto the public key for future verification
```

In this registration phase, the server only stores the public key, while the private key never leaves the user's device. This ensures that even if the server is breached, the attacker cannot gain access to the private key.

When the user attempts to log in, the server sends a cryptographic challenge to the user's device. This challenge must be signed by the private key stored on the device. The signed challenge is then sent back to the server, which verifies it using the public key stored during registration.

#### Authentication Process (Pseudocode Example):

**Step 1: Server sends a challenge during login**

```sh
challenge = server.generate_challenge()
```

**Step 2: User's device signs the challenge using the private key**

```sh
signed_challenge = user_device.sign(challenge, private_key)
```

**Step 3: Signed challenge is sent back to the server**

```sh
server.verify(signed_challenge, public_key)
```

**Step 4: If the verification is successful, the user is authenticated**

```sh
if server.verify_success:

    user_access_granted()

else:

    user_access_denied()
```

This process guarantees that the user is authenticated without transmitting any sensitive data, such as a password, over the network. The server only verifies the signature based on the public key it holds.


### Visualizing the Challenge-Response Flow:

1. Server: Generates a unique cryptographic challenge and sends it to the user's device.

2. User Device: Signs the challenge using the private key stored locally on the device.

3. Server: Verifies the signed challenge using the public key stored during registration.


### Example with WebAuthn API in JavaScript

Let's look at a practical example using JavaScript and the WebAuthn API, which is a standard part of how browsers like Google Chrome implement FIDO2.

#### Registration Process (JavaScript Example):

```js
async function register() {

  // Browser requests public-private key pair generation

  const publicKey = {

    challenge: new Uint8Array([/* server-generated challenge here */]),

    rp: { name: "Example Corp" },  // Relying Party info (the website)

    user: {

      id: new Uint8Array(16),  // Unique user ID

      name: "user@example.com",

      displayName: "User Example",

    },

    pubKeyCredParams: [{ alg: -7, type: "public-key" }]  // Algorithm and key type

  };

  // Device generates key pair and sends public key to the server

  const credential = await navigator.credentials.create({ publicKey });

  // Send the public key to the server for future authentication

}
```

#### Authentication Process (JavaScript Example):

```js
async function authenticate() {

  // Server sends a challenge for the user to sign

  const publicKey = {

    challenge: new Uint8Array([/* server-generated challenge here */]),

    allowCredentials: [{ id: new Uint8Array(16), type: "public-key" }]  // Allowable credential types

  };

  // User's device signs the challenge using the private key

  const assertion = await navigator.credentials.get({ publicKey });

  // Send the signed response back to the server for verification

}
```


### The Power of Biometric Authentication

One of the most significant advantages of FIDO2 is that it enables biometric authentication for a seamless and secure user experience. Instead of relying on passwords, users can authenticate using their fingerprint or face ID directly from their device. This type of biometric authentication not only improves security but also enhances convenience, as users no longer need to remember or reset passwords.

This approach makes it possible to integrate multifactor authentication (MFA) into the authentication process without adding friction. For example, users can combine biometric authentication with PIN-based authentication, further securing the login process.

FIDO Standards and Their Impact on the Authentication Ecosystem
---------------------------------------------------------------

One of the most exciting aspects of FIDO standards is their potential to fundamentally reshape how businesses and consumers interact with digital services. By enabling secure, scalable, and user-friendly passwordless login solutions, FIDO's approach addresses many of the inherent weaknesses in traditional authentication systems.

### Security Benefits of FIDO2:

- Phishing Resistance: Passkeys are inherently resistant to phishing because they don't rely on shared secrets like passwords. Even if a user interacts with a fake website, their private key remains securely stored on their device.

- Prevention of Credential Stuffing: Since passkeys are unique to each service, attackers can't use credentials stolen from one website to log into another. This makes it harder for attackers to exploit credential breaches across multiple services.

- Eliminating Man-in-the-Middle Attacks: Passkeys offer strong protection against man-in-the-middle attacks, where attackers intercept credentials in transit. With public-key cryptography, authentication is securely bound to the device and the server, making such attacks ineffective.

For a deeper understanding of how FIDO standards and passkeys can enhance security, check out this article from[  Ping Identity](https://www.pingidentity.com/en/resources/identity-fundamentals/authentication/passwordless-authentication/fido.html).

## The User Experience Benefits of Passwordless Login

Security isn't the only advantage of passkey-based authentication. The user experience benefits are equally significant. By eliminating the need for users to manage, reset, and remember complex passwords, passwordless login systems reduce friction and enhance user satisfaction.

### Improved User Authentication Experience:

- Biometric Authentication: Users can authenticate quickly and easily using their fingerprint or face, creating a frictionless login process.

- Simplified MFA: With device-based authentication, multifactor authentication becomes more seamless, as users don't need to deal with additional authentication steps like SMS codes or email verifications.

In enterprise settings, passkey authentication offers a streamlined alternative to traditional two-factor authentication (2FA) systems. For businesses, this means faster onboarding, reduced help desk requests related to password resets, and enhanced compliance with security regulations like GDPR and PCI DSS.

## Adopting Passkeys

While passkeys offer many advantages, there are still challenges that businesses need to consider. The transition to passwordless authentication requires both investment and education.

### Challenges in Passkey Adoption:

1. User Education: Many users are still unfamiliar with passwordless login methods, and educating them about the benefits of passkeys---such as resistance to phishing attacks and convenience---will be crucial for widespread adoption.

2. Device Compatibility: Not all users have devices that support passkeys. Older devices may lack the necessary biometric authentication features, or users may not have access to compatible hardware keys. Developers will need to ensure that their authentication systems are backward compatible with older devices and login methods.

3. Biometric Data Privacy: With the rise of biometric authentication, concerns over the privacy and security of biometric data are also increasing. Developers must ensure that biometric data is securely stored on the user's device and not transmitted to third-party servers. This is a key component of privacy regulations like the California Consumer Privacy Act (CCPA) and the EU's General Data Protection Regulation (GDPR).

Despite these challenges, the transition to passkeys represents a significant opportunity for businesses to enhance both security and user experience. For more on how passwordless login can benefit businesses, check out this[OneSpan article](https://www.onespan.com/topics/fido-fast-identity-online).

## Conclusion

The adoption of passkeys and the widespread support of FIDO2 standards are driving the world closer to a passwordless future. By replacing passwords with public-key cryptography and leveraging biometric authentication, passkeys offer a more secure, user-friendly alternative to traditional passwords. As more businesses and consumers embrace passwordless authentication, the days of weak passwords, phishing attacks, and credential stuffing could soon be behind us.

The key to realizing this future lies in the continued development of FIDO standards and the widespread adoption of technologies like passkeys. With the backing of tech giants and a growing number of developers integrating passwordless login into their apps, a more secure and seamless online experience is on the horizon.

For further reading on the evolution of passwordless authentication and how to implement passkeys in your applications, visit:

- [FIDO Alliance](https://fidoalliance.org/how-fido-works/)

- [SuperTokens Blog](https://supertokens.com/blog)