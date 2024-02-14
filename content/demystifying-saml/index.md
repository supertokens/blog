---
title: "Demystifying SAML: A Comprehensive Guide"
date: "2024-01-16"
description: "SAML is an authentication standard created to address the growing need of federated identity. In this blog we go over what SAML is and what makes it special."
cover: "demystifying-saml.png"
category: "featured"
author: "Michiel Mulders"
---


![What is SAML](./what-is-SAML.png)

SAML or the Security Assertion Markup Language was created in November 2002 to address the growing need for federated identity enabling users to access multiple  applications and domains across multiple identity management systems. 

The standard quickly gained traction among companies looking to streamline application interoperability, increase security without sacrificing end-user usability.

In this article we aim to demystify SAML by breaking down it's inner workings and benefits.

## Understanding SAML: The Basics

SAML, or Security Assertion Markup Language, is an open standard that enables secure, cross-domain communication for authentication and authorization. It lets users log in once and access multiple applications and services without repeatedly entering login credentials.


### Step 1: Initiate the flow

The SAML flow starts with a user attempting to access a service or application (SP). They are redirected to a centralized authentication system called the identity provider. 

### Step 2: Issuing an Assertion
Once the idP has verified the credentials, it returns an assertion to the service provider. An assertion is like a digital certificate from the identity provider that contains information about the user, such as their identity and the access rights or roles they have.

### Step 3: Validation
Finally, the service provider receives the assertion and determines if the user should get access and what resources they can access based on their roles. 


In short, SAML provides users with fast and seamless access to services without prompting for an email, username, or password. They only need to log in once to access a plentitude of applications or services that are connected to the same identity provider. 

## How SAML works: Under the hood

Let's dive one level deeper into SAML and how the XML-based standard works.

Below is an example of a SAML authentication request sent from a service provider to an identity provider, requesting to authenticate a user.

```xml
<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="service_provider_name_809707f0030a" Version="2.0" ProviderName="SP authHeroes" IssueInstant="2014-07-16T23:52:45Z" Destination="https://idp.authHeroes.com/SSOService.php" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTPS-POST" AssertionConsumerServiceURL="https://myService/index.php">
  <saml:Issuer>https://myService/metadata.php</saml:Issuer>
  <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
  <samlp:RequestedAuthnContext Comparison="exact">
    <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
  </samlp:RequestedAuthnContext>
</samlp:AuthnRequest>

```

Let's break down this request.
- **`samlp:AuthnRequest`**: This root element of the XML request indicates the start of a SAML protocol message.
- Attributes of `samlp:AuthnRequest`:
  - `ID`: Unique identifier to distinguish it from other requests
  - `Version`: Specifies which version of the SAML standard we want to use. The latest version is 2.0. 
  - `ProviderName`: Identifies the service provider sending the request, here labeled as “SP authHeroes”. 
  - `IssueInstant`: Datetime to timestamp when the request was sent.
  - `Destination`: Lists the identity provider’s SSO service where the request is being sent. 
  - `ProtocolBinding`: Specifies the protocol to be used for the identity provider’s response. In this case, we want to use a HTTPS POST request.
  - `AssertionConsumerServiceURL`: Specifies the URL where the service provider expects a response from the identity provider. 
- **`saml:Issuer`**: Lists a URL containing metadata to uniquely identify the service provider.
- **`samlp:NameIDPolicy`**: The service provider and identity provider can agree upon an identifier for the user’s account. In this case, the email address represents the user who’s being authenticated. If omitted, any type of identifier can be used.

This is a basic example of an authentication request a service provider can send to an identity provider. To prove authenticity, you can expand an authentication request with many more attributes like signatures or certificates. 

In total, the SAML 2.0 specification consists of 86 pages of technical details. If you want to look up specific elements or give it a read, you can find it under [docs.oasis-open.org](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf).


## Understanding the SAML Workflow

To better understand the SAML workflow, let’s set the stage with Alice wanting to request a Google Drive resource. Alice is an employee of company X and logs in to their employee identity provider. Now, Alice can access various applications like Expensify, Google Drive, or Asana. 

When Alice selects the file she wants to open via Google Drive in the dashboard, she can immediately access it. But how? Let’s explore the SAML workflow to understand better why Alice can access the resource directly from her company dashboard. 

**Step 1: User Access Request**
It all starts with the Alice wanting to access a Google Drive resource. 

**Step 2: Redirect to Identity Provider**
If Alice is not authenticated, the login request is forwarded to the identity provider. This request uses the SAML request format, as seen in the example in the previous section.

**Step 3: Authentication at Identity Provider**
The identity provider will check if Alice is logged in or not. If not, Alice has to log in first. Once logged in, the identity provider will return Alice’s identity and authorization level for Google Drive (service).

**Step 4: Assertion Transfer to Service Provider**
Do you remember the `AssertionConsumerServiceURL` field in our sample authentication request? The assertion is returned to Google Drive, listed at the `AssertionConsumerServiceURL`. This digital certificate contains the user’s information, authentication level, and roles.

**Step 5: Service Provider Validates Assertion**
Once Google Drive has received the assertion request, it will validate if the request came from a trusted identity provider based on the attached keys and signatures. Using this information, a service provider can check the authenticity of the assertion. 

**Step 6: Grant Access to the User**
Now that Google Drive is sure that they can trust the identity provider and the request hasn’t been tampered with, Alice is granted access. Google Drive determines whether Alice can view the file based on the returned authorization level, role, or attributes.


## SAML: The Benefits
Let’s list the benefits of using SAML for authentication:

- **Enhanced security**: By centralizing authentication, you are reducing the attack vector. Additionally, organizations don’t have to store user passwords, which decreases their liabilities. 
- **Scalability**: Service providers can decide to quickly add new services to their offering, using the same login system. There’s no need for significant changes when adding more services.
- **Improved user experience**: Users can log in faster and can avoid password fatigue. 
- **Improved compliance and reporting**: Auditing user access requests and activities across multiple services is more straightforward.


## SAML vs OAuth 2.0

Both SAML and OAuth allow users to access multiple applications with a single sign on, but, the difference is that OAuth is easier to use and also gives an access token that can be used to call APIs on the identity provider to read/write on the user's behalf. SAML does not have this ability but tends to be the ideal choice for secure access to sensitive data in organizations such as healthcare or government due to the baked in encryption. OAuth relies on SSL/TLS protocols for security. You can learn more about [SAML vs OAuth here](https://supertokens.com/blog/saml-vs-oauth).

## Conclusion
SAML's flexibility and scalability make it an ideal choice for organizations of all sizes. Whether it's streamlining access to multiple applications or ensuring secure authentication, SAML is a versatile authentication protocol that can be employed in various use cases. In short, SAML offers a more secure, efficient, and interconnected digital future. 
