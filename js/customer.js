alert("customer.js connected");

// LOAD CUSTOMER DASHBOARD

function loadCustomerDashboard(){

let customer =
JSON.parse(localStorage.getItem("customer"));

if(!customer){

window.location.href="login.html";
return;

}

let welcome =
document.getElementById("customerWelcome");

if(welcome){

welcome.innerText =
"Welcome " + customer.name;

}

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let myOrders =
orders.filter(function(order){

return order.email === customer.email;

});

document.getElementById("customerOrderCount").innerText =
myOrders.length;

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

document.getElementById("wishlistCount").innerText =
wishlist.length;

}

// LOGOUT

function customerLogout(){

localStorage.removeItem("customer");

alert("Logged out");

window.location.href="../index.html";

}
