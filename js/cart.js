alert("cart.js connected");


// ADD PRODUCT

function addToCart(name, price, merchantEmail){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


let existing =
cart.find(function(item){

return item.name === name;

});


if(existing){

existing.quantity += 1;

}

else{

cart.push({

id: Date.now(),

name:name,

price:Number(price),

quantity:1,

merchantEmail:merchantEmail

});

}


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


alert("Product added to cart 🛒");

}



// LOAD CART

function loadCart(){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


let box =
document.getElementById("cartItems");


let totalBox =
document.getElementById("cartTotal");


if(!box) return;


box.innerHTML="";


let total=0;


if(cart.length===0){

box.innerHTML =
"<p>Your cart is empty</p>";

totalBox.innerText = 0;

return;

}



cart.forEach(function(item,index){


total += Number(item.price) * Number(item.quantity);



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


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


cart.splice(index,1);


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


loadCart();


}



// CART COUNT

function updateCartCount(){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


let count =
document.getElementById("cartCount");


if(count){

count.innerText = cart.length;

}

}
