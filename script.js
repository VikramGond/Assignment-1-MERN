const addButtons = document.querySelectorAll('.add-btn');
const cartTableBody = document.querySelector('#cart-items tbody');
const totalAmount = document.getElementById('total-amount');

let cart = [];

addButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.service-item');
    const name = item.dataset.name;
    const price = parseFloat(item.dataset.price);

    const existingItem = cart.find(i => i.name === name);
    if (!existingItem) {
      cart.push({ name, price });
      renderCart();
    }
  });
});

function renderCart() {
  cartTableBody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td><button onclick="removeItem('${item.name}')">Remove ❌</button></td>
    `;
    cartTableBody.appendChild(row);
  });

  totalAmount.textContent = total.toFixed(2);
}

function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}
