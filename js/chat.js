alert("chat.js connected");

// ================= START CHAT =================

function openChat(merchantEmail, productId){

localStorage.setItem("chatMerchant", merchantEmail);
localStorage.setItem("chatProduct", productId);

window.location.href="chat.html";

}


// ================= CUSTOMER CHAT =================

function loadCustomerChat(){

markMessagesRead();

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

time:new Date().toLocaleString(),

read:false

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

let style =
message.sender === "customer"
?
"customer-message"
:
"merchant-message";


box.innerHTML += `

<div class="chat-message ${style}">

<p>
${message.text}
</p>


<small class="chat-time">

${message.time}

</small>

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

time:new Date().toLocaleString(),

read:false

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


// ================= MESSAGE NOTIFICATION COUNT =================

function updateMessageCount(){

let countBox =
document.getElementById("messageCount");


if(!countBox) return;


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let customer =
JSON.parse(localStorage.getItem("customer"));


if(!customer){

return;

}


let unread = 0;


chats.forEach(function(chat){


if(chat.customerEmail === customer.email){


chat.messages.forEach(function(message){


if(
message.sender === "merchant" &&
!message.read
){

unread++;

}


});


}


});



countBox.innerText = unread;


if(unread === 0){

countBox.style.display="none";

}
else{

countBox.style.display="inline-block";

}


}



// ================= MARK MESSAGES READ =================

function markMessagesRead(){


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let customer =
JSON.parse(localStorage.getItem("customer"));



chats.forEach(function(chat){


if(chat.customerEmail === customer.email){


chat.messages.forEach(function(message){


if(message.sender==="merchant"){

message.read=true;

}


});


}


});


localStorage.setItem(
"chats",
JSON.stringify(chats)
);


updateMessageCount();

}

// ================= MERCHANT CONVERSATION LIST =================


function loadMerchantConversations(){


let box =
document.getElementById("merchantConversationList");


if(!box) return;



let merchant =
JSON.parse(localStorage.getItem("merchant"));



let chats =
JSON.parse(localStorage.getItem("chats")) || [];



if(!merchant){

box.innerHTML =
"<p>Please login as merchant</p>";

return;

}



let myChats =
chats.filter(function(chat){

return chat.merchantEmail === merchant.email;

});



box.innerHTML="";



if(myChats.length === 0){

box.innerHTML =
"<p>No customer conversations yet.</p>";

return;

}



myChats.forEach(function(chat){



let last =
chat.messages[
chat.messages.length - 1
];



box.innerHTML += `

<div class="product">


<h3>
💬 Customer
</h3>


<p>
${last ? last.text : "No messages"}
</p>


<small>
${last ? last.time : ""}
</small>



<button onclick="openMerchantChat(
'${chat.customerEmail}',
'${chat.productId}'
)">

Open Chat

</button>


</div>

`;

});


}



function openMerchantChat(customerEmail, productId){


localStorage.setItem(
"merchantCustomer",
customerEmail
);


localStorage.setItem(
"chatProduct",
productId
);


window.location.href =
"merchant-chat.html";


}

function updateMerchantMessageCount(){

let badge =
document.getElementById("messageCount");


if(!badge) return;


let merchant =
JSON.parse(localStorage.getItem("merchant"));


let chats =
JSON.parse(localStorage.getItem("chats")) || [];


let count = 0;


chats.forEach(function(chat){

if(chat.merchantEmail === merchant.email){


chat.messages.forEach(function(message){


if(
message.sender === "customer" &&
message.read === false
){

count++;

}


});


}

});


badge.innerText = count;


if(count === 0){

badge.style.display="none";

}
else{

badge.style.display="inline-block";

}


}
