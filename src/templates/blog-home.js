import * as React from "react"

import Seo from "../components/seo"

import "../styles/blog.css"

const BlogHomeTemplate = (props) => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [classToHideList, setClassToHideList] = React.useState("visible");

  React.useEffect(() => {
    setTimeout(() => {
      const postList = document.getElementById("gatsby-blog-post-list")
      if (postList) {
        postList.innerHTML = props.pageContext.postsAsHTMLString[selectedCategory]
      }
      setClassToHideList("visible");
    }, 150);
  }, [selectedCategory, props.pageContext.postsAsHTMLString]);

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

      <div
        id="gatsby-blog-post-list"
        className={`blog-post-list ${classToHideList}`}
        dangerouslySetInnerHTML={{ __html: props.pageContext.postsAsHTMLString.all }}
      />
    </div>
  )
}

export default BlogHomeTemplate
