// ============================================
// PRODUCT FINDER - ADMIN.JS
// Admin authentication, dashboard, products,
// merchants, customers and orders
// ============================================

console.log("admin.js loaded");


// ============================================
// STORAGE HELPERS
// ============================================

function getAdmins() {
    try {
        return JSON.parse(localStorage.getItem("admins")) || [];
    } catch (error) {
        console.error("Could not read admins:", error);
        return [];
    }
}

function saveAdmins(admins) {
    localStorage.setItem("admins", JSON.stringify(admins));
}

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem("merchantProducts")) || [];
    } catch (error) {
        console.error("Could not read products:", error);
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(
        "merchantProducts",
        JSON.stringify(products)
    );
}

function getMerchants() {
    try {
        return JSON.parse(localStorage.getItem("merchants")) || [];
    } catch (error) {
        console.error("Could not read merchants:", error);
        return [];
    }
}

function saveMerchants(merchants) {
    localStorage.setItem(
        "merchants",
        JSON.stringify(merchants)
    );
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
        console.error("Could not read users:", error);
        return [];
    }
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem("orders")) || [];
    } catch (error) {
        console.error("Could not read orders:", error);
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );
}


// ============================================
// ADMIN LOGIN
// ============================================

function adminLogin() {

    const email =
        document.getElementById("adminEmail")
        ?.value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("adminPassword")
        ?.value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    const admins = getAdmins();

    const admin =
        admins.find(function(account) {
            return (
                account.email === email &&
                account.password === password
            );
        });

    if (!admin) {
        alert("Incorrect admin details.");
        return;
    }

    localStorage.setItem(
        "adminLoggedIn",
        "true"
    );

    localStorage.setItem(
        "currentAdmin",
        JSON.stringify(admin)
    );

    alert("Admin login successful.");

    window.location.href =
        "admin-dashboard.html";
}


// ============================================
// ADMIN REGISTER
// ============================================

function registerAdmin() {

    const name =
        document.getElementById("adminName")
        ?.value
        .trim();

    const email =
        document.getElementById("adminEmail")
        ?.value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("adminPassword")
        ?.value;

    if (!name || !email || !password) {
        alert("Complete all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const admins = getAdmins();

    const exists =
        admins.some(function(admin) {
            return admin.email === email;
        });

    if (exists) {
        alert("Admin already exists.");
        return;
    }

    const admin = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    admins.push(admin);
    saveAdmins(admins);

    alert("Admin account created successfully.");

    window.location.href =
        "admin-login.html";
}


// ============================================
// ADMIN LOGOUT
// ============================================

function adminLogout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    localStorage.removeItem(
        "currentAdmin"
    );

    alert("Admin logged out.");

    window.location.href =
        "admin-login.html";
}


// ============================================
// ADMIN DASHBOARD
// ============================================

function loadAdminDashboard() {

    const merchants = getMerchants();
    const products = getProducts();
    const users = getUsers();
    const orders = getOrders();

    const pending =
        products.filter(function(product) {
            return product.status === "Pending";
        });

    // Top summary
    const merchantCount =
        document.getElementById("merchantCount");

    const productCount =
        document.getElementById("productCount");

    const pendingCount =
        document.getElementById("pendingCount");

    if (merchantCount) {
        merchantCount.innerText =
            merchants.length;
    }

    if (productCount) {
        productCount.innerText =
            products.length;
    }

    if (pendingCount) {
        pendingCount.innerText =
            pending.length;
    }

    // Marketplace overview
    const adminProductsCount =
        document.getElementById(
            "adminProductsCount"
        );

    const adminMerchants =
        document.getElementById(
            "adminMerchants"
        );

    const adminCustomers =
        document.getElementById(
            "adminCustomers"
        );

    const adminOrders =
        document.getElementById(
            "adminOrders"
        );

    if (adminProductsCount) {
        adminProductsCount.innerText =
            products.length;
    }

    if (adminMerchants) {
        adminMerchants.innerText =
            merchants.length;
    }

    if (adminCustomers) {
        adminCustomers.innerText =
            users.length;
    }

    if (adminOrders) {
        adminOrders.innerText =
            orders.length;
    }
}


// ============================================
// ADMIN STATS
// Kept as compatibility wrapper for existing HTML
// ============================================

function loadAdminStats() {
    loadAdminDashboard();
}


// ============================================
// ADMIN PRODUCTS
// ============================================

function loadAdminProducts() {

    const box =
        document.getElementById(
            "adminProducts"
        );

    if (!box) {
        return;
    }

    const products = getProducts();

    box.innerHTML = "";

    if (products.length === 0) {
        box.innerHTML =
            "<p>No products found.</p>";
        return;
    }

    products.forEach(function(product, index) {

        const status =
            product.status || "Pending";

        box.innerHTML += `

            <div class="product">

                <h3>
                    ${product.name || "Unnamed Product"}
                </h3>

                <p>
                    💰 Price:
                    $${Number(product.price || 0).toFixed(2)}
                </p>

                <p>
                    Seller:
                    ${product.merchantName || "-"}
                </p>

                <p>
                    Category:
                    ${product.category || "-"}
                </p>

                <p>
                    Stock:
                    ${Number(product.stock || 0)}
                </p>

                <p>
                    Status:
                    <strong>${status}</strong>
                </p>

                <button
                    onclick="approveProduct(${index})"
                >
                    ✅ Approve
                </button>

                <button
                    onclick="rejectProduct(${index})"
                >
                    ❌ Reject
                </button>

                <button
                    onclick="deleteProduct(${index})"
                >
                    🗑 Delete
                </button>

            </div>
        `;
    });
}


// ============================================
// APPROVE PRODUCT
// ============================================

function approveProduct(index) {

    const products = getProducts();

    if (!products[index]) {
        alert("Product not found.");
        return;
    }

    products[index].status =
        "Approved";

    saveProducts(products);

    alert("Product approved.");

    loadAdminProducts();
}


// ============================================
// REJECT PRODUCT
// ============================================

function rejectProduct(index) {

    const products = getProducts();

    if (!products[index]) {
        alert("Product not found.");
        return;
    }

    products[index].status =
        "Rejected";

    saveProducts(products);

    alert("Product rejected.");

    loadAdminProducts();
}


// ============================================
// DELETE PRODUCT
// ============================================

function deleteProduct(index) {

    const products = getProducts();

    if (!products[index]) {
        alert("Product not found.");
        return;
    }

    products.splice(index, 1);

    saveProducts(products);

    alert("Product deleted.");

    loadAdminProducts();
}


// ============================================
// ADMIN MERCHANTS
// ============================================

function loadAdminMerchants() {

    const box =
        document.getElementById(
            "adminMerchantList"
        );

    if (!box) {
        return;
    }

    const merchants =
        getMerchants();

    box.innerHTML = "";

    if (merchants.length === 0) {
        box.innerHTML =
            "<p>No merchants found.</p>";
        return;
    }

    merchants.forEach(function(merchant, index) {

        box.innerHTML += `

            <div class="product">

                <h3>
                    🏪 ${merchant.storeName || merchant.name}
                </h3>

                <p>
                    👤 Owner:
                    ${merchant.name || "-"}
                </p>

                <p>
                    📧 Email:
                    ${merchant.email || "-"}
                </p>

                <p>
                    📞 Phone:
                    ${merchant.phone || "-"}
                </p>

                <p>
                    Status:
                    ${merchant.status || "Active"}
                </p>

                <p>
                    ${
                        merchant.online
                            ? "🟢 Online"
                            : "⚪ Offline"
                    }
                </p>

                <button
                    onclick="suspendMerchant('${merchant.email}')"
                >
                    ⛔ Suspend Merchant
                </button>

                <button
                    onclick="deleteMerchant(${index})"
                >
                    ❌ Remove Merchant
                </button>

            </div>
        `;
    });
}


// ============================================
// SUSPEND MERCHANT
// ============================================

function suspendMerchant(email) {

    const merchants =
        getMerchants();

    const merchant =
        merchants.find(function(item) {
            return item.email === email;
        });

    if (!merchant) {
        alert("Merchant not found.");
        return;
    }

    merchant.status =
        "Suspended";

    merchant.online =
        false;

    saveMerchants(merchants);

    // Update active session if it belongs
    try {
        const session =
            JSON.parse(
                localStorage.getItem("merchant")
            );

        if (
            session &&
            session.email === email
        ) {
            localStorage.setItem(
                "merchant",
                JSON.stringify(merchant)
            );
        }
    } catch (error) {
        console.warn(
            "Could not update merchant session."
        );
    }

    alert("Merchant suspended.");

    loadAdminMerchants();
}


// ============================================
// DELETE MERCHANT
// ============================================

function deleteMerchant(index) {

    const merchants =
        getMerchants();

    if (!merchants[index]) {
        alert("Merchant not found.");
        return;
    }

    merchants.splice(index, 1);

    saveMerchants(merchants);

    alert("Merchant removed.");

    loadAdminMerchants();
}


// ============================================
// ADMIN CUSTOMERS
// ============================================

function loadAdminUsers() {

    const box =
        document.getElementById(
            "adminUserList"
        );

    if (!box) {
        return;
    }

    const users =
        getUsers();

    box.innerHTML = "";

    if (users.length === 0) {
        box.innerHTML =
            "<p>No customers found.</p>";
        return;
    }

    users.forEach(function(user) {

        box.innerHTML += `

            <div class="product">

                <h3>
                    👤 ${user.name}
                </h3>

                <p>
                    📧 ${user.email}
                </p>

            </div>
        `;
    });
}


// ============================================
// ADMIN ORDERS
// ============================================

function loadAdminOrders() {

    const orders =
        getOrders();

    const box =
        document.getElementById(
            "adminOrdersList"
        );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    if (orders.length === 0) {
        box.innerHTML =
            "<p>No orders yet.</p>";
        return;
    }

    orders.forEach(function(order) {

        box.innerHTML += `

            <div class="product">

                <h3>
                    🧾 Order #${order.id}
                </h3>

                <p>
                    👤 Customer:
                    ${order.customer || "-"}
                </p>

                <p>
                    📧 Email:
                    ${order.customerEmail || order.email || "-"}
                </p>

                <p>
                    💰 Total:
                    $${Number(order.total || 0).toFixed(2)}
                </p>

                <p>
                    📦 Status:
                    ${order.status || "New"}
                </p>

                <p>
                    🚚 Shipping:
                    ${order.shippingStatus || "Processing"}
                </p>

                <p>
                    📅 Date:
                    ${order.date || "-"}
                </p>

                <button
                    onclick="adminUpdateOrder(${order.id}, 'Approved')"
                >
                    ✅ Approve
                </button>

                <button
                    onclick="adminUpdateOrder(${order.id}, 'Completed')"
                >
                    ✔ Complete
                </button>

            </div>
        `;
    });
}


// ============================================
// ADMIN ORDER STATUS
// ============================================

function adminUpdateOrder(id, status) {

    const orders =
        getOrders();

    const order =
        orders.find(function(item) {
            return item.id === id;
        });

    if (!order) {
        alert("Order not found.");
        return;
    }

    order.status = status;

    saveOrders(orders);

    loadAdminOrders();
}
