import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
    // Select the form and inputs using the IDs we just added
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("contact-name"); // Added for name
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    const subjectInput = document.getElementById("contact-subject"); // Added for subject
    const submitBtn = document.getElementById("submit-btn");
    const messageContainer = document.getElementById("contact-message-container");

    // Helper function to display messages
    function showFormMessage(message, isSuccess) {
        if (!messageContainer) return;
        messageContainer.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'border-green-400', 'bg-red-100', 'text-red-700', 'border-red-400');
        if (isSuccess) {
            messageContainer.classList.add('bg-green-100', 'text-green-700', 'border-green-400');
        } else {
            messageContainer.classList.add('bg-red-100', 'text-red-700', 'border-red-400');
        }
        messageContainer.innerText = message;
        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000); // Message disappears after 5 seconds
    }

    // Only run this code if the contact form actually exists on the page
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Stops the page from refreshing on submit

            // Get the text the user typed
            const userName = nameInput ? nameInput.value.trim() : 'N/A';
            const userEmail = emailInput.value.trim();
            const userMessage = messageInput.value.trim();
            const userSubject = subjectInput ? subjectInput.value.trim() : 'N/A';

            // Provide visual feedback (change button text)
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-50", "cursor-not-allowed");

            try {
                await addDoc(collection(db, 'contact'), {
                    name: userName,
                    email: userEmail,
                    subject: userSubject,
                    message: userMessage,
                    timestamp: serverTimestamp()
                });

                showFormMessage("Your message has been sent successfully! Our support team will respond shortly.", true);
                contactForm.reset();
            } catch (error) {
                // If it fails, log the error to the console and warn the user
                console.error("Error adding document: ", error);
                showFormMessage("There was an error sending your message. Please try again later.", false);
            } finally {
                // Restore the button to its original state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        });
    }
});