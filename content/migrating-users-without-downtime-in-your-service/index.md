---
title: Migrating users without downtime in your service (The Lazy Migration Strategy)
date: "2023-07-12"
description: "User Migration can be a challenging process, in this article we go over some user migration scenarios and break down the lazy migration strategy"
cover: "migrating-users-without-downtime-in-your-service.png"
category: "programming"
author: "Joel Coutinho"
---

## Table of Contents

- [Introduction](#introduction)
- [Real world migration scenarios](#real-world-migration-scenarios)
- [Our experience of migrating customers over to SuperTokens](#our-experience-of-migrating-customers-over-to-supertokens)
- [Understanding Lazy Migration](#understanding-lazy-migration)
- [The benefits of Lazy Migration](#the-benefits-of-lazy-migration)
- [Conclusion](#conclusion) 


## Introduction:

On the surface, migrating your users from one authentication solution to another seems simple enough. Remove the old authentication logic, integrate with the new authentication provider, and finally import the user profiles to the new identity provider. Theoretically, this process seems very simple but, depending on the scale of your user base and the complexity of your auth schema, the difficulty can spiral out of control.

To illustrate this let's take a look at some real-world examples.

## Real world migration scenarios

### WeTransfer

In 2021, [WeTransfer](https://wetransfer.com/) decided to consolidate their fragmented user pools across their products into a single identity store, to improve the user experience and unify the billing system. In this [article](https://wetransfer.com/engineering/migrating-millions-of-users-to-auth0-without-downtime/) by Esteban Pintos, the Senior Backend Engineer at WeTransfer, he goes over their migration experiences and some of the challenges they faced when migrating 80 million users across 3 applications to Auth0. Here are the key challenges they faced:

- WeTransfer needed SSO so users who had accounts in multiple products could log in with a single account. This meant that the authentication solution they were using needed to be extensible and customizable to allow for accounts to be linked from the legacy data stores during initial sign-in.
- Additionally, there were rate limits imposed on the APi responsible for importing users. This meant they could not just do a simple bulk import of all users as it could take months and increases the likelihood of things going wrong.

In  their approach, they split the migration into 2 phases:

#### Phase 1: Lazy Migration:
- In this phase users sign in with the new auth provider but, the flow is modified to check if there are other associated accounts and link them.
- These customizations need to be thoroughly tested so that error cases are handled and the users are not lost during migration
#### Phase 2: Bulk Import:
- Once the rate of users being migrated per day leveled out they initiated the second phase of their migration strategy which was to bulk import the remaining user accounts. A number of scripts had to be written in order to load and format the user profile data to be imported into Auth0 while being cognizant of the rate limits.

### Parquet’s user migration from Auth0 to Supabase
In this [article](https://kevcodez.medium.com/migrating-125-000-users-from-auth0-to-supabase-81c0568de307) by Kevin Grüneberg, he goes over how they migrated users from Auth0 to Supabase. They had reached the end of Auth0’s startup plan and the revised pricing was too expensive, which resulted in the decision to migrate away from Auth0. Similarly, they had to go through similar processes like managing linked accounts and facilitating the password hash export but they faced an additional challenge since Supabase did not support an in house OAuth endpoint, so they had to build an in house solution to integrate with Circle, their community platform.

### Migrating users when auth schema is inconsistent
Finally changes in the user auth schema between providers or within the same provider can also cause issues during migration as seen with [Juan Alvardo](https://twitter.com/Jalvarado91/status/1653740848889180164) and [Aggelos Arvanitakis](https://twitter.com/AggArvanitakis/status/1218429561404370944)


## Our experience of migrating customers over to SuperTokens:

At SuperTokens, we have helped hundreds of customers migrate to SuperTokens and are familiar with some of the common pitfalls users encounter during their migration. Here are some of the users we have migrated over

### Built Intelligence

Originally using Auth0 as its provider, Built Intelligence was forced to switch to a new provider after Auth0 revised its pricing. The new pricing structure would increase Built Intelligence’s bill by nearly 700%.  After evaluating a number of auth providers, they finally settled on using SuperTokens. Adrian, the Technical Director at Built Intelligence found the  documentation to be straightforward forward and after speaking to the SuperTokens team they had he had a clear vision of how the migration should be implemented.It took them two weeks to prepare a POC and test the migration for a single user. Within the span of 4 weeks, they had all their users migrated over and removed the legacy provider from their product.

You can learn more about how Built Intelligence integrated with SuperTokens in our [case study](https://supertokens.com/customers/builtintelligence).

### Poppy
For Poppy, they needed to make sure that the solution they were choosing had the extensibility required to meet their needs due to issues arising from fraudulent sms requests. Poppy opted for a Lazy migration strategy slowly migrating users over to SuperTokens over the course of 6 months. Once there were only a few thousand people left on Auth0, Poppy simply asked the remaining users to reset their passwords and was able to disable Auth0 completely.


Apart from these users we also had to make provisions for users who were migrating from Firebase Auth. Firebase uses a modified version of the [scrypt](https://en.wikipedia.org/wiki/Scrypt) password hashing algorithm. We had to update our import password hash API to support this algorithm to ensure a smooth migration experience.

Here are the most important takeaways from these user migration journeys:

- Validate that the provider you are switching to has the features you need.
- Plan and test your migration strategy
- Make sure the auth schema of the new auth solution is compatible with the old one
- Check that the password hashes are compatible with the new system and can be imported. (Inability to do so will result in all users having to reset their passwords)
- Be cognizant of API rate limits, services rate limit their APIs and if not accounted for can result in import failures and user accounts not being transferred over.


In most of the examples seen above a commonly adopted strategy for migration is “Lazy Migration”, but, what exactly is that and how does it work?

## Understanding Lazy Migration:
Lazy Migration refers to a phased and strategic approach to migrating systems, applications, or data. Rather than attempting a full-scale migration in one go, Lazy Migration breaks down the process into manageable steps. This method allows organizations to transfer specific components gradually, ensuring minimal downtime and reduced risks associated with complex migrations.

### The Benefits of Lazy Migration:
- Reduced Downtime: One of the primary advantages of Lazy Migration is the significant reduction in downtime. By migrating components incrementally, businesses can keep essential services operational while gradually shifting to the new environment. This eliminates the need for lengthy maintenance windows or service disruptions that could affect productivity and customer satisfaction.

- Risk Mitigation: Lazy Migration minimizes the risk associated with large-scale migrations. By migrating in smaller increments, businesses can identify and address potential issues early on. This iterative approach enables effective troubleshooting, ensuring a smooth transition without jeopardizing critical operations or data integrity.

- Flexibility and Adaptability: Lazy Migration allows organizations to adapt their migration strategy as needed. It allows for adjustments based on real-time feedback, enabling businesses to fine-tune their approach and address any unforeseen challenges efficiently. This adaptability ensures that the migration aligns with the organization's goals and timelines.

- Cost Optimization: By avoiding a complete overhaul in one go, Lazy Migration can help businesses optimize costs. It allows for a more granular allocation of resources, enabling organizations to invest in migration efforts strategically. This cost optimization ensures that budgets are utilized efficiently while achieving the desired outcomes.

## Conclusion:
.By breaking down migrations into smaller, manageable steps, Lazy migration can reduce downtime, mitigate risks, optimize costs, and enhance the overall user experience when shifting to a new system.


