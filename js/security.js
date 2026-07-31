// ===============================
// PRODUCT FINDER - SECURITY.JS
// Page access protection
// ===============================

console.log("security.js loaded");


// ===============================
// CUSTOMER
// ===============================

function requireLogin() {

    const user =
        localStorage.getItem("user") ||
        localStorage.getItem("customer");

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// ===============================
// ADMIN
// ===============================

function requireAdmin() {

    const loggedIn =
        localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
        alert("Admin access only.");
        window.location.href = "admin-login.html";
        return false;
    }

    return true;
}


// Keep compatibility with pages that currently use protectAdmin()
function protectAdmin() {
    return requireAdmin();
}


// ===============================
// MERCHANT
// ===============================

function requireMerchant() {

    let merchant = null;

    try {
        merchant =
            JSON.parse(localStorage.getItem("merchant"));
    } catch (error) {
        console.error("Invalid merchant session:", error);
    }

    if (!merchant) {
        alert("Merchant login required.");
        window.location.href = "merchant-login.html";
        return false;
    }

    if (merchant.status === "Suspended") {
        alert("Your merchant account is suspended.");
        localStorage.removeItem("merchant");
        window.location.href = "../index.html";
        return false;
    }

    return true;
}


// Compatibility
function protectMerchant() {
    return requireMerchant();
}
