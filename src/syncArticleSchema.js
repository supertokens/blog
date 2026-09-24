/**
 * Updates the Article JSON-LD of every post in static/blog-seo/config.json with the post's
 * headline, datePublished, dateModified and author, read from each post's frontmatter. Posts with a
 * visible "## Frequently Asked Questions" section also get a FAQPage block generated from it.
 *
 * Run after changing a post's `title`, `date`, `updated` or `author` frontmatter:
 *   node src/syncArticleSchema.js
 *
 * Safe to re-run: it only rewrites the Article block and leaves every other JSON-LD block as is.
 */
const fs = require('fs');
const path = require('path');
const { applyPostMetadata, buildHeadline, buildFaqSchema } = require('./articleSchema');

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
    const frontmatter = { body: content.slice(match[0].length) };
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
let faqCount = 0;
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

    const faq = buildFaqSchema(frontmatter.body);
    if (faq) {
        // Replace any hand-written FAQPage block with one generated from the visible FAQ section.
        entry.schema = entry.schema.replace(LD_JSON_BLOCK, (block, open, body) => {
            try {
                return JSON.parse(body)["@type"] === "FAQPage" ? "" : block;
            } catch (e) {
                return block;
            }
        }).trimEnd();
        entry.schema += `\n<script type="application/ld+json">\n${JSON.stringify(faq)}</script>`;
        faqCount++;
    }
}

fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
console.log(`Updated Article schema for ${updatedCount} posts; generated FAQPage for ${faqCount}.`);
if (missing.length > 0) {
    console.log(`No content/<slug>/index.md found for: ${missing.join(', ')}`);
}
