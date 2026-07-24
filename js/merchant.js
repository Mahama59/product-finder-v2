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

alert("Please login as merchant");

return;

}


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let orders =
JSON.parse(localStorage.getItem("orders")) || [];


// Get this merchant products

let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});


// Approved products

let approved =
myProducts.filter(function(product){

return product.status === "Approved";

});


// Pending products

let pending =
myProducts.filter(function(product){

return product.status === "Pending";

});


// Merchant orders

let myOrders =
orders.filter(function(order){

return order.items && order.items.some(function(item){

return item.merchantEmail === merchant.email;

});

});


// Calculate revenue

let revenue = 0;


myOrders.forEach(function(order){

if(order.status === "Completed"){

order.items.forEach(function(item){

if(item.merchantEmail === merchant.email){

revenue += Number(item.price) * Number(item.quantity);

}

});

}

});



// Update dashboard

let welcome =
document.getElementById("merchantWelcome");


if(welcome){

welcome.innerText =
"Welcome " + merchant.storeName;

}



document.getElementById("productCount").innerText =
myProducts.length;


document.getElementById("approvedProducts").innerText =
approved.length;


document.getElementById("pendingProducts").innerText =
pending.length;


document.getElementById("merchantOrders").innerText =
myOrders.length;


document.getElementById("revenue").innerText =
revenue;


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
${
product.stock <= 5 
? "⚠️ Low Stock" 
: "✅ In Stock"
}
</p>


<p>
Approval:
${product.status}
</p>

<p>
Inventory:
${getStockStatus(product.stock)}
</p>

<button onclick="changeStock(${index},1)">
➕ Add Stock
</button>


<button onclick="changeStock(${index},-1)">
➖ Remove Stock
</button>
<button onclick="editMerchantProduct(${index})">

✏️ Edit

</button>

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

<p>
🚚 Shipping:
${order.shippingStatus || "Processing"}
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

function shipOrder(id){

let orders =
JSON.parse(localStorage.getItem("orders")) || [];


orders.forEach(function(order){

if(order.id === id){

order.shippingStatus="Shipped";

order.trackingNumber =
"PF-" + Date.now();

}

});


localStorage.setItem(
"orders",
JSON.stringify(orders)
);


alert("Order shipped 🚚");

loadMerchantOrders();

}

// ================= EDIT PRODUCT =================


function loadEditProduct(){

let product =
JSON.parse(localStorage.getItem("editProduct"));


if(!product) return;


document.getElementById("editName").value =
product.name;


document.getElementById("editPrice").value =
product.price;


document.getElementById("editCategory").value =
product.category;


document.getElementById("editStock").value =
product.stock;


document.getElementById("editDescription").value =
product.description || "";

}



// ================= UPDATE PRODUCT =================


function updateProduct(){


let product =
JSON.parse(localStorage.getItem("editProduct"));


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let index =
products.findIndex(function(item){

return item.id === product.id;

});



products[index].name =
document.getElementById("editName").value;


products[index].price =
Number(document.getElementById("editPrice").value);


products[index].category =
document.getElementById("editCategory").value;


products[index].stock =
Number(document.getElementById("editStock").value);


products[index].description =
document.getElementById("editDescription").value;



localStorage.setItem(
"merchantProducts",
JSON.stringify(products)
);



alert("Product updated successfully");


window.location.href =
"merchant-products.html";


}

function editMerchantProduct(index){

let merchant =
JSON.parse(localStorage.getItem("merchant"));


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});


localStorage.setItem(
"editProduct",
JSON.stringify(myProducts[index])
);


window.location.href =
"merchant-edit-product.html";

}

// ================= INVENTORY STATUS =================


function getStockStatus(stock){


if(stock <= 0){

return "❌ Out of Stock";

}


if(stock <= 5){

return "⚠️ Low Stock";

}


return "✅ Available";


}

function changeStock(index, amount){

let merchant =
JSON.parse(localStorage.getItem("merchant"));


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});


let product =
myProducts[index];


let realIndex =
products.findIndex(function(item){

return item.id === product.id;

});


products[realIndex].stock += amount;


if(products[realIndex].stock < 0){

products[realIndex].stock = 0;

}


localStorage.setItem(
"merchantProducts",
JSON.stringify(products)
);


alert("Stock updated");


loadMerchantProducts();

}
