// Smooth Scrolling for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
window.onload = function() {
    const gifContainer = document.querySelector('.gif-container');
    
    // Function to show and hide the GIF
    function animateGif() {
        // Bring the GIF into view
        gifContainer.style.bottom = '0px'; // Move it to the bottom of the screen

        // After 2 seconds, hide the GIF again
        setTimeout(function() {
            gifContainer.style.bottom = '-150px'; // Move it back down off-screen
        }, 2000); // Wait for 2 seconds before hiding
    }

    // Start the animation after 500ms
    setTimeout(animateGif, 500);
}
