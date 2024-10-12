document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
        }
    });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

let cart = JSON.parse(localStorage.getItem('cartItems')) || []; 
function addToCart(item) {
    cart.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cart)); 
    alert(`${item.name} added to cart!`);
    updateCartCount(); 
}

document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const item = {
            name: button.parentElement.querySelector('h3').textContent, 
            price: button.parentElement.querySelector('.price').textContent 
        };
        addToCart(item); 
    });
});

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length; 
    }
}
updateCartCount(); 
});
