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


<p>
💰 Price: $${product.price}
</p>


<p>
📂 Category: ${product.category}
</p>


<p>
🏪 Seller: ${product.merchantName}
</p>

<p>
⭐ Rating:
<span>
${getProductRating(product.id)}
</span>
</p>

<button onclick="openProduct(${product.id})">
👁 View Product
</button>

<button onclick="addToWishlistById(${product.id})">
❤️ Wishlist
</button>

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

function loadFeaturedProducts(){

let box =
document.getElementById("featuredProducts");


if(!box) return;


let products =
JSON.parse(localStorage.getItem("merchantProducts")) || [];


let approved =
products.filter(function(product){

return product.status === "Approved";

});


box.innerHTML="";


approved.slice(0,4).forEach(function(product){
if(approved.length === 0){

box.innerHTML =
"<p>No featured products yet.</p>";

return;

}

box.innerHTML += `

<div class="product">

<h3>${product.name}</h3>

<p>
💰 $${product.price}
</p>

<p>
🏪 ${product.merchantName}
</p>

<button onclick="window.location.href='pages/marketplace.html'">

View Product

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


<h3>
${product.name}
</h3>


<p>
💰 $${product.price}
</p>


<p>
📂 ${product.category}
</p>

<p>
⭐ Rating:
${getProductRating(product.id)}
</p>

<button onclick="openProduct(${product.id})">

👁 View Product

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
