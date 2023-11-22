import React from "react"

import authorsDetails from "../authors-details";

export default function AuthorCardFooter({ author }) {

  if (author === undefined) {
    return null
  }

  const authorDetails = authorsDetails.find(a => a.name === author)

  if (authorDetails === undefined) {
    return null;
  }

  return (
    <div className="author-card-footer-container">
      <img src="https://avatars.githubusercontent.com/u/87567452?v=4" alt="author image" />
      <div className="author-info">
        <span className="author-name">{authorDetails.name}</span>
        <div className="author-title-socials-container">
          <span className="author-title">{authorDetails.title}</span>
          <div className="author-socials">
            {authorDetails.socials.map(s => {
              return <Icon fill="#000" />
            })}
          </div>
        </div>
        <p className="author-description">
          {authorDetails.description}
        </p>
      </div>
    </div>
  )
}

function Icon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
}