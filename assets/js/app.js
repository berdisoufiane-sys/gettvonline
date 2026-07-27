function setupNewsletterForm() {
    const newsletterForm = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const submitButton = document.getElementById("newsletter-submit-btn");

    if (!newsletterForm || !emailInput || !submitButton || newsletterForm.dataset.ready) return;
    newsletterForm.dataset.ready = "true";

    newsletterForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const originalButtonText = submitButton.innerText;
        submitButton.innerText = "Joining...";
        submitButton.disabled = true;
        submitButton.classList.add("opacity-50", "cursor-not-allowed");

        try {
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formType: 'newsletter',
                    email: emailInput.value.trim(),
                })
            });

            if (!response.ok) {
                throw new Error('Server responded with an error.');
            }

            newsletterForm.reset();

            alert("Thanks for subscribing to the GetTV newsletter!");
        } catch (error) {
            console.error("Error subscribing to newsletter:", error);
            alert("We could not complete your subscription. Please try again shortly.");
        } finally {
            submitButton.innerText = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Load Header (Notice the slash: components / header.html)
    fetch('assets/components/header.html')
        .then(response => {
            if (!response.ok) throw new Error("Header file not found!");
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer (Notice the slash: components / footer.html)
    fetch('assets/components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error("Footer file not found!");
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            setupNewsletterForm();
        })
        .catch(error => console.error('Error loading footer:', error));

});
