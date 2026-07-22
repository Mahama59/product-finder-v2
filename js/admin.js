alert("admin.js connected");


// ================= ADMIN LOGIN =================


function adminLogin(){


let email =
document.getElementById("adminEmail").value.trim();


let password =
document.getElementById("adminPassword").value;



if(
email === "admin@productfinder.com" &&
password === "admin123"
){


localStorage.setItem(
"adminLoggedIn",
"true"
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
