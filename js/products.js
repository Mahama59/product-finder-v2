alert("products.js connected");


// ================= SAVE PRODUCT =================

function saveProduct(){

let merchant =
JSON.parse(localStorage.getItem("merchant"));

if(merchant.status === "Suspended"){

alert("Your account is suspended. You cannot add products.");

return;

}
  
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
document.getElementById("imagePreview").src || 
"https://via.placeholder.com/250",


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


if(!file){

document.getElementById("imagePreview").src =
"https://via.placeholder.com/250";

return;

}


let reader = new FileReader();


reader.onload = function(e){

document.getElementById("imagePreview").src =
e.target.result;

};


reader.readAsDataURL(file);

}

function loadMarketplaceProducts(){

let box = document.getElementById("marketplaceProducts");

if(!box) {
    alert("Marketplace box not found");
    return;
}


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


alert("Marketplace products: " + products.length);


// ONLY SHOW APPROVED PRODUCTS
let approvedProducts =
products.filter(function(product){

return product.status === "Approved";

});


alert("Approved products: " + approvedProducts.length);


box.innerHTML = "";


approvedProducts.forEach(function(product){

console.log(product);


box.innerHTML += `

<div class="product">

<img 
src="${product.image || 'https://via.placeholder.com/250'}"
width="250">


<h3>${product.name}</h3>

<p class="price">
💰 $${product.price}
</p>

<p>
📂 Category:
${product.category}
</p>

<p>

🏪 Seller:

<a href="#"
onclick="openSellerStore('${product.merchantEmail}')">

${product.merchantName}

</a>

</p>

<a href="compare.html">

⚖️ Compare

</a>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

<button onclick="addToCart(
'${product.name.replace(/'/g,"\\'")}',
${product.price},
'${product.merchantEmail}'
)">
🛒 Add To Cart
</button>

<button onclick="addToCompare(${product.id})">

⚖️ Compare

</button>

</div>

`;

});

}

  
function openProduct(id){

let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let product =
products.find(function(p){

return p.id == id;

});


if(product){

localStorage.setItem(
"selectedProduct",
JSON.stringify(product)
);


window.location.href =
"product-details.html";

}

}

// ================= LOAD PRODUCT DETAILS =================

function loadProductDetails(){

let product =
JSON.parse(localStorage.getItem("selectedProduct"));


if(!product){

alert("Product not found");

return;

}


let image =
document.getElementById("productImage");

let name =
document.getElementById("productName");

let price =
document.getElementById("productPrice");

let seller =
document.getElementById("productSeller");

let category =
document.getElementById("productCategory");

let description =
document.getElementById("productDescription");


if(image){

image.src = product.image;

}


if(name){

name.innerText = product.name;

}


if(price){

price.innerText = product.price;

}


if(seller){

seller.innerText = product.merchantName;

}


if(category){

category.innerText = product.category;

}


if(description){

description.innerText = product.description;

}

loadReviews();
}



// ================= ADD CURRENT PRODUCT TO CART =================

function addCurrentProductToCart(){

let product =
JSON.parse(localStorage.getItem("selectedProduct"));


if(!product){

return;

}


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


cart.push({

id: product.id,

name: product.name,

price: product.price,

quantity:1,

merchantEmail:product.merchantEmail

});


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


alert("Added to cart 🛒");


}



// ================= SUBMIT REVIEW =================

function submitReview(){

let product =
JSON.parse(localStorage.getItem("selectedProduct"));


let reviews =
JSON.parse(localStorage.getItem("reviews")) || [];


let review = {


id:Date.now(),

productId:product.id,

productName:product.name,

name:
document.getElementById("reviewName").value,


text:
document.getElementById("reviewText").value,


rating:
Number(document.getElementById("reviewRating").value)


};


reviews.push(review);


localStorage.setItem(
"reviews",
JSON.stringify(reviews)
);


alert("Review submitted ⭐");


loadReviews();

}



// ================= LOAD REVIEWS =================

function loadReviews(){

let product =
JSON.parse(localStorage.getItem("selectedProduct"));


let reviewsBox =
document.getElementById("reviews");


let ratingBox =
document.getElementById("averageRating");


if(!product || !reviewsBox){

return;

}


let reviews =
JSON.parse(localStorage.getItem("reviews")) || [];


let productReviews =
reviews.filter(function(review){

return review.productId == product.id;

});


reviewsBox.innerHTML="";


let total = 0;


productReviews.forEach(function(review){


total += Number(review.rating);


reviewsBox.innerHTML += `

<div class="product">

<h3>
${review.name}
</h3>


<p>
${review.text}
</p>


<p>
${"⭐".repeat(review.rating)}
</p>


</div>

`;

});


if(productReviews.length > 0){

ratingBox.innerText =
(total / productReviews.length).toFixed(1)
+ " ⭐";

}
else{

ratingBox.innerText =
"No ratings yet";

}


}

// ================= SEARCH PRODUCTS =================

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
product.name.toLowerCase()
.includes(search);



let matchCategory =
category === "" ||
product.category === category;



return matchName && matchCategory;


});



let box =
document.getElementById("marketplaceProducts");


box.innerHTML="";



if(results.length===0){

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

function addToWishlistById(id){

let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];

let product =
products.find(function(item){

return item.id == id;

});

if(!product){

return;

}

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

let exists =
wishlist.find(function(item){

return item.id == id;

});

if(exists){

alert("Already in wishlist ❤️");

return;

}

wishlist.push(product);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

alert("Added to wishlist ❤️");

}

// ================= LOAD WISHLIST =================

function loadWishlist(){

let box =
document.getElementById("wishlistItems");

if(!box) return;

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

box.innerHTML = "";

if(wishlist.length === 0){

box.innerHTML =
"<p>Your wishlist is empty ❤️</p>";

return;

}

wishlist.forEach(function(product,index){

box.innerHTML += `

<div class="product">

<h3>${product.name}</h3>

<p>💰 $${product.price}</p>

<p>🏪 ${product.merchantName}</p>

<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.merchantEmail}'
)">
🛒 Add To Cart
</button>

<button onclick="removeWishlist(${index})">
❌ Remove
</button>

</div>

`;

});

}



// ================= REMOVE WISHLIST =================

function removeWishlist(index){

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

wishlist.splice(index,1);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

loadWishlist();

}

// ================= PRODUCT RATING =================


function getProductRating(productId){

let reviews =
JSON.parse(localStorage.getItem("reviews")) || [];


let productReviews =
reviews.filter(function(review){

return review.productId == productId;

});


if(productReviews.length === 0){

return "No ratings yet";

}


let total = 0;


productReviews.forEach(function(review){

total += Number(review.rating);

});


let average =
total / productReviews.length;


return average.toFixed(1) + " ⭐ (" 
+ productReviews.length 
+ " reviews)";

}

// ================= RECOMMENDATION ENGINE =================

function loadRecommendations(){


let currentProduct =
JSON.parse(localStorage.getItem("selectedProduct"));


let box =
document.getElementById("recommendations");


if(!box || !currentProduct){

return;

}


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];



let recommended =
products.filter(function(product){


return (

product.status === "Approved" &&

product.category === currentProduct.category &&

product.id !== currentProduct.id

);


});



box.innerHTML="";



if(recommended.length === 0){

box.innerHTML =
"<p>No recommendations yet.</p>";

return;

}



recommended.slice(0,4)
.forEach(function(product){


box.innerHTML += `

<div class="product">

<h3>
${product.name}
</h3>


<p>
💰 $${product.price}
</p>


<p>
🏪 ${product.merchantName}
</p>


<p>
⭐ ${getProductRating(product.id)}
</p>


<button onclick="openProduct(${product.id})">

View Product

</button>


</div>

`;


});


}


// ================= FEATURED PRODUCTS =================
function loadFeaturedProducts(){

let box = document.getElementById("featuredProducts");

if(!box){
    alert("featuredProducts box missing");
    return;
}


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let approvedProducts =
products.filter(function(product){

return product.status === "Approved";

});


box.innerHTML = "";


if(approvedProducts.length === 0){

box.innerHTML = "<p>No approved products.</p>";
return;

}


approvedProducts.slice(0,4).forEach(function(product){

box.innerHTML += `

<div class="product">

<img src="${product.image || 'https://via.placeholder.com/250'}"
width="250"
height="250">

<h3>${product.name}</h3>

<p>💰 $${product.price}</p>

<p>📂 ${product.category}</p>

<p>🏪 ${product.merchantName}</p>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

</div>

`;

});


}


// ================= OPEN SELLER STORE =================

function openSellerStore(merchantEmail){

let merchants =
JSON.parse(localStorage.getItem("merchants")) || [];


let merchant =
merchants.find(function(item){

return item.email === merchantEmail;

});


if(!merchant){

alert("Seller not found");

return;

}


localStorage.setItem(
"selectedSeller",
JSON.stringify(merchant)
);


window.location.href =
"seller-store.html";

}



// ================= LOAD SELLER STORE =================

function loadSellerStore(){

let seller =
JSON.parse(localStorage.getItem("selectedSeller"));


if(!seller){

alert("Seller not found");

window.location.href="marketplace.html";

return;

}


document.getElementById("storeName").innerText =
"🏪 " + seller.storeName;


document.getElementById("storeInfo").innerText =
"Seller: " + seller.name;


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let sellerProducts =
products.filter(function(product){

return product.merchantEmail === seller.email &&
product.status === "Approved";

});


let box =
document.getElementById("sellerProducts");


box.innerHTML = "";


if(sellerProducts.length === 0){

box.innerHTML =
"<p>No products available.</p>";

return;

}


sellerProducts.forEach(function(product){

box.innerHTML += `

<div class="product">

<img
src="${product.image || 'https://via.placeholder.com/250'}"
width="250"
height="250">

<h3>${product.name}</h3>

<p>💰 $${product.price}</p>

<p>📂 ${product.category}</p>

<p>⭐ ${getProductRating(product.id)}</p>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

<button onclick="addToCart(
'${product.name.replace(/'/g,"\\'")}',
${product.price},
'${product.merchantEmail}'
)">
🛒 Add To Cart
</button>

</div>

`;

});

}

// ================= PRODUCT COMPARISON =================

function addToCompare(productId){

let compare =
JSON.parse(localStorage.getItem("compareProducts")) || [];


if(compare.includes(productId)){

alert("Product already selected.");

return;

}


if(compare.length >= 4){

alert("You can compare up to 4 products.");

return;

}


compare.push(productId);


localStorage.setItem(
"compareProducts",
JSON.stringify(compare)
);


alert("Product added for comparison.");

}


function loadComparison(){

let compare =
JSON.parse(localStorage.getItem("compareProducts")) || [];


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let selected =
products.filter(function(product){

return compare.includes(product.id);

});


let box =
document.getElementById("comparisonTable");


if(!box) return;


if(selected.length === 0){

box.innerHTML =
"<p>No products selected for comparison.</p>";

return;

}


let html = `
<table border="1" cellpadding="10">

<tr>

<th>Feature</th>
`;


selected.forEach(function(product){

html += `<th>${product.name}</th>`;

});


html += "</tr>";


function row(title,key){

html += `<tr><td><b>${title}</b></td>`;


selected.forEach(function(product){

html += `<td>${product[key] || "-"}</td>`;

});


html += "</tr>";

}


row("Price","price");

row("Category","category");

row("Seller","merchantName");

row("Stock","stock");

row("Description","description");


html += "</table>";


box.innerHTML = html;

}


function clearComparison(){

localStorage.removeItem("compareProducts");

alert("Comparison cleared.");

window.location.reload();

}
