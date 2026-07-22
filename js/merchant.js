alert("merchant.js connected");


// ================= REGISTER MERCHANT =================

function registerMerchant(){

let name =
document.getElementById("merchantName").value.trim();

let email =
document.getElementById("merchantEmail").value.trim();

let phone =
document.getElementById("merchantPhone").value.trim();


if(!name || !email || !phone){

alert("Please fill all fields");
return;

}


let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];


let exists =
merchants.find(m => m.email === email);


if(exists){

alert("Merchant already exists");
return;

}


let merchant = {

id: Date.now(),

name:name,

email:email,

phone:phone,

storeName:name + " Store",

joined:new Date().toLocaleDateString()

};


merchants.push(merchant);


localStorage.setItem(
"merchants",
JSON.stringify(merchants)
);


localStorage.setItem(
"merchant",
JSON.stringify(merchant)
);


alert("Merchant registration successful");


window.location.href =
"merchant-dashboard.html";


}



// ================= LOGIN MERCHANT =================


function merchantLogin(){


let email =
document.getElementById("merchantEmail").value.trim();


let phone =
document.getElementById("merchantPhone").value.trim();



let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];



let merchant =
merchants.find(m => 
m.email === email &&
m.phone === phone
);



if(!merchant){

alert("Incorrect merchant details");
return;

}



localStorage.setItem(
"merchant",
JSON.stringify(merchant)
);



alert("Login successful");


window.location.href =
"merchant-dashboard.html";


}



// ================= DASHBOARD =================


function loadMerchantDashboard(){


let merchant =
JSON.parse(localStorage.getItem("merchant"));



if(!merchant){

return;

}



let welcome =
document.getElementById("merchantWelcome");


if(welcome){

welcome.innerText =
"Welcome " + merchant.name;

}



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let myProducts =
products.filter(product => 
product.merchantEmail === merchant.email
);



let count =
document.getElementById("productCount");


if(count){

count.innerText =
myProducts.length;

}



let productBox =
document.getElementById("merchantProducts");



if(productBox){


productBox.innerHTML="";



if(myProducts.length === 0){

productBox.innerHTML =
"<p>No products yet.</p>";

}

else{


myProducts.forEach(product=>{


productBox.innerHTML += `

<div class="card">

<h3>${product.name}</h3>

<p>
💰 Price: $${product.price}
</p>

<p>
📦 Stock: ${product.stock}
</p>

<p>
📂 ${product.category}
</p>

</div>

`;

});


}


}




// Revenue

let revenue =
0;


let orders =
JSON.parse(localStorage.getItem("orders")) || [];



orders.forEach(order=>{


order.items.forEach(item=>{


if(item.merchantEmail === merchant.email){


revenue +=
Number(item.price) *
Number(item.quantity);


}


});


});



let revenueBox =
document.getElementById("merchantRevenue");



if(revenueBox){

revenueBox.innerText =
revenue;

}



}




// ================= LOGOUT =================


function merchantLogout(){

localStorage.removeItem("merchant");


alert("Logged out");


window.location.href =
"merchant-login.html";


}

// ================= MERCHANT PRODUCT MANAGEMENT =================


function loadMerchantProducts(){


let box =
document.getElementById("merchantProducts");


if(!box) return;



let merchant =
JSON.parse(localStorage.getItem("merchant"));



if(!merchant){

box.innerHTML =
"<p>Please login as merchant</p>";

return;

}



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});



box.innerHTML = "";



if(myProducts.length === 0){

box.innerHTML =
"<p>No products added yet.</p>";

return;

}



myProducts.forEach(function(product,index){


box.innerHTML += `

<div class="product">


<img src="${product.image}" width="200">


<h3>
${product.name}
</h3>


<p>
💰 Price: $${product.price}
</p>


<p>
📂 Category: ${product.category}
</p>


<p>
📦 Stock: ${product.stock}
</p>


<p>
Status:
${product.status}
</p>



<button onclick="deleteMerchantProduct(${index})">

🗑 Delete

</button>


</div>


`;


});


}



// ================= DELETE PRODUCT =================


function deleteMerchantProduct(index){


let merchant =
JSON.parse(localStorage.getItem("merchant"));



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});



let productToDelete =
myProducts[index];



let realIndex =
products.findIndex(function(product){

return product.id === productToDelete.id;

});



products.splice(realIndex,1);



localStorage.setItem(

"merchantProducts",

JSON.stringify(products)

);



alert("Product deleted");



loadMerchantProducts();


}

// ================= MERCHANT ORDERS =================

function loadMerchantOrders(){

let merchant =
JSON.parse(localStorage.getItem("merchant"));

if(!merchant){

alert("Please login");

return;

}

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let box =
document.getElementById("merchantOrders");

if(!box) return;

box.innerHTML = "";

let myOrders =
orders.filter(function(order){

return order.merchantEmail === merchant.email;

});

if(myOrders.length === 0){

box.innerHTML =
"<p>No customer orders yet.</p>";

return;

}

myOrders.forEach(function(order){

box.innerHTML += `

<div class="product">

<h3>
🧾 Order #${order.id}
</h3>

<p>
👤 Customer:
${order.customer}
</p>

<p>
📧 ${order.email}
</p>

<p>
📞 ${order.phone}
</p>

<p>
💰 Total:
$${order.total}
</p>

<p>
📦 Status:
${order.status}
</p>

<button onclick="updateOrderStatus(${order.id},'Accepted')">

✅ Accept

</button>

<button onclick="updateOrderStatus(${order.id},'Shipped')">

🚚 Ship

</button>

<button onclick="updateOrderStatus(${order.id},'Completed')">

✔ Complete

</button>

</div>

`;

});

}

function updateOrderStatus(orderId,status){

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

orders.forEach(function(order){

if(order.id===orderId){

order.status=status;

}

});

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

loadMerchantOrders();

}
