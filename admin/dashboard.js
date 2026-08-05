import { auth, db, collection, getDocs, doc, deleteDoc, query, orderBy } from '../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
        return 'N/A';
    }
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const mainContent = document.querySelector('main');

    // Hide content until the auth check is complete to prevent a flash of the page
    if (mainContent) mainContent.style.visibility = 'hidden';

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, show the page content.
            console.log("User is signed in:", user.email);
            if (mainContent) mainContent.style.visibility = 'visible';
            // Fetch and display data once the user is authenticated
            loadAllSubmissions();
        } else {
            // No user is signed in. Redirect to the login page.
            console.log("No user signed in, redirecting to login.");
            window.location.href = 'login.html';
        }
    });

    // Handle logout button click
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth); // The onAuthStateChanged listener will automatically handle the redirect.
        });
    }

    // Event delegation for delete buttons
    if (mainContent) {
        mainContent.addEventListener('click', async (e) => {
            const deleteButton = e.target.closest('.delete-btn');
            if (deleteButton) {
                const docId = deleteButton.dataset.id;
                const collectionName = deleteButton.dataset.collection;

                if (confirm(`Are you sure you want to delete this ${collectionName} entry?`)) {
                    try {
                        await deleteDoc(doc(db, collectionName, docId));
                        // Remove the table row from the UI
                        deleteButton.closest('tr').remove();
                        console.log(`${collectionName} entry ${docId} deleted.`);
                    } catch (error) {
                        console.error(`Error deleting document: ${error}`);
                        alert('Failed to delete entry.');
                    }
                }
            }

            const copyButton = e.target.closest('.copy-link-btn');
            if (copyButton) {
                const slug = copyButton.dataset.slug;
                const url = `https://gettv.online/${slug}`;
                navigator.clipboard.writeText(url).then(() => {
                    const originalHTML = copyButton.innerHTML;
                    copyButton.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Copied!';
                    copyButton.disabled = true;
                    setTimeout(() => {
                        copyButton.innerHTML = originalHTML;
                        copyButton.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                    alert('Failed to copy link.');
                });
            }
        });
    }
});

async function loadAllSubmissions() {
    // Load Posts
    loadAndDisplayData('posts', 'posts-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Cover" class="h-10 w-16 object-cover rounded">` : 'No Image'}
            </td>
            <td class="px-6 py-4">${formatDate(item.createdAt)}</td>
            <td class="px-6 py-4 font-medium text-white">${item.title}</td>
            <td class="px-6 py-4">${item.author || 'N/A'}</td>
            <td class="px-6 py-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${item.status === 'published' ? 'Published' : 'Draft'}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <a href="edit-post.html?id=${item.id}" class="text-blue-400 hover:text-blue-300 font-medium mr-4"><i class="fa-solid fa-pencil-alt mr-1"></i>Edit</a>
                ${item.slug ? `<button class="copy-link-btn text-purple-400 hover:text-purple-300 font-medium mr-4" data-slug="${item.slug}" title="Copy public URL"><i class="fa-solid fa-link mr-1"></i>Copy Link</button>` : ''}
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="posts"><i class="fa-solid fa-trash mr-1"></i>Delete</button>
            </td>
        </tr>
    `);

    // Load Trial Requests
    loadAndDisplayData('trial', 'trial-requests-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${formatDate(item.timestamp)}</td>
            <td class="px-6 py-4 font-medium text-white">${item.name}</td>
            <td class="px-6 py-4">${item.email}</td>
            <td class="px-6 py-4">${item.device}</td>
            <td class="px-6 py-4">${item.country}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="trial">
                    <i class="fa-solid fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `);

    // Load Contact Messages
    loadAndDisplayData('contact', 'contact-messages-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${formatDate(item.timestamp)}</td>
            <td class="px-6 py-4 font-medium text-white">${item.email}</td>
            <td class="px-6 py-4 max-w-sm truncate" title="${item.message}">${item.message}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="contact">
                    <i class="fa-solid fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `);

    // Load Newsletter Subscriptions
    loadAndDisplayData('newsletter', 'newsletter-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${formatDate(item.timestamp)}</td>
            <td class="px-6 py-4 font-medium text-white">${item.email}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="newsletter">
                    <i class="fa-solid fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `);

    // Load Channel List Requests
    loadAndDisplayData('channelList', 'channel-list-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${formatDate(item.timestamp)}</td>
            <td class="px-6 py-4 font-medium text-white">${item.email}</td>
            <td class="px-6 py-4">${item.preferredRegion || 'N/A'}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="channelList">
                    <i class="fa-solid fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `);
}

async function loadAndDisplayData(collectionName, tableBodyId, rowTemplate) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;

    try {
        // Order posts by creation date, newest first. Other collections are not ordered.
        const dataQuery = collectionName === 'posts' ? query(collection(db, collectionName), orderBy("createdAt", "desc")) : query(collection(db, collectionName));
        const querySnapshot = await getDocs(dataQuery);
        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="100%" class="text-center py-4 text-gray-500">No entries found.</td></tr>`;
            return;
        }

        let rowsHtml = '';
        querySnapshot.forEach(doc => {
            rowsHtml += rowTemplate({ id: doc.id, ...doc.data() });
        });
        tableBody.innerHTML = rowsHtml;
    } catch (error) {
        console.error(`Error loading ${collectionName}:`, error);
        tableBody.innerHTML = `<tr><td colspan="100%" class="text-center py-4 text-red-500">Error loading data.</td></tr>`;
    }
}