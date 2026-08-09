import { auth } from '../assets/js/firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const loginButton = document.getElementById('login-button');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Disable button and show loading state
        const originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = 'Signing In...';
        loginButton.disabled = true;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(`Login Failed: ${error.message}`);
            // Restore button
            loginButton.innerHTML = originalButtonText;
            loginButton.disabled = false;
        }
    });
});