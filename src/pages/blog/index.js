import * as React from "react"
import { graphql } from "gatsby"

import Seo from "../../components/seo"
import { webflowBlogsList } from "../../blog-details"
import BlogCard from "../../components/BlogCard"

import "../../styles/blog.css"

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [classToHideList, setClassToHideList] = React.useState("visible");
  const [allPostsList, setAllPostsList] = React.useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      setClassToHideList("visible");
    }, 150);
  }, [selectedCategory]);

  // filters the posts according to the selected category
  // sorts them by date
  // and renders them using the BlogCard component
  const filterPostsByCategory = React.useCallback((listOfPosts) => {
    return listOfPosts.filter((post) => {
      if (selectedCategory === "all") {
        return true;
      }
      return post.frontmatter.category === selectedCategory || post.frontmatter.category.includes(selectedCategory);
    });
  }, [selectedCategory]);

  React.useEffect(() => {
    const webflowAndGatsbyPosts = [
      ...filterPostsByCategory(webflowBlogsList), 
      ...filterPostsByCategory(posts)
    ].sort((postA, postB) => {
      try {
        return new Date(postB.frontmatter.date) - new Date(postA.frontmatter.date);
      } catch {
        console.log('date is not sorted', postA, postB)
        return false;
      } 
    });

    setTimeout(() => {
      setAllPostsList(webflowAndGatsbyPosts);
    }, 150);
  }, [posts, filterPostsByCategory]);

  const allPostsRendered = React.useMemo(() => {
    return allPostsList.map((post) => {
      return (
        <BlogCard
          key={post.fields.slug}
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          date={post.frontmatter.date}
          cover={post.frontmatter.cover}
          url={post.fields.slug ? `/blog${post.fields.slug}` : post.fields.url}
        />
      )
    })
  }, [allPostsList])

  const updateCategory = (newCategory) => {
    if (newCategory !== selectedCategory) {
      setClassToHideList("hidden");
      setSelectedCategory(newCategory);
    }
  }

  return (
    <div className="blog-container">
      <Seo />
      <div className="blog-header">
        <h1 className="blog-header__title">SuperTokens Blog</h1>

        <div className="blog-categories">
          <button
            className={`blog-categories__category ${selectedCategory === "all" && "selected"}`}
            onClick={() => updateCategory("all")}
          >
            All
          </button>
          <button
            className={`blog-categories__category ${selectedCategory === "sessions" && "selected"}`}
            onClick={() => updateCategory("sessions")}
          >
            Sessions
          </button>
          <button
            className={`blog-categories__category ${selectedCategory === "featured" && "selected"}`}
            onClick={() => updateCategory("featured")}
          >
            Featured
          </button>
          <button
            className={`blog-categories__category ${selectedCategory === "programming" && "selected"}`}
            onClick={() => updateCategory("programming")}
          >
            Programming
          </button>
        </div>
      </div>

      <div className={`blog-post-list ${classToHideList}`}>
        {allPostsRendered}
      </div>
    </div>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
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
