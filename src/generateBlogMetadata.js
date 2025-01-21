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
    title: "8 Benefits of Identity and Access Management (IAM) for Security",
    description: "Discover the 8 key benefits of Identity and Access Management (IAM) for enhancing security. Learn how IAM can protect your organization effectively.",
    cover: "8-benefits-of-identity-and-access-management-for-security.png",
    url: "8-benefits-of-identity-and-access-management-for-security"
};

console.log(generateBlogMetadata(frontmatter));