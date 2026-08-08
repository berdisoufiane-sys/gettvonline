import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import RSS from 'rss';

const SITE_URL = 'https://gettv.online';
const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public'); // Vercel will deploy from the 'public' directory

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
    await fs.writeFile(outputPath, JSON.stringify(posts, null, 2));
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
 * Generates individual static HTML pages for each blog post.
 * This is a more robust method than client-side rendering.
 * @param {Array<object>} posts - An array of post metadata objects.
 */
async function generateStaticPostPages(posts) {
    const templatePath = path.join(ROOT_DIR, 'blog-post.html');
    try {
        await fs.access(templatePath);
    } catch {
        console.warn(`! Warning: blog-post.html template not found. Skipping static page generation.`);
        return;
    }
    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    const outputBlogDir = path.join(OUTPUT_DIR, 'blog');
    await fs.mkdir(outputBlogDir, { recursive: true });

    console.log('📄 Generating static pages for each post...');

    for (const post of posts) {
        const $ = cheerio.load(templateHtml);

        // Update head with post-specific SEO metadata
        $('title').text(post.title);
        $('link[rel="canonical"]').attr('href', post.url);
        $('meta[name="description"]').attr('content', post.description);
        $('meta[property="og:title"]').attr('content', post.title);
        $('meta[property="og:description"]').attr('content', post.description);
        $('meta[property="og:url"]').attr('content', post.url);
        $('meta[property="og:image"]').attr('content', post.featuredImage);
        $('meta[name="twitter:title"]').attr('content', post.title);
        $('meta[name="twitter:description"]').attr('content', post.description);
        $('meta[name="twitter:url"]').attr('content', post.url);
        $('meta[name="twitter:image"]').attr('content', post.featuredImage);

        // Inject the article content directly into the template
        $('#post-content-container').html(post.content);

        const finalHtml = $.html();
        const outputPath = path.join(outputBlogDir, `${post.slug}.html`);
        await fs.writeFile(outputPath, finalHtml);
    }
    console.log(`✔ Successfully generated ${posts.length} static post pages.`);
}

/**
 * Main build function.
 */
async function main() {
    console.log('🚀 Starting static build process...');

    // 1. Clean and create the public output directory
    console.log('🧹 Cleaning up old /public directory...');
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 2. Copy all source files to the public directory
    console.log('📂 Copying source files to /public directory...');
    const sourceItems = await fs.readdir(ROOT_DIR);
    const itemsToCopy = sourceItems.filter(file => ![
        'node_modules', '.git', '.gitignore', 'package.json', 'package-lock.json',
        'build-blog.js', 'public', 'posts', 'api', '.vercel', 'README.md'
    ].includes(file));

    for (const item of itemsToCopy) {
        const sourcePath = path.join(ROOT_DIR, item);
        const destPath = path.join(OUTPUT_DIR, item);
        await fs.cp(sourcePath, destPath, { recursive: true });
    }
    console.log('✅ Source files copied.');

    // 3. Run the blog generation process
    console.log('✍️ Starting blog generation...');
    try {
        const files = await fs.readdir(POSTS_DIR);
        const postFiles = files.filter(file => file.endsWith('.html'));

        if (postFiles.length === 0) {
            console.log('ℹ No HTML posts found in /posts directory. Generating empty files.');
            // This is a valid state, so we generate empty files and succeed the build.
            await Promise.all([
                generateBlogIndex([]),
                generateRssFeed([]),
                generateSitemap([]),
            ]);
            console.log('✅ Blog generation completed with no posts.');
            return;
        }

        console.log(`Found ${postFiles.length} post(s). Parsing...`);

        const postPromises = postFiles.map(file => parsePost(path.join(POSTS_DIR, file)));
        let posts = (await Promise.all(postPromises)).filter(Boolean); // Filter out nulls from parsing errors

        // Sort posts by publish date, newest first
        posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        // Generate all necessary files
        await Promise.all([
            generateStaticPostPages(posts),
            generateBlogIndex(posts),
            generateRssFeed(posts),
            generateSitemap(posts),
        ]);

        console.log('✅ Build process completed successfully!');
    } catch (error) {
        if (error.code === 'ENOENT') {
            // This is a fatal error. The posts directory MUST exist for a valid build.
            console.error(`\n🔥🔥🔥 BUILD FAILED 🔥🔥🔥`);
            console.error(`Error: The '/posts' directory was not found.`);
            console.error(`Please make sure a 'posts' directory exists in your project root and that it has been committed to your Git repository.`);
            console.error(`Run 'git status' to see if the directory is untracked.\n`);
            process.exit(1); // Exit with an error code to fail the Vercel build
        } else {
            console.error('🔥 A critical error occurred during the build process:', error);
            process.exit(1); // Exit with an error code to fail the Vercel build
        }
    }
}

main();