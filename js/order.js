// ============================================
// PRODUCT FINDER - ORDER.JS
// Checkout, orders, Paystack and tracking
// ============================================

console.log("order.js loaded");


// ============================================
// STORAGE HELPERS
// ============================================

function getCart() {

    try {
        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}


function getOrders() {

    try {
        return JSON.parse(
            localStorage.getItem("orders")
        ) || [];
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
// LOAD CHECKOUT
// ============================================

function loadCheckout() {

    const cart = getCart();

    const box =
        document.getElementById(
            "checkoutItems"
        );

    const totalBox =
        document.getElementById(
            "checkoutTotal"
        );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        box.innerHTML =
            "<p>Your cart is empty.</p>";

        if (totalBox) {
            totalBox.innerText = "0.00";
        }

        return;
    }

    cart.forEach(function(item) {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 0);

        total += price * quantity;

        box.innerHTML += `
            <p>
                ${item.name || "Product"}
                x ${quantity}
                -
                $${price.toFixed(2)}
            </p>
        `;
    });

    if (totalBox) {
        totalBox.innerText =
            total.toFixed(2);
    }
}


// ============================================
// PLACE ORDER
// ============================================

function placeOrder() {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const customerName =
        document.getElementById("customerName")?.value.trim();

    const customerEmail =
        document.getElementById("customerEmail")
        ?.value.trim()
        .toLowerCase();

    const customerPhone =
        document.getElementById("customerPhone")?.value.trim();

    if (
        !customerName ||
        !customerEmail ||
        !customerPhone
    ) {
        alert("Please complete all customer details.");
        return;
    }

    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    const paymentMethod =
        selectedPayment.value;

    if (paymentMethod === "Paystack") {

        payWithPaystack();

        return;
    }

    if (paymentMethod === "Cash on Delivery") {

        createOrder("Cash on Delivery");

        return;
    }

    alert("Invalid payment method.");
}

// ============================================
// CREATE ORDER
// ============================================

function createOrder(
    paymentMethod,
    paymentReference = ""
) {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const customerName =
        document.getElementById(
            "customerName"
        )?.value.trim();

    const customerEmail =
        document.getElementById(
            "customerEmail"
        )?.value.trim().toLowerCase();

    const customerPhone =
        document.getElementById(
            "customerPhone"
        )?.value.trim();

    const address =
        document.getElementById(
            "customerAddress"
        )?.value.trim() || "";

    const city =
        document.getElementById(
            "customerCity"
        )?.value.trim() || "";

    if (
        !customerName ||
        !customerEmail ||
        !customerPhone
    ) {
        alert(
            "Please complete customer details."
        );
        return;
    }

    let total = 0;

    cart.forEach(function(item) {

        total +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

    });

    const orders = getOrders();

    const order = {

        id: Date.now(),

        customer:
            customerName,

        customerEmail:
            customerEmail,

        email:
            customerEmail,

        phone:
            customerPhone,

        address:
            address,

        city:
            city,

        items:
            cart.map(function(item) {

                return {

                    id:
                        item.id,

                    name:
                        item.name,

                    price:
                        Number(item.price || 0),

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    merchantEmail:
                        item.merchantEmail || ""

                };

            }),

        total:
            total,

        paymentMethod:
            paymentMethod,

        paymentReference:
            paymentReference,

        paymentStatus:
            paymentMethod ===
            "Paystack"
                ? "Paid"
                : "Pending",

        status:
            "New",

        shippingStatus:
            "Processing",

        trackingNumber:
            "Not assigned",

        date:
            new Date().toLocaleString()

    };

    orders.push(order);

    saveOrders(orders);

    // Keep customer email available
    // for existing customer-order pages.
    localStorage.setItem(
        "customerEmail",
        customerEmail
    );

    // Notify customer if notifications.js exists.
    if (
        typeof addNotification ===
        "function"
    ) {

        addNotification(
            "Your order #" +
            order.id +
            " has been placed successfully 🎉"
        );

    }

    localStorage.removeItem(
        "cart"
    );

    alert(
        "Order placed successfully 🎉"
    );

    window.location.href =
        "success.html";
}


// ============================================
// CUSTOMER ORDER TRACKING
// ============================================

function loadCustomerOrders() {

    const orders =
        getOrders();

    const email =
        (
            localStorage.getItem(
                "customerEmail"
            ) || ""
        )
        .trim()
        .toLowerCase();

    const box =
        document.getElementById(
            "customerOrders"
        );

    if (!box) {
        return;
    }

    box.innerHTML = "";

    if (!email) {

        box.innerHTML =
            "<p>Please login first.</p>";

        return;
    }

    const myOrders =
        orders.filter(function(order) {

            return (
                String(
                    order.customerEmail ||
                    order.email ||
                    ""
                )
                .trim()
                .toLowerCase() ===
                email
            );

        });

    if (myOrders.length === 0) {

        box.innerHTML =
            "<p>No orders found.</p>";

        return;
    }

    myOrders.forEach(function(order) {

        box.innerHTML += `

            <div class="product">

                <h3>
                    🧾 Order #${order.id}
                </h3>

                <p>
                    📦 Order Status:
                    ${order.status || "New"}
                </p>

                <p>
                    💳 Payment:
                    ${order.paymentStatus || "Pending"}
                </p>

                <p>
                    🚚 Shipping:
                    ${order.shippingStatus || "Processing"}
                </p>

                <p>
                    🔎 Tracking Number:
                    ${order.trackingNumber || "Not assigned"}
                </p>

                <p>
                    📍 Address:
                    ${order.address || "Not provided"}
                </p>

                <p>
                    💰 Total:
                    $${Number(order.total || 0).toFixed(2)}
                </p>

                <p>
                    📅 Date:
                    ${order.date || "-"}
                </p>

            </div>
        `;
    });
}


// ============================================
// PAYSTACK
// ============================================

function payWithPaystack() {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const email =
        document.getElementById("customerEmail")
        ?.value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    if (typeof PaystackPop === "undefined") {
        alert("Paystack has not loaded. Please refresh.");
        return;
    }

    let total = 0;

    cart.forEach(function(item) {
        total +=
            Number(item.price || 0) *
            Number(item.quantity || 0);
    });

    if (total <= 0) {
        alert("Order total must be greater than zero.");
        return;
    }

    const publicKey = "YOUR_PAYSTACK_PUBLIC_KEY";

    if (publicKey === "YOUR_PAYSTACK_PUBLIC_KEY") {
        alert("Add your Paystack public test key first.");
        return;
    }

    const paystack = new PaystackPop();

    paystack.newTransaction({

        key: publicKey,

        email: email,

        amount: Math.round(total * 100),

        currency: "GHS",

        onSuccess: function(transaction) {

            alert(
                "Payment completed.\nReference: " +
                transaction.reference
            );

            createOrder(
                "Paystack",
                transaction.reference
            );
        },

        onCancel: function() {

            alert("Payment cancelled.");
        },

        onError: function(error) {

            console.error("Paystack error:", error);

            alert(
                "Payment could not be started."
            );
        }

    });
}
