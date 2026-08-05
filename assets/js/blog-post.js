import { db, collection, getDocs, query, where } from './firebase.js';

/**
 * Safely sets a meta tag's content in the document's <head>.
 * @param {string} selector - A CSS selector for the tag (e.g., 'meta[name="description"]').
 * @param {string} attribute - The attribute to set (e.g., 'content').
 * @param {string} value - The value to set for the attribute.
 */
function setMetaTag(selector, attribute, value) {
    if (!value) return;
    let element = document.querySelector(selector);
    if (element) {
        element.setAttribute(attribute, value);
    }
}

/**
 * Updates or creates a JSON-LD script tag in the <head>.
 * @param {string} id - The ID for the script tag.
 * @param {object} data - The JSON-LD data object.
 */
function setJsonLd(id, data) {
    let script = document.getElementById(id);
    if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Main function to load and render a single blog post.
 */
async function loadBlogPost() {
    const postContentContainer = document.getElementById('post-content-container');
    if (!postContentContainer) return;

    // 1. Get the slug from the URL path.
    const path = window.location.pathname;
    const slug = path.substring(1).replace(/\/$/, ""); // Remove leading/trailing slashes

    if (!slug || slug === 'blog-post.html') {
        window.location.replace('/blog'); // Redirect to the blog index if no slug
        return;
    }

    try {
        // 2. Query Firestore for the post with the matching slug.
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where("slug", "==", slug), where("status", "==", "published".toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // 3. Handle "Not Found" case.
            document.title = "404: Article Not Found | GetTV.online";
            postContentContainer.innerHTML = `
                <h1 class="text-4xl font-bold">404: Article Not Found</h1>
                <p>Sorry, we couldn't find the article you were looking for.</p>
                <p><a href="/blog" class="text-blue-400 hover:underline">Return to the blog</a></p>
            `;
            return;
        }

        const postDoc = querySnapshot.docs[0];
        const post = postDoc.data();
        const canonicalUrl = post.canonical || `https://gettv.online/${post.slug}`;
        const metaDescription = post.meta?.description || post.excerpt || '';

        // 4. Dynamically update the <head> for SEO.
        document.title = post.meta?.title || post.title;
        setMetaTag('meta[name="description"]', 'content', metaDescription);
        document.querySelector('link[rel="canonical"]').href = canonicalUrl;

        // Open Graph
        setMetaTag('meta[property="og:title"]', 'content', post.meta?.title || post.title);
        setMetaTag('meta[property="og:description"]', 'content', metaDescription);
        setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
        setMetaTag('meta[property="og:type"]', 'content', 'article');
        setMetaTag('meta[property="og:image"]', 'content', post.imageUrl);

        // Twitter Card
        setMetaTag('meta[name="twitter:title"]', 'content', post.meta?.title || post.title);
        setMetaTag('meta[name="twitter:description"]', 'content', metaDescription);
        setMetaTag('meta[name="twitter:image"]', 'content', post.imageUrl);

        // 5. Generate and inject JSON-LD Schema.
        if (post.schema?.article) {
            setJsonLd('article-schema', post.schema.article);
        } else {
            const publishedTimestamp = post.publishedAt || post.createdAt;
            const modifiedTimestamp = post.updatedAt || publishedTimestamp;
            const articleSchema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                "headline": post.title,
                "description": metaDescription,
                "image": post.imageUrl || "https://gettv.online/assets/images/gettvonline.webp",
                "author": { "@type": "Organization", "name": post.author || "GetTV.online Team" },
                "publisher": { "@id": "https://gettv.online/#organization" },
                "datePublished": publishedTimestamp ? new Date(publishedTimestamp.seconds * 1000).toISOString() : new Date().toISOString(),
                "dateModified": modifiedTimestamp ? new Date(modifiedTimestamp.seconds * 1000).toISOString() : new Date().toISOString()
            };
            setJsonLd('article-schema', articleSchema);
        }

        if (post.schema?.breadcrumb) {
            setJsonLd('breadcrumb-schema', post.schema.breadcrumb);
        } else {
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gettv.online/" },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://gettv.online/blog" },
                    { "@type": "ListItem", "position": 3, "name": post.title }
                ]
            };
            setJsonLd('breadcrumb-schema', breadcrumbSchema);
        }

        // 6. Render the article content into the page.
        const publishedTimestamp = post.publishedAt || post.createdAt;
        const publishedDate = publishedTimestamp ? new Date(publishedTimestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }) : 'N/A';

        postContentContainer.innerHTML = `
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="rounded-xl mb-8 w-full h-auto object-cover shadow-lg">` : ''}
            <h1 class="text-4xl md:text-5xl font-extrabold mb-4">${post.title}</h1>
            <p class="text-gray-400 mb-8">Published on ${publishedDate} by ${post.author || 'GetTV.online Team'}</p>
            <div class="prose-content">${post.content}</div>
        `;

    } catch (error) {
        console.error("Error loading blog post:", error);
        document.title = "Error | GetTV.online";
        postContentContainer.innerHTML = `<h1>Error</h1><p>Could not load the article. Please try again later.</p>`;
    }
}

// The main app.js waits for DOMContentLoaded, so we can run this directly.
loadBlogPost();