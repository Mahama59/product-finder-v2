// ============================================
// PRODUCT FINDER - PRODUCTS.JS
// Products, Marketplace, Search, Wishlist,
// Reviews, Seller Store, Recommendations,
// Product Comparison and Product Details
// ============================================

console.log("products.js loaded");


// ============================================
// STORAGE HELPERS
// ============================================

function getStoredProducts() {
    try {
        return JSON.parse(
            localStorage.getItem("merchantProducts")
        ) || [];
    } catch (error) {
        console.error("Could not read products:", error);
        return [];
    }
}

function saveStoredProducts(products) {
    localStorage.setItem(
        "merchantProducts",
        JSON.stringify(products)
    );
}

function getStoredReviews() {
    try {
        return JSON.parse(
            localStorage.getItem("reviews")
        ) || [];
    } catch (error) {
        console.error("Could not read reviews:", error);
        return [];
    }
}


// ============================================
// SAVE PRODUCT
// ============================================

function saveProduct() {

    const merchant = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("merchant")
            );
        } catch (error) {
            return null;
        }
    })();

    if (!merchant) {
        alert("Please login first.");
        return;
    }

    if (merchant.status === "Suspended") {
        alert(
            "Your account is suspended. You cannot add products."
        );
        return;
    }

    const name =
        document.getElementById("productName")
        ?.value
        .trim();

    const price =
        document.getElementById("productPrice")
        ?.value;

    const category =
        document.getElementById("productCategory")
        ?.value
        .trim();

    const description =
        document.getElementById("productDescription")
        ?.value
        .trim() || "";

    const stock =
        document.getElementById("productStock")
        ?.value;

    if (
        !name ||
        price === "" ||
        !category ||
        stock === ""
    ) {
        alert("Complete product details.");
        return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
    ) {
        alert("Enter a valid price.");
        return;
    }

    if (
        !Number.isFinite(numericStock) ||
        numericStock < 0
    ) {
        alert("Enter a valid stock quantity.");
        return;
    }

    const imageElement =
        document.getElementById("imagePreview");

    const image =
        imageElement?.src ||
        "https://via.placeholder.com/250";

    const products =
        getStoredProducts();

    const product = {
        id: Date.now(),
        name: name,
        price: numericPrice,
        category: category,
        description: description,
        stock: numericStock,
        image: image,
        merchantEmail: merchant.email,
        merchantName:
            merchant.storeName ||
            merchant.name ||
            "Seller",
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    products.push(product);

    saveStoredProducts(products);

    alert(
        "Product saved successfully and sent for approval."
    );

    window.location.href =
        "merchant-dashboard.html";
}


// ============================================
// IMAGE PREVIEW
// ============================================

function previewImage(event) {

    const preview =
        document.getElementById("imagePreview");

    if (!preview) {
        return;
    }

    const file =
        event?.target?.files?.[0];

    if (!file) {
        preview.src =
            "https://via.placeholder.com/250";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        preview.src =
            "https://via.placeholder.com/250";
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
    };

    reader.onerror = function() {
        preview.src =
            "https://via.placeholder.com/250";
        alert("Could not load the selected image.");
    };

    reader.readAsDataURL(file);
}


// ============================================
// PRODUCT CARD
// ============================================

function createProductCard(product, options = {}) {

    const showChat =
        options.showChat !== false;

    const showCompare =
        options.showCompare === true;

    const showWishlist =
        options.showWishlist !== false;

    const card =
        document.createElement("div");

    card.className = "product";

    const image =
        document.createElement("img");

    image.src =
        product.image ||
        "https://via.placeholder.com/250";

    image.alt =
        product.name || "Product";

    const title =
        document.createElement("h3");

    title.textContent =
        product.name || "Unnamed Product";

    const price =
        document.createElement("p");

    price.className = "price";
    price.textContent =
        "💰 $" +
        Number(product.price || 0).toFixed(2);

    const category =
        document.createElement("p");

    category.textContent =
        "📂 " + (product.category || "-");

    const seller =
        document.createElement("p");

    seller.innerHTML = "🏪 Seller: ";

    const sellerLink =
        document.createElement("a");

    sellerLink.href = "#";
    sellerLink.className = "seller-link";
    sellerLink.textContent =
        product.merchantName || "Seller";

    sellerLink.addEventListener(
        "click",
        function(event) {
            event.preventDefault();
            openSellerStore(
                product.merchantEmail
            );
        }
    );

    seller.appendChild(sellerLink);

    const status =
        document.createElement("p");

    if (
        typeof getSellerStatus === "function"
    ) {
        status.textContent =
            getSellerStatus(
                product.merchantEmail
            );
    }

    const rating =
        document.createElement("p");

    rating.className = "rating";
    rating.textContent =
        "⭐ " +
        getProductRating(product.id);

    const stock =
        document.createElement("p");

    const stockNumber =
        Number(product.stock || 0);

    stock.className = "stock";

    if (stockNumber <= 0) {
        stock.textContent =
            "❌ Out of Stock";
    } else if (stockNumber <= 5) {
        stock.textContent =
            "⚠️ Low Stock";
    } else {
        stock.textContent =
            "✅ In Stock";
    }

    const viewButton =
        document.createElement("button");

    viewButton.textContent =
        "👁 View Product";

    viewButton.addEventListener(
        "click",
        function() {
            openProduct(product.id);
        }
    );

    const cartButton =
        document.createElement("button");

    cartButton.textContent =
        "🛒 Add To Cart";

    cartButton.addEventListener(
        "click",
        function() {

            if (
                typeof addToCart !== "function"
            ) {
                alert("Cart system is unavailable.");
                return;
            }

            if (stockNumber <= 0) {
                alert("This product is out of stock.");
                return;
            }

            addToCart(
                product.name,
                product.price,
                product.merchantEmail
            );
        }
    );

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(category);
    card.appendChild(seller);
    card.appendChild(status);
    card.appendChild(rating);
    card.appendChild(stock);
    card.appendChild(viewButton);
    card.appendChild(cartButton);

    if (showWishlist) {

        const wishlistButton =
            document.createElement("button");

        wishlistButton.textContent =
            "❤️ Wishlist";

        wishlistButton.addEventListener(
            "click",
            function() {
                addToWishlistById(
                    product.id
                );
            }
        );

        card.appendChild(wishlistButton);
    }

    if (showChat) {

        const chatButton =
            document.createElement("button");

        chatButton.textContent =
            "💬 Chat with Seller";

        chatButton.addEventListener(
            "click",
            function() {

                if (
                    typeof openChat !== "function"
                ) {
                    alert("Chat system is unavailable.");
                    return;
                }

                openChat(
                    product.merchantEmail,
                    product.id
                );
            }
        );

        card.appendChild(chatButton);
    }

    if (showCompare) {

        const compareButton =
            document.createElement("button");

        compareButton.textContent =
            "⚖️ Compare";

        compareButton.addEventListener(
            "click",
            function() {
                addToCompare(
                    product.id
                );
            }
        );

        card.appendChild(compareButton);
    }

    return card;
}


// ============================================
// MARKETPLACE
// ============================================

function loadMarketplaceProducts() {

    const box =
        document.getElementById("marketplaceProducts");

    if (!box) {
        alert("Marketplace container not found");
        return;
    }

    let products = [];

    try {
        products =
            JSON.parse(
                localStorage.getItem("merchantProducts")
            ) || [];
    } catch (error) {
        alert("Cannot read merchantProducts");
        return;
    }

    alert("Products found: " + products.length);

    const approved =
        products.filter(function(product) {
            return String(product.status).trim() === "Approved";
        });

    alert("Approved: " + approved.length);

    box.innerHTML = "";

    if (approved.length === 0) {
        box.innerHTML =
            "<p>No approved products found.</p>";
        return;
    }

    approved.forEach(function(product) {

        const div =
            document.createElement("div");

        div.className = "product";

        div.innerHTML = `
            <h3>${product.name || "Product"}</h3>
            <p>💰 Price: $${product.price || 0}</p>
            <p>📂 Category: ${product.category || "-"}</p>
            <p>🏪 Seller: ${product.merchantName || "-"}</p>
            <p>📦 Status: ${product.status || "-"}</p>
        `;

        box.appendChild(div);
    });
}

// ============================================
// SEARCH
// ============================================

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const box =
        document.getElementById(
            "marketplaceProducts"
        );

    if (!searchInput || !categoryFilter || !box) {
        return;
    }

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const category =
        categoryFilter.value;

    const products =
        getStoredProducts();

    const results =
        products.filter(function(product) {

            if (
                product.status !== "Approved"
            ) {
                return false;
            }

            const name =
                String(product.name || "")
                    .toLowerCase();

            const matchesName =
                name.includes(search);

            const matchesCategory =
                category === "" ||
                product.category === category;

            return (
                matchesName &&
                matchesCategory
            );
        });

    box.innerHTML = "";

    if (results.length === 0) {
        box.innerHTML =
            "<p>No products found.</p>";
        return;
    }

    results.forEach(function(product) {

        box.appendChild(
            createProductCard(product, {
                showChat: true,
                showWishlist: true,
                showCompare: true
            })
        );
    });
}


// ============================================
// FEATURED PRODUCTS
// ============================================

function loadFeaturedProducts() {

    const box =
        document.getElementById(
            "featuredProducts"
        );

    if (!box) {
        return;
    }

    const products =
        getStoredProducts();

    const approvedProducts =
        products.filter(function(product) {
            return product.status === "Approved";
        });

    box.innerHTML = "";

    if (approvedProducts.length === 0) {
        box.innerHTML =
            "<p>No featured products available yet.</p>";
        return;
    }

    approvedProducts
        .slice(0, 4)
        .forEach(function(product) {

            box.appendChild(
                createProductCard(product, {
                    showChat: true,
                    showWishlist: true,
                    showCompare: true
                })
            );
        });
}


// ============================================
// OPEN PRODUCT
// ============================================

function openProduct(id) {

    const products =
        getStoredProducts();

    const product =
        products.find(function(item) {
            return item.id == id;
        });

    if (!product) {
        alert("Product not found.");
        return;
    }

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    window.location.href =
        "product-details.html";
}


// ============================================
// PRODUCT DETAILS
// ============================================

function loadProductDetails() {

    let product = null;

    try {
        product =
            JSON.parse(
                localStorage.getItem(
                    "selectedProduct"
                )
            );
    } catch (error) {
        product = null;
    }

    if (!product) {
        alert("Product not found.");
        return;
    }

    const image =
        document.getElementById(
            "productImage"
        );

    const name =
        document.getElementById(
            "productName"
        );

    const price =
        document.getElementById(
            "productPrice"
        );

    const seller =
        document.getElementById(
            "productSeller"
        );

    const category =
        document.getElementById(
            "productCategory"
        );

    const description =
        document.getElementById(
            "productDescription"
        );

    if (image) {
        image.src =
            product.image ||
            "https://via.placeholder.com/250";
    }

    if (name) {
        name.innerText =
            product.name || "";
    }

    if (price) {
        price.innerText =
            Number(product.price || 0).toFixed(2);
    }

    if (seller) {
        seller.innerText =
            product.merchantName || "";
    }

    if (category) {
        category.innerText =
            product.category || "";
    }

    if (description) {
        description.innerText =
            product.description || "";
    }

    loadReviews();

    if (
        typeof loadRecommendations === "function"
    ) {
        loadRecommendations();
    }
}


// ============================================
// ADD CURRENT PRODUCT TO CART
// ============================================

function addCurrentProductToCart() {

    const product =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );

    if (!product) {
        alert("Product not found.");
        return;
    }

    if (Number(product.stock || 0) <= 0) {
        alert("This product is out of stock.");
        return;
    }

    if (
        typeof addToCart !== "function"
    ) {
        alert("Cart system is unavailable.");
        return;
    }

    addToCart(
        product.name,
        product.price,
        product.merchantEmail
    );
}


// ============================================
// REVIEWS
// ============================================

function submitReview() {

    const product =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const name =
        document.getElementById("reviewName")
        ?.value
        .trim();

    const text =
        document.getElementById("reviewText")
        ?.value
        .trim();

    const rating =
        Number(
            document.getElementById(
                "reviewRating"
            )?.value
        );

    if (!name || !text || !rating) {
        alert("Please complete the review.");
        return;
    }

    const reviews =
        getStoredReviews();

    reviews.push({
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        name: name,
        text: text,
        rating: rating,
        createdAt:
            new Date().toISOString()
    });

    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );

    alert("Review submitted ⭐");

    const reviewName =
        document.getElementById(
            "reviewName"
        );

    const reviewText =
        document.getElementById(
            "reviewText"
        );

    if (reviewName) {
        reviewName.value = "";
    }

    if (reviewText) {
        reviewText.value = "";
    }

    loadReviews();
}


function loadReviews() {

    const product =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );

    const reviewsBox =
        document.getElementById(
            "reviews"
        );

    const ratingBox =
        document.getElementById(
            "averageRating"
        );

    if (
        !product ||
        !reviewsBox
    ) {
        return;
    }

    const reviews =
        getStoredReviews();

    const productReviews =
        reviews.filter(function(review) {
            return review.productId == product.id;
        });

    reviewsBox.innerHTML = "";

    if (productReviews.length === 0) {

        reviewsBox.innerHTML =
            "<p>No reviews yet.</p>";

        if (ratingBox) {
            ratingBox.innerText =
                "No ratings yet";
        }

        return;
    }

    let total = 0;

    productReviews.forEach(function(review) {

        total += Number(
            review.rating || 0
        );

        const reviewElement =
            document.createElement("div");

        reviewElement.className =
            "product";

        const title =
            document.createElement("h3");

        title.textContent =
            review.name || "Customer";

        const text =
            document.createElement("p");

        text.textContent =
            review.text || "";

        const rating =
            document.createElement("p");

        rating.textContent =
            "⭐".repeat(
                Math.max(
                    1,
                    Math.min(
                        5,
                        Number(review.rating || 0)
                    )
                )
            );

        reviewElement.appendChild(title);
        reviewElement.appendChild(text);
        reviewElement.appendChild(rating);

        reviewsBox.appendChild(
            reviewElement
        );
    });

    if (ratingBox) {

        ratingBox.innerText =
            (
                total /
                productReviews.length
            ).toFixed(1) + " ⭐";
    }
}


// ============================================
// PRODUCT RATING
// ============================================

function getProductRating(productId) {

    const reviews =
        getStoredReviews();

    const productReviews =
        reviews.filter(function(review) {
            return review.productId == productId;
        });

    if (productReviews.length === 0) {
        return "No ratings yet";
    }

    const total =
        productReviews.reduce(
            function(sum, review) {
                return (
                    sum +
                    Number(review.rating || 0)
                );
            },
            0
        );

    const average =
        total /
        productReviews.length;

    return (
        average.toFixed(1) +
        " ⭐ (" +
        productReviews.length +
        " reviews)"
    );
}


// ============================================
// WISHLIST
// ============================================

function addToWishlistById(id) {

    const products =
        getStoredProducts();

    const product =
        products.find(function(item) {
            return item.id == id;
        });

    if (!product) {
        alert("Product not found.");
        return;
    }

    let wishlist = [];

    try {
        wishlist =
            JSON.parse(
                localStorage.getItem(
                    "wishlist"
                )
            ) || [];
    } catch (error) {
        wishlist = [];
    }

    const exists =
        wishlist.some(function(item) {
            return item.id == id;
        });

    if (exists) {
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


function addToWishlist(product) {

    if (!product) {
        return;
    }

    addToWishlistById(product.id);
}


function loadWishlist() {

    const box =
        document.getElementById(
            "wishlistItems"
        );

    if (!box) {
        return;
    }

    let wishlist = [];

    try {
        wishlist =
            JSON.parse(
                localStorage.getItem(
                    "wishlist"
                )
            ) || [];
    } catch (error) {
        wishlist = [];
    }

    box.innerHTML = "";

    if (wishlist.length === 0) {
        box.innerHTML =
            "<p>Your wishlist is empty ❤️</p>";
        return;
    }

    wishlist.forEach(function(product, index) {

        const card =
            createProductCard(product, {
                showChat: false,
                showWishlist: false,
                showCompare: false
            });

        const removeButton =
            document.createElement("button");

        removeButton.textContent =
            "❌ Remove";

        removeButton.addEventListener(
            "click",
            function() {
                removeWishlist(index);
            }
        );

        card.appendChild(removeButton);

        box.appendChild(card);
    });
}


function removeWishlist(index) {

    let wishlist = [];

    try {
        wishlist =
            JSON.parse(
                localStorage.getItem(
                    "wishlist"
                )
            ) || [];
    } catch (error) {
        wishlist = [];
    }

    wishlist.splice(index, 1);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    loadWishlist();
}


// ============================================
// RECOMMENDATIONS
// ============================================

function loadRecommendations() {

    const currentProduct =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );

    const box =
        document.getElementById(
            "recommendations"
        );

    if (
        !currentProduct ||
        !box
    ) {
        return;
    }

    const products =
        getStoredProducts();

    const recommended =
        products.filter(function(product) {

            return (
                product.status === "Approved" &&
                product.category ===
                    currentProduct.category &&
                product.id !==
                    currentProduct.id
            );
        });

    box.innerHTML = "";

    if (recommended.length === 0) {
        box.innerHTML =
            "<p>No recommendations yet.</p>";
        return;
    }

    recommended
        .slice(0, 4)
        .forEach(function(product) {

            box.appendChild(
                createProductCard(product, {
                    showChat: true,
                    showWishlist: true,
                    showCompare: true
                })
            );
        });
}


// ============================================
// SELLER STORE
// ============================================

function openSellerStore(merchantEmail) {

    let merchants = [];

    try {
        merchants =
            JSON.parse(
                localStorage.getItem(
                    "merchants"
                )
            ) || [];
    } catch (error) {
        merchants = [];
    }

    const merchant =
        merchants.find(function(item) {
            return (
                item.email ===
                merchantEmail
            );
        });

    if (!merchant) {
        alert("Seller not found.");
        return;
    }

    localStorage.setItem(
        "selectedSeller",
        JSON.stringify(merchant)
    );

    window.location.href =
        "seller-store.html";
}


function loadSellerStore() {

    const seller =
        JSON.parse(
            localStorage.getItem(
                "selectedSeller"
            )
        );

    if (!seller) {
        alert("Seller not found.");
        window.location.href =
            "marketplace.html";
        return;
    }

    const storeName =
        document.getElementById(
            "storeName"
        );

    const storeInfo =
        document.getElementById(
            "storeInfo"
        );

    const box =
        document.getElementById(
            "sellerProducts"
        );

    if (storeName) {
        storeName.innerText =
            "🏪 " +
            (
                seller.storeName ||
                seller.name ||
                "Seller Store"
            );
    }

    if (storeInfo) {
        storeInfo.innerText =
            "Seller: " +
            (seller.name || "-");
    }

    if (!box) {
        return;
    }

    const products =
        getStoredProducts();

    const sellerProducts =
        products.filter(function(product) {

            return (
                product.merchantEmail ===
                    seller.email &&
                product.status ===
                    "Approved"
            );
        });

    box.innerHTML = "";

    if (sellerProducts.length === 0) {
        box.innerHTML =
            "<p>No products available.</p>";
        return;
    }

    sellerProducts.forEach(function(product) {

        box.appendChild(
            createProductCard(product, {
                showChat: true,
                showWishlist: true,
                showCompare: true
            })
        );
    });
}


// ============================================
// PRODUCT COMPARISON
// ============================================

function addToCompare(productId) {

    let compare = [];

    try {
        compare =
            JSON.parse(
                localStorage.getItem(
                    "compareProducts"
                )
            ) || [];
    } catch (error) {
        compare = [];
    }

    const numericId =
        Number(productId);

    if (compare.includes(numericId)) {
        alert(
            "Product already selected."
        );
        return;
    }

    if (compare.length >= 4) {
        alert(
            "You can compare up to 4 products."
        );
        return;
    }

    compare.push(numericId);

    localStorage.setItem(
        "compareProducts",
        JSON.stringify(compare)
    );

    alert(
        "Product added for comparison."
    );
}


function loadComparison() {

    let compare = [];

    try {
        compare =
            JSON.parse(
                localStorage.getItem(
                    "compareProducts"
                )
            ) || [];
    } catch (error) {
        compare = [];
    }

    const products =
        getStoredProducts();

    const selected =
        products.filter(function(product) {

            return compare.some(function(id) {
                return Number(id) ===
                    Number(product.id);
            });
        });

    const box =
        document.getElementById(
            "comparisonTable"
        );

    if (!box) {
        return;
    }

    if (selected.length === 0) {
        box.innerHTML =
            "<p>No products selected for comparison.</p>";
        return;
    }

    const table =
        document.createElement("table");

    table.border = "1";
    table.cellPadding = "10";

    const header =
        document.createElement("tr");

    const featureHeader =
        document.createElement("th");

    featureHeader.textContent =
        "Feature";

    header.appendChild(
        featureHeader
    );

    selected.forEach(function(product) {

        const th =
            document.createElement("th");

        th.textContent =
            product.name;

        header.appendChild(th);
    });

    table.appendChild(header);

    function addRow(label, valueGetter) {

        const tr =
            document.createElement("tr");

        const labelCell =
            document.createElement("td");

        labelCell.innerHTML =
            "<strong>" +
            label +
            "</strong>";

        tr.appendChild(labelCell);

        selected.forEach(function(product) {

            const td =
                document.createElement("td");

            td.textContent =
                valueGetter(product);

            tr.appendChild(td);
        });

        table.appendChild(tr);
    }

    addRow(
        "Price",
        function(product) {
            return "$" +
                Number(product.price || 0)
                    .toFixed(2);
        }
    );

    addRow(
        "Category",
        function(product) {
            return product.category || "-";
        }
    );

    addRow(
        "Seller",
        function(product) {
            return product.merchantName || "-";
        }
    );

    addRow(
        "Stock",
        function(product) {
            return Number(
                product.stock || 0
            );
        }
    );

    addRow(
        "Rating",
        function(product) {
            return getProductRating(
                product.id
            );
        }
    );

    addRow(
        "Description",
        function(product) {
            return product.description || "-";
        }
    );

    box.innerHTML = "";
    box.appendChild(table);
}


function clearComparison() {

    localStorage.removeItem(
        "compareProducts"
    );

    alert("Comparison cleared.");

    window.location.reload();
}
