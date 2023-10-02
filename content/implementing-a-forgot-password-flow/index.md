---
title: Implementing a forgot password flow (with pseudo code)
date: "2021-06-01"
description: "What should happen on the backend when a user forgets their password? Read to find a pseudo code implementation of the simplest way to reset passwords securely."
cover: "implementing-a-forgot-password-flow.png"
category: "programming"
author: "Joel Coutinho"
---

### Table of contents:

**Security Issues to consider:**

- [Brute Force Attacks](#brute-force-attacks)
- [Theft of password reset tokens from the database](#database-theft-of-password-reset-tokens)
- [Reusing existing tokens](#reusing-existing-tokens)
- [Stealing tokens through email hijacking](#stealing-tokens-from-email-hijacking)

**How to implement a secure password reset flow**

- [User’s enters email in the UI](#user-enters-their-email-in-the-ui-requesting-a-password-reset)
- [Creating password reset token and storing it in DB](#create-a-password-reset-token)
- [Sending token to the user and verifying it when used](#the-user-clicks-on-the-link-in-the-email)
- [What actually happens on the backend (pseudo code)](#what-happens-on-the-back-end)

**What actually happens on the backend (pseudo code)**

Applications need to account for the frequency with which users forget their passwords. This opens a potential attack vector because anyone can request a new password on behalf of the legitimate user. Resetting a password requires sending a token to a user’s email address and this provides an opening for attackers. Making sure you have a secure process for handling the password reset tokens will ensure your users’ accounts remain safe from attackers.

## Security Issues to Consider

![hullllk](./brute-force.png)

### Brute force attacks

This is a common threat for all web applications. Attackers may attempt to detect patterns in the password reset tokens - like if it’s derived from a user’s userId, time they signed up, their email or any other information. Attackers may also try all possible combinations of letters and numbers (brute force), and may even succeed if the generated tokens are not long or random enough (i.e. have low entropy).  

To prevent this, we must ensure that tokens are generated using a secure random source, and that they are long enough (we recommend >= 64 characters). Later on in this blog, we will see one such method.


## Database theft of password reset tokens

There are several ways an attacker can gain access to an application's database: SQL injection attacks, targeting unpatched database vulnerabilities, and exploiting unused database services. They could even gain access if someone hasn't updated the default login credentials.

While there are plenty of problems with an attacker getting database access, one of them is their ability to get users' password reset tokens, like in this research on [Paleohacks](https://www.zdnet.com/article/paleohacks-data-leak-exposes-customer-records-password-reset-tokens/). To mitigate this risk, we store only the hashed version of tokens in the database. Passwords are hashed and stored and it’s important that password reset tokens are too (for the same reasons). 

Another related attack vector is the use of JWTs as the password reset token. Whilst this makes development easy, a major risk is that if the secret key used to sign them is compromised, the attacker can use that to generate their own valid JWT. This would allot them to reset any user’s password. The JWT secret key (or signing key) must be carefully protected and hence we do not recommend using JWTs as the password reset token.

## Reusing existing tokens

For simplicity of development, it may be tempting to store a “static” password reset token per user. This token might be randomly generated on user sign up, or based on their password’s hash or some other information.

This in turn implies that these tokens cannot be stored in a hashed form in the database - since we will need to send this token over email (because if we hash it, we can’t unhash it at the time). Therefore, if the database is compromised, these tokens can be used to reset a user’s password.

Another risk of reusing tokens is that if a token somehow gets leaked, even if it has been redeemed by the actual user, it can still be used by an attacker to change that user’s password. 



## Stealing tokens from email hijacking

Attackers can gain access to a user's email account through email hijacking. This usually happens with phishing emails, social engineering, or by getting them to enter their credentials in a bogus login form. Once they have access to a user's email, they are able to trigger a password reset link and gain access to the user’s account.

This risk can be mitigated by enabling two-factor authentication via SMS or an authenticator app, or by asking secret questions to the user before allowing them to reset their password.


## How to implement a secure password reset flow

To ensure that your password reset process is as secure as possible, here is a potential flow that takes into account the security issues we discussed above.


### User enters their email in the UI requesting a password reset

This is how users will begin the process for updating their password. There's usually a simple form available that lets them enter the email address associated with their account.

When they submit the email address, this will trigger the back-end to check if that email exists in the database. Even if the email doesn't exist, we'll show a message that says the email has been sent successfully. That way we don't give attackers any indication that they should try a different email address.

If the email does exist in the database, then we create a new password reset token, store its hashed version in the database, and generate a password reset link that's sent to the user's email address.


### Create a password reset token

With Supertokens, the password reset token is generated using a random 64 character string. This prevents brute force attacks mentioned above since new tokens are unguessable, and have high entropy. 

- For [Java](https://github.com/supertokens/supertokens-core/blob/3.4/src/main/java/io/supertokens/emailpassword/EmailPassword.java#L99) ‍‍(uptill line 120)
- For [NodeJS](https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js/8856177#8856177)
- For [Python](https://docs.python.org/3/library/secrets.html) and use <span style="background: #fff7cb">secrets.**token_urlsafe**</span>


### Store the token in the database

After the token has been created, [it's hashed](#database-theft-of-password-reset-tokens) using SHA256 and stored in the database along with the user’s ID and it's assigned an expiration time. That way the token is only valid for a set amount of time, blocking attacks that could happen if the token never expired. Here’s an example of the db schema we can use to store password reset tokens.

```sql
‍CREATE TABLE password_reset_tokens (    
    user_id VARCHAR(36) NOT NULL,    
    token VARCHAR(128) NOT NULL UNIQUE,    
    token_expiry BIGINT UNSIGNED NOT NULL,    
    PRIMARY KEY (user_id, token),
); ‍

```

If you notice, we allow multiple tokens to be stored per user. This is necessary since we only store the hashed version of the tokens in the db. This means that if a user requests multiple tokens at the same time, we cannot send them the same previously generated token (which is not yet redeemed), since it’s stored in hashed form.

At the end, we want to generate a password reset link which points to a link on your website that displays the “enter new password” form, and also contains the token. An example of this is:

`https://example.com/reset-password?token=<Token here>`

### The user clicks on the link in the email
Once the user has received the email, they will click on the link and it will redirect them to a page on the website to enter their new password. The password validators should follow the same rules as that in a sign up form.

### The new password is submitted along with the token to the back-end
Once they enter the new password, the reset token and the new password are sent to the back-end. The reset password token is obtained from the password reset link’s query params.

In summary, if the token’s hash matches what was stored in the database, the user's password will be updated with the new password. Otherwise, the user will have to request a new reset token and go through the process again.

### What happens on the back-end
Here is a pseudo code of your backend API logic for redeeming a token:

```tsx
function redeemToken(passwordResetToken, newPassword) {
       /*
         First we hash the token, and query the db based on the hashed value.          
         If nothing is found, then we throw an error.
       */
       hashedToken = hash_sha256(passwordResetToken);
       rowFromDb = db.getRowTheContains(hashedToken)
       if (rowFromDb == null) {
           throw Error(“invalid password reset token”)
       }
       userId = rowFromDb.user_id
       /*
         Now we know that the token exists, so it is valid. We start a          
         transaction to prevent race conditions.
       */
       
       db_startTransaction() {
             /*   allTokensForUser is an array of db rows. We have to                   
             use a query that locks all the rows in the table that                   
             belong to this userId. We can use something like “SELECT                   
             * FROM password_reset_tokens where user_id = userId FOR                   
             UPDATE”. The “FOR UPDATE" part locks all the relevant rows.             
             */  

            allTokensForUser = db_getAllTokensBasedOnUser(userId)
            /*
               We search for the row that matches the input token’s                    
               hash, so that we know that another transaction has not 
               redeemed it already.                
            */ 

             matchedRow = null;
             allTokensForUser.forEach(row => {
                   if (row.token == hashedToken) {
                          matchedRow = row;
                   }
             });

             if (matchedRow == null) {
                /* The token was redeemed by another transaction. So                      
                 we exit
                */
                throw Error(“invalid password reset token”)
             }
             /*
             Now we will delete all the tokens belonging to this user to              
             prevent duplicate use              
             */
            db_deleteAllRowsForUser(userId)
             /*
            Now we check if the current token has expired or not.
            */
            if (matchedRow.token_expiry < time_now()) {
                db_rollback();
                throw Error(“Token has expired. Please try again”);
             }
             /*
                Now all checks have been completed. We can change the user’s 
                password
             */
             hashedAndSaltedPassword = hashAndSaltPassword(newPassword);
             db_saveNewPassword(userId, hashedAndSaltedPassword);
             db_commitTransaction();
        }
 }
```

## Conclusion

Password reset flows are easy to get wrong. One needs to be knowledgeable in cryptography, database transactions / distributed locking, and should be able to think about all the edge cases in the flow. The cost of getting these wrong can lead to compromised user accounts.

At supertokens.com, we have tried to provide an easy to use, open source, password reset solution (and lots of other auth modules) that you can use to secure your app and save time.

