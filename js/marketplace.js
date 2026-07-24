alert("marketplace.js connected");

// ================= LOAD MARKETPLACE =================

function loadMarketplaceProducts(){

let box = document.getElementById("marketplaceProducts");

if(!box) return;

let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];

let approvedProducts =
products.filter(function(product){

return product.status === "Approved";

});

box.innerHTML = "";

if(approvedProducts.length === 0){

box.innerHTML =
"<p>No approved products available.</p>";

return;

}

approvedProducts.forEach(function(product){

box.innerHTML += `

<div class="product">

<h3>${product.name}</h3>

<p>💰 Price: $${product.price}</p>

<p>📂 ${product.category}</p>

<p>🏪 Seller: ${product.merchantName}</p>

<p>⭐ ${getProductRating(product.id)}</p>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.merchantEmail}'
)">
🛒 Add To Cart
</button>

<button onclick="addToWishlistById(${product.id})">
❤️ Wishlist
</button>

</div>

`;

});

}

// ================= SEARCH =================

function searchProducts(){

let search =
document.getElementById("searchInput").value.toLowerCase();

let category =
document.getElementById("categoryFilter").value;

let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];

let approved =
products.filter(function(product){

return product.status === "Approved";

});

let results =
approved.filter(function(product){

let matchName =
product.name.toLowerCase().includes(search);

let matchCategory =
category === "" ||
product.category === category;

return matchName && matchCategory;

});

let box =
document.getElementById("marketplaceProducts");

box.innerHTML = "";

if(results.length === 0){

box.innerHTML =
"<p>No products found.</p>";

return;

}

results.forEach(function(product){

box.innerHTML += `

<div class="product">

<h3>${product.name}</h3>

<p>💰 Price: $${product.price}</p>

<p>📂 ${product.category}</p>

<p>🏪 Seller: ${product.merchantName}</p>

<p>⭐ ${getProductRating(product.id)}</p>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.merchantEmail}'
)">
🛒 Add To Cart
</button>

<button onclick="addToWishlistById(${product.id})">
❤️ Wishlist
</button>

</div>

`;

});

}
