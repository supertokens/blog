---
title: Solve the problem of vendor lock-in
date: "2021-11-10"
description: "What is vendor lock-in? How does it affect your customers? What are the different ways you can minimize it? Read the blog to learn more."
cover: "solve-the-problem-of-vendor-lock-in.png"
category: "programming"
author: "Advait Ruia"
---


Vendor lock-in refers to a situation where the cost of switching to a different vendor (or an in-house solution) is so high that the customer is essentially stuck with the original vendor ([Source](https://www.cloudflare.com/en-in/learning/cloud/what-is-vendor-lock-in/)). 

The problem of vendor lock-in increases if:

- Integration with a service requires several touch points (deep integration), and that there is no industry wide standardised API for those touch points.
- The service owns critical app data.

This is a problem not only for customers, but also for companies offering software (especially startups): For customers, they run the risk of being stuck with a vendor even if their service quality declines, they change their product focus, they increase their pricing, or worst case, they run out of business. As a result, startups have the problem of gaining potential customer’s trust, and therefore, have to design their software to minimise these risks. This results in lots of additional engineering costs, and sometimes, lost revenue.

## Control of data

This issue can be solved by providing a self hosted version of your product which will store all the data in your customer’s database. Most apps use a SQL database, so supporting MySQL and PostgreSQL would be enough (until your product becomes fairly popular).

There are issues with this approach though:

- Your product’s architecture cannot contain several microservices. Ideally just one docker image that connects to your user’s database, or one framework library working with a popular ORM library of that framework.
- If you also want to provide a managed service version of your product, then maintaining that and a self hosted version is an added engineering cost.
- There can be issues with monetizing a self hosted version. Even if it requires a license key to use, it can always be “hacked” to not require one.
- Running an additional service is added work for your customers, and several potential users may not even have the infrastructure skills required to set up a new micro service.

To mitigate some of these issues, here are two ideas:

- Allow users to get started quickly by using your managed service version, and give them an option to migrate the data from your databases into their database. This gives users the peace of mind that they can be in control if needed. The best part about this approach is that once they start to use the managed service version, they may never actually bother with migrating to a self hosted one anyway.
- Allow users to use your managed service version which can connect to their database. This removes the hassle of them doing additional infrastructure work, and also gives them the control they want. This can also be an option exclusive to your most expensive pricing tier.

## Control of code [[1]](#footnote)

This section caters to two aspects:

- Customizability of code & features as per business requirements
- Runnability of the product independently to the vendor.

One way to solve these issues is to make your product open source. However, this has major implications on your product’s business model. If that is not possible, you could consider a “source available”[[2]](#footnote) model which converts to being open source in case your business shuts down. You could even charge users extra to provide them a license that allows them to modify the source code. Finally, depending on how your managed service offering runs, you could allow users to modify the source code of your product, and the modified version can be hosted by you.

Other than direct source code modifications, you should design your product to have enough hooks and switches so as to meet any sort of business customisation requirements. You should also aim to provide an API only interface to all your features / dashboards. That way, even if you do not provide a feature that a user wants, it may be possible for them to build that out “on top” of your product. 

## Focus on migration

Most companies focus on making it easy to migrate into their product. To minimise vendor lockin, you should also focus on making it easy to migrate away from your product.

At first, this may seem counterintuitive from a business perspective, the chances that a production customer will actually migrate out of your product is very low (assuming that your product and service meets their expectations). You are better off optimising for this as it gives an impression of customer prioritisation and focus, which in turn will increase the probability of getting newer customers.


## Conclusion
To summarise, the problem of vendor lokin can be minimised by: 

- Allowing users to use their own database via a self hosted version of your product.
- Allowing them to carry out complex customisations with and without modifying the code you provide.
- Allowing users to move from using your managed service version to a self hosted version of your product.
- Allowing your managed service version to connect to a user’s database.
- Making migration into and away from your product as easy as possible.


## Footnote:

*[1]: I am not a lawyer. Please consult one before implementing / seriously considering the ideas pointed out in this section.*

*[2]: The source code is viewable, but under a proprietary license - limiting the distribution and modification of the code, and usually requiring a license key to run.*