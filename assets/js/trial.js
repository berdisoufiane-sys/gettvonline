import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
  const trialForm = document.getElementById("trial-form");
  const submitButton = document.getElementById("trial-submit-btn");
  const deviceSelect = document.getElementById("trial-device"); // Get device select
  const macAddressContainer = document.getElementById("mac-address-container"); // Get MAC container
  const messageContainer = document.getElementById("trial-message-container"); // Get message container

  if (!trialForm || !submitButton) return;

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

  // NEW: Add event listener to show/hide MAC address field
  if (deviceSelect && macAddressContainer) {
    deviceSelect.addEventListener('change', function() {
      if (this.value.toLowerCase().includes('mag')) {
        macAddressContainer.classList.remove('hidden');
      } else {
        macAddressContainer.classList.add('hidden');
      }
    });
  }

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
        showFormMessage('Please select your country.', false);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        return; // Stop submission
    }

    try {
      await addDoc(collection(db, 'trial'), {
        name: name,
        email: email,
        country: country,
        plan: plan,
        device: device,
        macAddress: macAddress,
        timestamp: serverTimestamp()
      });

      showFormMessage("Your trial request has been sent. Our team will contact you within 1-2 hours.", true);
      trialForm.reset();
    } catch (error) {
      console.error("Error submitting trial request:", error);
      showFormMessage("We could not send your request. Please try again shortly.", false);
    } finally {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});
