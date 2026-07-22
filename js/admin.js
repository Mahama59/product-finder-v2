alert("admin.js connected");


// ================= ADMIN LOGIN =================


function adminLogin(){


let email =
document.getElementById("adminEmail").value.trim();


let password =
document.getElementById("adminPassword").value;



if(
email === "admin@productfinder.com" &&
password === "admin123"
){


localStorage.setItem(
"adminLoggedIn",
"true"
);


alert("Admin login successful");


window.location.href =
"admin-dashboard.html";


}

else{


alert("Incorrect admin details");


}


}



// ================= ADMIN PROTECTION =================


function protectAdmin(){


let admin =
localStorage.getItem("adminLoggedIn");


if(!admin){


alert("Please login as admin");


window.location.href =
"admin-login.html";


}


}
