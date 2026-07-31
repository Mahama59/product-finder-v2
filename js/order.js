// ============================================
// PRODUCT FINDER - ORDER.JS
// Checkout, orders, Paystack and tracking
// ============================================

console.log("order.js loaded");

// ============================================
// PAYM0
// Local testing:
const PAYMENT_API_BASE_URL =
    "http://localhost:3000";

// Later, when the backend is deployed to Render:
// const PAYMENT_API_BASE_URL =
//     "https://your-render-service.onrender.com";


// ============================================
// STORAGE HELPERS
// ============================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        console.error(
            "Could not read cart:",
            error
        );

        return [];
    }
}


function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    } catch (error) {

        console.error(
            "Could not read orders:",
            error
        );

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

            totalBox.innerText =
                "GHS 0.00";
        }

        return;
    }

    cart.forEach(function(item) {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 0);

        total +=
            price * quantity;

        box.innerHTML += `
            <p>
                ${item.name || "Product"}
                x ${quantity}
                -
                GHS ${price.toFixed(2)}
            </p>
        `;
    });

    if (totalBox) {

        totalBox.innerText =
            "GHS " +
            total.toFixed(2);
    }
}


// ============================================
// PLACE ORDER
// ============================================

function placeOrder() {

    const cart = getCart();

    if (cart.length === 0) {

        alert(
            "Cart is empty."
        );

        return;
    }

    const customerName =
        document.getElementById(
            "customerName"
        )
        ?.value
        .trim();

    const customerEmail =
        document.getElementById(
            "customerEmail"
        )
        ?.value
        .trim()
        .toLowerCase();

    const customerPhone =
        document.getElementById(
            "customerPhone"
        )
        ?.value
        .trim();

    if (
        !customerName ||
        !customerEmail ||
        !customerPhone
    ) {

        alert(
            "Please complete all customer details."
        );

        return;
    }

    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    if (!selectedPayment) {

        alert(
            "Please select a payment method."
        );

        return;
    }

    const paymentMethod =
        selectedPayment.value;

    if (
        paymentMethod ===
        "Paystack"
    ) {

        payWithPaystack();

        return;
    }

    if (
        paymentMethod ===
        "Cash on Delivery"
    ) {

        createOrder(
            "Cash on Delivery"
        );

        return;
    }

    alert(
        "Invalid payment method."
    );
}


// ============================================
// CREATE LOCAL ORDER
// ============================================

function createOrder(
    paymentMethod,
    paymentReference = ""
) {

    const cart = getCart();

    if (cart.length === 0) {

        alert(
            "Cart is empty."
        );

        return;
    }

    const customerName =
        document.getElementById(
            "customerName"
        )
        ?.value
        .trim();

    const customerEmail =
        document.getElementById(
            "customerEmail"
        )
        ?.value
        .trim()
        .toLowerCase();

    const customerPhone =
        document.getElementById(
            "customerPhone"
        )
        ?.value
        .trim();

    const address =
        document.getElementById(
            "customerAddress"
        )
        ?.value
        .trim() || "";

    const city =
        document.getElementById(
            "customerCity"
        )
        ?.value
        .trim() || "";

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

    const orders =
        getOrders();

    const order = {

        id:
            Date.now(),

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
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    merchantEmail:
                        item.merchantEmail ||
                        ""

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

    orders.push(
        order
    );

    saveOrders(
        orders
    );

    localStorage.setItem(
        "customerEmail",
        customerEmail
    );

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
        orders.filter(
            function(order) {

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

            }
        );

    if (
        myOrders.length === 0
    ) {

        box.innerHTML =
            "<p>No orders found.</p>";

        return;
    }

    myOrders.forEach(
        function(order) {

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
                        GHS ${Number(
                            order.total || 0
                        ).toFixed(2)}
                    </p>

                    <p>
                        📅 Date:
                        ${order.date || "-"}
                    </p>

                </div>
            `;
        }
    );
}


// ============================================
// INITIALIZE PAYSTACK PAYMENT ON SERVER
// ============================================

async function initializePaystackPayment(
    email,
    amount
) {

    const response =
        await fetch(
            PAYMENT_API_BASE_URL +
            "/api/paystack/initialize",
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        email:
                            email,

                        amount:
                            Number(amount)

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

    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Could not initialize Paystack payment."
        );
    }

    if (
        !result.accessCode
    ) {

        throw new Error(
            "Paystack did not return an access code."
        );
    }

    if (
        !result.reference
    ) {

        throw new Error(
            "Paystack did not return a transaction reference."
        );
    }

    return result;
}


// ============================================
// WAIT FOR WEBHOOK PAYMENT STATUS
// ============================================

async function waitForPaymentStatus(
    reference
) {

    if (!reference) {

        throw new Error(
            "Payment reference is missing."
        );
    }

    const maxAttempts =
        30;

    const delayMs =
        3000;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        try {

            const response =
                await fetch(
                    PAYMENT_API_BASE_URL +
                    "/api/payments/" +
                    encodeURIComponent(
                        reference
                    )
                );

            if (
                response.ok
            ) {

                const result =
                    await response.json();

                if (
                    result.success &&
                    result.payment &&
                    result.payment.status ===
                        "PAID"
                ) {

                    return result.payment;
                }
            }

        } catch (error) {

            console.warn(
                "Payment status check failed:",
                error
            );
        }

        await new Promise(
            function(resolve) {

                setTimeout(
                    resolve,
                    delayMs
                );

            }
        );
    }

    throw new Error(
        "Payment is still processing. Reference: " +
        reference
    );
}


// ============================================
// CREATE VERIFIED SERVER ORDER
// ============================================

async function createVerifiedServerOrder(
    paymentReference,
    total
) {

    const cart =
        getCart();

    if (cart.length === 0) {

        throw new Error(
            "Cart is empty."
        );
    }

    const customer = {

        name:
            document.getElementById(
                "customerName"
            )
            ?.value
            .trim(),

        email:
            document.getElementById(
                "customerEmail"
            )
            ?.value
            .trim()
            .toLowerCase(),

        phone:
            document.getElementById(
                "customerPhone"
            )
            ?.value
            .trim(),

        address:
            document.getElementById(
                "customerAddress"
            )
            ?.value
            .trim() || "",

        city:
            document.getElementById(
                "customerCity"
            )
            ?.value
            .trim() || ""

    };

    if (!customer.name) {

        throw new Error(
            "Customer name is required."
        );
    }

    if (!customer.email) {

        throw new Error(
            "Customer email is required."
        );
    }

    if (!customer.phone) {

        throw new Error(
            "Customer phone is required."
        );
    }

    const items =
        cart.map(
            function(item) {

                return {

                    id:
                        item.id,

                    name:
                        item.name,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    merchantEmail:
                        item.merchantEmail ||
                        ""

                };
            }
        );

    const response =
        await fetch(
            PAYMENT_API_BASE_URL +
            "/api/orders/paystack",
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        paymentReference:
                            paymentReference,

                        total:
                            Number(total),

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
            "Order server returned an invalid response."
        );
    }

    if (
        !response.ok ||
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Verified server order could not be created."
        );
    }

    if (!result.order) {

        throw new Error(
            "Server did not return the created order."
        );
    }

    return result.order;
}


// ============================================
// PAYSTACK PAYMENT
// ============================================
// Flow:
//
// 1. Backend initializes transaction.
// 2. Paystack returns access code/reference.
// 3. Popup resumes transaction.
// 4. Backend webhook marks payment PAID.
// 5. Frontend waits for PAID.
// 6. Backend verifies again.
// 7. Local customer order is created.
//
// Paystack's secret key NEVER appears here.

async function payWithPaystack() {

    const cart =
        getCart();

    if (
        cart.length === 0
    ) {

        alert(
            "Cart is empty."
        );

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

        alert(
            "Please enter your email."
        );

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

    cart.forEach(
        function(item) {

            total +=
                Number(
                    item.price || 0
                ) *
                Number(
                    item.quantity || 0
                );

        }
    );

    if (
        total <= 0
    ) {

        alert(
            "Order total must be greater than zero."
        );

        return;
    }

    try {

        // ----------------------------------------
        // STEP 1: INITIALIZE ON SERVER
        // ----------------------------------------

        const initialized =
            await initializePaystackPayment(
                email,
                total
            );

        console.log(
            "Paystack initialized:",
            initialized
        );

        // ----------------------------------------
        // STEP 2: OPEN PAYSTACK POPUP
        // ----------------------------------------

        const paystack =
            new PaystackPop();

        paystack.resumeTransaction(
            initialized.accessCode
        );

        // ----------------------------------------
        // STEP 3: WAIT FOR WEBHOOK CONFIRMATION
        // ----------------------------------------

        alert(
            "Payment window opened. Complete the payment and please keep this page open while we confirm it."
        );

        const payment =
            await waitForPaymentStatus(
                initialized.reference
            );

        console.log(
            "WEBHOOK PAYMENT CONFIRMED:",
            payment
        );

        // ----------------------------------------
        // STEP 4: CREATE VERIFIED SERVER ORDER
        // ----------------------------------------

        const serverOrder =
            await createVerifiedServerOrder(
                initialized.reference,
                total
            );

        console.log(
            "SERVER ORDER CREATED:",
            serverOrder
        );

        // ----------------------------------------
        // STEP 5: KEEP EXISTING CUSTOMER PAGES
        // WORKING DURING THE DATABASE TRANSITION
        // ----------------------------------------

        createOrder(
            "Paystack",
            initialized.reference
        );

    } catch (error) {

        console.error(
            "Paystack payment processing error:",
            error
        );

        alert(
            error.message ||
            "Payment could not be completed or verified."
        );
    }
}
