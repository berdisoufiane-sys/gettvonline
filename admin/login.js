import { auth } from '../../assets/js/firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Login Failed: ${errorMessage}`);
        // Restore button
        loginButton.innerHTML = originalButtonText;
        loginButton.disabled = false;
    }
});