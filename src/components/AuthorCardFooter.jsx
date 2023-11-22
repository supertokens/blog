import React from "react"

import authorsDetails from "../authors-details"
import { Github, Linkedin, Twitter } from "../icons"

export default function AuthorCardFooter({ author }) {

  const authorDetails = authorsDetails.find(a => a.name === author)

  if (authorDetails === undefined) {
    return <b>Written by the Folks at <a href="https://supertokens.com">SuperTokens</a> — hope you enjoyed!</b>
  }

  return (
   <>
    <div className="author-card-footer-container">
      <img
        src={authorDetails.image}
        alt="author image"
      />
      <div className="author-info">
        <span className="author-name">{authorDetails.name}</span>
        <div className="author-title-socials-container">
          <span className="author-title">{authorDetails.title}</span>
          <div className="author-socials">
            {authorDetails.socials.map(({name, url}) => {
              return <LinkIcon key={name} name={name} url={url}/>
            })}
          </div>
        </div>
        <p className="author-description">{authorDetails.description}</p>
      </div>
    </div>
    <p className="hidden-md">{authorDetails.description}</p>
   </>
  )
}

function LinkIcon({name, url}) {
  let icon = undefined
  if (name === "github") {
    icon = <Github />
  } else if (name === "linkedin") {
    icon = <Linkedin />
  } else if (name === "twitter") {
    icon = <Twitter />
  }
  return (
    <a href={url} target="_blank">
      {icon}
    </a>
  )
}
