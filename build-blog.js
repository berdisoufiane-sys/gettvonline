import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import RSS from 'rss';

const SITE_URL = 'https://gettv.online';
const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public'); // Vercel deploys from the 'public' directory

const DEFAULT_OG_IMAGE = '/assets/images/gettvonline.webp';

// Every existing top-level route. A post slug matching one of these would silently
// overwrite a real, already-indexed page, so it's treated as a hard build failure.
const RESERVED_SLUGS = new Set([
    'about', 'pricing', 'channels', 'contact', 'trial', 'tutorial', 'privacy',
    'refund-policy', 'terms-of-service', 'blog', 'blog-listing', 'blog-post',
    '404', 'admin', 'api', 'index', 'robots', 'sitemap', 'rss',
]);

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function resolveImageUrl(image) {
    const src = image || DEFAULT_OG_IMAGE;
    return src.startsWith('http') ? src : `${SITE_URL}${src}`;
}

/**
 * Parses one /posts/{slug}.html source file: a JSON frontmatter block
 * (#post-frontmatter) plus a raw HTML body (<template id="post-body">).
 * Fails the whole build loudly on missing required fields or a slug that
 * collides with an existing top-level page, rather than skipping silently
 * or overwriting a real page — this feeds an unattended, multiple-times-a-day
 * automation pipeline, so a bad file needs to be loud, not quietly wrong.
 */
async function parsePost(filePath) {
    const fileName = path.basename(filePath);
    const slug = path.basename(filePath, '.html');
    const html = await fs.readFile(filePath, 'utf-8');
    const $ = cheerio.load(html);

    const frontmatterRaw = $('#post-frontmatter').html();
    if (!frontmatterRaw) {
        throw new Error(`${fileName}: missing <script id="post-frontmatter"> block. See posts/_TEMPLATE.html.`);
    }

    let frontmatter;
    try {
        frontmatter = JSON.parse(frontmatterRaw);
    } catch (error) {
        throw new Error(`${fileName}: frontmatter is not valid JSON (${error.message}).`);
    }

    const missing = ['title', 'description', 'publishDate'].filter((field) => !frontmatter[field]);
    if (missing.length > 0) {
        throw new Error(`${fileName}: missing required frontmatter field(s): ${missing.join(', ')}.`);
    }

    if (Number.isNaN(new Date(frontmatter.publishDate).getTime())) {
        throw new Error(`${fileName}: publishDate "${frontmatter.publishDate}" is not a valid date (expected YYYY-MM-DD).`);
    }

    if (RESERVED_SLUGS.has(slug)) {
        throw new Error(`${fileName}: slug "${slug}" collides with an existing top-level page. Rename the file.`);
    }

    const bodyHtml = $('#post-body').html();
    if (!bodyHtml || !bodyHtml.trim()) {
        throw new Error(`${fileName}: <template id="post-body"> is empty.`);
    }

    const bodyText = $('#post-body').text();
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

    return {
        slug,
        url: `/${slug}`,
        title: frontmatter.title,
        description: frontmatter.description,
        author: frontmatter.author || 'GetTV.online Team',
        publishDate: frontmatter.publishDate,
        category: frontmatter.category || 'General',
        featuredImage: frontmatter.featuredImage || DEFAULT_OG_IMAGE,
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        content: bodyHtml,
    };
}

async function generateBlogIndex(posts) {
    const outputPath = path.join(OUTPUT_DIR, 'blog-index.json');
    await fs.writeFile(outputPath, JSON.stringify(posts, null, 2));
    console.log(`✔ Successfully generated blog-index.json with ${posts.length} post(s).`);
}

async function generateRssFeed(posts) {
    const feed = new RSS({
        title: 'GetTV.online Tech Blog',
        description: 'Read the latest IPTV articles, tips, and guides from the GetTV.online tech blog to make the most of your streaming setup.',
        feed_url: `${SITE_URL}/rss.xml`,
        site_url: SITE_URL,
        image_url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        language: 'en',
        pubDate: new Date(),
        copyright: `© ${new Date().getFullYear()} GetTV.online`,
    });

    for (const post of posts) {
        feed.item({
            title: post.title,
            description: post.content,
            url: `${SITE_URL}${post.url}`,
            guid: post.slug,
            date: post.publishDate,
            author: post.author,
        });
    }

    const outputPath = path.join(OUTPUT_DIR, 'rss.xml');
    await fs.writeFile(outputPath, feed.xml({ indent: true }));
    console.log('✔ Successfully generated rss.xml.');
}

async function generateSitemap(posts) {
    const staticPages = [
        '/', '/pricing', '/channels', '/tutorial', '/contact', '/trial',
        '/blog', '/about', '/privacy', '/refund-policy', '/terms-of-service',
    ];

    const today = new Date().toISOString().split('T')[0];

    const sitemapEntries = staticPages.map((page) => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page === '/' ? '1.00' : '0.80'}</priority>
  </url>`).join('');

    const postEntries = posts.map((post) => `
  <url>
    <loc>${SITE_URL}${post.url}</loc>
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
 * Generates one static page per post, at the site ROOT (public/{slug}.html),
 * not under /blog/ — matches every other page on the site, and Vercel's
 * cleanUrls turns it into /{slug} automatically with no routing config needed.
 */
async function generateStaticPostPages(posts) {
    const templatePath = path.join(ROOT_DIR, 'blog-post.html');
    const templateHtml = await fs.readFile(templatePath, 'utf-8');

    for (const post of posts) {
        const $ = cheerio.load(templateHtml);
        const canonicalUrl = `${SITE_URL}${post.url}`;
        const imageUrl = resolveImageUrl(post.featuredImage);

        $('title').text(`${post.title} | GetTV.online`);
        $('meta[name="description"]').attr('content', post.description);
        $('link[rel="canonical"]').attr('href', canonicalUrl);
        $('meta[property="og:url"]').attr('content', canonicalUrl);
        $('meta[property="og:title"]').attr('content', post.title);
        $('meta[property="og:description"]').attr('content', post.description);
        $('meta[property="og:image"]').attr('content', imageUrl);
        $('meta[name="twitter:url"]').attr('content', canonicalUrl);
        $('meta[name="twitter:title"]').attr('content', post.title);
        $('meta[name="twitter:description"]').attr('content', post.description);
        $('meta[name="twitter:image"]').attr('content', imageUrl);

        const articleSchema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            image: imageUrl,
            author: { '@type': 'Organization', name: post.author },
            publisher: {
                '@type': 'Organization',
                name: 'GetTV.online',
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/logogettv.svg` },
            },
            datePublished: post.publishDate,
            dateModified: post.publishDate,
            articleSection: post.category,
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        };
        $('head').append(`<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`);

        const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
        $('#post-header').html(`
            <p class="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">${escapeHtml(post.category)}</p>
            <h1 class="text-3xl md:text-5xl font-extrabold mb-4">${escapeHtml(post.title)}</h1>
            <div class="flex items-center text-sm text-gray-500 flex-wrap gap-x-2">
                <span>By ${escapeHtml(post.author)}</span>
                <span class="mx-1">&bull;</span>
                <span>${publishDate}</span>
                <span class="mx-1">&bull;</span>
                <span>${post.readingTime} min read</span>
            </div>
        `);

        $('#post-content-container').html(post.content);

        await fs.writeFile(path.join(OUTPUT_DIR, `${post.slug}.html`), $.html());
    }
    console.log(`✔ Successfully generated ${posts.length} static post page(s) at site root.`);
}

/**
 * Renders the /blog listing at build time (server-rendered, not fetched by
 * client JS) by replacing the <!-- BLOG_POSTS --> marker in blog-listing.html
 * with post cards built from the same post data used everywhere else. Adding
 * a post file is the only step needed to make it appear here.
 */
async function generateBlogListing(posts) {
    const templatePath = path.join(ROOT_DIR, 'blog-listing.html');
    const templateHtml = await fs.readFile(templatePath, 'utf-8');

    const cardsHtml = posts.length === 0
        ? `<p class="text-center text-gray-400 col-span-full">No posts yet. Check back soon!</p>`
        : posts.map((post) => {
            const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
            return `
            <article class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300 flex flex-col">
                <a href="${post.url}"><img src="${escapeHtml(post.featuredImage)}" alt="${escapeHtml(post.title)}" class="rounded-lg mb-4 w-full h-48 object-cover" loading="lazy" decoding="async"></a>
                <div class="text-sm text-blue-400 font-semibold mb-2">${escapeHtml(post.category)}</div>
                <h2 class="text-xl font-bold mb-3">
                    <a href="${post.url}" class="text-white hover:text-blue-400 transition-colors duration-200">${escapeHtml(post.title)}</a>
                </h2>
                <p class="text-gray-400 text-sm mb-4 flex-grow">${escapeHtml(post.description)}</p>
                <div class="flex items-center text-xs text-gray-500 flex-wrap gap-x-2 mb-4">
                    <span>By ${escapeHtml(post.author)}</span>
                    <span class="mx-1">&bull;</span>
                    <span>${publishDate}</span>
                    <span class="mx-1">&bull;</span>
                    <span>${post.readingTime} min read</span>
                </div>
                <a href="${post.url}" class="inline-block text-blue-400 hover:text-blue-300 font-semibold">Read More <i class="fa-solid fa-arrow-right ml-1" aria-hidden="true"></i></a>
            </article>`;
        }).join('');

    const finalHtml = templateHtml.replace('<!-- BLOG_POSTS -->', cardsHtml);
    await fs.writeFile(path.join(OUTPUT_DIR, 'blog-listing.html'), finalHtml);
    console.log('✔ Successfully rendered the /blog listing.');
}

/**
 * Injects the shared header/footer partials directly into every static HTML
 * page in the output directory, replacing the placeholder divs. This makes
 * navigation/footer links (and their internal linking) visible to crawlers
 * that don't execute JS, and avoids a render-blocking fetch() round trip.
 */
async function injectSharedPartials() {
    const [headerHtml, footerHtml] = await Promise.all([
        fs.readFile(path.join(ROOT_DIR, 'assets', 'components', 'header.html'), 'utf-8'),
        fs.readFile(path.join(ROOT_DIR, 'assets', 'components', 'footer.html'), 'utf-8'),
    ]);

    let injectedCount = 0;

    async function walk(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                const html = await fs.readFile(fullPath, 'utf-8');
                if (!html.includes('id="header-placeholder"') && !html.includes('id="footer-placeholder"')) {
                    continue;
                }
                const updated = html
                    .replace('<div id="header-placeholder"></div>', headerHtml.trim())
                    .replace('<div id="footer-placeholder"></div>', footerHtml.trim());
                await fs.writeFile(fullPath, updated);
                injectedCount++;
            }
        }
    }

    await walk(OUTPUT_DIR);
    console.log(`✔ Injected shared header/footer into ${injectedCount} static page(s).`);
}

async function main() {
    console.log('🚀 Starting static build process...');

    console.log('🧹 Cleaning up old /public directory...');
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log('📂 Copying source files to /public directory...');
    const sourceItems = await fs.readdir(ROOT_DIR);
    const itemsToCopy = sourceItems.filter((file) => ![
        'node_modules', '.git', '.gitignore', 'package.json', 'package-lock.json',
        'build-blog.js', 'public', 'posts', 'api', '.vercel', 'README.md',
        // Config/tooling that must never be served as static files on the live site.
        '.env', '.env.local', '.env.production', '.env.development',
        'firebase.json', 'firestore.rules', '.firebase', '.vscode', 'scripts', 'vercel.json',
        // Post/listing templates: consumed directly by this script, not copied verbatim.
        'blog-post.html',
    ].includes(file));

    for (const item of itemsToCopy) {
        await fs.cp(path.join(ROOT_DIR, item), path.join(OUTPUT_DIR, item), { recursive: true });
    }
    console.log('✅ Source files copied.');

    console.log('✍️ Starting blog generation...');
    let postFiles = [];
    try {
        const files = await fs.readdir(POSTS_DIR);
        postFiles = files.filter((file) => file.endsWith('.html') && !file.startsWith('_'));
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        console.log('ℹ No /posts directory found. Continuing with an empty blog.');
    }

    let posts = [];
    if (postFiles.length > 0) {
        console.log(`Found ${postFiles.length} post(s). Parsing...`);
        try {
            posts = await Promise.all(postFiles.map((file) => parsePost(path.join(POSTS_DIR, file))));
        } catch (error) {
            console.error(`\n🔥🔥🔥 BUILD FAILED 🔥🔥🔥`);
            console.error(error.message);
            console.error(`\nSee posts/_TEMPLATE.html for the expected post file structure.\n`);
            process.exit(1);
        }
        posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    } else {
        console.log('ℹ No posts found. Generating an empty blog.');
    }

    await generateStaticPostPages(posts);
    await generateBlogListing(posts);
    await Promise.all([
        generateBlogIndex(posts),
        generateRssFeed(posts),
        generateSitemap(posts),
    ]);

    await injectSharedPartials();

    console.log('✅ Build process completed successfully!');
}

main().catch((error) => {
    console.error('🔥 A critical error occurred during the build process:', error);
    process.exit(1);
});
