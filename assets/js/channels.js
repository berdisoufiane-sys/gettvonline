document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("channel-list-form");
  const emailInput = document.getElementById("channel-list-email");
  const regionInput = document.getElementById("channel-list-region");
  const submitButton = document.getElementById("channel-list-submit-btn");

  if (!form || !emailInput || !regionInput || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButton = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Sending...';
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'channelList',
          email: emailInput.value.trim(),
          preferredRegion: regionInput.value.trim() || null,
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }

      form.reset();
      alert("Your request has been sent. Our support team will email the channel-list information soon.");

    } catch (error) {
      console.error("Error requesting channel list:", error);
      alert("We could not send your request. Please try again shortly.");
    } finally {
      submitButton.innerHTML = originalButton;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});
