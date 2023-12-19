let groupId=1;
const socket = io(window.location.origin);
// socket.on('common-message', () => {
//     if (formElements.message_btn.id == 0) {
//         ShowCommonChats();
//     }

// })
socket.on('group-message', (Id) => {
    if (groupId== Id) {
        getMessages(groupId);
    }
})



const messageSection=document.querySelector("#message-section");
const messageInput=messageSection.querySelector("#message-input");
const sendButton=messageSection.querySelector("#send-button");



sendButton.addEventListener("click",sendMessage)

async function sendMessage(event){
    try{
        event.preventDefault();
        const messageContent=messageInput.value;
        if (messageContent==""){return;}
        const data={
            message:messageContent,
            groupId:groupId
        }
        console.log(axios)
        console.log(",jnuwegyfyubfewb")
        await axios.post("http://localhost:2000/chat/messages",data);
        addMessage(messageContent);
        messageInput.value="";
        socket.emit('new-group-message', groupId)
        getMessages(groupId);
    }
    catch(error){
        
        console.log(error);
    }
    
}
// document.addEventListener("DOMContentLoaded",getMessages);
getMessages(groupId);
async function getMessages(groupId){
    try{
        console.log(".........................................")
        if(groupId==1){
            const chatHistory=localStorage.getItem("chatHistory");
        // console.log("length ",chatHistory.length)
        if(chatHistory && chatHistory.length>2){
            console.log("inside of the not null")
            parsedChatHistory=JSON.parse(chatHistory);
            console.log("inide of the not null")
            const lastMessageId=parsedChatHistory[parsedChatHistory.length-1].id;

            console.log(parsedChatHistory)
            console.log("last mes",lastMessageId)
            const response=await axios.get(`http://localhost:2000/chat/messages/${groupId}?lastMessageId=${lastMessageId}`);
            const mergedListOfMessages=[...parsedChatHistory,...response.data];
            cachingChats = mergedListOfMessages.slice(-1000);
            console.log("sssssssss :",cachingChats)
            
        }
        else{
            console.log("inside of the null")
            const response=await axios.get(`http://localhost:2000/chat/messages/${groupId}?lastMessageId=${0}`);
            const messages=response.data;
            cachingChats = messages.slice(-1000);
            console.log("sssssssss :",cachingChats)


        }
        localStorage.setItem("chatHistory",JSON.stringify(cachingChats));
        // console.log(messages.data)
        showMessage(cachingChats)
        }
        const response=await axios.get(`http://localhost:2000/chat/messages/${groupId}?lastMessageId=${0}`);
        const messages=response.data;
        console.log("print inside of teh get mesages")
        showMessage(messages);
  

    }
    catch(error){
        console.log(error)
    }
}

const messageList=messageSection.querySelector("#message-list");
function showMessage(messages){
    messageList.innerHTML="";
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



//left half of page

// create group
const groupModalButton=document.querySelector("#group-modal-button");
const groupForm=document.querySelector("#group-form");
const groupFormElements={
    name:groupForm.querySelector("#group-name"),
    description:groupForm.querySelector("#group-description"),
    members:groupForm.querySelector("ul"),
    submit:groupForm.querySelector("#submit"),
    title:document.querySelector("#title"),
    id:groupForm.querySelector("#group-id")
};
groupModalButton.addEventListener("click",showAllUser);
async function  showAllUser(event){
    event.preventDefault();
    const userList=await axios.get("http://localhost:2000/user/getuserlist");
    console.log("user list ",userList);
    groupFormElements.members.innerHTML="";
    userList.data.forEach(user=>{
        groupFormElements.members.innerHTML+=`                                    
        <li class="flex  justify-content-between">
            <div class="flex  align-items-center justify-content-between">
                <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
                    class="rounded-circle me-3" style="width: 35px; height: 35px;">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="" name="users" value="${user.id}">
        </li>`
    })

}

groupFormElements.submit.onclick=createGroup;

async function createGroup(event){
    event.preventDefault();
    const name=groupFormElements.name.value;
    const description=groupFormElements.description.value;
    const groupMembers= Array.from(groupFormElements.members.querySelectorAll('input[name="users"]:checked'))
                .map(checkbox => checkbox.value);
    console.log(groupMembers);
    if (name && description) {
        const data={
            name:name,
            description:description,
            members:groupMembers,
            nomember:groupMembers.length+1
        }
        if(groupFormElements.id.value==0){
            await axios.post("http://localhost:2000/user/creategroup",data);
            alert("Group created successfully!");
        }
        else{
            await axios.post(`/user/updategroup/${groupFormElements.id.value}`,data);
            alert("Group updated successfully!")

        }
        
    }
}

const leftSide=document.querySelector("#leftpage");
const groupList=leftSide.querySelector("#group-list");


async function showGroup() {
    try {
        groupList.innerHTML=""
        const groupsResponse = await axios.get(`user/usergroups`);
        const userGroups = groupsResponse.data;
        console.log(groupsResponse)
        groupList.innerHTML=`<li class="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer bg-gray-400 text-white" id="group-1" onclick="switchGroup(1)">
        <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-500 rounded-full"></div>
            <span class="ml-2">Common Group</span>
        </div>
        <span class="text-xs">2h ago</span>
    </li>`

    // <li class="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer">
    //     <div class="flex items-center">
    //         <div class="w-8 h-8 bg-gray-500 rounded-full"></div>
    //         <span class="ml-2">${group.name}</span>
    //         <input type="text" value="${group.id}">
    //     </div>
    //     <span class="text-xs">2h ago</span>
    // </li>
    
        userGroups.forEach(group=>{
            groupList.innerHTML+=`<li class="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer" id="group-${group.id}" onclick="switchGroup(${group.id})">
            <div class="flex items-center" id="${group.id}">
                <div class="w-8 h-8 bg-gray-500 rounded-full"></div>
                <span class="ml-2">${group.name}</span>
            </div>
            <span class="text-xs">2h ago</span>
        </li>
    
    `
        })
       

    } catch (error) {
        console.log(error);
    }
}

showGroup()

function switchGroup(id){
    alterGroupStyle(groupId,id);
    groupId=id;
    setUpGroupHeader(groupId);
    getMessages(groupId)

}
const groupElements={
    groupName:messageSection.querySelector("#group-name"),
    groupEdit:messageSection.querySelector("#group-edit")
}
async function setUpGroupHeader(groupId){
    try{
        const groupResponse=await axios.get(`user/group/${groupId}`);
        const userResponse=await axios.get('user/getuserdetails');
        const groupDetails=groupResponse.data;
        const userId=userResponse.data.userId;
        groupElements.groupName.innerText=groupDetails.name;
        console.log(userId,groupDetails.AdminId)
        if(userId===groupDetails.AdminId){
            groupElements.groupEdit.classList.remove("hidden");
        }

    }
    catch(error){
        console.log(error);
    }
}

groupElements.groupEdit.addEventListener("click",showGroupDetails);

async function showGroupDetails(){
    try{
        const groupResponse=await axios.get(`user/groupmembers/${groupId}`);
        const usersResponse=await axios.get('user/getusers');
        const groupMembers=groupResponse.data;
        const users=usersResponse.data;
        console.log(users)
        let memberSet=new Set(groupMembers.map(member=> member.id));
        console.log("member set ",memberSet)
        groupFormElements.members.innerHTML="";
        let HTMLcontent='';
        users.forEach(user=>{
            if(memberSet.has(user.id)){
                console.log("inside for user ",user.id)
                HTMLcontent+=`                                    
            <li class="flex  justify-content-between">
                <div class="flex  align-items-center justify-content-between">
                    <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
                        class="rounded-circle me-3" style="width: 35px; height: 35px;">
                    <h6><strong class="mb-1">${user.name}</strong></h6>
                </div>
                <input type="checkbox" class="" name="users" value="${user.id}" checked>
            </li>`
            }
            else{
                HTMLcontent+=`                                    
            <li class="flex  justify-content-between">
                <div class="flex  align-items-center justify-content-between">
                    <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
                        class="rounded-circle me-3" style="width: 35px; height: 35px;">
                    <h6><strong class="mb-1">${user.name}</strong></h6>
                </div>
                <input type="checkbox" class="" name="users" value="${user.id}">
            </li>`
            }
            
        });
        groupFormElements.members.innerHTML=HTMLcontent;
        const groupResponse1=await axios.get(`user/group/${groupId}`);
        const groupDetails=groupResponse1.data;
        groupFormElements.name.value=groupDetails.name;
        groupFormElements.description.value=groupDetails.description;
        groupFormElements.title.innerText=`Edit ${groupDetails.name} Group`;
        groupFormElements.submit.innerText="Update Details"
        groupFormElements.id.value=groupDetails.id;


    }
    catch(error){
        console.log(error);
    }
} 

function alterGroupStyle(prevId,curId){
    const preGroup=groupList.querySelector(`#group-${prevId}`);
    const curGroup=groupList.querySelector(`#group-${curId}`);
    preGroup.classList.remove("bg-gray-400","text-white");
    preGroup.classList.add("text-black","bg-white");
    curGroup.classList.remove("text-black","bg-white");
    curGroup.classList.add("bg-gray-400","text-white");

    
}

