document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

async function loadPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) {
        console.error('Blog posts container not found!');
        return;
    }

    // Show a loading state
    container.innerHTML = '<p class="text-center text-gray-400">Loading posts...</p>';

    try {
        const response = await fetch('/blog-index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-400">No posts found. Check back soon!</p>';
            return;
        }

        // Clear loading state
        container.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300';
            
            const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const postUrl = `/blog/${post.slug}`;

            postElement.innerHTML = `
                ${post.featuredImage ? `<a href="${postUrl}"><img src="${post.featuredImage}" alt="${post.title}" class="rounded-lg mb-4 w-full h-48 object-cover"></a>` : ''}
                <div class="text-sm text-blue-400 font-semibold mb-2">${post.category}</div>
                <h2 class="text-2xl font-bold mb-3">
                    <a href="${postUrl}" class="text-white hover:text-blue-400 transition-colors duration-200">${post.title}</a>
                </h2>
                <p class="text-gray-400 text-sm mb-4">${post.description}</p>
                <div class="flex items-center text-xs text-gray-500 flex-wrap gap-x-2">
                    <span>By ${post.author}</span>
                    <span class="mx-1">&bull;</span>
                    <span>${publishDate}</span>
                    <span class="mx-1">&bull;</span>
                    <span>${post.readingTime} min read</span>
                </div>
                <a href="${postUrl}" class="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold">Read More <i class="fa-solid fa-arrow-right ml-1"></i></a>
            `;
            container.appendChild(postElement);
        });

    } catch (error) {
        console.error('Failed to load blog posts:', error);
        container.innerHTML = `<p class="text-center text-red-500">Failed to load posts. Please try again later.</p>`;
    }
}