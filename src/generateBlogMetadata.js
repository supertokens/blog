const fs = require('fs');
const path = require('path');

const OUTPUT_FILE_PATH = path.join(__dirname,"../","static","blog-seo","config.json")
const SITEMAP_CONFIG_PATH = path.join(__dirname,"../","static","blog-seo","sitemapconfig.json")

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

function appendBlogMetadataToFile(frontmatter, urlSlug, outputFilePath) {
    /**
     * Appends JSON metadata for a blog post based on frontmatter input and an optional URL slug
     * to an existing JSON file containing an array of metadata objects.
     */

    // Extract values from frontmatter
    const { title, description, cover } = frontmatter;

    // Construct JSON metadata
    const metadata = {
        path: `/blog/${urlSlug}`,
        metaTags: [
            `<meta name=\"description\" content=\"${description}\" />`,
            "",
            '<meta name=\"keywords\" content=\"Authentication, Open Source, Authorization, User Management, OAuth, Enterprise SSO, Security\" />',
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

    // Read the existing JSON file or create a new array if the file doesn't exist
    {
        let existingData = [];
        if (fs.existsSync(outputFilePath)) {
            const fileContent = fs.readFileSync(outputFilePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Append the new metadata to the array
        existingData.push(metadata);

        // Write the updated array back to the file
        fs.writeFileSync(outputFilePath, JSON.stringify(existingData, null, 4), 'utf-8');
    }
    // Add the URL slug to the sitemapconfig
    {
        let existingData = [];
        if (fs.existsSync(SITEMAP_CONFIG_PATH)) {
            const fileContent = fs.readFileSync(SITEMAP_CONFIG_PATH, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Append the new metadata to the array
        existingData.push({location: `https://supertokens.com/blog/${urlSlug}`});

        // Write the updated array back to the file
        fs.writeFileSync(SITEMAP_CONFIG_PATH, JSON.stringify(existingData, null, 4), 'utf-8');
    }

    return [outputFilePath, SITEMAP_CONFIG_PATH];
}

// Command-line usage
const filePathArgument = process.argv[2];
const outputFilePath = OUTPUT_FILE_PATH;
if (!filePathArgument) {
    console.error('Usage: node script.js <file-path>');
    process.exit(1);
}

try {
    const fileContent = fs.readFileSync(filePathArgument + "/index.md", 'utf-8');
    const frontmatter = parseFrontmatter(fileContent);
    const urlSlug = path.basename(filePathArgument, path.extname(filePathArgument));

    const updatedFilePath = appendBlogMetadataToFile(frontmatter, urlSlug, outputFilePath);
    console.log(`Metadata appended to: ${updatedFilePath[0]}`);
    console.log(`Sitemap appended to: ${updatedFilePath[1]}`)
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}