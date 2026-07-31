// ============================================
// PRODUCT FINDER - ORDER.JS
// Checkout, orders, Paystack and tracking
// ============================================

console.log("order.js loaded");
// ============================================
// PAYMENT BACKEND
// ============================================

// Local testing:
const PAYMENT_API_BASE_URL =
    "http://localhost:3000";

// Later, when the backend is deployed to Render,
// change this to your Render URL, for example:
// const PAYMENT_API_BASE_URL =
//     "https://product-finder-api.onrender.com";

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
    "my-orders.html";
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
        document.getElementById(
            "customerEmail"
        )
        ?.value
        .trim()
        .toLowerCase();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    if (
        typeof PaystackPop ===
        "undefined"
    ) {
        alert(
            "Paystack has not loaded. Please refresh."
        );
        return;
    }

    let total = 0;

    cart.forEach(function(item) {

        total +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

    });

    if (total <= 0) {
        alert(
            "Order total must be greater than zero."
        );
        return;
    }

    initializePaystackPayment(
        email,
        total
    )
        .then(function(initialized) {

            console.log(
                "Paystack initialized:",
                initialized
            );

            const paystack =
                new PaystackPop();

            paystack.resumeTransaction(
                initialized.accessCode,
                {
                    onSuccess:
                        async function(transaction) {

                            console.log(
                                "Paystack payment completed:",
                                transaction.reference
                            );

                            try {

                                const verified =
                                    await verifyPaystackPayment(
                                        transaction.reference,
                                        total
                                    );

                                console.log(
                                    "PAYMENT VERIFIED:",
                                    verified
                                );

                                const serverOrder =
                                    await createVerifiedServerOrder(
                                        transaction.reference,
                                        total
                                    );

                                console.log(
                                    "SERVER ORDER CREATED:",
                                    serverOrder
                                );

                                createOrder(
                                    "Paystack",
                                    transaction.reference
                                );

                            } catch (error) {

                                console.error(
                                    "Payment/order verification failed:",
                                    error
                                );

                                alert(
                                    "Payment could not be fully verified. Your order has NOT been confirmed.\n\nReference: " +
                                    transaction.reference
                                );
                            }
                        },

                    onCancel:
                        function() {

                            alert(
                                "Payment cancelled."
                            );

                        },

                    onError:
                        function(error) {

                            console.error(
                                "Paystack error:",
                                error
                            );

                            alert(
                                "Paystack payment could not be completed."
                            );

                        }
                }
            );

        })
        .catch(function(error) {

            console.error(
                "Paystack initialization failed:",
                error
            );

            alert(
                error.message ||
                "Unable to start Paystack payment."
            );

        });
}

function(error) {

                console.error(
                    "Paystack error:",
                    error
                );

                alert(
                    "Payment could not be started."
                );

            }

    });
}

// ============================================
// VERIFY PAYSTACK PAYMENT ON SERVER
// ============================================

async function verifyPaystackPayment(
    reference,
    expectedAmount
) {

    if (!reference) {
        throw new Error(
            "Payment reference is missing."
        );
    }

    const response = await fetch(
        PAYMENT_API_BASE_URL +
        "/api/paystack/verify/" +
        encodeURIComponent(reference)
    );

    let result;

    try {
        result = await response.json();
    } catch (error) {
        throw new Error(
            "Payment server returned an invalid response."
        );
    }

    if (!response.ok) {

        throw new Error(
            result.message ||
            "Payment verification request failed."
        );
    }

    if (!result.success || !result.data) {

        throw new Error(
            result.message ||
            "Paystack transaction could not be verified."
        );
    }

    const transaction =
        result.data;

    // Paystack amounts are in the smallest
    // currency unit, so GHS 100 = 10000.
    const expectedAmountInSubunit =
        Math.round(
            Number(expectedAmount) * 100
        );

    const actualAmount =
        Number(transaction.amount);

    const paymentSuccessful =
        transaction.status === "success";

    const amountMatches =
        actualAmount ===
        expectedAmountInSubunit;

    const currencyMatches =
        transaction.currency === "GHS";

    if (!paymentSuccessful) {

        throw new Error(
            "Paystack payment was not successful."
        );
    }

    if (!amountMatches) {

        console.error(
            "PAYMENT AMOUNT MISMATCH",
            {
                expected:
                    expectedAmountInSubunit,
                received:
                    actualAmount
            }
        );

        throw new Error(
            "Payment amount does not match the order."
        );
    }

    if (!currencyMatches) {

        throw new Error(
            "Payment currency does not match GHS."
        );
    }

    return transaction;
}

// ============================================
// CREATE VERIFIED SERVER ORDER
// ============================================

async function createVerifiedServerOrder(
    paymentReference,
    total
) {

    const customer = {
        name:
            document.getElementById(
                "customerName"
            )?.value.trim(),

        email:
            document.getElementById(
                "customerEmail"
            )?.value.trim().toLowerCase(),

        phone:
            document.getElementById(
                "customerPhone"
            )?.value.trim(),

        address:
            document.getElementById(
                "customerAddress"
            )?.value.trim() || "",

        city:
            document.getElementById(
                "customerCity"
            )?.value.trim() || ""
    };

    const cart = getCart();

    const items =
        cart.map(function(item) {

            return {
                id: item.id,
                name: item.name,
                price:
                    Number(
                        item.price || 0
                    ),
                quantity:
                    Number(
                        item.quantity || 0
                    ),
                merchantEmail:
                    item.merchantEmail || ""
            };

        });

    const response = await fetch(
        PAYMENT_API_BASE_URL +
        "/api/orders/paystack",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                paymentReference:
                    paymentReference,

                total:
                    total,

                customer:
                    customer,

                items:
                    items
            })
        }
    );

    let result;

    try {

        result =
            await response.json();

    } catch (error) {

        throw new Error(
            "Payment server returned an invalid response."
        );

    }

    if (!response.ok || !result.success) {

        throw new Error(
            result.message ||
            "Verified order could not be created."
        );
    }

    return result.order;
}
