// ================================
// SCROLL REVEAL ANIMATION
// ================================

const sections = document.querySelectorAll(".section, .quote-section");

const revealSections = () => {
    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            section.classList.add("visible");
        }
    });
};

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);