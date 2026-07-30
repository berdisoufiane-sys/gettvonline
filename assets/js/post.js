import { db, doc, getDoc } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('post-content-container');
    if (!postContainer) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postContainer.innerHTML = '<p class="text-center text-red-500">Post ID is missing. Cannot load post.</p>';
        return;
    }

    try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists() || postSnap.data().status !== 'published') {
            postContainer.innerHTML = '<p class="text-center text-red-500">This post could not be found or is not available.</p>';
            return;
        }

        const post = postSnap.data();

        // --- SEO and Metadata ---
        document.title = `${post.title} | GetTV.online Blog`;
        // Create or update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        // Create a snippet for the description
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const snippet = tempDiv.textContent.substring(0, 160).trim();
        metaDesc.content = snippet;

        // --- Render Post Content ---
        const postDate = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }) : 'Date not available';

        postContainer.innerHTML = `
            <article class="prose prose-invert lg:prose-xl mx-auto">
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="w-full rounded-lg mb-8">` : ''}
                <div class="text-center mb-8">
                    <h1 class="text-4xl md:text-5xl font-bold">${post.title}</h1>
                    <p class="text-gray-400 mt-2">Published on ${postDate} by ${post.author || 'Anonymous'}</p>
                </div>
                <div class="post-body">
                    ${post.content}
                </div>
            </article>
        `;
    } catch (error) {
        console.error("Error fetching post: ", error);
        postContainer.innerHTML = '<p class="text-center text-red-500">Could not load the post. Please try again later.</p>';
    }
});