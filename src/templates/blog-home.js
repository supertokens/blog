import * as React from "react"

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
      <div className="blog-header">
        <h1 className="blog-header__title">SuperTokens Blog</h1>

        <div className="blog-categories">
          <button
            id="tab-1-id"
            className={`blog-categories__category ${selectedCategory === "all" && "selected"}`}
            onClick={() => updateCategory("all")}
            >
            All
          </button>
          <button
            id="tab-2-id"
            className={`blog-categories__category ${selectedCategory === "sessions" && "selected"}`}
            onClick={() => updateCategory("sessions")}
            >
            Sessions
          </button>
          <button
            id="tab-3-id"
            className={`blog-categories__category ${selectedCategory === "featured" && "selected"}`}
            onClick={() => updateCategory("featured")}
            >
            Featured
          </button>
          <button
            id="tab-4-id"
            className={`blog-categories__category ${selectedCategory === "programming" && "selected"}`}
            onClick={() => updateCategory("programming")}
          >
            Programming
          </button>
          <button
            id="tab-5-id"
            className={`blog-categories__category ${selectedCategory === "test" && "selected"}`}
            onClick={() => updateCategory("Test")}
          >
            Test
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
