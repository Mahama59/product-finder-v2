alert("products.js connected");


// ================= SAVE PRODUCT =================

function saveProduct(){

let merchant =
JSON.parse(localStorage.getItem("merchant"));


if(!merchant){

alert("Please login first");

return;

}



let name =
document.getElementById("productName").value.trim();


let price =
document.getElementById("productPrice").value;


let category =
document.getElementById("productCategory").value.trim();


let description =
document.getElementById("productDescription").value.trim();


let stock =
document.getElementById("productStock").value;



if(!name || !price || !category || !stock){

alert("Complete product details");

return;

}



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let product = {


id: Date.now(),

name:name,

price:Number(price),

category:category,

description:description,

stock:Number(stock),


image:
document.getElementById("imagePreview").src,


merchantEmail:
merchant.email,


merchantName:
merchant.storeName,


status:"Pending"


};



products.push(product);
localStorage.setItem(
"merchantProducts",
JSON.stringify(products)
);


alert("Product saved successfully");


window.location.href =
"merchant-dashboard.html";

}

function previewImage(event){

let file = event.target.files[0];

if(!file) return;


let reader = new FileReader();


reader.onload = function(e){

document.getElementById("imagePreview").src =
e.target.result;

};


reader.readAsDataURL(file);

}
