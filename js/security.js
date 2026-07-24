alert("security.js connected");


// ================= CHECK LOGIN =================

function requireLogin(){

let user =
localStorage.getItem("user");


if(!user){

alert("Please login first");

window.location.href="login.html";

}

}



// ================= CHECK ADMIN =================

function requireAdmin(){

let admin =
localStorage.getItem("adminLoggedIn");


if(!admin){

alert("Admin access only");

window.location.href="admin-login.html";

}

}



// ================= CHECK MERCHANT =================

function requireMerchant(){


let merchant =
JSON.parse(localStorage.getItem("merchant"));


if(!merchant){

alert("Merchant login required");

window.location.href="merchant-login.html";

return;

}



if(merchant.status === "Suspended"){


alert("Your merchant account is suspended");


window.location.href="../index.html";


}
