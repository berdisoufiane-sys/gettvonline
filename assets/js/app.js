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
 * Initializes the infinite scrolling carousels.
 * It respects the user's motion preferences and dynamically duplicates content for a seamless loop.
 */
function initializeCarousels() {
    const scrollers = document.querySelectorAll(".scroller");

    // If the user hasn't opted for reduced motion, add the animation.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }
}

/**
 * Main application entry point.
 * Header/footer are now inlined into each page at build time (see build-blog.js),
 * so there's no fetch to wait on before wiring up the rest of the page.
 */
function main() {
    initializeMobileMenu();
    highlightActiveLink();
    setupNewsletterForm(); // This is for the form in the footer
    initializeBackToTopButton();
    initializeCookieConsent();
    initializeCarousels();
}

// Wait for the DOM to be fully loaded before running the main app logic
document.addEventListener("DOMContentLoaded", main);
