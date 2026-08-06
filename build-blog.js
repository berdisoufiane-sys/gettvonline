import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import RSS from 'rss';

const SITE_URL = 'https://gettv.online';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUTPUT_DIR = process.cwd(); // Vercel builds from the root

/**
 * Extracts metadata from a single blog post HTML file.
 * @param {string} filePath - The full path to the HTML file.
 * @returns {Promise<object|null>} A promise that resolves to the post's metadata object.
 */
async function parsePost(filePath) {
    try {
        const html = await fs.readFile(filePath, 'utf-8');
        const $ = cheerio.load(html);

        // Extracting metadata from JSON-LD is most reliable
        const jsonLdScript = $('script[type="application/ld+json"]').html();
        const jsonLd = jsonLdScript ? JSON.parse(jsonLdScript) : {};
        const articleSchema = Array.isArray(jsonLd['@graph'])
            ? jsonLd['@graph'].find(item => item['@type'] === 'Article')
            : (jsonLd['@type'] === 'Article' ? jsonLd : {});

        if (!articleSchema || Object.keys(articleSchema).length === 0) {
            console.warn(`! Warning: No Article schema found in ${path.basename(filePath)}. Skipping.`);
            return null;
        }

        const slug = path.basename(filePath, '.html');
        const articleBody = $('article').html();
        const articleText = $('article').text();
        const wordCount = articleText.split(/\s+/).filter(Boolean).length;

        return {
            slug: slug,
            url: `${SITE_URL}/blog/${slug}`,
            title: articleSchema.headline || $('title').text(),
            description: articleSchema.description || $('meta[name="description"]').attr('content'),
            author: articleSchema.author?.name || 'GetTV.online Team',
            publishDate: articleSchema.datePublished,
            category: articleSchema.articleSection || 'General',
            featuredImage: articleSchema.image?.url || $('meta[property="og:image"]').attr('content'),
            readingTime: Math.ceil(wordCount / 200), // Average reading time
            content: articleBody, // For RSS feed
        };
    } catch (error) {
        console.error(`x Error parsing post ${filePath}:`, error);
        return null;
    }
}

/**
 * Generates a blog-index.json file from all posts.
 * @param {Array<object>} posts - An array of post metadata objects.
 */
async function generateBlogIndex(posts) {
    const outputPath = path.join(OUTPUT_DIR, 'blog-index.json');
    // We don't need the full content in the index
    const indexPosts = posts.map(({ content, ...rest }) => rest);
    await fs.writeFile(outputPath, JSON.stringify(indexPosts, null, 2));
    console.log(`✔ Successfully generated blog-index.json with ${posts.length} posts.`);
}

/**
 * Generates an rss.xml file for the blog.
 * @param {Array<object>} posts - An array of post metadata objects.
 */
async function generateRssFeed(posts) {
    const feed = new RSS({
        title: 'GetTV.online Tech Blog',
        description: 'Read the latest IPTV articles, tips, and guides from the GetTV.online tech blog to make the most of your streaming setup.',
        feed_url: `${SITE_URL}/rss.xml`,
        site_url: SITE_URL,
        image_url: `${SITE_URL}/assets/images/gettvonline.webp`,
        language: 'en',
        pubDate: new Date(),
        copyright: `© ${new Date().getFullYear()} GetTV.online`,
    });

    for (const post of posts) {
        feed.item({
            title: post.title,
            description: post.content, // Use full HTML content for RSS readers
            url: post.url,
            guid: post.slug,
            date: post.publishDate,
            author: post.author,
        });
    }

    const outputPath = path.join(OUTPUT_DIR, 'rss.xml');
    await fs.writeFile(outputPath, feed.xml({ indent: true }));
    console.log('✔ Successfully generated rss.xml.');
}

/**
 * Generates a sitemap.xml file including static pages and all blog posts.
 * @param {Array<object>} posts - An array of post metadata objects.
 */
async function generateSitemap(posts) {
    const staticPages = [
        '/',
        '/pricing',
        '/channels',
        '/tutorial',
        '/contact',
        '/trial',
        '/blog',
        '/about',
        '/privacy',
        '/refund-policy',
        '/terms-of-service',
    ];

    const today = new Date().toISOString().split('T')[0];

    const sitemapEntries = staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page === '/' ? '1.00' : '0.80'}</priority>
  </url>`).join('');

    const postEntries = posts.map(post => `
  <url>
    <loc>${post.url}</loc>
    <lastmod>${new Date(post.publishDate).toISOString().split('T')[0]}</lastmod>
    <priority>0.90</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
${postEntries}
</urlset>`;

    const outputPath = path.join(OUTPUT_DIR, 'sitemap.xml');
    await fs.writeFile(outputPath, sitemap);
    console.log('✔ Successfully generated sitemap.xml.');
}

/**
 * Main build function.
 */
async function main() {
    console.log('🚀 Starting blog build process...');

    try {
        const files = await fs.readdir(POSTS_DIR);
        const postFiles = files.filter(file => file.endsWith('.html'));

        if (postFiles.length === 0) {
            console.log('ℹ No posts found in /posts directory. Skipping blog generation.');
            // Still generate empty/default files to avoid 404s
            await generateBlogIndex([]);
            await generateRssFeed([]);
            await generateSitemap([]);
            console.log('✅ Build process completed.');
            return;
        }

        const postPromises = postFiles.map(file => parsePost(path.join(POSTS_DIR, file)));
        let posts = (await Promise.all(postPromises)).filter(Boolean); // Filter out nulls from parsing errors

        // Sort posts by publish date, newest first
        posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        // Generate all necessary files
        await Promise.all([
            generateBlogIndex(posts),
            generateRssFeed(posts),
            generateSitemap(posts),
        ]);

        console.log('✅ Blog build process completed successfully!');
    } catch (error) {
        if (error.code === 'ENOENT') {
             console.log('ℹ /posts directory not found. Skipping blog generation.');
             await generateBlogIndex([]);
             await generateRssFeed([]);
             await generateSitemap([]);
             console.log('✅ Build process completed.');
        } else {
            console.error('🔥 A critical error occurred during the build process:', error);
            process.exit(1); // Exit with an error code to fail the Vercel build
        }
    }
}

main();