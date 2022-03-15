import React from "react"
import { graphql } from "gatsby"
import BlogPostTemplate from "../../templates/blog-post"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  return (
    <BlogPostTemplate
      data={data}
    />
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        cover
        author
      }
      fields {
        slug
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`