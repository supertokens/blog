---
title: Angular Authentication: Secure Your App the Right Way
description: "Learn how Angular authentication works, key methods to secure apps, and how to integrate with providers like SuperTokens or OAuth."
date: "2025-05-18"
cover: "TODO.png"
category: "programming, angular, authentication"
author: "Maurice Saldivar"
---

# Angular Authentication – A Complete Guide for Secure Web Apps

## What Is Authentication in Angular?

Before a user can access protected components, routes, or APIs Angular must first Authenticate them. This verification is fundamental to web security, creating a barrier that prevents unauthorized users from accessing sensitive information or performing restricted actions. 

## Authentication From A High Level

Authentication is essentially about confirming “who you are” before granting access. In Angular applications, this involves validating users, like usernames and passwords, or verifying tokens from a trusted identity provider. When implemented properly, authentication creates a secure foundation for your application by ensuring only verified users can enter protected areas. 

## Why It Matters

* **Route Protection:** Prevents unauthorized access to sensitive parts of your application  
* **Data Security:** Safeguards account information  
* **API Protection:** Ensures only authenticated users can make requests to specific backend services   
* **Regulatory Compliance:** Many industries require proper authentication for legal standard, e.g. SOC 2   
*  **User Trust:** A secure systems builds confidence in your platform

Without robust authentication, your Angular application becomes vulnerable to countless security threats, it's only a matter of time until user data is compromised. 

## Angular’s Role

Angular itself doesn’t implement authentication protocols directly. Instead, it provides a framework that makes integration with authentication systems a simple reality. 

* **Client-side Routing:** Angular’s router enables protection of routes through guards that can prevent navigation to restricted routes.  
* **HTTP Interceptors:**  Automatically attach authorization tokens, handle token refreshes, and manage authentication errors.  
* **Reactive Forms:** Handle secure collection of user credentials.   
* **Services Pattern:** Provides a clean battle tested architecture for authentication. 

Remember for the actual identity verification, Angular relies on external authentication providers. These can range from your own custom backend solution to open-source solutions like SuperTokens. 

The separation of concerns allows Angular applications to integrate with virtually any authentication system while maintaining a clean architecture focused on delivering the core user experience.  

## Authentication vs Authorization in Angular

People often use authentication and authorization interchangeably; this is a mistake, both serve distinct security functions in Angular applications. 

### Verifying Who The User Is:

Authentication is fundamentally about identity verification, confirming that users are who they claim to be; this involves: 

* Username and password validation
* Social login integration
* Biometric Verification
* Multi-factor authentication (MFA)
* Single sign-on (SSO) systems

The auth process usually results in a security token being issued that serves as digital proof for subsequent requests. 

## Authorization – Determining What They Can Access

Authorization, on the other hand, determines what authenticated users can do within your application. This involves:

* Defines and enforces permission boundaries  
* Controls access to specific routes, components, and features  
* Restricts data visibility based on user roles  
* Manages feature availability according to subscription levels  
* Prevents unauthorized operations on backend resources


Even after a user authenticates successfully, authorization ensures they can only access the resources appropriate for their role or permission level.

## Common Confusion in Angular

A prevalent misconception among Angular developers is treating route guards as complete authentication solutions, rather than authorization mechanisms. This confusion can lead to security gaps in application design.

Route guards like `CanActivate` and `CanLoad` are primarily authorization tools that enforce access rules, but they rely on a proper authentication system to function correctly. The common points of confusion include:

* **Guards Don't Authenticate**: Route guards check if a user is authorized to access a route but don't perform the actual authentication. They typically consult an authentication service that manages the user's authenticated state.  
* **Client-Side Vulnerability**: Since route guards run in the browser, they can be bypassed by savvy users if not backed by server-side authorization checks. Guards should be viewed as a UX enhancement rather than the sole security measure.  
* **Token Validation**: Many developers mistakenly assume checking for the presence of a token in local storage is sufficient for authentication. Proper implementation requires validating the token's integrity, expiration, and permissions.

For secure Angular applications, authentication and authorization should work in harmony—authentication services verify identity and manage tokens, while route guards use this authentication state to enforce access policies throughout the application. The backend must always validate both authentication and authorization independently, as client-side checks can be circumvented.

## Core Components of Angular Authentication

A robust authentication system in Angular relies on several key components working together to create a secure user experience.

### Login UI Form

The login form is your authentication system's entry point, available in two main implementations:

**Custom-built forms** offer maximum flexibility, with reactive forms providing type safety and robust validation. These forms can be precisely tailored to match your application's specific requirements and user flows.

**Component library-based forms** accelerate development through pre-built, tested components from libraries like Angular Material or NgBootstrap. These ready-made solutions handle common authentication patterns while allowing customization to match your design.

An effective login interface balances security with usability, incorporating elements like password strength indicators and meaningful error messages.

### HTTP Interceptors

Interceptors are middleware components that transparently manage authentication across API requests by:

* Automatically adding authorization tokens to outgoing requests  
* Managing token refresh flows when credentials expire  
* Handling authentication-related errors  
* Implementing logout logic when authentication fails

This centralized token management eliminates the need to manually handle authentication headers throughout your codebase, improving security and reducing code duplication.

### Route Guards

Guards protect navigation paths based on authentication status, connecting your auth system to Angular's routing framework:

* **CanActivate**: Controls access to routes based on authentication  
* **CanLoad**: Prevents unauthorized loading of lazy-loaded modules  
* **CanActivateChild**: Protects child routes within a configuration  
* **CanDeactivate**: Controls navigation away from protected content

These guards create a coherent security layer that directs users to appropriate content while preventing unauthorized access to protected resources.

### State Management

Authentication state must be securely maintained throughout the user session:

**Browser storage** (localStorage/sessionStorage) offers simple persistence but with security limitations regarding XSS vulnerabilities.

**Cookies** provide enhanced security options through HttpOnly, Secure, and SameSite flags that protect against common attack vectors.

**State management libraries** like NgRx or NGXS offer robust solutions for complex authentication flows in larger applications, with features like centralized state and action tracking.

**In-memory services** balance security and simplicity by keeping authentication state in application memory, reducing exposure to client-side attacks.

The right combination of these components creates an authentication system that effectively protects your application while providing a seamless experience for legitimate users.

## Popular Authentication Methods in Angular

### Token-Based (JWT)

JWT (JSON Web Token) authentication is the most widely adopted method in modern Angular applications. After successful login, the server generates a signed JWT containing encoded user information and permissions. This token is then:

* Stored on the client (localStorage, sessionStorage, or memory)  
* Attached to subsequent API requests via HTTP interceptors  
* Validated by the server without requiring database lookups

JWTs are self-contained and stateless, making them ideal for scalable applications. However, they require careful implementation regarding token expiration, refresh strategies, and secure storage to prevent XSS attacks.

### Session-Based Auth

The traditional authentication approach uses server-side sessions paired with client cookies. When implementing this in Angular:

* Server creates a session ID upon successful login  
* Session ID is stored in an HttpOnly cookie  
* Server maintains session state and validates cookies on each request  
* Angular handles CSRF protection through interceptors

This method offers stronger security against XSS attacks through HttpOnly cookies but creates server-side state that can complicate scaling. Modern implementations often use Redis or similar technologies to manage distributed session storage.

### OAuth 2.0 \+ OIDC Integration

For applications requiring social logins or enterprise single sign-on (SSO), OAuth 2.0 with OpenID Connect provides a standardized authentication framework:

* Angular delegates authentication to trusted providers (Google, Microsoft, Auth0)  
* Libraries like `angular-oauth2-oidc` simplify integration  
* Authorization code flow with PKCE is recommended for SPA security  
* Access tokens, ID tokens, and refresh tokens are managed separately

This approach offloads complex security concerns to specialized providers while enabling seamless integration with existing identity ecosystems. It's particularly valuable for enterprise applications requiring compliance with security standards.

### Passwordless

Increasingly popular passwordless authentication eliminates password vulnerabilities through alternative verification methods:

* Magic links sent to verified email addresses  
* One-time passcodes (OTPs) delivered via SMS or email  
* WebAuthn/FIDO2 for biometric and security key authentication

Libraries like SuperTokens provide Angular-compatible implementations that handle the complex workflows involved in secure passwordless authentication. This method improves security by eliminating password-related vulnerabilities while often enhancing user experience through simplified login flows.

Each authentication method has distinct security characteristics and implementation requirements. Many modern Angular applications implement hybrid approaches, combining multiple methods to balance security with user experience based on specific application requirements.

## Step-by-Step Guide – Implementing JWT Auth in Angular

Before we begin let’s make sure we have a project structure  
`mkdir jwt-auth-project`

1. ### Set up the Backend to Issue JWTs

   We’ll be making use of Node.js for our backend
   
   ```
    cd jwt-auth-project
    mkdir backend
    cd backend
   ```
    
   use `npm` to init our project  
   
   ```  
   npm init -y
   npm install express jsonwebtoken cors dotenv cookie-parser
   ```

   Create a simple js server that can issue JWT tokens, provides public and private api routes, and some traceability so we can see what’s happening in our system.   
     
   File: `backend/server.js`  

    ```javascript
    const express = require('express');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    const cookieParser = require('cookie-parser');
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 3000;
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true // Important for cookies
    }));
    app.use(express.json());
    app.use(cookieParser()); // Needed to parse cookies from requests

    // Mock user database
    // IMPORTANT: In a production environment, NEVER store passwords in plain text.
    // Always use a hashing library like bcrypt to hash passwords securely.
    const users = [{
        id: 1,
        username: 'miles@web.com',
        password: 'e-1610'
    }];

    app.post('/api/login', (req, res) => {
    console.log('Login attempt received:', req.body);
    
    const { username, password } = req.body;
    console.log('Credentials extracted:', { username, password });
    
    const user = users.find(u => u.username === username);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
        console.log('User not found, returning 401');
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = password === user.password;
    console.log('Password valid:', isPasswordValid);
    console.log('Received password:', password);
    console.log('Stored password:', user.password);
    
    if (!isPasswordValid) {
        console.log('Password invalid, returning 401');
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('Authentication successful, generating token');
    
    // Generate JWT
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Option 1: Send JWT as HttpOnly cookie (more secure)
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
    });
    console.log('Token generated and cookie set');
    
    // Option 2: Send JWT in response body (for sessionStorage)
    res.json({ 
        message: 'Login successful',
        token, // Remove this in production if using HttpOnly cookies
        user: { id: user.id, username: user.username }
    });
    console.log('Login response sent');
    });

    // User must be authd for this route
    app.get('/api/protected', verifyToken, (req, res) => {
    console.log('Protected route accessed by:', req.user?.username);
    res.json({ 
        message: 'This is protected data', 
        user: req.user,
        timestamp: new Date().toISOString()
    });
    });

    // Token verification middleware
    function verifyToken(req, res, next) {
    console.log('Verifying token...');
    
    // Option 1: Get token from cookies
    const tokenFromCookie = req.cookies?.jwt_token;
    console.log('Token from cookie:', tokenFromCookie ? 'Present' : 'Not present');
    
    // Option 2: Get token from Authorization header
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    console.log('Token from header:', tokenFromHeader ? 'Present' : 'Not present');
    
    const token = tokenFromCookie || tokenFromHeader;
    
    if (!token) {
        console.log('No token found, access denied');
        return res.status(401).json({ message: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token verified successfully for user:', decoded.username);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
    }

    app.post('/api/logout', (req, res) => {
    console.log('Logout request received');

    res.clearCookie('jwt_token');
    console.log('JWT cookie cleared');
    res.json({ message: 'Logged out successfully' });
    });

    app.get('/api/hello', (req, res) => {
    console.log('Hello endpoint accessed');
    res.json({ 
        message: 'Hello from the server!',
        timestamp: new Date().toISOString()
    });
    });

    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test credentials: user@example.com / auth123');
    console.log('Available endpoints:');
    console.log('  POST /api/login - Login endpoint');
    console.log('  GET /api/protected - Protected endpoint (requires authentication)');
    console.log('  POST /api/logout - Logout endpoint');
    console.log('  GET /api/hello - Public test endpoint');
    });
    ```
    File: `backend/.env`  
    ```javascript
    JWT_SECRET=your-secret-key 
    PORT=3000
    ```


    The `.env` file contains environment variables that your server uses at runtime.

    **Note:** With the `.env` file the default values in server.js will be used, which is fine for development but not secure for production.

2. ### Login Component with Form Submission

    Let's create the Angular Authentication Components, navigate to the top level project directory and run the `ng new` cmd. This will create a `frontend` directory.

    ```
    ng new frontend --routing=true --style="scss" --package-manager="npm" --skip-git=true  --skip-tests=true
    ```



    File: `frontend/src/app/auth/auth.service.ts`
    ```javascript
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { BehaviorSubject, Observable, tap } from 'rxjs';

    @Injectable({
    providedIn: 'root'
    })
    export class AuthService {
    private apiUrl = 'http://localhost:3000/api';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    
    constructor(private http: HttpClient) {
        // Check sessionStorage for existing user on service init
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }
    
    login(username: string, password: string): Observable<any> {
        console.log('Login attempt:', username);
        
        return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, {
        withCredentials: true // Important for cookies
        }).pipe(
        tap(response => {
            console.log('Login response received:', response);
            
            // If using sessionStorage (Option 2)
            if (response.token) {
            const user = {
                ...response.user,
                token: response.token
            };
            
            // Store user details in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            console.log('User stored in session storage');
            }
            // If using HttpOnly cookies (Option 1)
            else if (response.user) {
            this.currentUserSubject.next(response.user);
            }
        })
        );
    }
    
    logout(): Observable<any> {
        console.log('Logout service method called');
        
        return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
        withCredentials: true // Important for cookies
        }).pipe(
        tap(() => {
            console.log('Logout response received, clearing session storage');
            // Clear sessionStorage
            sessionStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
            console.log('Current user reset to null');
        })
        );
    }
    
    get currentUserValue() {
        return this.currentUserSubject.value;
    }
    
    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }
    }
    ```

    File: `frontend/src/app/auth/login/login.component.ts`
    ```javascript
    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
    import { Router } from '@angular/router';
    import { CommonModule } from '@angular/common';
    import { HttpClient } from '@angular/common/http';
    import { AuthService } from '../auth.service';

    @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule], // These are critical!
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
    })
    export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    error = '';
    apiResponse: any = null; // Property for API test results
    
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private http: HttpClient // Required for API testing
    ) { }
    
    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
        });
        
        // Redirect if already logged in
        if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
        }
    }
    
    onSubmit(): void {
        if (this.loginForm.invalid) {
        return;
        }
        
        this.loading = true;
        this.error = '';
        
        const { username, password } = this.loginForm.value;
        
        this.authService.login(username, password)
        .subscribe({
            next: () => {
            this.router.navigate(['/dashboard']);
            },
            error: err => {
            this.error = err.error?.message || 'Login failed';
            this.loading = false;
            }
        });
    }
    
    // Add testApi method for API testing
    testApi(endpoint: 'hello' | 'protected'): void {
        console.log(`Testing ${endpoint} API endpoint`);
        this.apiResponse = null; // Clear previous response
        
        this.http.get(`http://localhost:3000/api/${endpoint}`, {
        withCredentials: true // Important for cookies
        }).subscribe({
        next: (response) => {
            console.log(`${endpoint} API response:`, response);
            this.apiResponse = response;
        },
        error: (error) => {
            console.error(`${endpoint} API error:`, error);
            this.apiResponse = {
            error: true,
            message: error.error?.message || error.statusText || 'Unknown error',
            status: error.status
            };
        }
        });
    }
    }
    ```

    File: `frontend/src/app/auth/login/login.component.html`
    ```javascript
    <div class="login-container">
    <h2>Login</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
        <label for="username">Email</label>
        <input
            type="email"
            id="username"
            formControlName="username"
            class="form-control"
            [ngClass]="{ 'is-invalid': loginForm.get('username')?.touched && loginForm.get('username')?.invalid }"
        />
        <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" class="invalid-feedback">
            <div *ngIf="loginForm.get('username')?.errors?.['required']">Email is required</div>
            <div *ngIf="loginForm.get('username')?.errors?.['email']">Please enter a valid email</div>
        </div>
        </div>
        
        <div class="form-group">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            formControlName="password"
            class="form-control"
            [ngClass]="{ 'is-invalid': loginForm.get('password')?.touched && loginForm.get('password')?.invalid }"
        />
        <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="invalid-feedback">
            <div *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</div>
        </div>
        </div>
        
        <div class="form-group">
        <button [disabled]="loading || loginForm.invalid" class="btn btn-primary">
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        </div>
        
        <div *ngIf="error" class="alert alert-danger mt-3">
        {{ error }}
        </div>
    </form>
    
    <div class="api-test">
        <h3>API Test</h3>
        <p class="test-description">You can test the API endpoints before and after login to see how authentication works.</p>
        <button (click)="testApi('hello')" class="test-btn">Test Public API</button>
        <button (click)="testApi('protected')" class="test-btn">Test Protected API</button>
        
        <div *ngIf="apiResponse" class="response-box">
        <h4>API Response:</h4>
        <pre>{{ apiResponse | json }}</pre>
        </div>
    </div>
    </div>

    ```

    File: `frontend/src/app/auth/login/login.component.scss`
    ```javascript
    .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    
    h2 {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .form-group {
        margin-bottom: 15px;
        
        label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        }
        
        .form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        
        &.is-invalid {
            border-color: #dc3545;
        }
        }
        
        .invalid-feedback {
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        }
        
        .btn {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &:disabled {
            background-color: #7abaff;
            cursor: not-allowed;
        }
        }
    }
    
    .alert {
        padding: 10px;
        border-radius: 4px;
        
        &.alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        }
    }
    
    .api-test {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        
        h3 {
        margin-bottom: 10px;
        font-size: 18px;
        }
        
        .test-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
        }
        
        .test-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 12px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        cursor: pointer;
        }
        
        .test-btn:hover {
        background-color: #0069d9;
        }
        
        .response-box {
        margin-top: 15px;
        padding: 15px;
        background-color: #f1f1f1;
        border-radius: 4px;
        overflow: auto;
        
        h4 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        pre {
            margin: 0;
            white-space: pre-wrap;
            font-size: 13px;
        }
        }
    }
    }
    ```

3. ### Store JWT Securely
    In our implementation, we've provided two options for storing JWTs, with HttpOnly cookies as the recommended approach and sessionStorage as a fallback:

    **Option 1:** HttpOnly Cookies (Primary Recommended Approach)

    * Cookies with the HttpOnly flag cannot be accessed by JavaScript
    * Provides protection against XSS attacks
    * Automatically sent with every request to the same domain
    * Requires proper CORS configuration on the server

    **Option 2:** sessionStorage (Fallback Option)

    * Clears when the browser tab is closed (unlike localStorage)
    * Still vulnerable to XSS attacks, but preferable to localStorage
    * Must be manually attached to each request

    Our implementation supports both approaches simultaneously:

    * The backend sets an HttpOnly cookie for optimal security
    * The frontend also stores the token in sessionStorage as a fallback
    * The JWT interceptor uses whichever method is available

    **Why SessionStorage over LocalStorage?**

    * Security: sessionStorage is cleared when the browser tab is closed, reducing the window of vulnerability
    * Session-based: Better aligns with the temporary nature of authentication tokens
    * Isolation: Each tab gets its own sessionStorage, preventing session leakage between tabs

4. ### Attach JWT to Requests
    Let's create an HTTP interceptor to automatically attach the JWT to all outgoing requests. Angular offers two ways to create interceptors: class-based and function-based.

    File: `frontend/src/app/interceptors/jwt.interceptor.ts`
    ```javascript
    import { HttpInterceptorFn } from '@angular/common/http';
    import { inject } from '@angular/core';
    import { AuthService } from '../auth/auth.service';

    export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    
    // Get the current user from the auth service
    const currentUser = authService.currentUserValue;
    
    // If using sessionStorage and we have a token, add it to the Authorization header
    if (currentUser && currentUser.token) {
        request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
        }
        });
    }
    
    // If the endpoint requires credentials (for HttpOnly cookies), add withCredentials
    if (request.url.includes('/api/')) {
        request = request.clone({
        withCredentials: true
        });
    }
    
    return next(request);
    };
    ```

    Register the function-based interceptor in `frontend/src/app/app.config.ts`
    ```javascript
    import { ApplicationConfig } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { provideHttpClient, withInterceptors } from '@angular/common/http';

    import { routes } from './app.routes';
    import { jwtInterceptor } from './interceptors/jwt.interceptor';

    export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([jwtInterceptor]))
    ]
    };

    ```

5. ### Protect Routes w/ Guards
    Create an authentication guard to protect routes.

    File: `frontend/src/app/guards/auth.guard.ts`
    ```javascript
    import { Routes } from '@angular/router';
    import { LoginComponent } from './auth/login/login.component';
    import { DashboardComponent } from './dashboard/dashboard.component';
    import { AuthGuard } from './guards/auth.guard';

    export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard] 
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
    ];
    ```

6. ### Logout Mechanism
    We already implemented the logout method in our auth service. Let's add a simple component to use it.

    File: `frontend/src/app/auth/logout/logout.component.ts`
    ```javascript 
    import { Component } from '@angular/core';
    import { Router } from '@angular/router';
    import { AuthService } from '../auth.service';

    @Component({
    selector: 'app-logout',
    template: `
        <button class="logout-btn" (click)="logout()">
        Logout
        </button>
    `,
    styles: [`
        .logout-btn {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        }
        .logout-btn:hover {
        text-decoration: underline;
        }
    `]
    })
    export class LogoutComponent {
    
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    
    logout(): void {
        this.authService.logout().subscribe({
        next: () => {
            this.router.navigate(['/login']);
        },
        error: err => {
            console.error('Logout error:', err);
            // Even if the server request fails, we want to clear local state
            sessionStorage.removeItem('currentUser');
            this.router.navigate(['/login']);
        }
        });
    }
    }
    ```

    File: `frontend/src/app/dashboard/dashboard.component.ts`
    ```javascript
    import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { HttpClient } from '@angular/common/http';
    import { Router } from '@angular/router';
    import { AuthService } from '../auth/auth.service';

    @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="dashboard">
        <h2>Welcome to your Dashboard</h2>
        <p>Hello, {{ currentUser?.username }}</p>
        
        <div class="auth-status" *ngIf="currentUser">
            <h3>Authentication Status</h3>
            <p><strong>Status:</strong> Authenticated</p>
            <p><strong>Auth Method:</strong> {{ hasToken ? 'JWT in sessionStorage' : 'HttpOnly Cookie' }}</p>
            
            <div class="api-test">
            <h3>API Test</h3>
            <button (click)="testApi('hello')" class="test-btn">Test Public API</button>
            <button (click)="testApi('protected')" class="test-btn">Test Protected API</button>
            
            <div *ngIf="apiResponse" class="response-box">
                <h4>API Response:</h4>
                <pre>{{ apiResponse | json }}</pre>
            </div>
            </div>
        </div>
        
        <div class="actions">
            <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
        </div>
    `,
    styles: [`
        .dashboard {
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        }
        
        .auth-status {
        margin: 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 5px;
        }
        
        .api-test {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        }
        
        .test-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 12px;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        }
        
        .test-btn:hover {
        background-color: #0069d9;
        }
        
        .response-box {
        margin-top: 15px;
        padding: 15px;
        background-color: #f1f1f1;
        border-radius: 4px;
        overflow: auto;
        }
        
        pre {
        margin: 0;
        white-space: pre-wrap;
        }
        
        .actions {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        text-align: right;
        }
        
        .logout-btn {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        }
        
        .logout-btn:hover {
        text-decoration: underline;
        }
    `]
    })
    export class DashboardComponent implements OnInit {
    currentUser: any;
    hasToken: boolean = false;
    apiResponse: any = null;
    
    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private router: Router
    ) {}
    
    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
        console.log('Dashboard received user update:', user);
        this.currentUser = user;
        
        // Check if we're using token-based auth (sessionStorage)
        const storedUser = sessionStorage.getItem('currentUser');
        this.hasToken = storedUser ? true : false;
        });
    }
    
    testApi(endpoint: 'hello' | 'protected'): void {
        console.log(`Testing ${endpoint} API endpoint`);
        this.apiResponse = null; // Clear previous response
        
        this.http.get(`http://localhost:3000/api/${endpoint}`, {
        withCredentials: true // Important for cookies
        }).subscribe({
        next: (response) => {
            console.log(`${endpoint} API response:`, response);
            this.apiResponse = response;
        },
        error: (error) => {
            console.error(`${endpoint} API error:`, error);
            this.apiResponse = {
            error: true,
            message: error.error?.message || error.statusText || 'Unknown error',
            status: error.status
            };
        }
        });
    }
    
    logout(): void {
        console.log('Logout button clicked');
        
        this.authService.logout().subscribe({
        next: () => {
            console.log('Logout successful, redirecting to login page');
            this.router.navigate(['/login']);
        },
        error: err => {
            console.error('Logout error:', err);
            // Even if the server request fails, we want to clear local state
            sessionStorage.removeItem('currentUser');
            console.log('Session storage cleared, redirecting to login page');
            this.router.navigate(['/login']);
        }
        });
    }
    }
    ```

### Running the Application
* Start the backend server
``` 
cd jwt-auth-project/backend
node server.js
```

You should see output like:
```
Server running on http://localhost:3000
Test credentials: miles@web.com / e-1610
Available endpoints:
  POST /api/login - Login endpoint
  GET /api/protected - Protected endpoint (requires authentication)
  POST /api/logout - Logout endpoint
  GET /api/hello - Public test endpoint
```

**Note:** In a different terminal start the frontend server
```
cd jwt-auth-project/frontend
ng serve
```

Navigate to http://localhost:4200 in your browser, notice the backend server will print out what's happening. Attempt to access the protected api before and after getting a jwt. 

## How SuperTokens Simplifies Angular Authentication
After implementing JWT authentication from scratch, you've seen firsthand the complexities involved: token storage decisions, interceptor setup, session management, and this is before even considering long-term support. While building it yourself provides valuable learning, production applications often benefit from specialized authentication libraries. This is where SuperTokens shines:

### 1. Passwordless or Password-Based Authentication
SuperTokens supports multiple authentication methods out of the box:

### Email-Password Authentication
Traditional email and password authentication with built-in:

* Form validation
* Password strength requirements
* Secure password hashing
* Account verification flows
* Password reset functionality

### Passwordless Authentication

Modern authentication without passwords:

* Email One-Time Passwords (OTPs)
* Magic links sent via email
* Phone number verification with SMS codes
* Multi-factor authentication support

The beauty of SuperTokens is that these authentication methods require minimal boilerplate. The library provides pre-built UI components that you can use as-is or customize to match your application's design.

### 2. Frontend SDK for Angular
SuperTokens provides a dedicated Angular SDK that integrates smoothly with Angular's architecture:

### Key Features
* Pre-built UI Components: Ready-to-use login, signup, and password reset screens
* Session Management: Automatic handling of tokens and session state
* Redirection Handling: Smart redirects based on authentication status
* Route Protection: Angular route guards to protect private routes
* Typescript Support: Full type safety with TypeScript definitions

### Session Management
SuperTokens automatically handles complex session-related tasks:

* Token storage in HttpOnly cookies
* Token refreshing in the background
* Session expiry management
* Secure logout across all devices
* User session information access


### Route Protection
With SuperTokens' built-in route guards, protecting routes in your Angular application becomes straightforward. The guards integrate with Angular's router to check authentication status before allowing access to protected routes.

### 3. Security Benefits
SuperTokens provides several security advantages over a custom implementation:

### HttpOnly Cookies
SuperTokens uses HttpOnly cookies by default, protecting tokens from XSS attacks by making them inaccessible to JavaScript running in the browser.

### Anti-CSRF Protection
Built-in Cross-Site Request Forgery protection is enabled automatically when using cookies, preventing attackers from tricking users into making unintended requests.

### Automatic Token Refreshing
Sessions are refreshed in the background without disrupting the user experience, ensuring a smooth user experience while maintaining security.

### Rotating Refresh Tokens
SuperTokens implements rotating refresh tokens, enhancing security by making stolen tokens invalid after use. This approach significantly reduces the risk of session hijacking.

### Revocation
SuperTokens supports immediate session revocation, allowing you to log out users from all devices in case of a security breach or suspicious activity.

### 4. Integration Process Overview
Integrating SuperTokens into an Angular application involves a few high-level steps:

### Backend Setup
* Install the SuperTokens server SDK
* Configure authentication methods and session management
* Set up CORS to allow communication with your Angular frontend
* Define protected API endpoints

### Frontend Setup
* Install the SuperTokens Angular SDK
* Configure authentication UI and recipes
* Set up routing to include authentication pages
* Implement route guards for protected routes
* Add login/logout functionality to your application

The entire process typically takes hours rather than days, with most of the security complexities handled automatically by SuperTokens.

### 5. SuperTokens Documentation
More information can be found at the SuperTokens documentation: 

[SuperTokens Frontend Angular setup](https://supertokens.com/docs/quickstart/frontend-setup)

[SuperTokens Authentication Overview](https://supertokens.com/docs/authentication/overview)

[SuperTokens Migration Overview](https://supertokens.com/docs/migration/overview)

## Common Angular Authentication Pitfalls and Fixes
Even experienced developers encounter challenges when implementing authentication in Angular applications. Here are the most common pitfalls and practical solutions.

### 1. Token Expiry and Refresh Handling
### The Problem
JWTs typically expire after 15-60 minutes. When this happens during an active session, users suddenly receive 401 errors and get logged out, creating a poor experience.
### The Solution
Implement a silent refresh strategy:

* Proactive refresh: Set up a timer to refresh tokens at 75-80% of their lifetime
* Reactive interceptor: Catch 401 errors and refresh tokens automatically, then retry the original request
* Request queueing: Queue requests during refresh to prevent race conditions
* Fallback flow: Redirect to login only when refresh attempts fail

This approach maintains seamless user sessions while preserving security benefits of short-lived tokens.


### 2. Improper Token Storage
### The Problem
Many tutorials suggest storing JWTs in localStorage for simplicity, but this exposes tokens to XSS attacks since any JavaScript on your site can access localStorage.
### The Solution
Use more secure storage approaches:

* HttpOnly cookies: Server-set cookies that JavaScript cannot access
* Memory storage: Keep tokens in JavaScript variables (not persistent, but secure during the session)
* Refresh token pattern: Store short-lived access token in memory and longer-lived refresh token in an HttpOnly cookie

When using cookies, ensure proper security flags are set (HttpOnly, Secure, SameSite=Strict).

### 3. Missing CSRF Protection
### The Problem
Cookie-based authentication is vulnerable to Cross-Site Request Forgery (CSRF) attacks where malicious sites trick users into making unwanted actions.
### The Solution
Add appropriate CSRF protection:

* Modern approach: Use SameSite=Strict or SameSite=Lax cookie attribute.
* Traditional approach: Implement the Double-Submit Cookie pattern.
* Authorization header: If using token-based auth with Authorization headers (not cookies), CSRF protection isn't necessary.

Choose the right protection based on your authentication method: cookie-based auth needs CSRF protection, token-based auth with Authorization headers typically doesn't.

### 4. Race Conditions on Initialization
### The Problem
Angular applications often face timing issues during initialization where protected routes may render before authentication state is determined.

### The Solution
Ensure auth state is resolved before navigation:

* Route guards: Create guards that return observables and only complete when auth state is determined
* APP_INITIALIZER: Resolve authentication status before the application fully loads
* Loading states: Implement proper loading indicators during authentication checks
* Central auth service: Create a single source of truth for authentication state

This prevents flickering UI, unauthorized access, and redirect loops in your application.

## Best Practices for Secure Angular Authentication

Implementing a secure authentication system in Angular requires attention to several key areas. Here are five essential practices to ensure your application remains secure while providing a smooth user experience.

### 1. Use Secure Storage Mechanisms

How you store authentication tokens directly impacts your application's security.

### Best Practices:
- **Prefer HttpOnly cookies** for token storage
  - Not accessible via JavaScript, protecting against XSS attacks
  - Set with `Secure` and `SameSite=Strict` flags for additional protection
  
- **Avoid localStorage and sessionStorage** for sensitive tokens
  - Vulnerable to cross-site scripting (XSS) attacks
  - Any JavaScript on your page can access these storage options
  
- **Consider in-memory storage** as a compromise
  - Store access tokens in Angular services
  - Use with refresh tokens in HttpOnly cookies for persistence

Tokens stored in HttpOnly cookies provide significant security advantages over browser storage options, especially for production applications.

### 2. Protect All Routes

Ensure users can only access the content they're authorized to see.

### Best Practices:
- **Implement Angular route guards**
  - Apply `CanActivate` guards to all protected routes
  - Chain multiple guards for complex authorization rules
  
- **Create role-based protection**
  - Check user roles and permissions in guards
  - Return to requested URL after successful authentication
  
- **Apply protection consistently**
  - Don't rely only on hiding UI elements
  - Always complement client-side guards with server-side authorization

Remember that route guards are a convenience feature, not a security boundary. Always validate authorization on your server as well.

### 3. Token Revocation Support

The ability to invalidate active sessions is crucial for maintaining security.

### Best Practices:
- **Implement complete logout functionality**
  - Clear tokens from client storage and memory
  - Send revocation request to the server
  
- **Enable server-side session invalidation**
  - Maintain a blacklist of revoked tokens or session IDs
  - Or use short-lived tokens with refresh token rotation
  
- **Support multi-device logout**
  - Allow users to terminate sessions on other devices
  - Useful for "forgot password" scenarios

Proper revocation ensures that compromised credentials can be quickly invalidated, minimizing the damage from security breaches.

### 4. Handle Refresh Tokens Gracefully

A well-implemented token refresh mechanism balances security with user experience.

### Best Practices:
- **Implement automatic token refresh**
  - Use HTTP interceptors to handle 401 responses
  - Queue pending requests during refresh
  
- **Use token rotation for refresh tokens**
  - Issue new refresh tokens with each use
  - Invalidate old refresh tokens after use
  
- **Handle refresh failures appropriately**
  - Redirect to login when refresh fails
  - Provide clear feedback to users

Libraries like SuperTokens handle this complexity automatically. If building from scratch, carefully implement refresh logic to avoid race conditions.

### 5. Enable CORS and CSRF Safeguards

Proper cross-origin configuration is essential for secure authentication.

### Best Practices:
- **Configure CORS correctly**
  - Specify exact allowed origins (avoid wildcards)
  - Enable credentials for authentication cookies
  
- **Implement CSRF protection** for cookie-based auth
  - Use `SameSite=Strict` cookie setting
  - Apply Double-Submit Cookie pattern for older browsers
  
- **Add security headers**
  - Content-Security-Policy
  - X-XSS-Protection
  - X-Frame-Options

CORS misconfiguration is a common source of security vulnerabilities in modern web applications. Test your configuration thoroughly with cross-domain requests.

## Angular Authentication with OAuth Providers

Modern applications often support authentication through popular OAuth providers like Google, GitHub, and Microsoft. This approach allows users to log in with existing accounts while delegating security to established providers.

### 1. Google, GitHub, Microsoft Integration

Angular applications can integrate with OAuth providers using specialized libraries.

### Using angular-oauth2-oidc

The [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) library is a popular choice for implementing OAuth in Angular:

**Key Features:**
- Support for multiple authentication flows
- Token validation and refresh capabilities
- TypeScript interfaces for type safety
- Compatible with Angular's dependency injection

**Basic Setup Process:**
1. Install the library: `npm install angular-oauth2-oidc`
2. Configure with your OAuth provider details
3. Initialize the authentication flow
4. Handle callbacks and token storage

### 2. OAuth Authentication Flow Explained

The standard OAuth flow follows these steps:

###  Redirect to Provider
When a user clicks "Login with Google," your app redirects to the provider's authentication page.

###  User Consent
The user authenticates with the provider and grants permission for your app to access their information.

###  Authorization Code Exchange
The provider redirects back to your application with an authorization code that your app exchanges for tokens.

###  Receive and Store Tokens
The provider returns several tokens:
- **Access Token**: For accessing provider APIs
- **ID Token**: Contains user information (JWT format)
- **Refresh Token**: For obtaining new access tokens

###  Use Tokens for Authentication
Your application extracts user information from the tokens and establishes a session.

This flow happens largely behind the scenes when using libraries like angular-oauth2-oidc, which handle the complexity for you.

### 3. Security Implications

While OAuth delegates much of the authentication security to providers, there are still important considerations:

### Token Validation
Always validate received tokens:
- **Verify signatures** to ensure tokens haven't been tampered with
- **Check issuer** to confirm the token came from the expected provider
- **Validate audience** to ensure the token was issued for your application
- **Verify expiration** to reject outdated tokens

### CSRF Protection
Implement Cross-Site Request Forgery protection:
- Use the `state` parameter to verify authentication requests
- Implement PKCE (Proof Key for Code Exchange) for authorization code flows

### Secure Token Storage
Follow the same secure storage principles discussed earlier:
- Keep access tokens in memory when possible
- Use secure, HttpOnly cookies for refresh tokens
- Clear all tokens on logout

Most OAuth libraries handle these security measures automatically, but understanding them helps you configure the libraries correctly.

### 4. SuperTokens Integration with Social Providers

If you're using SuperTokens, integrating OAuth providers becomes even simpler.

### Available Social Providers
SuperTokens offers pre-built integration with:
- Google
- GitHub
- Apple
- Facebook
- Discord
- And many others

### Implementation Benefits
1. **Simplified Setup**: Configure provider details once
2. **Consistent API**: Same interface across different providers
3. **Pre-built UI Components**: Ready-to-use login buttons and flows
4. **Session Management**: Automatic handling of tokens and sessions

### Custom UI Options
You can still create your own UI while leveraging SuperTokens' backend authentication flow, giving you flexibility without sacrificing security.

### When to Use OAuth Providers

OAuth providers are particularly valuable when:
- You want to reduce friction in the sign-up process
- Your users already have accounts with major providers
- You prefer not to manage password security yourself
- You need to access provider APIs with user permission

By implementing OAuth authentication with providers like Google, GitHub, or Microsoft, you create a more user-friendly login experience while leveraging the robust security infrastructure of established identity providers.

## Key Takeaways

### Angular Doesn't Handle Auth Out of the Box
Unlike some frameworks that include built-in authentication, Angular leaves this critical functionality up to you:

* No default authentication or security mechanisms are provided
* Developers must implement authentication from scratch or use external libraries
* This approach provides flexibility but requires careful attention to security details
* Understanding authentication concepts is essential for proper implementation

The responsibility for secure authentication falls entirely on developers, making external libraries and best practices crucial for production applications.

### JWT Authentication Must Be Handled Securely
JSON Web Tokens (JWT) provide a powerful mechanism for authentication in Angular applications, but security depends on proper implementation:

* Token storage decisions significantly impact security (HttpOnly cookies recommended)
* Refresh token mechanisms require careful implementation to avoid vulnerabilities
* Proper route protection goes beyond Angular's route guards
* CSRF protection is necessary when using cookie-based approaches

Our detailed implementation demonstrated these concerns while showing how to build a functional JWT authentication system from the ground up.

### SuperTokens Provides a Production-Ready Solution
While building authentication from scratch is educational, production applications benefit from battle-tested solutions:

* SuperTokens offers a complete, secure authentication layer for Angular applications
* Multiple authentication methods (password-based, passwordless, social) are available out-of-the-box
* Complex security requirements are handled automatically
* Integration with existing systems and OAuth providers is streamlined

By using SuperTokens or similar authentication libraries, you gain robust security with significantly less development effort and risk.

### Final Thoughts
Authentication in Angular applications requires deliberate design and implementation. Whether you build from scratch or leverage existing solutions, understanding the security implications of your choices is essential.
The approaches covered in this guide—from manual JWT implementation to SuperTokens integration—provide a foundation for creating secure, user-friendly authentication systems in your Angular applications. Choose the approach that best fits your specific requirements, always prioritizing security best practices.
Remember that authentication is just one aspect of application security. Even the best authentication system must work alongside proper authorization, input validation, and other security measures to create truly secure applications.