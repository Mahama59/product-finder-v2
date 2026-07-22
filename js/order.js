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
