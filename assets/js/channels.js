document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("channel-list-form");
  const emailInput = document.getElementById("channel-list-email");
  const regionInput = document.getElementById("channel-list-region");
  const submitButton = document.getElementById("channel-list-submit-btn");
  const messageContainer = document.getElementById("channel-list-message-container"); // Get message container

  if (!form || !emailInput || !regionInput || !submitButton) return;

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
      showFormMessage("Your request has been sent. Our support team will email the channel-list information soon.", true);

    } catch (error) {
      console.error("Error requesting channel list:", error);
      showFormMessage("We could not send your request. Please try again shortly.", false);
    } finally {
      submitButton.innerHTML = originalButton;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});
