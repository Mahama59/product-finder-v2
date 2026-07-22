alert("cart.js connected");


// GET CART

let cart =
JSON.parse(localStorage.getItem("cart")) || [];


// ADD PRODUCT

function addToCart(name, price, merchantEmail){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];



let item = {

id: Date.now(),

name:name,

price:Number(price),

quantity:1,

merchantEmail:merchantEmail

};



cart.push(item);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



alert("Added to cart 🛒");


}



// LOAD CART

function loadCart(){


let box =
document.getElementById("cartItems");


let totalBox =
document.getElementById("cartTotal");



if(!box) return;



cart =
JSON.parse(localStorage.getItem("cart")) || [];



box.innerHTML="";


let total=0;



if(cart.length===0){

box.innerHTML=
"<p>Your cart is empty</p>";

return;

}



cart.forEach(function(item,index){


total += item.price * item.quantity;



box.innerHTML += `


<div class="product">

<h3>${item.name}</h3>

<p>
Price: $${item.price}
</p>


<p>
Quantity: ${item.quantity}
</p>


<button onclick="removeCartItem(${index})">

Remove

</button>


</div>


`;

});



totalBox.innerText = total;


}



// REMOVE ITEM

function removeCartItem(index){


cart.splice(index,1);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



loadCart();


}



// CHECKOUT

function checkout(){


if(cart.length===0){

alert("Cart is empty");

return;

}


alert("Checkout system coming next");


}
