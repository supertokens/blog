---
title: Implementing the right Email Verification flow
date: "2023-02-24"
description: "Email verification can increase friction and adds another stop to onboarding, but when done correctly can lead to better security and establish better communication with users."
cover: "email_verification_blog_banner.png"
category: "programming"
author: "SuperTokens team"
---

### Introduction

Email verification is contentious, it increases friction and adds yet another step to onboarding. However, when done right, email verification can lead to better communication with users, avoid fake accounts / negative externalities, and maintain high marketing reputation. 

In this post, we’ll break down why email verification is important and how to implement the right verification flow for your application. 

### **Why we need email verification**

**Communicating with users**

The main reason for adding email verification is to have a direct channel to users. 

Company emails aren’t the most exciting topic. I have a stack of AWS marketing emails collecting dust in my inbox. I’m simply not excited about AWS re:Invent or their latest product launch. However, many years ago, I was an avid League of Legends player and whenever new patch notes hit my inbox, I would spend hours reading through every change. 

Company content is in the same boat. Creating engaging content is one of the best ways to build a community of users that love your product. Plus, there are plenty of valid use cases for company communication, such as sending billing documents or password reset instructions. 

 

**Avoiding fake accounts / negative externalities**

Email verification helps weed out fake accounts. Generally, fake accounts are meant to abuse a certain feature or product of the application. This can lead to rising server costs and skew data analytics. Adding in the additional friction in email verification can be a low-cost way of reducing the risk for product misuse. 

In particular, some fake accounts might have real email addresses attached. An attacker could sign up with the email john@fbi.gov or susan@irs.gov. The last thing you want to do is badger John and Susan with company content. 

**Account linking**

Another reason to add email verification is to prevent attackers from hijacking accounts during automatic account linking. 

For example, if a user already has an account using Google Sign-In, an attacker can sign up with the same email on Email-password Sign-In. Most systems today will automatically link the two accounts since they share the same email address and give the attacker access to the original account. 

To solve this, the system must first verify the email-password account before linking it to the Google Sign-In account. 

**Marketing reputation**

If a product is shipped but users don’t discover it, was it really worth it?

Companies can email users to celebrate feature updates, product launches, and case studies. But without proper email verification, companies can end up sending hundreds of emails that hard bounce - the email doesn’t exist. 

Email Service Providers (ESPs) don’t take kindly to accounts that see high levels of hard bounces. They automatically assume that the account is a spammer and blacklist the account. That blocks everything from company updates to more vital operations like sending password reset instructions. 

### A how-to guide on email verification

Implementing a perfect email verification flow is a delicate balance between friction and user verification. 

**Universal verification**

The first question to ask is, “Does universal email verification make sense for my application?”

In some cases, like building a financial application, having every user verify their email is critical. They’re likely already expecting detailed verification and have the patience to take the extra step of hunting through their inbox to complete verification. 

On the other hand, more trivial applications like image editing, might not have the same luxury. Most users are looking to access the product as quickly as possible, and throwing up an email verification barrier is bound to result in lower conversions or increased churn.

**Verification triggers**

Say we still want to set up email verification - we’ll need to figure out what actions trigger an email verification. We could require email verification as soon as a user signs up, or perhaps when the user comes back for the second session.

Shifting the onboarding friction from email verification to a later time can make the process much more natural for users. For example, a social media platform can minimize friction during the sign up process so that a user can immediately start to consume content. Later, when the user wants to post content, the platform can verify emails to minimize spam.

We can also segment verification by using conditionals.

For example, if someone is signing up with a [gmail.com](http://gmail.com) email, we can be relatively sure that the email is legit. On the other hand, a [tmmcv.net](http://tmmcv.net) email has a high chance of being fake.

Either way, it’s critical to define a trigger that will initiate the email verification flow. Once initiated, the flow should tell users that a verification email has been sent and lock features until the user has confirmed the email. If the user has no incentive to verify their email, they’ll simply ignore the verification email.

**Generating verification tokens**

Once the email verification process starts, the first step is to design a verification token. With SuperTokens, the verification token is a random 128 character string. You can generate any random 64-128 character token. The length prevents brute force attempts from attackers.

Once the token is generated, it's assigned an expiration time of 24 hours. Unlike password reset or email change functions, email verification is relatively harmless. As a result, some companies may even opt for longer verification times.

Now that we’ve done all that, it’s time to send the user an email verification link.

An example of this is: 

> https://example.com/auth/verify-email?token=OTJiN2E5NmZkMGQzMWQ3ZTRhZTkwOGU4MmVmZjZmYjE5ZTQyMmViO


Here is pseudocode for sending a verification email:

```jsx
const crypto = require('crypto');

/*
	First, we need to generate a verification token. 
	We're using the JSON Web Token library for our example.
*/
var token = crypto.randomBytes(128).toString('hex');

/*
	Here, we save the verification token in the db 
to be verified when the token is consumed
*/
db_startTransaction() {
	db_saveNewVerificationToken(userId, token);
}

/*
	Next, we use the token to generate a verification link. 
*/
const emailVerificationLink = 'https://example.com/auth/verify-email?token=' + token;

const mailConfigurations = {
	from: 'example@example.com',
	to: 'user@user.com',
	/*
		The text and subject can be personalized for your specific use case. 
	*/
	subject: 'Verify your email to access Example',
	text: emailVerificationLink
};

/*
	With all that done, it's time to send an verification email to our user
*/
sendMail(mailConfigurations);
```

**Storing verification tokens in the database**

Occasionally, a user might try to request multiple email verifications. Since we have a generous expiration time, we can reuse the previously generated token in the database and send the same link each time the user requests a new email. If the expiration time is up, we can generate a new token and send the new link to the user. Generally, this makes it easier for us to handle email verification logic without having to create and disable multiple verification tokens. 

On the other hand, if we wanted to tighten security, we could choose to generate a new verification token, replace the verification token in the database, and send a new email verification link each time. The drawback to this approach is mainly in dealing with previously generated tokens.

In some cases, it makes sense to disable them. However, it could lead to frustrated users. Alternatively, we could keep all tokens enabled and disable all of them whenever one of the tokens is consumed.

**Passing verification to the backend**

After a user clicks on the verification link, there should be a clear indication for the user that they’ve been email-verified. This can either take the form of a distinct landing page or it could be a pop-up on the home page of the application.

One potential edge case with email verification links is that email clients might open the verification link for scanning purposes and consume the token. To prevent this, we can check if a session exists and if not, redirect the link to a page with a verify button. Email clients won’t click on the button and users that are redirected to this page can simply click on the button to finish their verification. 

The token in the URL is then passed onto the backend for verification. On the backend, once a verification token has been consumed, the verification status for the user should be changed.

```jsx
function verifyEmail(token) {
	/* 
		First, we need to verify that the token corresponds with an actual user.
	*/

	rowFromDb = db.getRowThatContains(token)
   if (rowFromDb == null) {
       throw Error(“invalid password reset token”)
   }
   userId = rowFromDb.user_id

	/*
    Now we know that the user exists, so it is valid. We start a 
		transaction to prevent race conditions.
   */
       
   db_startTransaction() {		
			/*
			  Here we check if the user is already verified.
		  */
      if (userId.verified = 1) {
        db_rollback();
        throw Error(“User is already verified.”);
	    }

      /*
			  Here we check if the current token has expired or not.
		  */
      if (userId.token_expiry < time_now()) {
        db_rollback();
        throw Error(“Token has expired. Please try again.”);
	    }

      /* 
        Here we'll change verifications status to verified. 
      */
      db_saveNewVerified(userId, 1);
      db_commitTransaction();
  }
```

### Conclusion

Email verification is only a small part of the overall onboarding process, but one with a surprising amount of nuance. Poor implementation can lead to frustrated users who will churn out. While you’ll get away with it in the beginning, ignoring this is a bad idea in the long term.