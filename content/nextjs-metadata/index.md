---
title: "Metadata in Next.js: Enhancing SEO and User Experience"
date: "2025-02-27"
description: "Learn how to effectively manage metadata in Next.js to boost SEO and improve user engagement through static and dynamic configurations."
cover: "metadata-in-nextjs.png"
category: "programming"
author: "Maria Shimkovska"
---

Imagine walking through the Van Gogh Museum, exploring different rooms that correspond to significant life moments of the illustrious and fascinating Dutch painter. 🎨

Each painting is accompanied by a placard that provides crucial details about each of his works (its title, the year it was painted, and a short description). Without these, you will find yourself struggling to understand the artwork’s meaning, historical context, or significance.

On the web, **metadata** serves a similar purpose. It provides essential information about a webpage (like its title, description, and keywords). **Metadata helps search engines and social media platforms "understand" your content and present it to the right audience.** 

Just as well-written placards enhance a museum experience, well-structured metadata improves your website's SEO, shareability, and visibility.

In **Next.js**, managing metadata effectively can make your site more discoverable and engaging. If you've ever seen <meta name="description" content="..."> or <title>Page Title</title> in an HTML file, you’ve encountered metadata. And just like Van Gogh's The Starry Night, it might not change how a page **looks**, but it plays a **crucial role behind the scenes**.

In this article, we’ll explore how to craft effective metadata in Next.js and ensure your site's “placards” are as informative and compelling as possible. 🖼️🚀

The **first section** provides a brief introduction to metadata and what it can do for you. <br>
The **second section** dives into how you can use Next.js for your metadata management. 

![Van Gogh's The Starry Night GIF](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdjanBrZTFlNnlkZXRvOXZ0dWxwbmczemg5cWI5dzVpb3IwcDZleCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9wbFB61YEh1u/giphy.gif)

```toc
tight: true
toHeading: 3
```

## 👉 Metadata Explained: How It Boosts SEO and Website Visibility
Metadata is **extra information** that gives valuable insights into your app’s data. It summarizes basic information about your data. You can think of it as **"data about your data"**! 📊🔍

It includes page **titles**, **descriptions**, **keywords**, and **social media previews** 📌✨ &mdash; all of which help make your web app easier to find, understand, and use.

Here is an example of metadata you may have seen in the `<head>` tag of any HTML file: 

```html
<head>
    <!-- Basic Metadata -->
    <title>The Starry Night by Vincent van Gogh</title> <!-- Sets the page title (shown in browser tab) -->
    <meta charset="UTF-8"> <!-- Defines character encoding -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Ensures responsive design -->
    
    <!-- SEO Metadata -->
    <meta name="description" content="Explore 'The Starry Night,' Vincent van Gogh's iconic masterpiece. Learn about its history, meaning, and artistic techniques.">
    <meta name="keywords" content="The Starry Night, Vincent van Gogh, Impressionism, famous paintings, art history">
    <meta name="author" content="Vincent van Gogh">
    <meta name="robots" content="index, follow"> <!-- Allows search engines to index the page -->

    <!-- Open Graph (OG) Metadata for Social Media -->
    <meta property="og:title" content="The Starry Night - Vincent van Gogh">
    <meta property="og:description" content="Discover the story behind 'The Starry Night,' one of Vincent van Gogh's most famous paintings.">
    <meta property="og:image" content="https://example.com/starry-night.jpg">
    <meta property="og:url" content="https://example.com/starry-night">
    <meta property="og:type" content="article">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="starry-night-favicon.png">
</head>
```

### Why Metadata is Important
Metadata is vital for search engines to rank your content and enhance SEO. 

Proper metadata configuration enhances SEO by:

- **Improving Search Engine Rankings**: Accurate titles and descriptions help search engines understand page content.
- **Optimizing Social Media Sharing**: Open Graph metadata ensures rich previews when links are shared.
- **Increasing Click-Through Rates**: Compelling metadata can attract users to click on your links in search results.

### Types of Metadata
There are various types of metadata. Some common ones, that you will encounter often, are **title**, **description**, **keywords**, **open graph**, and **favicon**. 

#### Title Metadata
The **title metadata** defines the title of a webpage shown on the browser tab and in search engine results. 

```html
<title>Page Title</title>
```

#### Description Metadata
The **description metadata** provides a summary of the webpage content, which is crucial for SEO. The description property corresponds to the meta tag in the head section of the document. 

```html
<meta name="description" content="A brief description of the page content." />
```

#### Keyword Metadata
The **keyword metadata** includes keywords related to the webpage content, aiding in search engine indexing.

```html 
<meta name="keywords" content="keyword1, keyword2, keyword3" />
```

#### Open Graph Metadata
The **Open Graph metadata** (part of the [Open Graph protocol](https://ogp.me/)) enhances the presentation of web pages on social media platforms by specifying details like title, description, and preview images. They are used by Facebook, X (formerly Twitter), LinkedIn, Discord, Slack, and others. 

The **Open Graph protocol** specifies the different types of meta tags that you can use to describe your data. 

```html
<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description Here" />
<meta property="og:image" content="image_url_here" />
<meta property="og:url" content="https://imgsrc.io/guides/open-graph-meta-tags" />
```

#### Favicon Metadata
The **favicon metadata** links the favicon to the webpage, displayed in the browser's address bar or tab.

```html
<link rel="icon" href="path/to/favicon.ico" />
```

## 🌟 Next.js Metadata for SEO: Best Practices and Implementation
Next.js has a **Metadata API** that is used to define and manage your app's metadata. <br> It allows you to modify the `<head>` element of a page. 

> 🗂️ **Metadata management** helps users easily access and understand data (what it means, where it comes from, how it's structured, how it connects to other data, and any usage rules).

### 🏗️ Metadata Inheritance and Overriding
**Next.js** organizes metadata in a hierarchy, ensuring consistency while allowing pages to set their own unique details.

#### 🔗 How Metadata Inheritance Works
To keep things organized, Next.js allows you to set global metadata for your entire site while letting individual pages override or extend it when needed. This ensures consistency, giving each page the flexibility to have its own unique details. 🚀

##### Global Metadata (Applied to All Pages)
Set in `layout.js`:

```js
export const metadata = {
  title: "My Website",
  description: "A great website built with Next.js",
};
```

##### Page-Specific Metadata (Overrides Global Values)
Set in `page.js`:

```js
export const metadata = {
  title: "About Us - My Website", // Overrides global title
  description: "Learn more about our team and mission.", // Overrides global description
};
```

The output in the `<head>` section for the About page will be: 
```html
<title>About Us - My Website</title>
<meta name="description" content="Learn more about our team and mission.">
```

Summary: 
- **Root Layout Metadata:** Define a default structure in the main layout (`layout.js`).
- **Nested Layouts:** Override or extend metadata for specific sections of the site.
- **Page Metadata:** Each page can refine or replace metadata as needed.

***
### Adding Metadata In Your Next.js App

There are two ways to add metadata to your app, **config-based** and **file-based metadata**. <br> Both methods help manage SEO-related information like page titles, descriptions, and Open Graph tags. 

Below is a detailed guide on how to utilize both options effectively.

#### Config-Based Metadata
Config-based metadata is added in **layout.js** or **page.js** by using a static `metadata` object or a dynamic `generateMetadata()` function.

##### Configuring Static Metadata 
Static Metadata is predefined and remains constant across sessions. To implement static metadata in Next.js. 

```js
export const metadata = {
    title: ' ... ', 
    description: ' ... ',
}

export default function Page() {}
```

This setup ensures that all pages inheriting from this layout share the same metadata. 

##### Configuring Dynamic Metadata
Dynamic metadata adapts based on content or user interaction. 
You can use the `generateMetadata` function to `fetch` metadata that requires dynamic values.

To configure dynamic metadata: 

```js
export async function generateMetadata({ params, searchParams }, parent) {
    // read route params
    const id = (await params).id

    // fetch data
    const product = await fetch(`https://.../${id}`).then((res) => res.json())

    // optionally access and extend (rather than replace) parent metadata
    const previousImage = (await parent).openGraph?.images || []

    return {
        title: product.title,
        openGraph: {
            images: ['/some-specific-page-image.jpg', ...previousImages],
        },
    }
}

export default function Page({ params, searchParams }) {}
```

This approach is beneficial for pages where metadata depends on dynamic data, such as product details or user-generated content. 

#### File-Based Metadata
File-based metadata is added in **special metadata files** in your project's folders, either statically or dynamically: 
- favicon.ico, apple-icon.jpg, and icon.jpg
- opengraph-image.jpg and twitter-image.jpg
- robots.txt
- sitemap.xml 

##### 🖼️ favicon.ico, apple-icon.jpg, and icon.jpg
The favicon.ico, apple-icon.jpg, and icon.jpg files are used to provide your website with consistent branding across different platforms and devices.

- **favicon.ico** is the small icon that appears in the browser tab.
- **apple-icon.jpg** is used for the home screen icon on iOS devices.
- **icon.jpg** is used for a more general icon that can appear across other platforms, like Android or web apps.

Here’s how to include them in your Next.js project:
```html
<!-- Favicon for browsers -->
<link rel="icon" href="https://example.com/favicon.ico" type="image/x-icon">

<!-- Apple icon for iOS devices -->
<link rel="apple-touch-icon" href="https://example.com/apple-icon.jpg">

<!-- General icon for web apps -->
<link rel="icon" href="https://example.com/icon.jpg" type="image/jpg">
```
In Next.js, you can define these dynamically in the `_document.js` file:

```js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="https://example.com/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="https://example.com/apple-icon.jpg" />
          <link rel="icon" href="https://example.com/icon.jpg" type="image/jpg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```
These icons help brand your website and ensure that it looks great on all devices and in every browser tab.

##### 📷 opengraph-image.jpg and twitter-image.jpg
The opengraph-image.jpg and twitter-image.jpg files are used to set the preview image when your content is shared on social media platforms like **Facebook** and **X** *(previously Twitter)*. These images provide a visual representation of your page, making it more engaging and clickable.

For Open Graph (OG) and X/Twitter Cards, you would typically add the following metadata:

```html
<!-- Open Graph Metadata -->
<meta property="og:image" content="https://example.com/opengraph-image.jpg">

<!-- Twitter Card Metadata -->
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

In Next.js, you can define these dynamically using a function:

```js
export default function Page() {
  const ogImage = 'https://example.com/opengraph-image.jpg';
  const twitterImage = 'https://example.com/twitter-image.jpg';

  return (
    <>
      <Head>
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={twitterImage} />
      </Head>
    </>
  );
}

// Output:

// <meta property="og:image" content="https://example.com/opengraph-image.jpg">
// <meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```
These images help ensure that when your page is shared on social media, it has a beautiful, relevant preview that attracts attention!

##### 🤖 robots.txt
The robots.txt file tells search engine crawlers which URLs they can access on your site and looks something like this: 

```text
User-Agent: *
Allow: /
Disallow: /private/
Sitemap: https://example.com/sitemap.xml
```

In Next.js, you can either write your file like the above example (static) or generate it (dynamic) in a robots.js/.ts file.

```js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}

// Output:

// User-Agent: *
// Allow: /
// Disallow: /private/
// Sitemap: https://example.com/sitemap.xml
```

##### 🗺️ sitemap.xml
The sitemap.xml file provides search engines with a structured map of all the important pages on your site, helping them crawl and index your content more efficiently. It looks something like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-03-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2025-02-15</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

In Next.js, you can create a static sitemap.xml file or generate it dynamically. Here's how to generate it dynamically:

```js
export default function sitemap() {
  return [
    {
      url: 'https://example.com/',
      lastModified: '2025-03-01',
      priority: 1.0,
    },
    {
      url: 'https://example.com/about',
      lastModified: '2025-02-15',
      priority: 0.8,
    },
  ]
}

// Output:

// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url>
//     <loc>https://example.com/</loc>
//     <lastmod>2025-03-01</lastmod>
//     <priority>1.0</priority>
//   </url>
//   <url>
//     <loc>https://example.com/about</loc>
//     <lastmod>2025-02-15</lastmod>
//     <priority>0.8</priority>
//   </url>
// </urlset>
```
This helps search engines discover and index all your important pages!

### Best Practices for Metadata Management 📌
To maximize the benefits of metadata management in Next.js (and metadata management in general), here are a few best practices to keep in mind: 
- **Keep metadata concise and relevant:** Ensure titles and descriptions are clear and to the point. 
- **Utilize dynamic metadata when necessary:** For pages with content that changes frequently, implement dynamic metadata to reflect the current state. 
- **Leverage metadata templates:** Use title templates to maintain consistency across pages. 
- **Regularly update metadata:** Keep metadata current to reflect any changes in content or branding. 
- **Properly set Open Graph:** Set Open Graph metadata correctly to improve how your content looks on social media, to boost engagement and clicks.

## Conclusion 🎯
Effective metadata management in Next.js is vital for SEO and user engagement. By understanding and implementing both static and dynamic metadata, leveraging inheritance, and following best practices, you can create apps that are both user-friendly and search-engine optimized. 

To deepen your Next.js knowledge, check out our article [**"Securing your Next.js with Authentication"**](https://supertokens.com/blog/adding-login-to-your-nextjs-app-using-the-app-directory-and-supertokens). It covers how Next.js handles rendering and authentication, explores various authentication strategies, and guides you through implementing an authentication solution in Next.js.