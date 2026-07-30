import { auth, db, storage, collection, doc, getDoc, addDoc, updateDoc, serverTimestamp, storageRef, uploadBytes, getDownloadURL } from '../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    let quill;
    let postId = null;
    let postImageUrl = null; // To store the existing image URL
    let removeImage = false; // Flag to track image removal

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

        // Handle image preview
        const imageInput = document.getElementById('post-image');
        const imagePreview = document.getElementById('image-preview');
        const removeImageBtn = document.getElementById('remove-image-btn');
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    imagePreview.classList.remove('hidden');
                    removeImageBtn.classList.remove('hidden');
                    removeImage = false;
                };
                reader.readAsDataURL(file);
            }
        });

        removeImageBtn.addEventListener('click', () => {
            removeImage = true;
            postImageUrl = null;
            imageInput.value = ''; // Clear the file input
            imagePreview.classList.add('hidden');
            removeImageBtn.classList.add('hidden');
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
                document.getElementById('post-status').value = postData.status || 'draft';

                // Load existing image
                if (postData.imageUrl) {
                    postImageUrl = postData.imageUrl;
                    const imagePreview = document.getElementById('image-preview');
                    const removeImageBtn = document.getElementById('remove-image-btn');
                    imagePreview.src = postImageUrl;
                    imagePreview.classList.remove('hidden');
                    removeImageBtn.classList.remove('hidden');
                }
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
        const status = document.getElementById('post-status').value;
        const imageFile = document.getElementById('post-image').files[0];

        const saveBtn = document.getElementById('save-post-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
            let imageUrl = postImageUrl; // Keep existing image URL by default

            // If a new image is selected, upload it
            if (imageFile) {
                const imageRef = storageRef(storage, `posts/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const postData = {
                title,
                author,
                content,
                imageUrl // This will be the new URL, the existing one, or null
            };

            if (postId) {
                postData.updatedAt = serverTimestamp();
                await updateDoc(doc(db, 'posts', postId), postData);
            } else {
                postData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'posts'), postData);
            }
            alert('Post saved successfully!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error saving post: ", error);
            alert('Error saving post. Please try again.');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Post';
        }
    }
});