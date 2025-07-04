import * as React from "react"

import "../styles/blog.css"
import { categories } from "../blog-categories";

const BlogHomeTemplate = (props) => {
  const [selectedCategory, setSelectedCategory] = React.useState(categories.ALL);
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
            className={`blog-categories__category ${selectedCategory === categories.ALL && "selected"}`}
            onClick={() => updateCategory(categories.ALL)}
          >
            All
          </button>
          <button
            id="tab-2-id"
            className={`blog-categories__category ${selectedCategory === categories.ANNOUNCEMENTS && "selected"}`}
            onClick={() => {updateCategory(categories.ANNOUNCEMENTS)}}
          >
            Announcements
          </button>
          <button
            id="tab-3-id"
            className={`blog-categories__category ${selectedCategory === categories.AUTHENTICATION && "selected"}`}
            onre
            onClick={() => updateCategory(categories.AUTHENTICATION)}
          >
            Authentication
          </button>
          <button
            id="tab-4-id"
            className={`blog-categories__category ${selectedCategory === categories.TUTORIALS && "selected"}`}
            onClick={() => updateCategory(categories.TUTORIALS)}
          >
            Tutorials
          </button>
          <button
            id="tab-5-id"
            className={`blog-categories__category ${selectedCategory === categories.SECURITY && "selected"}`}
            onClick={() => updateCategory(categories.SECURITY)}
          >
            Security
          </button>
          <button
            id="tab-6-id"
            className={`blog-categories__category ${selectedCategory === categories.NEWS && "selected"}`}
            onClick={() => updateCategory(categories.NEWS)}
          >
            News
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
