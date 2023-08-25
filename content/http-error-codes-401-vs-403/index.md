---
title: Demystifying HTTP Error Codes 401 vs 403
date: "2023-09-05"
description: "In this blog we will go over the http protocol error codes 401 and 403 and describe when is it appropriate to use each of them."
cover: "TODO"
category: "programming"
author: "Joel Coutinho"
---

## Table of content
- [Introduction](#introduction)
- [HTTP 401 UNAUTHORIZED](#http-401-unauthorized)
- [HTTP 403 FORBIDDEN](#http-403-forbidden)
- [Differences between error codes 401 and 403](#differences-between-error-codes-401-and-403)
- [Conclusion](#conclusion)

## Introduction

Understanding HTTP status codes is imperative since most modern Web APIs leverage this protocolr and on the surface, HTTP status codes are straightforward. A `200` response signifies the request was successfully completed while a `404`  signifies that the address was not found and a `500` means an internal error occurred in the backend server. But there seems to be some confusion between error codes `401 Unauthorized` and `403 Forbidden`. In this blog we will be looking into the differences between the two and when is it appropriate to respond with them.

## HTTP 401 UNAUTHORIZED
The HTTP status code 401, often denoted as `UNAUTHORIZED`, signifies that the client lacks proper authentication credentials or has provided invalid credentials. In simpler terms, the server has identified the user, but the user does not have the necessary permissions to access the requested resource. 

This could occur due to:

- Missing or Incorrect Credentials: The user hasn't provided any credentials or the ones provided are incorrect. An example of this is the user trying to sign in with an incorrect password.

- Expired Credentials: If the user's authentication token or session has expired, they won't be granted access until they reauthenticate. For example in the context of the OAuth flow, this would mean that the access token is missing/revoked/expired.


## HTTP 403 FORBIDDEN
HTTP status code `403` also denoted as `FORBIDDEN` is returned when the server has successfully authenticated the user, but the user is still denied access to the requested resource. This is different from a 401 error, as the user's credentials are valid, but they lack the necessary permissions to view or interact with the specific resource
Common scenarios that lead to 403 errors include:

- Insufficient permissions: The user's credentials may not grant them the required privileges to access the resource. This could be due to their user role or other access restrictions.
- IP Blacklisting: Some websites restrict access based on IP addresses, preventing certain users or locations from accessing specific content.

## Differences between error codes 401 and 403

While both HTTP error codes indicate access denial, their fundamental differences lie in the context of authentication and authorization:

- Authentication vs. Authorization: A 401 error focuses on invalid or missing authentication credentials, whereas a 403 error pertains to valid authentication but inadequate authorization.

- Credentials: A 401 error prompts the user to provide valid credentials, while a 403 error implies that the user's credentials are valid but they lack the necessary permissions.

- Response to the User: A 401 error urges the user to log in or provide valid credentials. In contrast, a 403 error informs the user that access is forbidden, regardless of their authentication status.

## Conclusion

To summarize the main difference between the two, although both status codes represent access denial, 401 errors address authentication issues, and 403 errors point towards authorization problems.
It is important to make this distinction as incorrectly handling these responses can leave you suspectable to exploits from malicious attackers.  


