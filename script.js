let cart = [];

/* ================= ADD SERVICE ================= */
function addService(name, price, button) {

  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });

    // change button to remove
    button.innerText = "Remove Item";
    button.classList.remove("add-btn");
    button.classList.add("remove-btn");
    button.onclick = function () {
      removeService(name, button);
    };
  }

  updateCart();
}

/* ================= REMOVE SERVICE ================= */
function removeService(name, button) {

  cart = cart.filter(item => item.name !== name);
  updateCart();

  // reset button
  button.innerText = "Add Item";
  button.classList.remove("remove-btn");
  button.classList.add("add-btn");
  button.onclick = function () {
    addService(name, getPrice(name), button);
  };
}

/* ================= INCREASE QUANTITY ================= */
function increaseQty(name) {
  let item = cart.find(item => item.name === name);
  item.quantity += 1;
  updateCart();
}

/* ================= DECREASE QUANTITY ================= */
function decreaseQty(name) {
  let item = cart.find(item => item.name === name);

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    // remove if quantity becomes 0
    cart = cart.filter(i => i.name !== name);

    // reset service button
    document.querySelectorAll(".service-item").forEach(service => {
      if (service.innerText.includes(name)) {
        let btn = service.querySelector("button");
        btn.innerText = "Add Item";
        btn.classList.remove("remove-btn");
        btn.classList.add("add-btn");
        btn.onclick = function () {
          addService(name, getPrice(name), btn);
        };
      }
    });
  }

  updateCart();
}

/* ================= UPDATE CART ================= */
function updateCart() {

  const tbody = document.querySelector("#cartTable tbody");
  tbody.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    let row = `
      <tr>
        <td>${item.name}</td>
        <td>
          ₹${item.price} x 
          <button onclick="decreaseQty('${item.name}')">−</button>
          ${item.quantity}
          <button onclick="increaseQty('${item.name}')">+</button>
        </td>
        <td>₹${itemTotal}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });

  document.getElementById("total").innerText = total;
}

/* ================= GET PRICE ================= */
function getPrice(name) {
  const prices = {
    "Dry Cleaning": 200,
    "Wash & Fold": 100,
    "Ironing": 30,
    "Stain Removal": 500,
    "Leather & Suede Cleaning": 999,
    "Wedding Dress Cleaning": 2800
  };
  return prices[name];
}

/* ================= BOOK NOW ================= */
function bookNow() {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (cart.length === 0) {
    alert("Please add at least one service.");
    return;
  }

  if (name === "" || email === "" || phone === "") {
    alert("Please fill all details.");
    return;
  }

  alert(
    "Booking Successful!\n\n" +
    "Customer: " + name +
    "\nTotal: ₹" + document.getElementById("total").innerText
  );

  // Reset everything
  cart = [];
  updateCart();

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  // reset all service buttons
  document.querySelectorAll(".service-item button").forEach(btn => {
    btn.innerText = "Add Item";
    btn.classList.remove("remove-btn");
    btn.classList.add("add-btn");
    btn.onclick = function () {
      let text = btn.parentElement.innerText;
      let serviceName = text.split(" - ")[0];
      addService(serviceName, getPrice(serviceName), btn);
    };
  });
}