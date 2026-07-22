alert("merchant.js connected");


// ================= MERCHANT REGISTER =================

function registerMerchant(){

let name =
document.getElementById("merchantName").value.trim();

let email =
document.getElementById("merchantEmail").value.trim();

let phone =
document.getElementById("merchantPhone").value.trim();


if(!name || !email || !phone){

alert("Fill all fields");
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

status:"Approved"

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



alert("Merchant account created");


window.location.href =
"merchant-dashboard.html";


}




// ================= MERCHANT LOGIN =================


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

alert("Wrong details");

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
