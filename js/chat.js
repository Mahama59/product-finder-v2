alert("chat.js connected");

// ================= START CHAT =================

function openChat(merchantEmail, productId){

localStorage.setItem("chatMerchant", merchantEmail);
localStorage.setItem("chatProduct", productId);

window.location.href="chat.html";

}


// ================= CUSTOMER CHAT =================

function loadCustomerChat(){

displayCustomerMessages();

}


function sendCustomerMessage(){

let text =
document.getElementById("chatMessage").value.trim();

if(text==="") return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let merchantEmail =
localStorage.getItem("chatMerchant");


let productId =
localStorage.getItem("chatProduct");


let customer =
JSON.parse(localStorage.getItem("customer"));


if(!customer){

alert("Please login.");

return;

}


let conversation =
chats.find(function(chat){

return chat.customerEmail===customer.email &&
chat.merchantEmail===merchantEmail &&
chat.productId==productId;

});


if(!conversation){

conversation={

id:Date.now(),

customerEmail:customer.email,

merchantEmail:merchantEmail,

productId:productId,

messages:[]

};

chats.push(conversation);

}


conversation.messages.push({

sender:"customer",

text:text,

time:new Date().toLocaleString()

});


localStorage.setItem(
"chats",
JSON.stringify(chats)
);


document.getElementById("chatMessage").value="";


displayCustomerMessages();

}


function displayCustomerMessages(){

let box =
document.getElementById("chatMessages");

if(!box) return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let customer =
JSON.parse(localStorage.getItem("customer"));


if(!customer){

return;

}


let merchantEmail =
localStorage.getItem("chatMerchant");


let productId =
localStorage.getItem("chatProduct");


let conversation =
chats.find(function(chat){

return chat.customerEmail===customer.email &&
chat.merchantEmail===merchantEmail &&
chat.productId==productId;

});


box.innerHTML="";


if(!conversation){

box.innerHTML="<p>No messages yet.</p>";

return;

}


conversation.messages.forEach(function(message){

box.innerHTML += `

<div class="product">

<b>${message.sender}</b>

<p>${message.text}</p>

<small>${message.time}</small>

</div>

`;

});

}



// ================= MERCHANT CHAT =================

function loadMerchantChat(){

displayMerchantMessages();

}


function sendMerchantReply(){

let text =
document.getElementById("merchantReply").value.trim();

if(text==="") return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let merchant =
JSON.parse(localStorage.getItem("merchant"));


let conversation =
chats.find(function(chat){

return chat.merchantEmail===merchant.email;

});


if(!conversation){

return;

}


conversation.messages.push({

sender:"merchant",

text:text,

time:new Date().toLocaleString()

});


localStorage.setItem(
"chats",
JSON.stringify(chats)
);


document.getElementById("merchantReply").value="";


displayMerchantMessages();

}


function displayMerchantMessages(){

let box =
document.getElementById("merchantChatMessages");

if(!box) return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let merchant =
JSON.parse(localStorage.getItem("merchant"));


let conversation =
chats.find(function(chat){

return chat.merchantEmail===merchant.email;

});


box.innerHTML="";


if(!conversation){

box.innerHTML="<p>No customer messages.</p>";

return;

}


conversation.messages.forEach(function(message){

box.innerHTML += `

<div class="product">

<b>${message.sender}</b>

<p>${message.text}</p>

<small>${message.time}</small>

</div>

`;

});

}


// ================= CONVERSATION LIST =================

function loadConversations(){

let box =
document.getElementById("conversationList");

if(!box) return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let customer =
JSON.parse(localStorage.getItem("customer"));


if(!customer){

box.innerHTML =
"<p>Please login first.</p>";

return;

}


let myChats =
chats.filter(function(chat){

return chat.customerEmail === customer.email;

});


box.innerHTML="";


if(myChats.length === 0){

box.innerHTML =
"<p>No conversations yet.</p>";

return;

}



myChats.forEach(function(chat){


let lastMessage =
chat.messages[chat.messages.length - 1];


box.innerHTML += `

<div class="product">

<h3>
💬 ${chat.merchantEmail}
</h3>


<p>
${lastMessage ? lastMessage.text : "No message"}
</p>


<small>
${lastMessage ? lastMessage.time : ""}
</small>


<button onclick="continueChat(
'${chat.merchantEmail}',
${chat.productId}
)">

Open Chat

</button>


</div>

`;

});


}



function continueChat(email, productId){

localStorage.setItem(
"chatMerchant",
email
);


localStorage.setItem(
"chatProduct",
productId
);


window.location.href="chat.html";

}
