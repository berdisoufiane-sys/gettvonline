import { db, collection, addDoc, serverTimestamp } from './firebase.js';

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
            await addDoc(collection(db, 'newsletter'), {
                email: emailInput.value.trim(),
                timestamp: serverTimestamp()
            });

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

/**
 * Fetches and injects an HTML component into the DOM.
 * @param {string} id The ID of the placeholder element.
 * @param {string} url The URL of the HTML component to load.
 */
async function loadComponent(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${url}`);
    }
    const text = await response.text();
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = text;

      // Scripts inserted via innerHTML are not executed by the browser.
      // We need to find them, create new script elements, and append them to the document.
      const scripts = Array.from(element.querySelectorAll('script'));
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch (error) {
    console.error(`Error loading component for #${id}:`, error);
  }
}

/**
 * Initializes the mobile menu toggle functionality.
 * This function should be called after the header is loaded.
 */
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Highlights the active navigation link based on the current page.
 */
function highlightActiveLink() {
    // Use a simple check for the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Select all links in both desktop and mobile nav
    const navLinks = document.querySelectorAll('header nav a, #mobile-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';

        if (linkPage === currentPage) {
            // These are Tailwind classes. Adjust if you use different ones for active state.
            link.classList.add('bg-gray-700', 'text-white');
            link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
        }
    });
}

/**
 * Initializes the "Back to Top" button functionality.
 */
function initializeBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) { // Show button after scrolling 200px
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Initializes the cookie consent banner functionality.
 */
function initializeCookieConsent() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');

    if (!cookieBanner || !acceptButton || !declineButton) return;

    const cookieConsent = localStorage.getItem('cookieConsent');

    if (cookieConsent === null) {
        // If no choice has been made, show the banner
        cookieBanner.classList.remove('hidden');
    }

    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.add('hidden');
    });

    declineButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.add('hidden');
        // Optionally, you might want to disable certain scripts here
    });
}

/**
 * Main application entry point.
 */
async function main() {
    // Load shared components and then initialize scripts
    await Promise.all([
        loadComponent("header-placeholder", "assets/components/header.html"),
        loadComponent("footer-placeholder", "assets/components/footer.html")
    ]);

    initializeMobileMenu();
    highlightActiveLink();
    setupNewsletterForm(); // This is for the form in the footer
    initializeBackToTopButton();
    initializeCookieConsent();
}

// Wait for the DOM to be fully loaded before running the main app logic
document.addEventListener("DOMContentLoaded", main);
