import { db, collection, getDocs, query, where, orderBy } from './firebase.js';

async function loadBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    container.innerHTML = '<p class="text-center text-gray-400">Loading articles...</p>'; // Loading state

    try {
        const postsRef = collection(db, 'blogPosts');
        const q = query(postsRef, where("status", "==", "published"), orderBy("publishedDate", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-400">No articles have been published yet. Check back soon!</p>';
            return;
        }

        let postsHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postUrl = `/${post.slug}`;
            const publishedDate = new Date(post.publishedDate.seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const snippet = post.metaDescription ? `${post.metaDescription.substring(0, 150)}...` : '';

            postsHTML += `
                <article class="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500 transition-all duration-300 shadow-lg">
                    ${post.featuredImage ? `
                    <a href="${postUrl}" class="block md:w-1/3 flex-shrink-0">
                        <img src="${post.featuredImage}" alt="${post.title}" class="w-full h-48 md:h-full object-cover">
                    </a>` : ''}
                    <div class="p-6 flex flex-col justify-between flex-1">
                        <div>
                            <p class="text-sm text-gray-400 mb-2">${publishedDate}</p>
                            <h2 class="text-2xl font-bold mb-3">
                                <a href="${postUrl}" class="hover:text-blue-400 transition">${post.title}</a>
                            </h2>
                            <p class="text-gray-400 text-sm leading-relaxed mb-4">${snippet}</p>
                        </div>
                        <a href="${postUrl}" class="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold mt-4 self-start">
                            Read More <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </article>
            `;
        });

        container.innerHTML = postsHTML;

    } catch (error) {
        console.error("Error loading blog posts:", error);
        container.innerHTML = '<p class="text-center text-red-400">Could not load articles. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);