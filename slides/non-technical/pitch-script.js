/**
 * ReVive Pitch Presentation
 * Simple, clean navigation for demo pitch
 */

// State
let currentSlide = 1;
const totalSlides = 9;

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

    console.log('ReVive Pitch Presentation initialized');
}

/**
 * Update the current slide
 * @param {number} slideNumber - The slide to show
 */
function updateSlide(slideNumber) {
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

    console.log(`Slide ${currentSlide} of ${totalSlides}`);
}

/**
 * Update navigation button disabled states
 */
function updateNavigationButtons() {
    prevBtn.disabled = currentSlide === 1;
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
 * @param {number} slideNumber - The slide to navigate to
 */
function goToSlide(slideNumber) {
    updateSlide(slideNumber);
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        const presentationKeys = ['ArrowRight', 'ArrowLeft', 'Space', ' '];

        if (presentationKeys.includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowRight':
            case ' ':
            case 'Spacebar':
                nextSlide();
                break;

            case 'ArrowLeft':
                prevSlide();
                break;

            case 'Home':
                goToSlide(1);
                break;

            case 'End':
                goToSlide(totalSlides);
                break;

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

            case '0':
                if (totalSlides >= 10) {
                    goToSlide(10);
                }
                break;
        }
    });
}

/**
 * Setup touch/swipe navigation for mobile
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

        if (swipeDistance < -swipeThreshold) {
            nextSlide();
        }

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
 * Get current slide number
 * @returns {number}
 */
function getCurrentSlide() {
    return currentSlide;
}

/**
 * Get total number of slides
 * @returns {number}
 */
function getTotalSlides() {
    return totalSlides;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for external use if needed
window.presentation = {
    nextSlide,
    prevSlide,
    goToSlide,
    getCurrentSlide,
    getTotalSlides
};
