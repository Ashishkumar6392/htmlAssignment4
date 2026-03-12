/* ================= EMAIL JS INIT ================= */

(function(){
emailjs.init("ytIAhKnkcjqVTgxj2");
})();

/* ================= CART ================= */

let cart = [];

/* ================= ADD SERVICE ================= */

function addService(name, price, button) {

  let existingItem = cart.find(item => item.name === name);

  if (!existingItem) {

    cart.push({
      name: name,
      price: price
    });

    button.innerText = "Remove Item";
    button.classList.remove("add-btn");
    button.classList.add("remove-btn");

    button.onclick = function(){
      removeService(name, button);
    };
  }

  updateCart();
}

/* ================= REMOVE SERVICE ================= */

function removeService(name, button) {

  cart = cart.filter(item => item.name !== name);

  updateCart();

  button.innerText = "Add Item";
  button.classList.remove("remove-btn");
  button.classList.add("add-btn");

  button.onclick = function(){
    addService(name, getPrice(name), button);
  };
}

/* ================= UPDATE CART ================= */

function updateCart(){

  const tbody = document.querySelector("#cartTable tbody");

  tbody.innerHTML = "";

  let total = 0;
  let count = 1;

  cart.forEach(item => {

    total += item.price;

    let row = `
    <tr>
      <td>${count}</td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
    </tr>
    `;

    tbody.innerHTML += row;

    count++;

  });

  document.getElementById("total").innerText = total;

}

/* ================= GET PRICE ================= */

function getPrice(name){

  const prices = {

    "Dry Cleaning":200,
    "Wash & Fold":100,
    "Ironing":30,
    "Stain Removal":500,
    "Leather & Suede Cleaning":999,
    "Wedding Dress Cleaning":2800

  };

  return prices[name];
}

/* ================= SHOW MESSAGE ================= */

function showMessage(text, type){

  const msg = document.getElementById("bookingMessage");

  msg.innerText = text;
  msg.className = type;

  setTimeout(function(){

    msg.innerText = "";
    msg.className = "";

  },3000);

}

/* ================= BOOK NOW ================= */

function bookNow(){

  const customerName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if(cart.length === 0){

    showMessage("Please add at least one service.","error");
    return;

  }

  if(customerName === "" || email === "" || phone === ""){

    showMessage("Please fill all details.","error");
    return;

  }

  let services = "";
  let total = 0;

  cart.forEach(item => {

    services += item.name + " = ₹" + item.price + "\n";
    total += item.price;

  });

  const templateParams = {

    customer_name: customerName,
    customer_email: email,
    phone: phone,
    services: services,
    total: total

  };

  emailjs.send("service_plkarmp","template_g5c74so",templateParams)

  .then(function(response){

    showMessage("Booking Successful! Email sent.","success");

    /* CLEAR CART */

    cart = [];
    updateCart();

    /* RESET FORM */

    document.getElementById("name").value="";
    document.getElementById("email").value="";
    document.getElementById("phone").value="";

    /* RESET BUTTONS */

    document.querySelectorAll(".service-item button").forEach(btn => {

      btn.innerText="Add Item";
      btn.classList.remove("remove-btn");
      btn.classList.add("add-btn");

    });

  })

  .catch(function(error){

    showMessage("Email failed to send. Please try again.","error");

  });

}