const { createFilePath } = require(`gatsby-source-filesystem`)

const webflowPosts = require("./src/blog-details")
const getBlogCardString = require("./src/getBlogCardString")

// create the /blog page
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
              cover
              category
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const markdownPosts = result.data.allMarkdownRemark.nodes

  const sortedPosts = [...markdownPosts, ...webflowPosts].sort((postA, postB) => {
    try {
      return new Date(postB.frontmatter.date) - new Date(postA.frontmatter.date);
    } catch {
      console.log('date is not sorted', postA, postB)
      return false;
    } 
  });


  const postsAsHTMLString = {
    all: "",
    sessions: "",
    featured: "",
    programming: ""
  }

  const allFilters = ["all", "sessions", "featured", "programming", "test"]
  allFilters.forEach((filter) => {
    postsAsHTMLString[filter] = sortedPosts.filter((post) => {
      if (filter === "all") {
        return true;
      }

      return post.frontmatter.category === filter || post.frontmatter.category.includes(filter);
    }).map((post, index) => {
      // add `loading="lazy"` to blog cards after the first 3 cards
      return getBlogCardString(post, index >= 3);
    }).join("");
  });

  createPage({
    path: "/blog",
    component: require.resolve('./src/templates/blog-home.js'),
    context: {
      postsAsHTMLString
    }
  })
}

// adds a `slug` field to the blog frontmatter
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      author: String
      cover: String
      category: String
    }

    type Fields {
      slug: String
    }
  `)
}
