
---
title: How to Authenticate and Authorize Users in a Node.js Express App
date: "2024-12-06"
description: "A step by step guide on how to Authenticate and Authorize Users in a Node.js Express App"
cover: "cover.png"
category: "programming"

---

# **Introduction**
Authentication and authorization are essential for web applications to ensure that only legitimate users gain access and that they can perform actions based on their permissions. **Node.js** and **Express.js** are popular tools for building these systems because they allow developers to create fast, scalable apps efficiently.

However, implementing authentication can be challenging—**securing passwords, managing sessions**, and ensuring tokens aren’t misused require careful planning. Authorization adds more complexity by defining user roles and permissions, ensuring users only access what they’re allowed to. Good user management is critical for protecting both **user data** and **application security**, while also maintaining a smooth user experience.
# **Handling Authorization in Node.js**

#### **Difference Between Authentication and Authorization**
- **Authentication:**
  This process confirms the **identity of the user**—essentially verifying who they are. It typically involves methods like **username and password checks**, **social login**, or **multi-factor authentication** (MFA). For example, when a user logs into an application, authentication ensures that the individual is who they claim to be.
- **Authorization:**
  Authorization determines **what actions or resources the authenticated user can access**. Once a user is authenticated, authorization checks whether they have the necessary permissions to perform specific operations, such as editing content or accessing admin features.

Authentication and authorization complement each other: authentication verifies the user, while authorization governs the **extent of their access** within the system.

-----
#### **Implementing Role-Based Access Control (RBAC)**
RBAC is a widely used strategy to **manage user permissions efficiently** by assigning roles to users. It simplifies authorization by grouping permissions under specific roles.

- **Assigning roles to users:**
  Users are given predefined roles such as **admin, editor, or viewer**. Each role corresponds to a set of permissions. For example:
  - **Admin**: Full access to all operations, including creating, editing, and deleting content.
  - **Editor**: Can modify content but lacks access to administrative settings.
  - **Viewer**: Read-only access to content.
- **Defining permissions for each role:**
  Each role has specific permissions that determine **what resources the user can access** and **what actions they can perform**. For example:
  - Admins can manage other users and change system configurations.
  - Editors can update or delete content but cannot manage users.
- **Importance of clear access rules:**
  - Well-defined access rules **reduce the risk of security loopholes**. For example, without proper role separation, unauthorized users could gain access to sensitive data or critical system operations.
  - **Consistency** in applying roles and permissions ensures better maintainability. Centralized control via middleware helps avoid inconsistencies, preventing scenarios where users have unintended privileges.

RBAC simplifies managing access, especially in applications with many users. By grouping permissions under roles, developers can ensure that **user privileges are clear and manageable**, helping to maintain a secure system.


# **Node.js User Authentication Prerequisites**
To set up a secure user [authentication system in Node.js](https://supertokens.com/blog/how-to-deploy-supertokens-with-react-nodejs-express-on-vercel), you’ll need several essential tools and packages. These will enable you to handle routing, password encryption, token management, and cookie parsing, laying the groundwork for a robust authentication flow.

**Setting Up the Environment**

Install the following packages

```bash
npm init -y
npm install express bcrypt jsonwebtoken cookie-parser
```

Run the server with the following command

```bash
node server.js
```

-----
**Choosing an Authentication Method**

There are several popular methods for handling authentication in web applications. Here’s an overview of the most commonly used approaches:

- **JWT (JSON Web Tokens)**: JWTs are used for **stateless authentication**, meaning the server doesn’t store session information. Instead, a token is generated when the user logs in, which includes encoded user data and is sent with each request. The server then verifies the token to authenticate the user, making JWTs ideal for scalable, stateless applications.
- **Session-based Authentication**: This method involves storing session data on the server to keep track of user activity. When a user logs in, a session is created on the server, and a unique session ID is sent to the user’s browser, often in a cookie. This session ID is then used to identify the user for future requests. Session-based authentication is commonly used in applications where maintaining user state is essential.
- **OAuth**: OAuth is often used for third-party login, allowing users to sign in with existing accounts from services like Google, Facebook, or GitHub. It simplifies user login by leveraging these providers for authentication, eliminating the need for users to create new credentials for each application. OAuth is widely used in applications that prioritize user convenience and wish to offer social login options.


**Setting Up the Server and Authentication Routes**

To configure the server, connect to MongoDB, and set up authentication routes, write the following code in the Index.js file:
### **Index.js**

```typescript
const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const dotenv = require('dotenv');

const Message = require('./models/Message');

const authRoutes = require('./routes/auth');

const auth = require('./middleware/auth');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());


// Routes

app.use('/api/auth', authRoutes);

// Protected route (only accessible with a valid token)

app.get('/api/private', auth, (req, res) => {

`   `res.send('This is a protected route');

` `});



app.get('/', (req, res) => {

`   `res.send('Hello World!');

});

app.post('/message', async (req, res) => {

`   `const newMessage = new Message({ text: req.body.text });

`   `try{

`       `await newMessage.save();

`       `res.status(201).json(newMessage);

`   `} catch (error) {

`       `res.status(500).json({ error: 'Error saving message' });

`   `}

})


mongoose

.connect(process.env.MONGO\_URI)

.then(() => console.log('MongoDB Connected'))

.catch((err) => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {

`   `console.log(`Server is running on port ${PORT}`);

});
```

# **How to Implement User Authentication in Node.js**
## **Backend Implementation**
### **Step 1: User Registration Process**
To securely register users, start by creating a Mongoose schema with fields for name, email, and password. Then, hash the password with bcrypt before saving it to enhance security. Finally, include basic validation to ensure required fields and unique email entries. To implement this setup, write the following code:

### **userModel.js/Models**
```typescript
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

`   `name: { type: String, required: true },

`   `email: { type: String, required: true, unique: true },

`   `password: { type: String, required: true },

` `});

// Hash password before saving

userSchema.pre('save', async function (next) {

`   `if (!this.isModified('password')) return next();

`   `this.password = await bcrypt.hash(this.password, 10);

`   `next();

` `});

module.exports = mongoose.model('User', userSchema);
```

### **Step 2: Login and Session Management**
To set up a secure login flow, validate user credentials by checking the stored hashed password in the database. JWT tokens will be used to maintain stateless sessions and manage token expiration, adding an extra layer of security. To implement this, write the following code in Auth.js/Routes:
### **Auth.js/Routes**
```typescript

const express = require('express');

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const router = express.Router();


// Register a new user

router.post('/register', async (req, res) => {

`   `const {name, email, password} = req.body;

`   `try{

`       `const newUser = new User({ name, email, password });

`       `await newUser.save();

`       `res.status(201).json({message: 'User registered successfully' });

`   `} catch (error) {

`       `res.status(400).json({ error: 'User already exists' });

`   `}

});


//Login user and generate JWT token

router.post('/login', async (req, res) => {

`   `const { email, password } = req.body;

`   `try{

`       `const user = await User.findOne({ email });

`       `if (!User) return res.status(404).json({ error: 'User not found'});

`       `const isMatch = await bcrypt.compare(password, user.password);

`       `if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

`       `const token = jwt.sign({ userId: user.\_id }, process.env.JWT\_SECRET, { expiresIn: '1h'});

`       `res.json({ token });

`   `} catch (error) {

`       `res.status(500).json({ error: 'Server error' });

`   `}

});

module.exports = router;
```
### **Step 3: Protecting Routes with Middleware**
To restrict access to certain routes, middleware is used to ensure only authenticated users can access specific pages or data. The following code demonstrates a middleware function that checks for a valid token, verifies it, and grants access if authenticated. Write this code in Auth.js/Middleware:
### **Auth.js/Middleware**
```typescript

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

`   `const token = req.header('Authorization')?.split(' ')[1];

`   `if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

`   `try {

`       `const decode = jwt.verify(token, process.env.JWT\_SECRET);

`       `req.user = decode;

`       `next();

`   `} catch (error) {

`       `res.status(400).json({ error: 'Invalid Token' });

`   `}

};

module.exports = auth;
```
This middleware function (auth) verifies if the request contains a valid JSON Web Token (JWT) in the authorization header. It checks for the token, verifies it using the secret key, and either allows access by calling next() or denies access if the token is invalid or missing.

For implementing registration and login with JWT generation, add the following routes in Auth.js/Routes:
### **Auth.js/Routes**
```typescript


const express = require('express');

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const router = express.Router();


// Register a new user

router.post('/register', async (req, res) => {

`   `const {name, email, password} = req.body;

`   `try{

`       `const newUser = new User({ name, email, password });

`       `await newUser.save();

`       `res.status(201).json({message: 'User registered successfully' });

`   `} catch (error) {

`       `res.status(400).json({ error: 'User already exists' });

`   `}

});


//Login user and generate JWT token

router.post('/login', async (req, res) => {

`   `const { email, password } = req.body;

`   `try{

`       `const user = await User.findOne({ email });

`       `if (!User) return res.status(404).json({ error: 'User not found'});

`       `const isMatch = await bcrypt.compare(password, user.password);

`       `if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

`       `const token = jwt.sign({ userId: user.\_id }, process.env.JWT\_SECRET, { expiresIn: '1h'});

`       `res.json({ token });

`   `} catch (error) {

`       `res.status(500).json({ error: 'Server error' });

`   `}

});

module.exports = router;

```
## **Frontend Implementation**
Finally, to create a simple login form that authenticates users, use the following code:
### **Login.js**
```typescript

import React, { useState } from 'react';

import axios from 'axios';

function Login({ onLogin }) { // Accept onLogin as a prop

` `const [email, setEmail] = useState('');

` `const [password, setPassword] = useState('');

` `const [message, setMessage] = useState('');

` `const handleSubmit = async (e) => {

`   `e.preventDefault(); // Prevents the page from refreshing on form submission

`   `try {

`     `const { data } = await axios.post('http://localhost:5000/api/auth/login', {

`       `email,

`       `password

`     `});

`     `localStorage.setItem('token', data.token); // Store JWT in localStorage

`     `setMessage('Login Successful');

`     `onLogin(); // Call onLogin to inform the App component of the login status

`   `} catch (error) {

`     `setMessage('Login failed. Check your credentials.');

`   `}

` `};

` `return (

`   `<div>

`     `<h2>Login</h2>

`     `<form onSubmit={handleSubmit}>

`       `<input

`         `type='email'

`         `placeholder='Email'

`         `value={email}

`         `onChange={(e) => setEmail(e.target.value)}

`       `/>

`       `<input

`         `type='password'

`         `placeholder='Password'

`         `value={password}

`         `onChange={(e) => setPassword(e.target.value)}

`       `/>

`       `<button type='submit'>Login</button>

`     `</form>

`     `<p>{message}</p>

`   `</div>

` `);

}

export default Login;
```

# **Common Pitfalls and Security Best Practices**
Building a secure authentication and authorization system requires more than just checking passwords and tokens. Developers must adopt a range of best practices to safeguard user data, prevent unauthorized access, and ensure smooth user experiences. This section highlights common vulnerabilities—like insecure password storage, session mismanagement, and token misuse—and provides practical solutions to address them effectively.
#### **Password Management**
- **Avoid storing plain-text passwords:** Store passwords securely using **encryption techniques like hashing**. Libraries such as bcrypt or argon2 generate hashed passwords that are computationally infeasible to reverse. This way, even if attackers gain access to the database, the original passwords remain protected.
- **Regularly update password policies:** Encourage the use of strong passwords and implement features like password expiration or complexity requirements to minimize vulnerabilities.
#### **Session and Token Management**
- **Short [expiration times for tokens](https://www.linkedin.com/pulse/deciding-token-expiration-time-subramanian-krishnan/):** Use **short-lived tokens** to limit the risk from compromised credentials. For instance, access tokens may expire in 15 minutes, and refresh tokens should be rotated frequently.
- **Store sensitive information securely:** Keep keys, secrets, and tokens safe by storing them in **environment variables**. Avoid hardcoding these sensitive values directly into the codebase to prevent exposure during development or deployment.
#### **Error Handling and Feedback**
- **Avoid exposing internal information:** Carefully design error messages to prevent leaking critical system information. For example, avoid messages like "Invalid username or password" to prevent attackers from inferring valid usernames.
- **Provide user-friendly but secure responses:** Make sure error messages offer users relevant feedback without revealing sensitive details.
#### **Using HTTPS**
- **Encrypt all communication between clients and servers** by using **HTTPS**. Encryption prevents sensitive data, such as login credentials or tokens, from being intercepted during transmission.
#### **CSRF Protection**
- **Prevent [Cross-Site Request Forgery (CSRF) attacks](https://portswigger.net/web-security/csrf):** Use **anti-CSRF tokens** for requests that modify data (non-GET requests). Libraries like csurf for Express or built-in protection from tools like **Supertokens** can simplify the process​.
#### **XSS Protection**
- **Mitigate Cross-Site Scripting (XSS) risks:** Use **HttpOnly cookies** to store tokens, ensuring they are inaccessible via JavaScript. This limits exposure to malicious scripts that might run on the client side. Additionally, validate user input and escape content properly to prevent injection attacks​.

By following these best practices, developers can create more secure systems, safeguarding both user data and the application from common vulnerabilities.

# **Simplify Authentication with Supertokens**
#### **Introduction to Supertokens**
Supertokens is a **developer-friendly authentication platform** designed to simplify the complexities of managing user sessions and secure access. It provides ready-made solutions for common challenges like **user registration, login flows, session handling, and token management**, so developers don't have to build these systems from scratch. With a focus on efficiency and security, Supertokens offers both flexibility and scalability for applications of all sizes.
#### <**How Supertokens Helps**
- **Session Management Made Easy:** Supertokens automatically handles **JWT-based sessions** and token rotation, eliminating the need for manual token configurations. This ensures **stateless authentication** with minimal setup.
- **Built-in Social Login:** It includes support for social login providers such as **Google and Facebook**, allowing users to sign up seamlessly without complex custom configurations.
- **Multi-Factor Authentication (MFA):** For applications that require **stronger security**, Supertokens provides support for **MFA** out of the box, offering advanced protection without adding unnecessary development overhead.
#### **Advantages Over Manual Implementation**
- **Development Efficiency:** By providing **secure, pre-built APIs**, Supertokens reduces the amount of time needed to set up authentication and session management.
- **Reliable and Tested Authentication Flows:** Supertokens ensures that **authentication processes work consistently** by adhering to best practices and implementing features like token rotation and expiration by default.
- **Lower Complexity:** With Supertokens managing the backend intricacies of authentication, teams can **focus on core application features**, reducing complexity while maintaining security.
#### **Supertokens’ Security Protections: CSRF and XSS Mitigation**
- **CSRF Protection:** Supertokens includes **built-in CSRF protection** for non-GET API routes. This ensures that only legitimate requests are processed, reducing the risk of unauthorized actions through cross-site request forgery attacks​.
- **XSS Protection:** For enhanced session security, Supertokens uses **HttpOnly cookies** to store tokens, which prevents them from being accessed by JavaScript in case of an XSS attack​. This makes session management safer by mitigating the risks associated with script injections.

Supertokens provides a secure, scalable solution that automates much of the work involved in authentication and session management. By implementing Supertokens, developers can ensure their applications are protected while also saving time and effort that would otherwise go into managing these systems manually.
# **Conclusion**
Authentication and authorization are essential for building secure web applications, requiring developers to carefully balance **security, usability, and performance**. These components ensure that only verified users gain access to the system and that their actions are appropriately controlled through permissions. This article covered the fundamental steps to build a secure authentication system, focusing on **user registration, login, session management, and role-based access control (RBAC)** to manage user permissions effectively.

For developers looking to streamline the implementation process, **Supertokens** offers a powerful, ready-to-use solution. It reduces the time and complexity of managing tokens, sessions, and user roles while incorporating **advanced security features** such as **XSS and CSRF protection**. Explore [Supertokens](https://supertokens.com/product) to **simplify your authentication system**, saving development effort and enhancing your application’s security and reliability​.

