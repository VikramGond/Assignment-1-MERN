document.addEventListener("DOMContentLoaded", function () {

  // EmailJS is already initialized in HTML, so no need to initialize here

  // Select elements
  const addButtons = document.querySelectorAll('.add-btn');
  const cartTableBody = document.querySelector('#cart-items tbody');
  const totalAmount = document.getElementById('total-amount');
  const paraTag = document.getElementById('para2');
  const bookingForm = document.getElementById('booking-form');
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const addressInput = document.querySelector('#address');

  let cart = [];

  // Load saved data on page load
  showData();

  // Add items to cart
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

  // Render the cart
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
    saveData();
  }

  // Make removeItem global
  window.removeItem = function (name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
  };

  // Handle booking form submission
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      paraTag.innerHTML = 'Please add some products.';
      paraTag.style.color = 'red';
      return;
    }

    // Prepare cart details
    let cartDetails = '';
    cart.forEach((item, index) => {
      const cleanName = item.name.replace(/[^\w\s]/gi, ''); // removes emojis & symbols
      cartDetails += `${index + 1}. ${cleanName} - ₹${item.price.toFixed(2)}\n`;
    });

    const name = bookingForm.querySelector('#full-name').value.trim();
    const email = bookingForm.querySelector('#email').value.trim();
    const phone = bookingForm.querySelector('#phone').value.trim();
    const address = addressInput.value.trim();
    const total = totalAmount.textContent;

    // Debugging logs
    console.log("Preparing to send email...");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Address:", address);
    console.log("Cart Items:", cartDetails);
    console.log("Total:", total);

    // Optional validation
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
      paraTag.innerHTML = 'Please enter a valid 10-digit phone number.';
      paraTag.style.color = 'red';
      return;
    }

    if (address.length < 5) {
      paraTag.innerHTML = 'Please enter a valid address.';
      paraTag.style.color = 'red';
      return;
    }

    // Disable the submit button while sending
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    var templateParams = {
      to_name: "WC Laundry", // Your business name
      to_email: "vikramgond22052@gmail.com", // Replace with YOUR actual email
      from_name: name,
      from_email: email,
      user_name: name,
      user_email: email,
      user_phone: phone,
      user_address: address,
      cart_items: cartDetails,
      total_amount: total,
    };

    // Send email using EmailJS
    emailjs.send('service_rpbju8d', 'template_my4xrmx', templateParams).then(function (response) {
      paraTag.innerHTML = "Booking Successful! Email sent.";
      paraTag.style.color = 'green';
      bookingForm.reset();
      cart = [];
      renderCart();
    })
      .catch(function (error) {
        paraTag.innerHTML = "Failed to send email. Please try again.";
        paraTag.style.color = 'red';
        console.error('EmailJS Error:', error);
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = "Book now";
        setTimeout(() => {
          paraTag.innerHTML = '';
        }, 3000);
      });
  });

  // Save cart data to localStorage
  function saveData() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Load cart data from localStorage
  function showData() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      renderCart();
    }
  }
});