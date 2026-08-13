// ============================================
// PRODUCT FINDER - MERCHANT.JS
// Merchant registration, login, products,
// orders, inventory, analytics and seller status
// ============================================

console.log("merchant.js loaded");


// ============================================
// STORAGE HELPERS
// ============================================

function getMerchants() {
    try {
        return JSON.parse(localStorage.getItem("merchants")) || [];
    } catch (error) {
        console.error("Could not read merchants:", error);
        return [];
    }
}

function saveMerchants(merchants) {
    localStorage.setItem("merchants", JSON.stringify(merchants));
}

function getMerchantSession(){

    const merchant =
    localStorage.getItem("merchant");


    if(!merchant){

        return null;

    }


    return JSON.parse(merchant);

}

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem("merchantProducts")) || [];
    } catch (error) {
        console.error("Could not read merchant products:", error);
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(
        "merchantProducts",
        JSON.stringify(products)
    );
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem("orders")) || [];
    } catch (error) {
        console.error("Could not read orders:", error);
        return [];
    }
}


// ============================================
// REGISTER MERCHANT
// ============================================

function registerMerchant() {

    const name = document
        .getElementById("merchantName")
        ?.value
        .trim();

    const email = document
        .getElementById("merchantEmail")
        ?.value
        .trim()
        .toLowerCase();

    const phone = document
        .getElementById("merchantPhone")
        ?.value
        .trim();

    if (!name || !email || !phone) {
        alert("Please fill all fields.");
        return;
    }

    const merchants = getMerchants();

    const exists = merchants.some(function(merchant) {
        return merchant.email === email;
    });

    if (exists) {
        alert("Merchant already exists.");
        return;
    }

    const merchant = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        storeName: name + " Store",
        status: "Active",
        online: true,
        lastSeen: new Date().toLocaleString(),
        joined: new Date().toLocaleDateString()
    };

    merchants.push(merchant);
    saveMerchants(merchants);

    localStorage.setItem(
        "merchant",
        JSON.stringify(merchant)
    );

    alert("Merchant registration successful.");

    window.location.href = "merchant-dashboard.html";
}


// ============================================
// MERCHANT LOGIN
// ============================================

async function merchantLogin(event) {

if (event) {
    event.preventDefault();
}

const email =
    document
    .getElementById("merchantEmail")
    .value
    .trim()
    .toLowerCase();

const password =
    document
    .getElementById("merchantPassword")
    .value;

const message =
    document.getElementById("loginMessage");

if (!email || !password) {

    message.innerText =
        "Please enter your email and password.";

    return;
}

try {

    message.innerText =
        "Logging in...";

    const response =
        await fetch("https://legendary-bassoon-45946gp4v7v3j7vv-3000.app.github.dev/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

    const data =
        await response.json();

    if (!response.ok || !data.success) {

        message.innerText =
            data.message ||
            "Login failed.";

        return;
    }

    // Make sure this is actually a merchant
    if (data.user.role !== "MERCHANT") {

        message.innerText =
            "This account is not a merchant account.";

        return;
    }

    // Save backend authentication
    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "merchant",
        JSON.stringify(data.user)
    );

    // Also keep the logged-in user
    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    message.innerText =
        "Login successful!";

    window.location.href =
        "merchant-dashboard.html";

} catch (error) {

    console.error(
        "Merchant login error:",
        error
    );

    message.innerText =
        "Cannot connect to Product Finder server.";

}

}
// ============================================
// MERCHANT DASHBOARD
// ============================================

function loadMerchantDashboard() {

    const merchant = getMerchantSession();

    if (!merchant) {
        alert("Please login as merchant.");
        window.location.href = "merchant-login.html";
        return;
    }

    const products = getProducts();
    const orders = getOrders();

    const myProducts = products.filter(function(product) {
        return product.merchantEmail === merchant.email;
    });

    const approved = myProducts.filter(function(product) {
        return product.status === "Approved";
    });

    const pending = myProducts.filter(function(product) {
        return product.status === "Pending";
    });

    const myOrders = orders.filter(function(order) {
        return Array.isArray(order.items) &&
            order.items.some(function(item) {
                return item.merchantEmail === merchant.email;
            });
    });

    let revenue = 0;

    myOrders.forEach(function(order) {

        if (order.status !== "Completed") {
            return;
        }

        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach(function(item) {

            if (item.merchantEmail === merchant.email) {
                revenue +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);
            }
        });
    });

    const welcome =
        document.getElementById("merchantWelcome");

    const productCount =
        document.getElementById("productCount");

    const approvedBox =
        document.getElementById("approvedProducts");

    const pendingBox =
        document.getElementById("pendingProducts");

    const ordersBox =
        document.getElementById("merchantOrders");

    const revenueBox =
        document.getElementById("revenue");

    if (welcome) {
        welcome.innerText =
            "Welcome " + merchant.storeName;
    }

    if (productCount) {
        productCount.innerText =
            myProducts.length;
    }

    if (approvedBox) {
        approvedBox.innerText =
            approved.length;
    }

    if (pendingBox) {
        pendingBox.innerText =
            pending.length;
    }

    if (ordersBox) {
        ordersBox.innerText =
            myOrders.length;
    }

    if (revenueBox) {
        revenueBox.innerText =
            revenue.toFixed(2);
    }
}


// ============================================
// MERCHANT LOGOUT
// ============================================

function merchantLogout() {

    const merchant = getMerchantSession();

    if (merchant) {

        const merchants = getMerchants();

        const storedMerchant =
            merchants.find(function(item) {
                return item.email === merchant.email;
            });

        if (storedMerchant) {
            storedMerchant.online = false;
            storedMerchant.lastSeen =
                new Date().toLocaleString();

            saveMerchants(merchants);
        }
    }

    localStorage.removeItem("merchant");

    alert("Logged out.");

    window.location.href = "merchant-login.html";
}


// ============================================
// LOAD MERCHANT PRODUCTS
// ============================================

function loadMerchantProducts() {

    const box =
        document.getElementById("merchantProducts");

    if (!box) {
        return;
    }

    const merchant = getMerchantSession();

    if (!merchant) {
        box.innerHTML =
            "<p>Please login as merchant.</p>";
        return;
    }

    const products = getProducts();

    const myProducts =
        products.filter(function(product) {
            return product.merchantEmail === merchant.email;
        });

    box.innerHTML = "";

    if (myProducts.length === 0) {
        box.innerHTML =
            "<p>No products added yet.</p>";
        return;
    }

    myProducts.forEach(function(product, index) {

        const image =
            product.image ||
            "https://via.placeholder.com/250";

        const stock =
            Number(product.stock || 0);

        box.innerHTML += `

            <div class="product">

                <img
                    src="${image}"
                    width="200"
                    alt="${product.name || "Product"}"
                >

                <h3>${product.name}</h3>

                <p>
                    💰 Price: $${Number(product.price || 0).toFixed(2)}
                </p>

                <p>
                    📂 Category: ${product.category || "-"}
                </p>

                <p>
                    📦 Stock: ${stock}
                </p>

                <p>
                    ${stock <= 0
                        ? "❌ Out of Stock"
                        : stock <= 5
                            ? "⚠️ Low Stock"
                            : "✅ In Stock"
                    }
                </p>

                <p>
                    Approval: ${product.status || "Pending"}
                </p>

                <p>
                    Inventory: ${getStockStatus(stock)}
                </p>

                <button onclick="changeStock(${index}, 1)">
                    ➕ Add Stock
                </button>

                <button onclick="changeStock(${index}, -1)">
                    ➖ Remove Stock
                </button>

                <button onclick="editMerchantProduct(${index})">
                    ✏️ Edit
                </button>

                <button onclick="deleteMerchantProduct(${index})">
                    🗑 Delete
                </button>

            </div>
        `;
    });
}


// ============================================
// DELETE MERCHANT PRODUCT
// ============================================

function deleteMerchantProduct(index) {

    const merchant = getMerchantSession();

    if (!merchant) {
        alert("Please login as merchant.");
        return;
    }

    const products = getProducts();

    const myProducts =
        products.filter(function(product) {
            return product.merchantEmail === merchant.email;
        });

    const productToDelete =
        myProducts[index];

    if (!productToDelete) {
        alert("Product not found.");
        return;
    }

    const realIndex =
        products.findIndex(function(product) {
            return product.id === productToDelete.id;
        });

    if (realIndex === -1) {
        alert("Product not found.");
        return;
    }

    products.splice(realIndex, 1);

    saveProducts(products);

    alert("Product deleted.");

    loadMerchantProducts();
}


// ============================================
// MERCHANT ORDERS
// ============================================

function loadMerchantOrders() {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        alert("Please login.");
        return;
    }

    const orders = getOrders();

    const box =
        document.getElementById("merchantOrders");

    if (!box) {
        return;
    }

    const myOrders =
        orders.filter(function(order) {
            return Array.isArray(order.items) &&
                order.items.some(function(item) {
                    return item.merchantEmail === merchant.email;
                });
        });

    box.innerHTML = "";

    if (myOrders.length === 0) {
        box.innerHTML =
            "<p>No customer orders yet.</p>";
        return;
    }

    myOrders.forEach(function(order) {

        const merchantTotal =
            order.items.reduce(function(total, item) {

                if (item.merchantEmail !== merchant.email) {
                    return total;
                }

                return total +
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

            }, 0);

        box.innerHTML += `

            <div class="product">

                <h3>🧾 Order #${order.id}</h3>

                <p>
                    👤 Customer:
                    ${order.customer || "-"}
                </p>

                <p>
                    📧 ${order.customerEmail || order.email || "-"}
                </p>

                <p>
                    📞 ${order.phone || "-"}
                </p>

                <p>
                    💰 Merchant Total:
                    $${merchantTotal.toFixed(2)}
                </p>

                <p>
                    📦 Status:
                    ${order.status || "New"}
                </p>

                <p>
                    🚚 Shipping:
                    ${order.shippingStatus || "Processing"}
                </p>

                <button
                    onclick="updateOrderStatus(${order.id}, 'Accepted')"
                >
                    ✅ Accept
                </button>

                <button
                    onclick="updateOrderStatus(${order.id}, 'Shipped')"
                >
                    🚚 Ship
                </button>

                <button
                    onclick="updateOrderStatus(${order.id}, 'Completed')"
                >
                    ✔ Complete
                </button>

            </div>
        `;
    });
}


// ============================================
// UPDATE ORDER STATUS
// ============================================

function updateOrderStatus(orderId, status) {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        return;
    }

    const orders = getOrders();

    const order =
        orders.find(function(item) {
            return item.id === orderId;
        });

    if (!order) {
        alert("Order not found.");
        return;
    }

    const belongsToMerchant =
        Array.isArray(order.items) &&
        order.items.some(function(item) {
            return item.merchantEmail === merchant.email;
        });

    if (!belongsToMerchant) {
        alert("You cannot update this order.");
        return;
    }

    order.status = status;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    if (typeof addNotification === "function") {
        addNotification(
            "Your order #" +
            orderId +
            " status changed to " +
            status +
            " 🚚"
        );
    }

    loadMerchantOrders();
}


// ============================================
// SHIP ORDER
// ============================================

function shipOrder(id) {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        return;
    }

    const orders = getOrders();

    const order =
        orders.find(function(item) {
            return item.id === id;
        });

    if (!order) {
        alert("Order not found.");
        return;
    }

    const belongsToMerchant =
        Array.isArray(order.items) &&
        order.items.some(function(item) {
            return item.merchantEmail === merchant.email;
        });

    if (!belongsToMerchant) {
        alert("You cannot ship this order.");
        return;
    }

    order.shippingStatus = "Shipped";
    order.trackingNumber =
        "PF-" + Date.now();

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    alert("Order shipped 🚚");

    loadMerchantOrders();
}


// ============================================
// LOAD EDIT PRODUCT
// ============================================

function loadEditProduct() {

    const product =
        JSON.parse(
            localStorage.getItem("editProduct")
        );

    if (!product) {
        return;
    }

    const name =
        document.getElementById("editName");

    const price =
        document.getElementById("editPrice");

    const category =
        document.getElementById("editCategory");

    const stock =
        document.getElementById("editStock");

    const description =
        document.getElementById("editDescription");

    if (name) {
        name.value = product.name || "";
    }

    if (price) {
        price.value = product.price || "";
    }

    if (category) {
        category.value = product.category || "";
    }

    if (stock) {
        stock.value = product.stock || 0;
    }

    if (description) {
        description.value =
            product.description || "";
    }
}


// ============================================
// UPDATE PRODUCT
// ============================================

function updateProduct() {

    const product =
        JSON.parse(
            localStorage.getItem("editProduct")
        );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const products = getProducts();

    const index =
        products.findIndex(function(item) {
            return item.id === product.id;
        });

    if (index === -1) {
        alert("Product not found.");
        return;
    }

    const name =
        document.getElementById("editName")
        ?.value
        .trim();

    const price =
        document.getElementById("editPrice")
        ?.value;

    const category =
        document.getElementById("editCategory")
        ?.value
        .trim();

    const stock =
        document.getElementById("editStock")
        ?.value;

    const description =
        document.getElementById("editDescription")
        ?.value
        .trim();

    if (!name || !price || !category || stock === "") {
        alert("Complete all product details.");
        return;
    }

    products[index].name = name;
    products[index].price = Number(price);
    products[index].category = category;
    products[index].stock = Number(stock);
    products[index].description =
        description || "";

    // Editing sends the product back for review.
    products[index].status = "Pending";

    saveProducts(products);

    localStorage.removeItem("editProduct");

    alert("Product updated and sent for approval.");

    window.location.href =
        "merchant-products.html";
}


// ============================================
// EDIT MERCHANT PRODUCT
// ============================================

function editMerchantProduct(index) {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        alert("Please login as merchant.");
        return;
    }

    const products = getProducts();

    const myProducts =
        products.filter(function(product) {
            return product.merchantEmail === merchant.email;
        });

    const product =
        myProducts[index];

    if (!product) {
        alert("Product not found.");
        return;
    }

    localStorage.setItem(
        "editProduct",
        JSON.stringify(product)
    );

    window.location.href =
        "merchant-edit-product.html";
}


// ============================================
// STOCK STATUS
// ============================================

function getStockStatus(stock) {

    const value =
        Number(stock || 0);

    if (value <= 0) {
        return "❌ Out of Stock";
    }

    if (value <= 5) {
        return "⚠️ Low Stock";
    }

    return "✅ Available";
}


// ============================================
// CHANGE STOCK
// ============================================

function changeStock(index, amount) {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        alert("Please login as merchant.");
        return;
    }

    const products = getProducts();

    const myProducts =
        products.filter(function(product) {
            return product.merchantEmail === merchant.email;
        });

    const product =
        myProducts[index];

    if (!product) {
        alert("Product not found.");
        return;
    }

    const realIndex =
        products.findIndex(function(item) {
            return item.id === product.id;
        });

    if (realIndex === -1) {
        alert("Product not found.");
        return;
    }

    products[realIndex].stock =
        Math.max(
            0,
            Number(products[realIndex].stock || 0) +
            Number(amount)
        );

    saveProducts(products);

    loadMerchantProducts();
}


// ============================================
// MERCHANT ANALYTICS
// ============================================

function loadMerchantAnalytics() {

    const merchant =
        getMerchantSession();

    if (!merchant) {
        return;
    }

    const products =
        getProducts();

    const orders =
        getOrders();

    const myProducts =
        products.filter(function(product) {
            return product.merchantEmail === merchant.email;
        });

    const myOrders =
        orders.filter(function(order) {
            return Array.isArray(order.items) &&
                order.items.some(function(item) {
                    return item.merchantEmail === merchant.email;
                });
        });

    let revenue = 0;

    myOrders.forEach(function(order) {

        if (order.status !== "Completed") {
            return;
        }

        order.items.forEach(function(item) {

            if (item.merchantEmail === merchant.email) {
                revenue +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);
            }
        });
    });

    const shipped =
        myOrders.filter(function(order) {
            return (
                order.shippingStatus === "Shipped"
            );
        }).length;

    const completed =
        myOrders.filter(function(order) {
            return order.status === "Completed";
        }).length;

    const productCount =
        document.getElementById("productCount");

    const orderCount =
        document.getElementById("merchantOrders");

    const revenueBox =
        document.getElementById("revenue");

    const shippedBox =
        document.getElementById("shippedOrders");

    const completedBox =
        document.getElementById("completedOrders");

    if (productCount) {
        productCount.innerText =
            myProducts.length;
    }

    if (orderCount) {
        orderCount.innerText =
            myOrders.length;
    }

    if (revenueBox) {
        revenueBox.innerText =
            revenue.toFixed(2);
    }

    if (shippedBox) {
        shippedBox.innerText =
            shipped;
    }

    if (completedBox) {
        completedBox.innerText =
            completed;
    }
}


// ============================================
// SALES CHART
// ============================================

function loadSalesChart() {

    const merchant =
        getMerchantSession();

    const canvas =
        document.getElementById("salesChart");

    if (!merchant || !canvas) {
        return;
    }

    if (
        typeof Chart === "undefined"
    ) {
        console.warn(
            "Chart.js is not loaded."
        );
        return;
    }

    const orders =
        getOrders();

    const myOrders =
        orders.filter(function(order) {
            return Array.isArray(order.items) &&
                order.items.some(function(item) {
                    return item.merchantEmail === merchant.email;
                });
        });

    let total = 0;

    myOrders.forEach(function(order) {

        order.items.forEach(function(item) {

            if (item.merchantEmail === merchant.email) {
                total +=
                    Number(item.price || 0) *
                    Number(item.quantity || 0);
            }
        });
    });

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Sales"],
            datasets: [{
                label: "Revenue",
                data: [total]
            }]
        },
        options: {
            responsive: true
        }
    });
}


// ============================================
// BEST SELLING PRODUCTS
// ============================================

function loadBestProducts() {

    const merchant =
        getMerchantSession();

    const box =
        document.getElementById("bestProducts");

    if (!merchant || !box) {
        return;
    }

    const orders =
        getOrders();

    const products = {};

    orders.forEach(function(order) {

        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach(function(item) {

            if (item.merchantEmail !== merchant.email) {
                return;
            }

            const quantity =
                Number(item.quantity || 0);

            if (!products[item.name]) {
                products[item.name] = 0;
            }

            products[item.name] += quantity;
        });
    });

    box.innerHTML = "";

    const list =
        Object.entries(products);

    if (list.length === 0) {
        box.innerHTML =
            "<p>No sales yet.</p>";
        return;
    }

    list.sort(function(a, b) {
        return b[1] - a[1];
    });

    list.slice(0, 5).forEach(function(item) {

        box.innerHTML += `

            <div class="product">

                <h3>
                    🏆 ${item[0]}
                </h3>

                <p>
                    Sold: ${item[1]}
                </p>

            </div>
        `;
    });
}


// ============================================
// SELLER ONLINE / OFFLINE STATUS
// ============================================

function getSellerStatus(email) {

    const merchants =
        getMerchants();

    const merchant =
        merchants.find(function(item) {
            return item.email === email;
        });

    if (!merchant) {
        return "⚪ Offline";
    }

    return merchant.online
        ? "🟢 Online"
        : "⚪ Offline";
}
