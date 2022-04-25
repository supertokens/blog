module.exports = function (post) {
  // if the url or slug of the post has a trailing '/'
  // we remove it
  let href = post.fields.slug ? `/blog${post.fields.slug}` : post.fields.url;
  if (href.endsWith("/")) {
    href = href.substring(0, href.length - 1);
  }

  let nofollowAttribute = "";
  if (post.fields.nofollow) {
    nofollowAttribute = "rel=\"nofollow\" target=\"_blank\"";
  }

  try {
    const renderedPost = `
      <a href="${href}" ${nofollowAttribute} class="blog-card">
        <div class="blog-card__image-container">
          <img
            src="${"/covers/" + post.frontmatter.cover}"
            alt="Blog cover"
            class="blog-card__image"
          />
        </div>
        <p class="blog-card__date">${post.frontmatter.date}</p>
        <h2 class="blog-card__title">${post.frontmatter.title}</h2>
        <p class="blog-card__excerpt">${post.frontmatter.description || post.excerpt}</p>
      </a>
    `

    return renderedPost
  } catch (err) {
    return ""
  }
}