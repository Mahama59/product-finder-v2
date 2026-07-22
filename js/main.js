alert("main.js connected");


// ================= PAGE LOADER =================

document.addEventListener("DOMContentLoaded", function(){

    console.log("Product Finder loaded");

    updateCartCount();

});



// ================= CART COUNT =================

function updateCartCount(){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


    let count = 0;


    cart.forEach(function(item){

        count += Number(item.quantity || 1);

    });



    let cartBox =
    document.getElementById("cartCount");


    if(cartBox){

        cartBox.innerText = count;

    }

}



// ================= LOGOUT =================

function logout(){

    localStorage.removeItem("user");

    localStorage.removeItem("merchant");


    alert("Logged out");


    window.location.href="index.html";

}
