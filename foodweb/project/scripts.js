// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Parallax scroll effect for the header background
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sample cart array
    let cart = JSON.parse(localStorage.getItem('cartItems')) || []; // Retrieve cart items from localStorage if any exist
    
    // Add to cart function
    function addToCart(item) {
        cart.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cart)); // Save cart to localStorage
        alert(`${item.name} added to cart!`);
        updateCartCount(); // Update cart count if you're displaying it
    }

    // Attach the "Add to Cart" functionality to buttons
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const item = {
                name: button.parentElement.querySelector('h3').textContent, // Get item name from h3 tag
                price: button.parentElement.querySelector('.price').textContent // Get price from .price class element
            };
            addToCart(item); // Add the item to the cart
        });
    });

    // Update the cart item count if you want to show it somewhere in your UI
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length; // Update cart count display
        }
    }

    updateCartCount(); // Initial call to set cart count on page load

});
