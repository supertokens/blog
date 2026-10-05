const authorsDetails = require("./authors-details");

const PUBLISHER = {
    "@type": "Organization",
    name: "SuperTokens",
    logo: {
        "@type": "ImageObject",
        url: "https://supertokens.com/static/assets/dark-home/logo.png",
    },
};

const ORGANIZATION_AUTHOR = {
    "@type": "Organization",
    name: "SuperTokens",
    url: "https://supertokens.com",
};

// Google recommends Article headlines of at most 110 characters.
const MAX_HEADLINE_LENGTH = 110;

function buildHeadline(title) {
    const headline = (title || "").split(" | ")[0].trim();
    if (headline.length <= MAX_HEADLINE_LENGTH) {
        return headline;
    }
    return headline.slice(0, MAX_HEADLINE_LENGTH - 1).replace(/\s+\S*$/, "") + "…";
}

function buildAuthor(authorName) {
    if (!authorName) {
        return ORGANIZATION_AUTHOR;
    }
    const details = authorsDetails.find(a => a.name === authorName);
    const author = { "@type": "Person", name: authorName };
    if (details) {
        if (details.jobTitle) {
            author.jobTitle = details.jobTitle;
        }
        const profileUrls = (details.socials || []).map(s => s.url).filter(Boolean);
        if (profileUrls.length > 0) {
            author.url = profileUrls[0];
            author.sameAs = profileUrls;
        }
    }
    author.worksFor = { "@type": "Organization", name: "SuperTokens", url: "https://supertokens.com" };
    return author;
}

/**
 * Applies publish/modified dates and the post's real author to an Article JSON-LD object.
 * `frontmatter.date` is the publish date; `frontmatter.updated` (optional) is the last
 * substantive content update.
 */
function applyPostMetadata(article, frontmatter) {
    const { date, updated, author } = frontmatter;
    const result = {};
    for (const [key, value] of Object.entries(article)) {
        if (["datePublished", "dateModified", "author", "publisher"].includes(key)) {
            continue;
        }
        result[key] = value;
    }
    if (date) {
        result.datePublished = date;
        result.dateModified = updated || date;
    }
    result.author = buildAuthor(author);
    result.publisher = article.publisher || PUBLISHER;
    return result;
}

function buildArticleSchema({ urlSlug, title, description, cover, date, updated, author }) {
    const article = {
        "@context": "https://schema.org",
        "@type": "Article",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://supertokens.com/blog/${urlSlug}`,
        },
        headline: buildHeadline(title),
        description,
        image: `https://supertokens.com/blog-meta-images/${cover}`,
    };
    return applyPostMetadata(article, { date, updated, author });
}

module.exports = { buildArticleSchema, applyPostMetadata, buildHeadline, MAX_HEADLINE_LENGTH };
