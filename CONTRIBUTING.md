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
All the blog posts exist inside their own directory in the `content` directory present at the root of this project. The name of the posts' director serves as the slug for the blog post. For example, to have a post at the route `/blog/my-new-blog-post`, we create a directory named `my-new-blog-post` inside the `content` directory and add all the post-related content inside this directory.

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
description: "This is a description that will be visible on the blog's card in the blog landing page"
date: "2022-02-20"
cover: "cover-image-for-my-blog-post.png"
category: "programming, featured"
author: "John Doe"
---
```
- **title:** Title of the blog post.
- **description:** Description of the post that will be visible on the blog's card.
- **date:** Date on which the post was created. It is a string of the format `YYYY-MM-DD`.
- **cover:** Name of the cover image file for this post. The cover image should be placed inside the `static/covers` directory which is present at the root of the project. Only the name of the cover image file should be specified in the frontmatter's `cover` property.
- **category:** The `category` property should be a string having all the categories for the blog post separated by a comma. For e.g. if we want a post that is visible in the _Featured_ and _Sessions_ tabs, the value would be `featured, sessions`.
- **author:** Name of the author of this post.

#### Content for the post
All the content for the post is added in the `index.md` file, after the frontmatter. Check out all the markdown features supported by Gatsby [here](https://www.gatsbyjs.com/docs/reference/markdown-syntax/).

Following are some examples-
- You can add footnotes to a blog post by following [this](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes) guide.
- You can add images by following [this](https://www.gatsbyjs.com/docs/reference/markdown-syntax/#image-with-alt-text) guide. Any image added to the blog post should be placed inside the blog's own directory. For example, if we want to add an image `flow.png` to the `my-new-blog-post` post, paste the image inside the `content/my-new-blog-post` directory, adjacent to the `index.md` file. Inside the `index.md` file, we can insert an image by doing the following-
```md
![Alt text for the image](./flow.png)
```

## Viewing the blogs
You can view the blog landing page by visiting `http://localhost:8000/blog`. All the posts placed inside the `content` directory are visible here, as well as all the posts details that are added in the `src/blog-details.js`'s `webflowBlogList` array.

**Note:** Visiting any blog that is listed in the `src/blog-details.js` file will result in a `404`.