alert("order.js connected");


// LOAD CHECKOUT

function loadCheckout(){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];



let box =
document.getElementById("checkoutItems");


let totalBox =
document.getElementById("checkoutTotal");



if(!box) return;



box.innerHTML="";


let total = 0;



cart.forEach(function(item){


total += item.price * item.quantity;



box.innerHTML += `

<p>
${item.name} x ${item.quantity}
- $${item.price}
</p>

`;



});



totalBox.innerText = total;


}



// PLACE ORDER
function placeOrder(){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];


if(cart.length===0){

alert("Cart is empty");

return;

}


let customerName =
document.getElementById("customerName").value.trim();

let customerEmail =
document.getElementById("customerEmail").value.trim();

let customerPhone =
document.getElementById("customerPhone").value.trim();


if(!customerName || !customerEmail || !customerPhone){

alert("Please complete all customer details");

return;

}


let total = 0;

cart.forEach(function(item){

total += item.price * item.quantity;

});


let orders =
JSON.parse(localStorage.getItem("orders")) || [];


let order = {

id: Date.now(),

address:
document.getElementById("customerAddress").value,

city:
document.getElementById("customerCity").value,

trackingNumber:"Not assigned",

shippingStatus:"Processing",
  
customer: customerName,

email: customerEmail,

phone: customerPhone,

items: cart,

total: total,

merchantEmail: cart[0].merchantEmail,

status: "New",

date: new Date().toLocaleString()

};


orders.push(order);


localStorage.setItem(
"orders",
JSON.stringify(orders)
);


localStorage.removeItem("cart");


alert("Order placed successfully 🎉");


window.location.href = "success.html";

}

function loadCustomerOrders(){

let email = prompt("Enter your email to view your orders");

if(!email) return;

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let box =
document.getElementById("customerOrders");

if(!box) return;

box.innerHTML = "";

let myOrders = orders.filter(function(order){

return order.email === email;

});

if(myOrders.length === 0){

box.innerHTML =
"<p>No orders found.</p>";

return;

}

myOrders.forEach(function(order){

let items = "";

order.items.forEach(function(item){

items += `<li>${item.name} x ${item.quantity}</li>`;

});

box.innerHTML += `

<div class="product">

<h3>🧾 Order #${order.id}</h3>

<p><strong>Date:</strong> ${order.date}</p>

<p><strong>Total:</strong> $${order.total}</p>

<p><strong>Status:</strong> ${order.status}</p>

<ul>${items}</ul>

</div>

`;

});

}
