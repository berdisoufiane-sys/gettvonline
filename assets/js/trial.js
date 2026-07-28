document.addEventListener("DOMContentLoaded", () => {
  const trialForm = document.getElementById("trial-form");
  const submitButton = document.getElementById("trial-submit-btn");

  if (!trialForm || !submitButton) return;

  trialForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Sending request...';
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Get form values
    const name = document.getElementById("trial-name").value.trim();
    const email = document.getElementById("trial-email").value.trim();
    const country = document.getElementById("trial-country")?.value.trim(); // Required
    const plan = document.getElementById("trial-plan")?.value.trim() || 'N/A';
    const device = document.getElementById("trial-device")?.value.trim() || 'N/A';
    const macAddress = document.getElementById("trial-mac")?.value.trim() || 'N/A';

    // Validation - Country is now required
    if (!country) {
        alert('Please select your country.');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        return; // Stop submission
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'trial',
          name: name,
          email: email,
          country: country,
          plan: plan,
          device: device,
          macAddress: macAddress
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }

      alert("Your trial request has been sent. Our team will contact you within 1-2 hours.");
      trialForm.reset();

    } catch (error) {
      console.error("Error submitting trial request:", error);
      alert("We could not send your request. Please try again shortly.");
    } finally {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});
