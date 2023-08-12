---
title: Why did HashiCorp adopt the Business Source License?
date: "2023-08-12"
description: "What is the Business Source License and why did HashiCorp adopt it?"
cover: "hashicorp-bsl.png"
category: "featured"
author: "Rishabh Poddar"
---

On August 10th, 2023, HashiCorp announced that they were adopting the Business Source License (BSL). This was a big deal because HashiCorp is one of the most popular open source companies in the world. In this blog post, we will try to understand what the BSL is and why HashiCorp adopted it.

## What is the Business Source License?
Simply put, the BSL is a license that prevents companies that are competing with HashiCorp to fork and use HashiCorp's software and resell it as a propriety service. It does not restrict regular users of HashiCorp's software from using or modifying the software in any way.

For example, this means that companies that use [Terraform (one of HashiCorp's product)](https://github.com/hashicorp/terraform) to build their product, can continue to do so without any restrictions, for free. Even open source projects that uses Terraform, can continue to use it without any restrictions, for free. Both of these types of use cases are unaffected by the change.

This license is not exclusively used by HashiCorp. It was in fact, first introduced by [MariaDB in 2016](https://mariadb.com/bsl-faq-mariadb/), and has also been adopted by [CockroachDB](https://github.com/cockroachdb/cockroach/blob/master/LICENSE) and [Sentry](https://github.com/getsentry/sentry/blob/master/LICENSE) - all fairly large open source companies.

One important nuance of the BSL is that it has a time limit. In case of HashiCorp, the time limit is 4 years (also known as "Change Date"). This means that for each new released version, it will remain under the BSL for 4 years, after which it will change to MPL 2.0 (the license which was previously used by HashiCorp). This is specified at the top of the [license file](https://github.com/hashicorp/terraform/blob/main/LICENSE) of Terraform, and other HashiCorp products. This has no implications for regular users, but for competitors of HashiCorp, who resell their software, it means that they can't merge new releases by HashiCorp into their forked version for 4 years.

## Why did HashiCorp switch to the Business Source License?
HashiCorp's CTO, Armon Dadgar, [wrote a blog post](https://www.hashicorp.com/blog/hashicorp-adopts-business-source-license) explaining the rationale behind the switch. In the post, he mentions that whilst HashiCorp spends tens of millions of dollars every year on the development of their open source software, there are vendors who fork the OSS projects and resell them, directly competing with HashiCorp, _"without providing material contributions back"_.

The BSL prevents such vendors from doing exactly this. HashiCorp has a [FAQ section where they explain exactly who they consider to be a competitor](https://www.hashicorp.com/license-faq#What-is-considered-a-competitive-offering).

## How do users react to license changes?
HashiCorp changing their open source license is not new in the open source world. Other companies like MongoDB, and Elastic have also made license changes (with an alternative license), for the same reason.

Sure, there is an initial backlash from their communities, but usage of their software continues to grow regardless:
- MongoDB made the license change in 2018, and since then, [their usage](https://npm-stat.com/charts.html?package=mongodb&from=2017-08-12&to=2023-08-11) has increased by 6x.
- Elastic made the license change in 2021, and since then, [their usage](https://npm-stat.com/charts.html?package=%40elastic%2Felasticsearch&from=2020-08-12&to=2023-08-11) has increased by 4x.

It seems that this movement is here to stay.