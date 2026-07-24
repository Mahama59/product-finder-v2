alert("notifications.js connected");


// SAVE NOTIFICATION

function addNotification(message){

let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];


notifications.push({

id: Date.now(),

message: message,

date: new Date().toLocaleString()

});


localStorage.setItem(
"notifications",
JSON.stringify(notifications)
);

}


// LOAD NOTIFICATIONS

function loadNotifications(){

let box =
document.getElementById("notifications");


if(!box) return;


let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];


box.innerHTML="";


if(notifications.length === 0){

box.innerHTML =
"<p>No notifications yet 🔔</p>";

return;

}


notifications.reverse().forEach(function(item){


box.innerHTML += `

<div class="product">

<h3>🔔 ${item.message}</h3>

<p>${item.date}</p>

</div>

`;

});


}
