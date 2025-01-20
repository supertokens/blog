// Warning: This script is WIP

function generateBlogMetadata(frontmatter) {
    // Parse the frontmatter object
    const {
        title,
        description,
        cover,
        url
    } = frontmatter;

    // Generate the slug from the title
    const slug = url

    // Construct the output JSON
    const metadata = {
        path: `/blog/${slug}`,
        metaTags: [
            `<meta name="description" content="${description}" />`,
            "",
            `<meta name="keywords" content="Authentication, Open Source, SAML, User Management, OAuth, Enterprise SSO, Security" />`,
            "<!--OG Tags-->",
            `<meta property="og:title" content="${title}" />`,
            `<meta property="og:type" content="article" />`,
            `<meta property="og:url" content="https://supertokens.com/blog/${slug}" />`,
            `<meta property="og:description" content="${description}"/>`,
            `<meta property="og:image" content="https://supertokens.com/blog-meta-images/${cover}" />`,
            "",
            `<meta name="twitter:card" content="summary_large_image" />`,
            `<meta name="twitter:title" content="${description}" />`,
            `<meta name="twitter:url" content="https://supertokens.com/blog/${slug}" />`,
            `<meta name="twitter:image" content="https://supertokens.com/blog-meta-images/${cover}" /> `,
            "<!--OG Tags-->",
            `<link rel="canonical" href="https://supertokens.com/blog/${slug}">`
        ],
        title,
        schema: `<script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://supertokens.com/blog/${slug}"
            },
            "headline": "${description}",
            "image": "https://supertokens.com/blog-meta-images/${cover}",
            "author": {
                "@type": "Organization",
                "name": "SuperTokens",
                "url": "https://supertokens.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "SuperTokens",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://supertokens.com/static/assets/dark-home/logo.png"
                }
            }
        }
        </script>`
    };

    return metadata;
}

// Example usage
const frontmatter = {
    title: "Session-Based Authentication: A Detailed Guide [2024]",
    description: "Session-based authentication is a cornerstone of web security, providing a simple and controlled method to manage user sessions. This guide delves into its workings, advantages, and implementation, while addressing challenges like security vulnerabilities and scalability concerns.",
    cover: "session-based-authentication.png",
    url: "session-based-authentication"
};

console.log(generateBlogMetadata(frontmatter));