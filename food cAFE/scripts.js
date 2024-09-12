window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
});

// Smooth Scroll for Navigation (Optional)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
