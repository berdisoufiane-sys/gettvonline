import { auth, db, collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from '../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    let quill;
    let postId = null;

    // Auth Guard
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (mainContent) mainContent.style.visibility = 'visible';
            initializePage();
        } else {
            window.location.href = 'login.html';
        }
    });

    // Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth);
        });
    }

    function initializePage() {
        // Initialize Quill editor
        quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    ['clean']
                ]
            }
        });

        // Check for post ID in URL for editing
        const params = new URLSearchParams(window.location.search);
        postId = params.get('id');

        if (postId) {
            document.getElementById('page-title').textContent = 'Edit Post';
            loadPostData(postId);
        }

        // Handle form submission
        const postForm = document.getElementById('post-form');
        postForm.addEventListener('submit', savePost);
    }

    async function loadPostData(id) {
        try {
            const postRef = doc(db, 'posts', id);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data();
                document.getElementById('post-title').value = postData.title;
                document.getElementById('post-author').value = postData.author;
                quill.root.innerHTML = postData.content;
            } else {
                alert("Post not found.");
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error("Error loading post: ", error);
            alert("Error loading post data.");
        }
    }

    async function savePost(e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const author = document.getElementById('post-author').value;
        const content = quill.root.innerHTML;

        try {
            if (postId) {
                await updateDoc(doc(db, 'posts', postId), { title, author, content, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'posts'), { title, author, content, createdAt: serverTimestamp() });
            }
            alert('Post saved successfully!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error saving post: ", error);
            alert('Error saving post. Please try again.');
        }
    }
});