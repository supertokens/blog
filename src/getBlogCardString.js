module.exports = function (post) {
  try {
    const renderedPost = `
      <a href="${post.fields.slug ? `/blog${post.fields.slug}` : post.fields.url}" class="blog-card">
        <img
          src="${"/covers/" + post.frontmatter.cover}"
          alt="Blog cover"
          class="blog-card__image"
        />
        <p class="blog-card__date">${post.frontmatter.date}</p>
        <p class="blog-card__title">${post.frontmatter.title}</p>
        <p class="blog-card__excerpt">${post.frontmatter.description || post.excerpt}</p>
      </a>
    `

    return renderedPost
  } catch (err) {
    return ""
  }
}