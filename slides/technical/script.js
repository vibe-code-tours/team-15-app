/**
 * ReVive Presentation - Slide Navigation Script
 * Handles keyboard navigation, button clicks, and progress tracking
 */

// State
let currentSlide = 1;
const totalSlides = 15;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progress');
const slideCounter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

/**
 * Initialize the presentation
 */
function init() {
    updateSlide(1);
    setupKeyboardNavigation();
    setupTouchNavigation();
    setupButtonNavigation();

    console.log(`ReVive Presentation initialized with ${totalSlides} slides`);
}

/**
 * Update the current slide display
 * @param {number} slideNumber - The slide number to show (1-indexed)
 */
function updateSlide(slideNumber) {
    // Validate slide number
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }

    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Add active class to target slide
    const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }

    // Update current slide tracker
    currentSlide = slideNumber;

    // Update progress bar
    const progressPercentage = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Update slide counter
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

    // Update navigation button states
    updateNavigationButtons();

    // Log for debugging
    console.log(`Slide ${currentSlide} of ${totalSlides}`);
}

/**
 * Update navigation button disabled states
 */
function updateNavigationButtons() {
    // Disable previous button on first slide
    prevBtn.disabled = currentSlide === 1;

    // Disable next button on last slide
    nextBtn.disabled = currentSlide === totalSlides;
}

/**
 * Go to the next slide
 */
function nextSlide() {
    if (currentSlide < totalSlides) {
        updateSlide(currentSlide + 1);
    }
}

/**
 * Go to the previous slide
 */
function prevSlide() {
    if (currentSlide > 1) {
        updateSlide(currentSlide - 1);
    }
}

/**
 * Go to a specific slide
 * @param {number} slideNumber - The slide number to navigate to
 */
function goToSlide(slideNumber) {
    updateSlide(slideNumber);
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        // Prevent default behavior for presentation keys
        const presentationKeys = ['ArrowRight', 'ArrowLeft', 'Space', ' ', 'f', 'F'];

        if (presentationKeys.includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            // Right arrow or Space: Next slide
            case 'ArrowRight':
            case ' ':
            case 'Spacebar':
                nextSlide();
                break;

            // Left arrow: Previous slide
            case 'ArrowLeft':
                prevSlide();
                break;

            // Home: First slide
            case 'Home':
                goToSlide(1);
                break;

            // End: Last slide
            case 'End':
                goToSlide(totalSlides);
                break;

            // F or f: Toggle fullscreen
            case 'f':
            case 'F':
                toggleFullscreen();
                break;

            // Escape: Exit fullscreen or go to first slide
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    goToSlide(1);
                }
                break;

            // Number keys 1-9: Jump to slide
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                const slideNum = parseInt(event.key);
                if (slideNum <= totalSlides) {
                    goToSlide(slideNum);
                }
                break;

            // 0: Go to slide 10
            case '0':
                if (totalSlides >= 10) {
                    goToSlide(10);
                }
                break;
        }
    });
}

/**
 * Setup touch/swipe navigation for mobile devices
 */
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    document.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        // Swipe left: Next slide
        if (swipeDistance < -swipeThreshold) {
            nextSlide();
        }

        // Swipe right: Previous slide
        if (swipeDistance > swipeThreshold) {
            prevSlide();
        }
    }
}

/**
 * Setup button click navigation
 */
function setupButtonNavigation() {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Get current slide number
 * @returns {number} Current slide number
 */
function getCurrentSlide() {
    return currentSlide;
}

/**
 * Get total number of slides
 * @returns {number} Total slide count
 */
function getTotalSlides() {
    return totalSlides;
}

/**
 * Check if on first slide
 * @returns {boolean}
 */
function isFirstSlide() {
    return currentSlide === 1;
}

/**
 * Check if on last slide
 * @returns {boolean}
 */
function isLastSlide() {
    return currentSlide === totalSlides;
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export functions for potential external use (if needed)
window.presentation = {
    nextSlide,
    prevSlide,
    goToSlide,
    getCurrentSlide,
    getTotalSlides,
    isFirstSlide,
    isLastSlide,
    toggleFullscreen
};
