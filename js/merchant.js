alert("merchant.js connected");


// REGISTER MERCHANT

function registerMerchant(){


let name =
document.getElementById("merchantName").value.trim();


let email =
document.getElementById("merchantEmail").value.trim();


let phone =
document.getElementById("merchantPhone").value.trim();



if(!name || !email || !phone){

alert("Complete all fields");

return;

}



let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];



let exists =
merchants.find(function(m){

return m.email === email;

});



if(exists){

alert("Merchant already exists");

return;

}



let merchant = {

id:Date.now(),

name:name,

email:email,

phone:phone,

storeName:name+" Store"

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



alert("Store created successfully");


window.location.href="merchant-login.html";


}



// LOGIN MERCHANT


function merchantLogin(){


let email =
document.getElementById("merchantEmail").value.trim();



let phone =
document.getElementById("merchantPhone").value.trim();



let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];



let merchant =
merchants.find(function(m){

return m.email === email &&
m.phone === phone;

});



if(!merchant){

alert("Merchant account not found");

return;

}



localStorage.setItem(
"merchant",
JSON.stringify(merchant)
);



localStorage.setItem(
"merchantLoggedIn",
"true"
);



alert("Login successful");


window.location.href="../index.html";


}
