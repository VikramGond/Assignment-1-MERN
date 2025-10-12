document.addEventListener("DOMContentLoaded", function () {



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
    const rBtn = item.querySelector('.r-btn'); // ✅ find the correct remove button for this item

    const existingItem = cart.find(i => i.name === name);

    if (!existingItem) {
      cart.push({ name, price });

      // Toggle buttons
      button.style.display = 'none';
      rBtn.style.display = 'inline-block'; // show the remove button

      paraTag.innerHTML = '✅ Item added to cart.';
      paraTag.style.color = 'green';
      setTimeout(() => paraTag.innerHTML = '', 1500);

      renderCart();
    }
  });

  // Handle remove button click too
  const item = button.closest('.service-item');
  const rBtn = item.querySelector('.r-btn');
  rBtn.addEventListener('click', () => {
    const name = item.dataset.name;

    // Remove from cart
    cart = cart.filter(i => i.name !== name);

    // Toggle back buttons
    rBtn.style.display = 'none';
    button.style.display = 'inline-block';

    paraTag.innerHTML = '🗑️ Item removed from cart.';
    paraTag.style.color = 'red';
    setTimeout(() => paraTag.innerHTML = '', 1500);

    renderCart();
    saveData();
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
      order_id: 121,
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

// localStorage.clear()