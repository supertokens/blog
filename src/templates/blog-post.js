import * as React from "react"
import * as cheerio from "cheerio";
import { withPrefix } from "gatsby"

import Layout from "../components/layout"
import BlogPostFooter from "../components/BlogPostFooter";
import AuthorCard from "../components/AuthorCardTop";
import McpToolkitInterestForm from "../components/McpToolkitInterestForm";

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const postSlugWithUnderscores = post.fields.slug.replaceAll("/", "").replaceAll("-", "_");
  const isMCPBlogPost = post.fields.slug === "/supertokens-mcp-toolkit/"

  const getUpdatedHtml = (html) => {
    const htmlStr = `<div>${html.trim()}</div>`;
    const $ = cheerio.load(htmlStr, null, false);

    // remove the <hr> which is always the first element
    $(".footnotes > hr").each((i, hr) => {
      $(hr).remove();
    })

    // Adds a "Footnotes" title to footnotes container
    $(".footnotes > ol").before("<h2>Footnotes:</h2>");

    // changes the innerText of backref links inside footnotes to " ^"
    $(".footnotes > ol > li .footnote-backref").each((i, backref) => {
      $(backref).text(" ^");
    });

    // removes rel="nofollow noreferrer" and target="_blank"
    // from links having domain `https://supertokens.com`
    $("a").each((_, a) => {
      if ($(a).attr("href").startsWith("https://supertokens.com")) {
        $(a).removeAttr("rel");
        $(a).removeAttr("target");
      }
    });

    return $.html();
  }

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
         <header>
          {post.frontmatter.cover && (
            <img
              style={{ maxWidth: "100%", marginBottom: "16px" }}
              src={withPrefix("/covers/" + post.frontmatter.cover)}
              alt="Cover"
            />
          )}
          <div className="blog-header-content-container">
            <p className="blog-date">{post.frontmatter.date}</p>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            <p className="blog-description">{post.frontmatter.description}</p>
            {post.frontmatter.author && (
              <AuthorCard author={post.frontmatter.author} />
            )}
          </div>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: getUpdatedHtml(post.html) }}
          itemProp="articleBody"
        />
        {isMCPBlogPost && <McpToolkitInterestForm />}
        <BlogPostFooter
          idSlug={postSlugWithUnderscores}
          author={post.frontmatter.author}
        />
      </article>
    </Layout>
  )
}

export default BlogPostTemplate
