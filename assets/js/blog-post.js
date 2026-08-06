document.addEventListener('DOMContentLoaded', async () => {
    const contentContainer = document.getElementById('post-content-container');
    const slug = window.location.pathname.split('/').pop();

    if (!contentContainer) return;
    if (!slug) {
        contentContainer.innerHTML = '<h1>Error</h1><p>Post not found.</p>';
        return;
    }

    try {
        // Fetch the metadata from our generated index
        const metaResponse = await fetch('/blog-index.json');
        if (!metaResponse.ok) throw new Error('Could not load blog index.');
        const posts = await metaResponse.json();
        const postMeta = posts.find(p => p.slug === slug);

        if (!postMeta) {
            throw new Error('Post metadata not found in index.');
        }

        // Update the page's head with the correct SEO info
        updateHead(postMeta);

        // Inject the content and metadata into the page
        // The content is now directly available in the postMeta object
        renderPost(postMeta, postMeta.content);

    } catch (error) {
        console.error('Error loading post:', error);
        contentContainer.innerHTML = `
            <h1 class="text-4xl font-bold text-red-500">404 - Post Not Found</h1>
            <p class="mt-4 text-gray-300">Sorry, we couldn't find the article you're looking for. It might have been moved or deleted.</p>
            <a href="/blog" class="mt-6 inline-block text-blue-400 hover:text-blue-300">&larr; Back to Blog</a>
        `;
    }
});

function updateHead(meta) {
    document.title = meta.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.url);
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    
    // Open Graph
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', meta.url);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', meta.featuredImage);

    // Twitter
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', meta.url);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', meta.featuredImage);
}

function renderPost(meta, content) {
    const container = document.getElementById('post-content-container');
    const publishDate = new Date(meta.publishDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    container.innerHTML = `
        <div class="mb-8 text-center">
            <p class="text-blue-400 font-semibold">${meta.category}</p>
            <h1 class="text-4xl md:text-5xl font-extrabold mt-2 mb-4 leading-tight">${meta.title}</h1>
            <div class="text-gray-400 text-sm">
                <span>By ${meta.author}</span> &bull;
                <span>${publishDate}</span> &bull;
                <span>${meta.readingTime} min read</span>
            </div>
        </div>
        ${meta.featuredImage ? `<img src="${meta.featuredImage}" alt="${meta.title}" class="rounded-lg mb-8 w-full object-cover max-h-96">` : ''}
        ${content}
    `;
}