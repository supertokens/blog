---
title: "URI vs URL: The real difference between the two"
date: "2023-08-16"
description: "In this blog we break down the differences between URL, URI, and URN"
cover: uri-vs-url.png
category: "programming"
author: "Joel Coutinho"
---

## Table of Content

- [Introduction](#introduction)
- [What is a URL](#url-uniform-resource-locator)
- [What is a URI](#uri-uniform-resource-identifier)
- [What is a URN](#urn-uniform-resource-name)
- [Conclusion](#conclusion)

## Introduction

In the ever-evolving landscape of web development, often times it can be confusing navigating the waters of all the acronyms and technical terms. In this blog we are going to be looking at URL, URI, and URN, terms often used interchangeably leading to confusion when describing the address of a webpage.

## URL (Uniform Resource Locator):

The more recognizable of the two is the URL or Uniform Resource Locator. Analogous to how your physical address helps someone find your home, a URL is what guides your web browser to locate a specific resource on the internet. This resource could be a webpage, an image, a video, or any other digital content. A typical URL consists of several components, including:

**Protocol**: This is the communication method your browser uses to retrieve the resource. Common protocols include `http`, `https`, `ftp`, and more.

**Domain Name**: The domain name represents the address of the website's server. For example, in `www.example.com`, `example.com` is the domain name.

**Path**: The path specifies the specific location of the resource on the server's directory structure. It resembles a file path on your computer.

**Query Parameters**: These are optional parameters that provide additional information to the server, often used to customize the content you see on a webpage.

**Fragment**: This part points to a specific section within a web page, allowing you to jump directly to a particular part of the content.


## URI (Uniform Resource Identifier):

Moving on to URI, or Uniform Resource Identifier. Think of a URI as the umbrella term that encompasses both URLs and another concept called URN (Uniform Resource Name). A URI is used to identify a resource on the internet, regardless of its type or location. In simpler terms, it's the digital fingerprint that uniquely distinguishes one resource from another.

## URN (Uniform Resource Name):
As mentioned in the previous section, URN or Uniform Resource Name, is a subset of URIs that serves as a persistent, location-independent identifier for a resource. Think of it as the "nameplate" for a digital entity. While URLs change if a resource's location shifts, URNs remain constant. This makes them invaluable for citing and referencing resources over time, especially in scenarios where the resource might move or change servers.

## Conclusion
Although they are interconnected, URLs, URI, and URN are distinct and should not be confused with each other. URLs guide us to desired online destinations, while URIs stand as the overarching system of identification. URNs, on the other hand, provide the nameplates that stay fixed amid the dynamic landscape of the internet.