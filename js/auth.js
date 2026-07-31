// ===============================
// PRODUCT FINDER - AUTH.JS
// Customer authentication only
// ===============================

console.log("auth.js loaded");


// ===============================
// HELPERS
// ===============================

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
        console.error("Could not read users:", error);
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


// ===============================
// REGISTER CUSTOMER
// ===============================

function registerUser() {

    const name = document
        .getElementById("registerName")
        ?.value
        .trim();

    const email = document
        .getElementById("registerEmail")
        ?.value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("registerPassword")
        ?.value;

    if (!name || !email || !password) {
        alert("Please complete all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const users = getUsers();

    const exists = users.some(function(user) {
        return user.email === email;
    });

    if (exists) {
        alert("An account with this email already exists.");
        return;
    }

    const user = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    alert("Registration successful.");

    window.location.href = "login.html";
}


// ===============================
// LOGIN CUSTOMER
// ===============================

function loginUser() {

    const email = document
        .getElementById("loginEmail")
        ?.value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("loginPassword")
        ?.value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    const users = getUsers();

    const user = users.find(function(account) {
        return (
            account.email === email &&
            account.password === password
        );
    });

    if (!user) {
        alert("Wrong email or password.");
        return;
    }

    // Main customer session
    localStorage.setItem("user", JSON.stringify(user));

    // Compatibility with existing customer pages
    localStorage.setItem("customer", JSON.stringify(user));
    localStorage.setItem("customerEmail", user.email);
    localStorage.setItem("loggedIn", "true");

    alert("Welcome " + user.name + "!");

    window.location.href = "../index.html";
}


// ===============================
// CUSTOMER LOGOUT
// ===============================

function logoutUser() {

    localStorage.removeItem("user");
    localStorage.removeItem("customer");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("loggedIn");

    alert("Logged out successfully.");

    window.location.href = "login.html";
}


// Compatibility for older pages
function customerLogout() {
    logoutUser();
}
