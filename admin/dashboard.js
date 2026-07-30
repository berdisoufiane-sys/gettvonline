import { auth, db, collection, getDocs, doc, deleteDoc } from '../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
            const button = e.target.closest('.delete-btn');
            if (button) {
                const docId = button.dataset.id;
                const collectionName = button.dataset.collection;

                if (confirm(`Are you sure you want to delete this ${collectionName} entry?`)) {
                    try {
                        await deleteDoc(doc(db, collectionName, docId));
                        // Remove the table row from the UI
                        button.closest('tr').remove();
                        console.log(`${collectionName} entry ${docId} deleted.`);
                    } catch (error) {
                        console.error(`Error deleting document: ${error}`);
                        alert('Failed to delete entry.');
                    }
                }
            }
        });
    }
});

async function loadAllSubmissions() {
    // Load Trial Requests
    loadAndDisplayData('trials', 'trial-requests-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</td>
            <td class="px-6 py-4 font-medium text-white">${item.name}</td>
            <td class="px-6 py-4">${item.email}</td>
            <td class="px-6 py-4">${item.device}</td>
            <td class="px-6 py-4">${item.country}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="trials">
                    <i class="fa-solid fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `);

    // Load Contact Messages
    loadAndDisplayData('contacts', 'contact-messages-body', (item) => `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
            <td class="px-6 py-4">${new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</td>
            <td class="px-6 py-4 font-medium text-white">${item.email}</td>
            <td class="px-6 py-4 max-w-sm truncate" title="${item.message}">${item.message}</td>
            <td class="px-6 py-4">
                <button class="delete-btn text-red-500 hover:text-red-400 font-medium" data-id="${item.id}" data-collection="contacts">
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
        const querySnapshot = await getDocs(collection(db, collectionName));
        if (querySnapshot.empty) {
            tableBody.innerHTML = \`<tr><td colspan="100%" class="text-center py-4 text-gray-500">No entries found.</td></tr>\`;
            return;
        }

        let rowsHtml = '';
        querySnapshot.forEach(doc => {
            rowsHtml += rowTemplate({ id: doc.id, ...doc.data() });
        });
        tableBody.innerHTML = rowsHtml;
    } catch (error) {
        console.error(\`Error loading ${collectionName}:\`, error);
        tableBody.innerHTML = \`<tr><td colspan="100%" class="text-center py-4 text-red-500">Error loading data.</td></tr>\`;
    }
}