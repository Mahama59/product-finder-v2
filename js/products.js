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

function loadMarketplaceProducts(){

let box =
document.getElementById("marketplaceProducts");


if(!box) return;



let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



console.log("Products:", products);



let approvedProducts =
products.filter(function(product){

return product.status === "Approved";

});



console.log("Approved:", approvedProducts);



box.innerHTML = "";



if(approvedProducts.length === 0){

box.innerHTML =
"<p>No approved products available.</p>";

return;

}



approvedProducts.forEach(function(product){


box.innerHTML += `

<div class="product">


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
🏪 Seller: ${product.merchantName}
</p>


<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.merchantEmail}'
)">

🛒 Add To Cart

</button>


</div>

`;



});


}
