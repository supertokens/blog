---
title: "Authorization with user roles (RBAC)"
date: "2022-07-21"
description: "Learn about how to add authorization to your app with RBAC"
cover: "TODO.png"
category: "programming"
author: "SuperTokens Team"
---

### What is Authorization?
Authorization is all about answering the question *"Is this user allowed to do a certain operation?"*. This is different from Authentication in which we answer the question *"Which user is this request coming from?"*

Both are essential to most applications, and as such, we first go through authentication flows to identify who the user is, and then we go through authorization flows in which we decide if the user has the permissions to do a certain operation.

<TODO: add graphic for authentication -> authorisation>

### What is Role based access control (RBAC)?
RBAC is one of the ways in which Authorization can be implemented. It allows developers to create "groups" of users that can all do the same set of operations. The name of the group is essentially the role of those users.

For example, a blogging app may have a role called `"admin"` which allows users (who are associated with that role) to do operations like delete, edit or read all the blogs on the app. The app may have another role called `"regular-user"` which allows users to read all blogs, but edit or delete only blogs created by them.

In a more formal notation, the actions that can be taken can be represented as strings like:
- Read all blogs: `"read:all"`
- Delete all blogs: `"delete:all"`
- Delete blogs created by self: `"delete:self"`
- Edit all blogs: `"edit:all"`
- Edit blogs created by self: `"edit:self"`

These are known as permissions. In a grid form, the roles and permissions for our example app will look like this:

|Role|`read:all`|`delete:all`|`delete:self`|`edit:all`|`edit:self`|
|-|-|-|-|-|-|
|`admin`|✅|✅|✅|✅|✅|
|`regular-user`|✅|-|✅|-|✅|