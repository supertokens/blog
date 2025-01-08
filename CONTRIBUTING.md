# Contributing

We’re glad that you are interested in contributing to SuperTokens 🎉
We welcome contributions of all kinds (discussions, bug fixes, features, design changes, videos, articles) and from anyone 👩‍💻🤚🏿🤚🏽🤚🏻🤚🏼🤚🏾👨‍💻.

## Project setup

*This project requires node version `16.4.2`. You can use [nvm](https://github.com/nvm-sh/nvm) to manage multiple versions of node on your machine.*

Clone the project by running the following command

```sh
git clone https://github.com/supertokens/blog.git
```

Once it is cloned, install the dependencies and run the site

```sh
cd blog
npm install
npm start
```

Visit `http://localhost:8000/blog` to see the blog.

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
- **cover:** Name of the cover image files for this post. Two cover image files need to be added, a high resolution image which will be visible inside the blog post and a low resolution (maximum height of `250px`) image which will be shown as the cover image in the blog cards on blog listing page. The high resolution image should be placed inside the `static/covers` directory and the low resolution image should be placed inside the `static/card_covers` directory, both present at the root of the project. Both the images should have the same name and this name should be specified in the frontmatter's `cover` property.
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

#### Author information for the post.
To add/edit the author information for existing or new author of the blog that needs to be published you need to add necessary information of that author in `src/authors-details.js` and the name property of the author object should match with the author value in frontmatter in your blogs `index.md` file.

##### Example

```mdx
---
title: "What is TOTP and why do you need it?"
date: "2023-11-16"
description: "Time based one-time passwords solve a number of issues that plague traditional authentication methods. In this blog we break down TOTP and why it's so useful."
cover: "totp-why-you-need-it-and-how-it-works.png"
category: "programming"
# this author properties value should exactly match with name property in the author object below.
author: "Joel Coutinho"
---

```

```js

module.exports = [
{
  // This property's value should match with the frontmatter author value.
  name: "Joel Coutinho",
  jobTitle: "Backend Developer at SuperTokens",
  image: "joel.jpeg",
  socials: [
    {
      name: "github",
      url: "https://github.com/jscyo",
    },
    {
      name: "linkedin",
      url: "https://linkedin.com/jscyo",
    },
    {
      name: "twitter",
      url: "https://twitter.com/jscyo",
    },
  ],
  bio:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis enim consequatur obcaecati, modi facilis nemo. Doloribus quia libero iste autem!",
}
]

```

Finally add a image of the author into `/static/author_images` folder and make sure that the author metatag is added to `/static/blog-seo/config.json` as show in the below [metatags](#meta-tags) example.

## Adding Table of Content

```toc
tight: true
toHeading: 3
```

#### SEO for blogs

##### Adding OG images

Images that are meant to be used as the source for `og:image`, `twitter:image` etc should be added to the `/static/blog-meta-images` folder. Then when setting the URL in meta tags you can use `https://supertokens.com/blog-meta-images/<IMAGE_NAME>`

##### Meta Tags

Meta tags for blog images are picked up from `/static/blog-seo/config.json`, for each blog you add an item to the array following the format

```json
{
    "path": "/blog/<SLUG>",
    "metaTags": [
        "<meta name=\"author\" content=\"<TODO>\" /> ",
        "<meta name=\"description\" content=\"<TODO>\" />",
        "",
        "<meta name=\"keywords\" content=\"<TODO>\" />",
        "<!--OG Tags-->",
        "<meta property=\"og:title\" content=\"<TODO>\" />",
        "<meta property=\"og:type\" content=\"article\" />",
        "<meta property=\"og:url\" content=\"https://supertokens.com/blog/<SLUG>\" />",
        "<meta property=\"og:description\" content=\"<TODO>\"/>",
        "<meta property=\"og:image\" content=\"https://supertokens.com/blog-meta-images/<IMAGE_NAME>.ext\" />",
        "",
        "<meta name=\"twitter:card\" content=\"summary_large_image\" />",
        "<meta name=\"twitter:title\" content=\"<TODO>\" />",
        "<meta name=\"twitter:description\" content=\"<TODO>\" />",
        "<meta name=\"twitter:url\" content=\"https://supertokens.com/blog/<SLUG>\" />",
        "<meta name=\"twitter:image\" content=\"https://supertokens.com/blog-meta-images/<IMAGE_NAME>.ext\" /> ",
        "<!--OG Tags-->"
    ],
    "title": "<TODO>",
    "schema": "<script type=\"application/ld+json\">\n{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"mainEntityOfPage\":{\"@type\":\"WebPage\",\"@id\":\"https://supertokens.com/blog/<SLUG>\"},\"headline\":\"<TODO>\",\"description\":\"<TODO>\",\"image\":\"https://supertokens.com/blog-meta-images/<IMAGE_NAME>.ext\",\"author\":{\"@type\":\"Organization\",\"name\":\"SuperTokens\",\"url\":\"https://supertokens.com\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"SuperTokens\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://supertokens.com/static/assets/dark-home/logo.png\"}}}</script>"
}
```

Then after the blog is published these meta tags will be used (on both the test and production site)

### Adding cannonical tags

By default the canonical tag is set to the URL of the blog. If you need to set a custom path you will need to set the `hasCustomCanonicalURL` field to the blog SEO config:

```json
{
   "path": "/blog/<SLUG>",
   "metaTags": [
       "...",
       "<!--OG Tags-->",
      "..."
       "<!--OG Tags-->",
       "<link rel=\"canonical\" href=\"<ORIGINAL_DOMAIN>\">"
   ],
   "title": "...",
   "schema": "...",
  "hasCustomCanonicalURL": true
}
```

### Updating the sitemap

Modify the `/static/blog-seo/sitemapconfig.json` file and add the URL of the blog you are adding to the website. This will ensure that the URL is present in the sitemap.xml file when Google bots request it

## Viewing the blogs
You can view the blog landing page by visiting `http://localhost:8000/blog`. All the posts placed inside the `content` directory are visible here, as well as all the posts details that are added in the `src/blog-details.js`'s `webflowBlogList` array.

**Note:** Visiting any blog that is listed in the `src/blog-details.js` file will result in a `404`.

## Creating a Pull Request
If you are creating a pull request for changes other than adding a new blog post, use the [PR template for dev](https://github.com/supertokens/blog/tree/master/.github/PULL_REQUEST_TEMPLATE/dev.md) by adding the `template=dev.md` query parameter (Learn more about the query parameter [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/using-query-parameters-to-create-a-pull-request)).


## Internal guide for posting a blog

### Content Process
- Setup content calendar for the month with timelines for each component
  - Graphic design: Designers
  - Review: CTO + CEO - leave anywhere from 5-14 days for review
  - Setup publication timeline
- Research SEO keywords using Ahrefs
  - Target keywords with fewer than 30 difficulty and 100+ volume
  - Focus on authentication related keywords
  - Look at competitors to see what keywords they rank for
  - Add tags for each article, 4 #s
- Write blog post
  - Focus on providing value upfront
- Write channel content for blog post
  - Hackernews, Product Hunt, Twitter, Discord, Email
- Review with CTO + CEO on Google Docs
- Ping designers for cover image + graphics where applicable
- Come up with the seo data for the publication process
  - Description
  - keywords
  - title
  - url
  - og image(Ask designers)

### Publication process
- Create an issue on Zenhub tracking the blog post
- Submit PR to supertokens/blog repo
  - Upload cover image to static/cover folder
  - Upload a reduced 250px height cover image to static/card-cover folder
  - Upload title, description, category, and author
    - “Programming” - if it has code - even if it’s a product launch
    - “Featured” - general educational content
    - “Sessions” - if it relates to sessions
  - Upload the og image to `/static/blog-meta-images` in the blog repo
  - Add the seo data(description, keywords, title, url, og image) to `/static/blog-seo/config.json` in the blog repo
  - Link to Github Issue (not the Zenhub issue).
- Place Zenhub issue into the Engineering Review column 

### Once blog is published in prod
- Go to https://socialsharepreview.com/, paste the url of the new blog and you should see in preview the og image, the title and the description that you inserted in the meta tags sheet
