/**
 * Updates the Article JSON-LD of every post in static/blog-seo/config.json with the post's
 * headline, datePublished, dateModified and author, read from each post's frontmatter.
 *
 * Run after changing a post's `title`, `date`, `updated` or `author` frontmatter:
 *   node src/syncArticleSchema.js
 *
 * Safe to re-run: it only rewrites the Article block and leaves every other JSON-LD block as is.
 */
const fs = require('fs');
const path = require('path');
const { applyPostMetadata, buildHeadline } = require('./articleSchema');

const CONTENT_DIR = path.join(__dirname, "../", "content");
const CONFIG_PATH = path.join(__dirname, "../", "static", "blog-seo", "config.json");
const LD_JSON_BLOCK = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;

function readFrontmatter(slug) {
    const filePath = path.join(CONTENT_DIR, slug, "index.md");
    if (!fs.existsSync(filePath)) {
        return undefined;
    }
    const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
        return undefined;
    }
    const frontmatter = {};
    for (const line of match[1].split('\n')) {
        const [key, ...valueParts] = line.split(':');
        if (!key || valueParts.length === 0) {
            continue;
        }
        frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
    return frontmatter;
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
let updatedCount = 0;
const missing = [];

for (const entry of config) {
    const slug = entry.path.replace(/^\/blog\//, '').replace(/\/$/, '');
    const frontmatter = readFrontmatter(slug);
    if (!frontmatter) {
        missing.push(entry.path);
        continue;
    }
    entry.schema = entry.schema.replace(LD_JSON_BLOCK, (block, open, body, close) => {
        let parsed;
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            console.warn(`Skipping unparseable JSON-LD block in ${entry.path}`);
            return block;
        }
        if (parsed["@type"] !== "Article" && parsed["@type"] !== "BlogPosting") {
            return block;
        }
        updatedCount++;
        if (frontmatter.title) {
            // The headline must match the post's visible title (not its description or another post's title).
            parsed.headline = buildHeadline(frontmatter.title);
        }
        return `${open}\n${JSON.stringify(applyPostMetadata(parsed, frontmatter))}${close}`;
    });
}

fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
console.log(`Updated Article schema for ${updatedCount} posts.`);
if (missing.length > 0) {
    console.log(`No content/<slug>/index.md found for: ${missing.join(', ')}`);
}
