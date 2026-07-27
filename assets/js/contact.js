document.addEventListener("DOMContentLoaded", () => {
    // Select the form and inputs using the IDs we just added
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("contact-name"); // Added for name
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    const subjectInput = document.getElementById("contact-subject"); // Added for subject
    const submitBtn = document.getElementById("submit-btn");

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
                // NEW: Send data to our serverless function backend
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formType: 'contact', // To identify the form on the backend
                        name: userName,
                        email: userEmail,
                        subject: userSubject,
                        message: userMessage,
                    })
                });

                if (!response.ok) {
                    // If the server responds with an error, throw it to the catch block
                    throw new Error('Server responded with an error.');
                }

                // Success! Show an alert and clear the form
                alert("Your message has been sent successfully! Our support team will respond shortly.");
                contactForm.reset();

            } catch (error) {
                // If it fails, log the error to the console and warn the user
                console.error("Error adding document: ", error);
                alert("There was an error sending your message. Please try again later.");
            } finally {
                // Restore the button to its original state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        });
    }
});