const addButtons = document.querySelectorAll('.add-btn');  // Corrected variable name
const cartTableBody = document.querySelector('#cart-items tbody');
const totalAmount = document.getElementById('total-amount');

let cart = [];

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.service-item');
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);

        // Check if already in cart
        const existingItem = cart.find(i => i.name === name);
        if (!existingItem) {
            cart.push({ name, price });
            renderCart();
        }
    });
});