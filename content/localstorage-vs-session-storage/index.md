---
title: "Unveiling the Intricacies of Local Storage and Session Storage"
date: "2024-01-17"
description: "In this blog we delve into the workings of Local and Session storage breaking down the nuances that set them apart"
cover: "localstorage-vs-session-storage.png"
category: "programming"
author: "Mostafa Ibrahim"
---

## Introduction

In this post, we're going to delve into the workings of Local and Session Storage. We aim to unravel not just their definitions, but more importantly, the nuances that set them apart. As developers, understanding these differences is crucial, akin to a carpenter knowing when to use a hammer versus a screwdriver.

For developers grappling with the choice between Local Storage and Session Storage, don’t worry, we've got you covered.

![Gotacha Covered](./gotcha_covered.gif)

## What are Local storage & session storage?

Local Storage and Session Storage are two types of web storage that offer different ways of managing data in a web browser.

**Local Storage** is akin to etching data onto a stone tablet. Once stored, it persists across browser restarts and computer reboots, remaining until it's explicitly removed by the user or through the clearing of the browser storage. Key uses include:

- **Token Storage for Authentication:** Web applications store authentication tokens in Local Storage, allowing users to remain logged in across browser restarts.
- **Shopping Cart Data:** E-commerce sites use Local Storage to keep shopping cart items even if the browser tab is closed.

An important aspect of Local Storage is its capacity limit, which is usually about 5MB. It's also accessible only on the client side and is not secure for sensitive data. A more secure alternative for storing sensitive user data would be by using backend cookies, which prevents malicious XSS attacks notably due to their httpOnly flag. The httpOnly flag ensures that the cookie's information is not readable by the client side JS, and instead only readable by the backend server that set them. You can learn more about cookies and how they compare to localstorage in our [comparison blog](https://supertokens.com/blog/cookies-vs-localstorage-for-sessions-everything-you-need-to-know).

**Session Storage** is more temporary, like a sandcastle. It holds data until that tab is kept alive. This means, that if the browser restarts, or if the tab is closed and new tab is opened, the sessionStorage for that page will be empty.. It's useful for:

 - **Form Data in Progress**: Temporarily saving user inputs in forms across page refreshes or navigations (within the same browser tab).
- **Temporary User Preferences**: Storing temporary settings or preferences during a single browser session, like filter settings on an e-commerce site.

Unlike Local Storage, Session Storage data is tab-specific. If you open the same site in two different tabs, they will each have their own separate Session Storage. This makes it ideal for situations where you don’t want data to persist across multiple tabs.

Both Local and Session Storage provide a simple and efficient way to store data on the client side without frequent server trips. However, due to their limitations in security and capacity, it’s crucial to use them judiciously and not for storing sensitive information.


| Feature 	| Local Storage 	| Session Storage 	|
|---	|---	|---	|
| Persistence 	| Data persists across browser restarts 	| Data is cleared when the page session ends (typically when the browser tab is closed) 	|
| Capacity 	| 5 MB 	| 5 MB 	|
| Use cases 	| Token Storage, Shopping Carts 	| Form Data, Temporary User Preferences 	|
| Expiration  	| Data does not expire; must be cleared manually or via script 	| Data expires automatically when the session ends. 	|


## Common Mistakes
Now, let's talk about the digital Houdinis who bypass the persistence of Local and Session Storage. Sometimes, in an effort to be clever, developers or users might inadvertently make the application insecure or behave unexpectedly.

### Common Mistakes for Local Storage
- **Not Managing Stored Data Over Time:** Unlike Session Storage, Local Storage data remains until explicitly removed. A common error is not managing or cleaning up this data over time, leading to unnecessary bloat and potential performance issues.

- **Assuming Session-Like Behavior:** Some developers mistakenly assume that data in Local Storage is tied to a session and will clear when the browser or tab closes. This misunderstanding can lead to privacy issues, as sensitive data such as passwords or credit card information might be left accessible on a shared or public computer.

- **Over-reliance on State Management:** Using Local Storage extensively for managing application state can lead to complex synchronization issues, especially in dynamic applications where the state changes frequently. On the bright side, specialized frameworks such as Redux can be helpful in managing state in ReactJS based applications.


## Common Mistakes for Session Storage
- **Expecting Cross-Tab Persistence:** A key misunderstanding about Session Storage is expecting it to share data across tabs or windows. Data stored in Session Storage is only accessible in the window or tab where it was set, which can lead to confusion or data inconsistencies in applications opened in multiple tabs.

- **Using for Long-Term Storage:** Since Session Storage is designed for data that only needs to persist during a single page session, using it for long-term data storage goes against its purpose. This can lead to data being lost unexpectedly when the browser or tab is closed.

## Security Considerations 

When diving into the world of web storage, it's crucial to swim with caution, especially when it comes to security. Local Storage and Session Storage, while handy, open up a Pandora's box of security vulnerabilities, notably cross-site scripting (XSS) risks.

### Understanding XSS Dangers
An XSS attack occurs when a web application unwittingly includes untrusted data in a webpage, allowing attackers to inject malicious scripts into a web application. This is particularly concerning for Local and Session Storage, as they can become unwitting storage lockers for such harmful scripts. The following are three prominent real-life XSS attacks that occurred in the past two decades:


- In 2010, YouTube faced a major XSS vulnerability where attackers injected malicious JavaScript into video comments, disrupting user experience and prompting security warnings. [Source](https://www.acunetix.com/blog/articles/dangerous-xss-vulnerability-found-on-youtube-the-vulnerability-explained/)

- In late 2015, eBay's unvalidated URL parameter led to an XSS attack, enabling hackers to access seller accounts and steal payment details, with continued related attacks until 2017. [Source](https://brightsec.com/blog/xss-attack/#:~:text=Here%20are%20common%20examples%3A,users%20and%20use%20their%20accounts)

- In 2018, Magecart hackers exploited an XSS flaw in British Airways' website, redirecting customer data to a fake server, leading to credit card skimming in 380,000 transactions. [Source](https://brightsec.com/blog/xss-attack/#:~:text=Here%20are%20common%20examples%3A,users%20and%20use%20their%20accounts)

```
function validateInput(inputText) {
    // Regular expression to match only letters, numbers, and basic punctuation (.,!?)
    var pattern = /^[a-zA-Z0-9 .,!?]+$/;

    // Validate the input text
    return pattern.test(inputText);
}
```

Think of it as a bouncer checking IDs at a club. Ensure that only the right data gets through. 


![Bouncer Gif](./name_on_list.gif)


Next, employ [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) which acts as a set of rules, dictating what's allowed and what's not in your webpage.  The exact content that is allowed depends on the policies you define. One key feature of CSP is the ability to dictate which domains are allowed to serve JavaScript files. This control is crucial as it ensures that scripts are only loaded from trusted sources, significantly reducing the risk of malicious script injection. Similarly, CSP allows you to specify which domains can provide CSS files. By doing so, you ensure that only approved styles from trusted sources are applied to your site.

## Conclusion

To sum up, effective use of Local and Session Storage is key in web development. Local Storage is best for long-term data, while Session Storage suits temporary, session-specific data. When dealing with local and session storage don’t forget to avoid common mistakes like mismanaging data and overlooking security risks, especially XSS attacks when building your app. Remember to include proper data handling, including both validation and encryption, as this is crucial for secure and efficient web applications. Mastering these tools ensures a better, safer user experience.
