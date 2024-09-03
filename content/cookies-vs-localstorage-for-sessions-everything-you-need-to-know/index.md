---
title: "Cookies vs. LocalStorage: Storing Session Data and Beyond"
date: "2024-08-16"
description: "Learn about the best approach and common misconceptions of storing sessions in cookies or browser storage"
cover: "cookies-vs-localstorage-for-sessions-everything-you-need-to-know.png"
category: "sessions"
author: "Darko Bozhinovski"
---


## Table of Content

- [Introduction](#introduction)
- [Understanding Cookies vs. Local Storage](#understanding-cookies-vs-local-storage)
- [What are Cookies?](#what-are-cookies)
- [What is LocalStorage?](#what-is-localstorage)
- [The Key Differences Between Cookies And Local Storage](#the-key-differences-between-cookies-and-local-storage)
- [When should you use which?](#when-should-you-use-which)
- [Cookies vs. LocalStorage For Session Storage](#cookies-vs-localstorage-for-session-storage)
- [Takeaway](#takeaway)

## Introdcution

On the web platform, we have several ways of storing data. As the title implies, the two most used ones are Cookies and the LocalStorage API. In this article, we'll explore what they are, what they are used (and abused) for, and how we can use them for authentication and session management.

## Understanding Cookies vs. Local Storage

To properly understand the differences between these two, we need to first examine the history of the web platform, the storage needs that arose with the increasing complexity of the apps we built for it, and the different methods available to store data in our browsers.

### The many ways to store data in the browser

Here's a handy table that goes over (some of) the methods to store data in modern browsers:

| Storage Method          | Type      | Description                                                                                                                                      | Storage Limit         | Persistence                                              |
|-------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|----------------------------------------------------------|
| **Cookies**              | Standard  | Small pieces of data stored by the browser are sent back to the server with every HTTP request. Primarily used for session management, authentication, and tracking user behavior. | ~4KB per cookie        | Typically set with an expiration date; can be session-based or persistent. |
| **Local Storage**        | Standard  | A key-value pair storage in the browser that persists data even after the browser is closed. Ideal for storing small amounts of data that need to persist across sessions.         | ~5-10MB per domain     | Persistent until explicitly deleted.                     |
| **Session Storage**      | Standard  | Similar to Local Storage, but data is only available for the page session duration. Data is cleared when the page or tab is closed.             | ~5-10MB per domain     | Session-based.                                           |
| **IndexedDB**            | Standard  | A low-level API for storing large amounts of structured data (including files and blobs). Provides a robust solution with support for transactions, searching, and indexing.     | Dependent on browser implementation; typically several GBs | Persistent until explicitly deleted.                     |
| **WebSQL**               | Non-Standard (Deprecated) | A database storage mechanism using SQL syntax. It was intended to be a more powerful alternative to Local Storage but was deprecated in favor of IndexedDB.                   | Similar to IndexedDB   | Persistent until explicitly deleted.                     |
| **File System Access API** | Non-Standard (Emerging Standard) | Allows web applications to read and write to the local file system, providing a powerful way to manage files directly on a user's device.                                           | It depends on user permissions and browser implementation. | Persistent until explicitly deleted by the application or user. |

While Cookies, Local Storage, Session Storage, and IndexedDB are standards and widely accepted, WebSQL, although still in use in some places, is being phased out. The File System Access API is relatively new, and even though it's considered an emerging standard, we're not sure how well-supported it will be outside of the Chromium family of browsers.

As a general rule, if you don't have a really specific case to deal with, use the widely supported standards. That's the only guaranteed path to a good client-side storage UX for all your users, regardless of their browser choice.

## What are Cookies?

Cookies have been with us for quite a while - initially, they were introduced back in '94 and were widely accepted by '95. On the surface, Cookies are a simple idea - to quote Wikipedia:

> Cookies are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or another device by the user's web browser.

And that idea was pretty good for the early days of the web platform - we got to use a whopping 4096 bytes per cookie! This joke aside, was pretty decent for the early days of the web, but the stuff we built and deployed on the web got increasingly complex. With that complexity, however, we soon realized that we either have to limit ourselves to 4KB of storage, cobble together something that uses multiple cookies (still limited), or call it a day and let the server worry about storage.

One of the answers to that problem became LocalStorage.

## What is LocalStorage?

LocalStorage (okay, the localStorage part of Web Storage, if we're being pedantic) was introduced as a part of the HTML5 specification to address some of the limitations of Cookies (most obviously, the storage size).

Unlike Cookies, which are sent with every HTTP request, LocalStorage allows web applications to store much more data in the browser. The key advantage here is its storage capacity—rather than being limited to a few kilobytes like Cookies, LocalStorage allows for around 5 to 10 megabytes of data per domain, depending on the browser.

This makes LocalStorage particularly useful for storing persistent data you don’t need to send to the server with every request. Think user preferences, UI state, or any other data that needs to persist between sessions but doesn’t need to be shared with the server.

## The Key Differences Between Cookies And Local Storage

Let's first have a look at how they compare to one another in terms of technical specification:

| Feature                 | Cookies                               | Local Storage                      |
|-------------------------|---------------------------------------|------------------------------------|
| **Storage Capacity**    | ~4KB per cookie                       | ~5-10MB per domain                 |
| **Expiration**          | Can be set with an expiration date; can be session-based or persistent | Persistent until explicitly deleted |
| **Data Transmission**   | Sent with every HTTP request to the server | Not sent with HTTP requests, client-side only |
| **Accessibility**       | Accessible from both client and server-side | Accessible only from the client-side |
| **Security**            | Vulnerable to cross-site scripting (XSS); can be marked as HttpOnly and Secure to reduce risk | Vulnerable to XSS; not suitable for sensitive data |
| **API**                 | `document.cookie` for manual handling; set/get via HTTP headers | `localStorage.setItem()` and `localStorage.getItem()` methods |
| **Scope**               | Accessible by all paths of the domain, subdomains, and across protocols (with domain and path attributes) | Scoped to the domain and protocol (origin) |

### Setting and getting data with Cookies

Now, I'm not going to beat around the bush - the standard API for Cookies is... mildly put, outdated. And certainly not too user-friendly by today's DX standards.

Here's an example:

```javascript
// Setting a cookie
document.cookie = "username=JohnDoe; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; 

// Getting a cookie
let allCookies = document.cookie; 
console.log(allCookies); // Example output: "username=JohnDoe; theme=dark; sessionToken=abc123"

// Example: Parsing a specific cookie value manually
let cookiesArray = allCookies.split('; ');
let usernameCookie = cookiesArray.find(cookie => cookie.startsWith('username='));
let username = usernameCookie ? usernameCookie.split('=')[1] : null;

console.log(username); // Outputs: "JohnDoe"
```

By now it's probably obvious that using the raw API might not be the best experience. Luckily, we have a ton of libraries to help with that - `js-cookie` is my favorite, but NPM offers a lot of choices on the matter.

### Setting and getting data with LocalStorage

LocalStorage is a lot more modern compared to the Cookies API:

```js
// Setting an item
localStorage.setItem("username", "JohnDoe");

// Getting an item
let username = localStorage.getItem("username");
console.log(username);  // Outputs: JohnDoe
```

No library is necessary (at least for the common use cases). However, there is an important caveat. It's a bit more obvious with cookies - everything is a string. You're always storing and parsing a string. The same applies to LocalStorage too - you can store numbers, booleans, even more complex things like objects and arrays. However, the result of using setItem with those types is probably not what you'd expect:

```js
// Properly storing and retrieving complex data types

// Storing an object
const user = { name: 'John', age: 30 };
localStorage.setItem('user', JSON.stringify(user));

// Retrieving and parsing the object
const retrievedUser = JSON.parse(localStorage.getItem('user'));
console.log(retrievedUser);  // Outputs: { name: "John", age: 30 }
```

### When should you use which?

"It depends." That's obvious, but humor aside, the answer to this will always depend on what you're trying to do. As we've seen, both Cookies and LocalStorage have pros and cons.

#### Cookies

**Session Management and Authentication:** Cookies, especially with the HttpOnly and Secure flags, are the best choice for storing session tokens securely. They are automatically sent with every HTTP request, which makes them ideal for server-side authentication and session persistence across browser tabs and page reloads.

**Subdomain and Cross-Domain Session Sharing:** Cookies are also advantageous when sharing session data across subdomains (e.g., `app.yoursite.com` and `admin.yoursite.com`). By setting the Domain attribute to `.yoursite.com`, the same session data can be shared across different subdomains seamlessly.

**Automatic Expiry Management:** For sessions that need to expire after a certain amount of time (e.g., logins expiring after 30 minutes), cookies offer an automatic way to handle this through the `expires` or `max-age` attributes.

#### Local Storage

**Persistent UI and Application State:** Local Storage is well-suited for storing client-side application data that doesn't need to be sent to the server on every request, such as user preferences (e.g., themes, layout configurations) or progress in a multi-step form. It's ideal for keeping this data persistent across page reloads or browser sessions.

**Single-Page Applications (SPAs):** If you're building an SPA where most of the user interaction happens without reloading the page or making server requests, Local Storage is a good option for storing application state or non-sensitive session data.

### Cookies vs. LocalStorage For Session Storage

To narrow things down to the session storage use case, let's see how Cookies compare to LocalStorage:

#### When To Use Cookies To Store Session Data

In most cases, cookies are the recommended choice for session storage, particularly when security is a top priority. This is because cookies can be configured with the HttpOnly and Secure flags, which greatly reduce the attack surface for session token theft.

**Secure Authentication:** If you're managing user authentication, you should use cookies to store session tokens. The HttpOnly flag ensures that JavaScript running on the page cannot access the cookie, reducing the risk of XSS attacks. The Secure flag guarantees the cookie is only sent over HTTPS, preventing exposure on insecure connections.

**Server-Side Sessions:** Since cookies are automatically sent with every request to the server, they are the ideal choice for traditional server-side session management. This makes them particularly useful in web applications where the server is responsible for maintaining session state, such as server-rendered applications or when interacting with APIs that require authentication on every request.

**Subdomain Sharing:** If your application spans multiple subdomains (e.g., `shop.yoursite.com` and `auth.yoursite.com`), cookies allow for sharing session tokens across these subdomains. By setting the domain attribute, you can ensure that a user logged in on one subdomain remains authenticated across the others.

**Cross-Site Scripting Protection:** Cookies are generally more secure for storing session tokens, particularly if you're concerned about XSS attacks. By leveraging the HttpOnly and SameSite flags, you can minimize the attack surface and mitigate both XSS and CSRF attacks.

In a nutshell, anything auth-specific should likely end up in a Cookie.

#### When To Use Local Storage To Store Session Data

Local Storage can be used for session storage in certain scenarios, but this approach is generally less secure. It should be considered only when the risk of XSS is minimal or when the session data is not sensitive.

**Single-Page Applications (SPAs):** If you're building a client-side-only application where session tokens are needed to persist across page reloads but do not need to be sent with every HTTP request, Local Storage might be a more straightforward solution. However, you need to be cautious about XSS risks and ensure your application is properly secured.

**Short-Lived Sessions:** Local Storage can be used for short-lived non-sensitive sessions where tokens are discarded after a single user interaction or within the same session. This is particularly useful when you don't need the tokens to persist across tabs or page reloads.

**Local Caching:** Local Storage is useful for storing non-sensitive data that enhances the user experience, such as session-based UI state or data retrieved from an API that needs to persist across sessions. For example, if you need to store a user's shopping cart across browser sessions, Local Storage can hold this data without repeatedly fetching it from the server.

**Offline Usage:** For offline-first applications where you need to cache session data while the user is disconnected from the internet, Local Storage provides a way to temporarily hold session tokens until the application reconnects to the server. However, caution must be taken to ensure these tokens are cleared or handled securely once the user reconnects.

In a nutshell, anything that's a setting that's important to the client-side can go in LocalStorage. You can store session data in LocalStorage, but in general, it should be avoided if possible.

## Takeaway

In summary:

- Cookies are the go-to choice for secure session management and authentication due to their ability to mitigate XSS and CSRF attacks.
- Local Storage is best suited for client-side state management and non-sensitive session data in SPAs, but it's generally not recommended for storing authentication tokens due to security risks.
