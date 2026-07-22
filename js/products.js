alert("products.js connected");


// SAVE PRODUCT

function saveProduct(){


let merchant =
JSON.parse(localStorage.getItem("merchant"));



if(!merchant){

alert("Please login as merchant");

return;

}



let product = {


id:Date.now(),

name:
document.getElementById("productName").value,


price:
Number(document.getElementById("productPrice").value),


category:
document.getElementById("productCategory").value,


stock:
Number(document.getElementById("productStock").value),


description:
document.getElementById("productDescription").value,


merchantEmail:
merchant.email,


merchantName:
merchant.storeName


};



let products =
JSON.parse(localStorage.getItem("products")) || [];



products.push(product);



localStorage.setItem(
"products",
JSON.stringify(products)
);



alert("Product added successfully");


window.location.href="merchant-dashboard.html";


}




// LOAD DASHBOARD


function loadMerchantDashboard(){



let merchant =
JSON.parse(localStorage.getItem("merchant"));



if(!merchant){

alert("Please login");

return;

}



document.getElementById("merchantWelcome").innerText =
"Welcome "+merchant.storeName;



let products =
JSON.parse(localStorage.getItem("products")) || [];



let myProducts =
products.filter(function(product){

return product.merchantEmail === merchant.email;

});



document.getElementById("productCount").innerText =
myProducts.length;



let box =
document.getElementById("merchantProducts");



box.innerHTML="";



if(myProducts.length===0){

box.innerHTML=
"<p>No products added.</p>";

return;

}



myProducts.forEach(function(product){


box.innerHTML += `


<div class="card">


<h3>
${product.name}
</h3>


<p>
💰 Price: $${product.price}
</p>


<p>
📦 Stock: ${product.stock}
</p>


<p>
📂 Category: ${product.category}
</p>


</div>


`;


});



}
