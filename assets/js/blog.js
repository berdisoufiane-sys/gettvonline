import { db, collection, getDocs, query, orderBy } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('blog-posts-container');
    if (!postsContainer) return;

    // Show a loading state
    postsContainer.innerHTML = '<p class="text-center text-gray-400">Loading posts...</p>';

    try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);

        if (querySnapshot.empty) {
            postsContainer.innerHTML = '<p class="text-center text-gray-400">No blog posts found yet. Check back soon!</p>';
            return;
        }

        let postsHtml = '';
        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;

            const postDate = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }) : 'Date not available';

            // Create a snippet from the content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const snippet = tempDiv.textContent.substring(0, 200) + '...';

            postsHtml += `
                <article class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="w-full h-64 object-cover rounded-lg mb-4">` : ''}
                    <h2 class="text-2xl font-bold mb-2 hover:text-blue-400 cursor-pointer">${post.title}</h2>
                    <p class="text-sm text-gray-500 mb-4">Published on ${postDate} by ${post.author || 'Anonymous'}</p>
                    <p class="text-gray-300 mb-4">${snippet}</p>
                    <a href="post.html?id=${postId}" class="text-blue-500 font-bold">Read More →</a>
                </article>
            `;
        });

        postsContainer.innerHTML = postsHtml;
    } catch (error) {
        console.error("Error fetching blog posts: ", error);
        postsContainer.innerHTML = '<p class="text-center text-red-500">Could not load blog posts. Please try again later.</p>';
    }
});