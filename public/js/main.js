const messageSection=document.querySelector("#message-section");
const messageInput=messageSection.querySelector("#message-input");
const sendButton=messageSection.querySelector("#send-button");
console.log(sendButton)


sendButton.addEventListener("click",sendMessage)

async function sendMessage(event){
    try{
        event.preventDefault();
        const messageContent=messageInput.value;
        if (messageContent==""){return;}
        const data={
            message:messageContent
        }
        console.log(axios)
        console.log(",jnuwegyfyubfewb")
        await axios.post("http://localhost:2000/chat/messages",data);
        addMessage(messageContent);
        messageInput.value="";
    }
    catch(error){
        
        console.log(error);
    }
    
}
document.addEventListener("DOMContentLoaded",getMessages);
// getMessages();
async function getMessages(event){
    try{
        console.log(".........................................")
        console.log(axios)
        event.preventDefault();
        const messages=await axios.get("http://localhost:2000/chat/messages");
        console.log(messages.data)
        showMessage(messages.data)

    }
    catch(error){
        console.log(error)
    }
}

const messageList=messageSection.querySelector("#message-list");
function showMessage(messages){
    for (let item of messages){
        messageList.innerHTML+=`<div class="flex mb-4">
        <div class="w-7 h-7 bg-gray-500 rounded-full"></div>
        <div class="ml-2 p-2 bg-white rounded-md">${item.message}</div>
    </div>`
    }
}
function addMessage(message){
    messageList.innerHTML+=`<div class="flex mb-4">
    <div class="w-7 h-7 bg-gray-500 rounded-full"></div>
    <div class="ml-2 p-2 bg-white rounded-md">${message}</div>
    </div>`
    
}