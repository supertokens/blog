# Contributing

We’re glad that you are interested in contributing to SuperTokens 🎉
We welcome contributions of all kinds (discussions, bug fixes, features, design changes, videos, articles) and from anyone 👩‍💻🤚🏿🤚🏽🤚🏻🤚🏼🤚🏾👨‍💻.

## Project setup
Clone the project by running the following command

```sh
git clone https://github.com/supertokens/blog.git
```

Once it is cloned, install the dependencies

```sh
cd blog
npm install
```

To start the project, do `npm start`.

## Adding blog posts
All the blog posts exist inside the `content` directory present at the root of this project. To add a new blog which is accessed at the route `/blog/my-new-blog-post`, we need to create a new directory called `my-new-blog-post` inside the `content` directory. Then we add an `index.md` file inside this newly created directory and this blog will now be accessible.

```sh
cd content
mkdir my-new-blog-post
cd my-new-blog-post
touch index.md
```
#### Frontmatter
The `index.md` file starts with a frontmatter where we specify some information about the blog.

```md
---
title: "Title for your new blog post"
date: "2022-02-20"
description: "This is a description that will be visible on the blog's card in the blog landing page"
cover: "cover-image-for-my-blog-post.png"
category: "programming, featured"
author: "John Doe"
---
```

- The `date` property's value should be a string of the format `YYYY-MM-DD`
- The cover image should be placed inside the `static/covers` directory which is present at the root of the project. Only the name of the cover image file should be specified in the frontmatter's `cover` property.
- The `category` property should be a string having all the categories for this blog post separated by a comma. For e.g. if we want a post that is visible in the _Featured_ and _Sessions_ tabs, the value would be `featured, sessions`.

#### Content for the post
All the content for the post is added in the `index.md` file, after the frontmatter. All the features for markdown are available to use. Following are some examples-
- You can add footnotes to a blog post by following [this](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes) guide.
- You can also add [lists](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#lists) and [nested lists](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#nested-lists).
- You can also add images by following [this](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images) guide. Any image added to the blog post should be placed insde the blog's directory. For example, if we want to add an image `flow.png` to the `my-new-blog-post` post, paste the image inside the `content/my-new-blog-post` directory, adjacent to the `index.md` file. Inside the `index.md` file, we can insert an image by doing the following-
```md
![Alt text for the image](./flow.png)
```

## Viewing the blogs
You can view the blog landing page by visiting `http://localhost:8000/blog`. All the posts placed inside the `content` directory are visible here, as well as all the posts details that are added in the `src/blog-details.js`'s `webflowBlogList` array.