import React from "react"

import authorsDetails from "../authors-details"

export default function AuthorCard({ author }) {

  const authorDetails = authorsDetails.find(a => a.name === author);
  
  if (authorDetails === undefined) {
    return (
      <p
        style={{
          fontSize: "16px",
          fontWeight: "normal",
          margin: "-16px 0px 32px",
          color: "#222",
        }}
      >
        By {author}
      </p>
    )
  }

  return (
    <div className="author-card-top-container">
      <img
        src={`/author_images/${authorDetails.image}`}
        alt="author"
      />
      <div className="author-info">
        <span className="author-name">By {author}</span>
        <span className="author-title">{authorDetails.jobTitle}</span>
      </div>
    </div>
  )
}
