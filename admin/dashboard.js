import { auth } from '../../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Auth Guard: Protect the page
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to login page.
        // The check for 'login.html' prevents an infinite redirect loop.
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Logout Functionality
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await signOut(auth);
        // Redirect to login page after sign out
        window.location.href = 'login.html';
    });
}