alert("admin.js connected");


// ================= ADMIN LOGIN =================
function adminLogin(){

let email =
document.getElementById("adminEmail").value.trim();

let password =
document.getElementById("adminPassword").value;


let admins =
JSON.parse(localStorage.getItem("admins")) || [];


let admin =
admins.find(function(a){

return a.email === email &&
a.password === password;

});


if(admin){

localStorage.setItem(
"adminLoggedIn",
"true"
);


localStorage.setItem(
"currentAdmin",
JSON.stringify(admin)
);


alert("Admin login successful");


window.location.href =
"admin-dashboard.html";

}

else{

alert("Incorrect admin details");

}

}


// ================= ADMIN PROTECTION =================


function protectAdmin(){


let admin =
localStorage.getItem("adminLoggedIn");


if(!admin){


alert("Please login as admin");


window.location.href =
"admin-login.html";


}


}

// ================= ADMIN DASHBOARD =================


function loadAdminDashboard(){


let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let pending =
products.filter(function(product){

return product.status === "Pending";

});



let merchantBox =
document.getElementById("merchantCount");


let productBox =
document.getElementById("productCount");


let pendingBox =
document.getElementById("pendingCount");



if(merchantBox){

merchantBox.innerText =
merchants.length;

}


if(productBox){

productBox.innerText =
products.length;

}


if(pendingBox){

pendingBox.innerText =
pending.length;

}


}



// ================= ADMIN LOGOUT =================


function adminLogout(){


localStorage.removeItem(
"adminLoggedIn"
);


alert("Admin logged out");


window.location.href =
"admin-login.html";


}

// ================= ADMIN PRODUCTS =================


function loadAdminProducts(){


let box =
document.getElementById("adminProducts");


if(!box) return;



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



box.innerHTML = "";



if(products.length === 0){


box.innerHTML =
"<p>No products found.</p>";


return;


}



products.forEach(function(product,index){



box.innerHTML += `


<div class="product">


<img 
src="${product.image || ''}"
width="200">


<h3>
${product.name}
</h3>


<p>
💰 Price: $${product.price}
</p>


<p>
🏪 Seller:
${product.merchantName}
</p>


<p>
📂 Category:
${product.category}
</p>


<p>
Status:
${product.status}
</p>



<button onclick="approveProduct(${index})">

✅ Approve

</button>



<button onclick="rejectProduct(${index})">

❌ Reject

</button>



</div>



`;



});


}




// ================= APPROVE PRODUCT =================


function approveProduct(index){


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



products[index].status =
"Approved";



localStorage.setItem(
"merchantProducts",
JSON.stringify(products)
);



alert("Product approved");


loadAdminProducts();


}





// ================= REJECT PRODUCT =================


function rejectProduct(index){


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



products[index].status =
"Rejected";



localStorage.setItem(
"merchantProducts",
JSON.stringify(products)
);



alert("Product rejected");


loadAdminProducts();


}

// ================= ADMIN REGISTER =================

function registerAdmin(){


let name =
document.getElementById("adminName").value.trim();


let email =
document.getElementById("adminEmail").value.trim();


let password =
document.getElementById("adminPassword").value;



if(!name || !email || !password){

alert("Complete all fields");

return;

}



let admins =
JSON.parse(localStorage.getItem("admins")) || [];



let exists =
admins.find(function(admin){

return admin.email === email;

});



if(exists){

alert("Admin already exists");

return;

}



let admin = {


id: Date.now(),

name:name,

email:email,

password:password


};



admins.push(admin);



localStorage.setItem(
"admins",
JSON.stringify(admins)
);



alert("Admin account created successfully");



window.location.href =
"admin-login.html";


}

function loadAdminStats(){

let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];


let users =
JSON.parse(localStorage.getItem("users")) || [];


let orders =
JSON.parse(localStorage.getItem("orders")) || [];


let productBox =
document.getElementById("adminProducts");

let merchantBox =
document.getElementById("adminMerchants");

let customerBox =
document.getElementById("adminCustomers");

let orderBox =
document.getElementById("adminOrders");


if(productBox){

productBox.innerText = products.length;

}


if(merchantBox){

merchantBox.innerText = merchants.length;

}


if(customerBox){

customerBox.innerText = users.length;

}


if(orderBox){

orderBox.innerText = orders.length;

}

}

function loadAdminOrders(){

let orders =
JSON.parse(localStorage.getItem("orders")) || [];


let box =
document.getElementById("adminOrdersList");


if(!box) return;


box.innerHTML = "";


if(orders.length === 0){

box.innerHTML =
"<p>No orders yet.</p>";

return;

}


orders.forEach(function(order){


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
💰 Total:
$${order.total}
</p>


<p>
📦 Status:
${order.status}
</p>


<p>
📅 ${order.date}
</p>


<button onclick="adminUpdateOrder(${order.id},'Approved')">

Approve

</button>


<button onclick="adminUpdateOrder(${order.id},'Completed')">

Complete

</button>


</div>

`;

});

}

function adminUpdateOrder(id,status){

let orders =
JSON.parse(localStorage.getItem("orders")) || [];


orders.forEach(function(order){

if(order.id === id){

order.status = status;

}

});


localStorage.setItem(
"orders",
JSON.stringify(orders)
);


loadAdminOrders();

}
