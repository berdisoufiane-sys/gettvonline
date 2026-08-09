import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from '../../assets/js/firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');

    // Check auth state on page load
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // No user is signed in. Redirect to login page.
            console.log("No user signed in, redirecting to login.");
            window.location.href = 'login.html';
        } else {
            // User is signed in. You can optionally display user info here.
            console.log("User is signed in:", user.email);
        }
    });

    // Handle logout button click
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth).catch((error) => {
                console.error("Sign out error:", error);
                alert("Error signing out.");
            });
        });
    }
});