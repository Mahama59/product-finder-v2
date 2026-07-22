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
