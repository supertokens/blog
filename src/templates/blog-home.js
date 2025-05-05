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
            className={`blog-categories__category ${selectedCategory === "authentication-identity" && "selected"}`}
            onClick={() => updateCategory("authentication-identity")}
          >
            Authentication & Identity
          </button>
          <button
            id="tab-3-id"
            className={`blog-categories__category ${selectedCategory === "security-compliance" && "selected"}`}
            onClick={() => updateCategory("security-compliance")}
          >
            Security & Compliance
          </button>
          <button
            id="tab-4-id"
            className={`blog-categories__category ${selectedCategory === "developer-guides" && "selected"}`}
            onClick={() => updateCategory("developer-guides")}
          >
            Developer Guides & Tutorials
          </button>
          <button
            id="tab-5-id"
            className={`blog-categories__category ${selectedCategory === "product-updates" && "selected"}`}
            onClick={() => updateCategory("product-updates")}
          >
            Product Updates & Announcements
          </button>
          <button
            id="tab-6-id"
            className={`blog-categories__category ${selectedCategory === "company-news" && "selected"}`}
            onClick={() => updateCategory("company-news")}
          >
            Company News & Events
          </button>
          <button
            id="tab-7-id"
            className={`blog-categories__category ${selectedCategory === "case-studies" && "selected"}`}
            onClick={() => updateCategory("case-studies")}
          >
            Case Studies & Customer Stories
          </button>
          <button
            id="tab-8-id"
            className={`blog-categories__category ${selectedCategory === "industry-insights" && "selected"}`}
            onClick={() => updateCategory("industry-insights")}
          >
            Industry Insights & Trends
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
