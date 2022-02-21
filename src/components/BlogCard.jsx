import React from "react";

const BlogCard = (props) => {
  return (
    <a href={props.url} className="blog-card">
      <img
        src={"/covers/" + props.cover}
        alt="Blog cover"
        className="blog-card__image"
      />
      <p className="blog-card__date">{props.date}</p>
      <p className="blog-card__title">{props.title}</p>
      <p className="blog-card__excerpt">{props.description}</p>
    </a>
  )
}

export default BlogCard;