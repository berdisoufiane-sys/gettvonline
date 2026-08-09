import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from '../../assets/js/firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const loginButton = document.getElementById('login-button');
        const originalButtonText = loginButton.innerHTML;

        loginButton.disabled = true;
        loginButton.innerHTML = 'Signing In...';

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully, redirect to dashboard
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error("Login failed:", error.code, error.message);
                alert(`Login Failed: ${error.message}`);

                loginButton.disabled = false;
                loginButton.innerHTML = originalButtonText;
            });
    });
});