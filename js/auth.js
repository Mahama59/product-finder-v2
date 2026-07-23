alert("auth.js connected");


// ================= REGISTER USER =================

function registerUser(){

let name =
document.getElementById("registerName").value.trim();

let email =
document.getElementById("registerEmail").value.trim();

let password =
document.getElementById("registerPassword").value;


if(!name || !email || !password){

alert("Please complete all fields");
return;

}


let users =
JSON.parse(localStorage.getItem("users")) || [];



let exists =
users.find(function(user){

return user.email === email;

});



if(exists){

alert("Account already exists");
return;

}



let user = {

id: Date.now(),

name:name,

email:email,

password:password

};



users.push(user);



localStorage.setItem(
"users",
JSON.stringify(users)
);



alert("Registration successful");


window.location.href="login.html";


}



// ================= LOGIN USER =================


function loginUser(){


let email =
document.getElementById("loginEmail").value.trim();



let password =
document.getElementById("loginPassword").value;



let users =
JSON.parse(localStorage.getItem("users")) || [];



let user =
users.find(function(user){

return user.email === email &&
user.password === password;

});



if(!user){

alert("Wrong email or password");
return;

}



localStorage.setItem(
"user",
JSON.stringify(user)
);
  
localStorage.setItem(
"customerEmail",
user.email
);


localStorage.setItem(
"loggedIn",
"true"
);



alert(
"Welcome " + user.name
);



window.location.href="../index.html";


}



// ================= LOGOUT =================


function logoutUser(){

localStorage.removeItem("user");

localStorage.removeItem("loggedIn");


alert("Logged out");


window.location.href="login.html";

}
