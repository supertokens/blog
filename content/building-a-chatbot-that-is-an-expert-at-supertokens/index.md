---
title: How we built a Chatbot that is an Expert at SuperTokens
date: "2023-05-30"
description: "Learn how we built a Q&A bot that is an expert at SuperTokens powered by ChatGPT"
cover: "supertokens-ai-banner.png"
category: "programming"
author: "Joel Coutinho"
---

## Introduction

At SuperTokens, we spend a lot of time providing support for our customers. Considering the complexity of authentication and our tools, this can be time-consuming and expensive. But, what if we could leverage AI to help us out? What if we could create a Q&A bot that is an expert on our product? So that's what we made! Powered by ChatGPT, the SuperTokens AI bot leverages the SuperTokens documentation as context to accurately answer questions and point the user to the right resources. Let's take a look at how it works.

## How does SuperTokens AI work?

On a high level, the [SuperTokens AI](https://github.com/supertokens/supertokens-ai/) works by taking a question as input, finding the relevant SuperTokens documentation, and passing it to ChatGPT as context to answer the question. Additionally, it will use a host of agents to make sure that the answers that are being produced are correct. 

Before we get into the details we need to understand some of the limitations of ChatGPT. 

- **Training data**: LLMs like ChatGPT are only as good as the data they were trained on. In our case, that means that changes to the product or new versions and updates might not be recorded resulting in incorrect responses.
- **Contextual understanding**:  Although ChatGPT accepts contextual information to create better answers and solve the limitations of training data, there is a restriction on the tokens you are allowed to pass. This means that we cannot just pass the entire SuperTokens documentation as context, but, need to find the relevant information from the documentation.

So how do we filter thousands of pages of documentation to figure out what's relevant? Well, that's where vector embeddings come in. 

Vector embeddings is a mathematical model that can take arbitrary pieces of data like text and map it to a long string of numbers. What makes vector embeddings special though is you can find semantic similarity between phrases based on the vector distance between them. Essentially, we can find how related phrases are based on their vector distance.

You can learn more about vector embeddings and Agents in our guide [here].(link to guide)

So let's get into how the SuperTokens AI bot works:

Step 1: Retrieve the SuperTokens documentation and discord messages and tokenize the data
The first step is to retrieve the SuperTokens documentation and discord messages.
You can take a look at the `update_docs.py` script which will effectively load the documentation into memory, tokenize the input and ask OpenAI to create vector embeddings.
