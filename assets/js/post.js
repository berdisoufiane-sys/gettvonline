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

        // --- Social Sharing ---
        const postUrl = window.location.href;
        const postTitle = encodeURIComponent(post.title);

        const shareHtml = `
            <div class="mt-12 pt-8 border-t border-gray-700">
                <h3 class="text-lg font-semibold text-center text-gray-300 mb-4">Share this post</h3>
                <div id="social-share-buttons" class="flex justify-center items-center gap-4 text-2xl">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${postUrl}" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-500 transition" title="Share on Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}" target="_blank" rel="noopener" class="text-gray-400 hover:text-sky-500 transition" title="Share on Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-600 transition" title="Share on LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}" target="_blank" rel="noopener" class="text-gray-400 hover:text-green-500 transition" title="Share on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <button id="copy-link-btn" class="text-gray-400 hover:text-gray-200 transition" title="Copy link">
                        <i class="fa-solid fa-link"></i>
                    </button>
                </div>
            </div>
        `;


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
            ${shareHtml}
        `;

        // Add event listener for copy button
        const copyBtn = document.getElementById('copy-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(postUrl).then(() => {
                    const icon = copyBtn.querySelector('i');
                    icon.classList.remove('fa-link');
                    icon.classList.add('fa-check');
                    copyBtn.title = 'Copied!';
                    setTimeout(() => {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-link');
                        copyBtn.title = 'Copy link';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                });
            });
        }
    } catch (error) {
        console.error("Error fetching post: ", error);
        postContainer.innerHTML = '<p class="text-center text-red-500">Could not load the post. Please try again later.</p>';
    }
});