const fs = require('fs');
const path = require('path');

function parseFrontmatter(fileContent) {
    /**
     * Parses the frontmatter block from a file's content and returns it as an object.
     */
    const frontmatterMatch = fileContent.match(/^---[\s\S]*?---/);
    if (!frontmatterMatch) {
        throw new Error('Frontmatter block not found.');
    }

    const frontmatterBlock = frontmatterMatch[0].replace(/^---|---$/g, '').trim();
    const frontmatterLines = frontmatterBlock.split('\n');

    const frontmatter = {};
    frontmatterLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^"|"$/g, '');
    });

    return frontmatter;
}

function generateBlogMetadataToFile(frontmatter, urlSlug) {
    /**
     * Generates JSON metadata for a blog post based on frontmatter input and an optional URL slug,
     * then writes the metadata to a JSON file in the 'temp' directory.
     */

    // Extract values from frontmatter
    const { title, description, cover } = frontmatter;

    // Construct JSON metadata
    const metadata = {
        path: `/blog/${urlSlug}`,
        metaTags: [
            `<meta name=\"description\" content=\"${description}\" />`,
            "",
            '<meta name=\"keywords\" content=\"Authentication, Open Source, SAML, User Management, OAuth, Enterprise SSO, Security\" />',
            "<!--OG Tags-->",
            `<meta property=\"og:title\" content=\"${title}\" />`,
            '<meta property=\"og:type\" content=\"article\" />',
            `<meta property=\"og:url\" content=\"https://supertokens.com/blog/${urlSlug}\" />`,
            `<meta property=\"og:description\" content=\"${description}\"/>`,
            `<meta property=\"og:image\" content=\"https://supertokens.com/blog-meta-images/${cover}\" />`,
            "",
            '<meta name=\"twitter:card\" content=\"summary_large_image\" />',
            `<meta name=\"twitter:title\" content=\"${description}\" />`,
            `<meta name=\"twitter:url\" content=\"https://supertokens.com/blog/${urlSlug}\" />`,
            `<meta name=\"twitter:image\" content=\"https://supertokens.com/blog-meta-images/${cover}\" /> `,
            "<!--OG Tags-->",
            `<link rel=\"canonical\" href=\"https://supertokens.com/blog/${urlSlug}\">`
        ],
        title: title,
        schema: `{
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://supertokens.com/blog/${urlSlug}"
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
        }`
    };

    // Ensure the 'temp' directory exists
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Define the file path
    const filePath = path.join(tempDir, `${urlSlug}.json`);

    // Write the metadata to the file
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 4), 'utf-8');

    return filePath;
}

// Command-line usage
const filePathArgument = process.argv[2];
if (!filePathArgument) {
    console.error('Usage: node script.js <file-path>');
    process.exit(1);
}

try {
    const fileContent = fs.readFileSync(filePathArgument, 'utf-8');
    const frontmatter = parseFrontmatter(fileContent);
    const urlSlug = path.basename(filePathArgument, path.extname(filePathArgument));

    const metadataFilePath = generateBlogMetadataToFile(frontmatter, urlSlug);
    console.log(`Metadata saved to: ${metadataFilePath}`);
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
