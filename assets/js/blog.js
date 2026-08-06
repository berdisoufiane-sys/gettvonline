document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('blog-posts-container');

    if (!container) {
        console.error('Blog posts container not found.');
        return;
    }

    const renderPosts = (posts) => {
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-400">No blog posts found. Check back soon!</p>';
            return;
        }

        const postsHtml = posts.map(post => `
            <a href="${post.url}" class="block bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300 group">
                <div class="md:flex">
                    ${post.featuredImage ? `<div class="md:w-1/3">
                        <img src="${post.featuredImage}" alt="" class="h-full w-full object-cover" loading="lazy">
                    </div>` : ''}
                    <div class="p-6 ${post.featuredImage ? 'md:w-2/3' : 'w-full'}">
                        <p class="text-sm text-blue-400 mb-2">${post.category} &bull; ${new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <h2 class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">${post.title}</h2>
                        <p class="text-gray-400 mt-2">${post.description}</p>
                        <div class="mt-4 text-sm font-semibold text-gray-300 group-hover:text-white">
                            Read More <i class="fa-solid fa-arrow-right ml-1 transform group-hover:translate-x-1 transition-transform"></i>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');

        container.innerHTML = postsHtml;
    };

    const loadPosts = async () => {
        try {
            const response = await fetch('/blog-index.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error("Failed to load blog posts:", error);
            container.innerHTML = '<p class="text-center text-red-500">Could not load blog posts. Please try again later.</p>';
        }
    };

    loadPosts();
});