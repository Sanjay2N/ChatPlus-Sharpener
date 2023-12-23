let groupId=0;
const socket = io(window.location.origin);
socket.on('group-message', (Id) => {
    if (groupId== Id) {
        getMessages(groupId);
    }
})


// navbar
const navDropdown=document.querySelector("#dropdownDivider");
const navDropdownItems={
    profile:navDropdown.querySelector("#profile-button"),
    setting:navDropdown.querySelector("#setting-button"),
    logout:navDropdown.querySelector("#logout-button")

}

// logout 
navDropdownItems.logout.onclick=logout;
function logout(){
    document.cookie = 'token=; expires=Thu, 01 Jan 2023 00:00:00 UTC; path=/;';
    window.location.href="home";
}

navDropdownItems.profile.onclick=setUpProfile;
const profileModal=document.querySelector("#profile-modal");
const profileElement={
    name:profileModal.querySelector("#profile-name"),
    email:profileModal.querySelector("#profile-email"),
    image:profileModal.querySelector("#profile-image"), 
    phoneNumber:profileModal.querySelector("#profile-pnumber"),
}

async function setUpProfile(){
    try{
        const response=await axios.get("user/userdetails");
        const userDetails=response.data;
        profileElement.image.src=`https://picsum.photos/seed/${userDetails.userId}/200`
        profileElement.name.innerText=userDetails.name;
        profileElement.email.innerText=userDetails.email;
        profileElement.phoneNumber.innerText=userDetails.phonenumber;
       
    }
    catch(error){
        if(error && error.response.status==401){
            alert("Session timeout,Pls login again..")
        }
        else{
            console.log(error);
        }
    }
}

// right half of page
// messaging section
const messageSection=document.querySelector("#message-section");
const chatForm=messageSection.querySelector("#chat-form");
const chatFormElements={
    messageInput:chatForm.querySelector("#message-input"),
    sendButton:chatForm.querySelector("#send-button"),
    fileInput:chatForm.querySelector('#fileInput'),
    chatType:chatForm.querySelector('#chat-type'),
    emojiButton:chatForm.querySelector("#emoji-button"),
    emojiCloseButton:chatForm.querySelector("#emoji-container-close")
}

chatFormElements.sendButton.addEventListener("click",sendMessage)

function handleFileSelect() {
    try{
        if (fileInput.files.length > 0) {
            const selectedFileName = chatFormElements.fileInput.files[0].name;
            chatFormElements.messageInput.value = `Selected File: ${selectedFileName}`;
            chatFormElements.chatType.value="image";
          } else {
              chatFormElements.messageInput.value = ``;
          }
    }
    catch(error){
        console.log(error);
    }
    
  }

// emoji container part

chatFormElements.emojiButton.onclick=showEmojiKeyboard;
const emojiContainer=document.querySelector("#emojiPickerContainer");
const pickerOptions = { onEmojiSelect: addEmojiToInput }
const picker = new EmojiMart.Picker(pickerOptions)
emojiContainer.appendChild(picker)
function showEmojiKeyboard(event){
    event.preventDefault();
    emojiContainer.classList.remove("hidden");
    chatFormElements.emojiButton.classList.add("hidden");
    chatFormElements.emojiCloseButton.classList.remove("hidden");
    
}
chatFormElements.emojiCloseButton.onclick=closeEmojiContainer;
function closeEmojiContainer(event){
    event.preventDefault();
    chatFormElements.emojiCloseButton.classList.add("hidden");
    emojiContainer.classList.add("hidden");
    chatFormElements.emojiButton.classList.remove("hidden");

}

function addEmojiToInput(emoji){
    chatFormElements.messageInput.value+=emoji.native;
}

// send message
async function sendMessage(event){
    try{
        event.preventDefault();
        if(chatFormElements.chatType.value==="text"){
            const messageContent=chatFormElements.messageInput.value;
            if (messageContent==""){return;}
            const data={
                message:messageContent,
                groupId:groupId
            }
            await axios.post("chat/message",data);
        }
        else{
            const file = chatFormElements.fileInput.files[0];
            const formData = new FormData();
            formData.append('image', file);
            formData.append('groupId',groupId)
            await axios.post('chat/image',formData);

        }
        chatForm.reset();
        socket.emit('new-group-message', groupId)
        getMessages(groupId);
    }
    catch(error){
        if(error && error.response.status==401){
            alert("Session timeout,Pls login again..")
        }
        else{
            console.log(error);
        }
    }
    
}

// get message
async function getMessages(groupId){
    try{
        const response=await axios.get('user/userdetails');
        const userId=response.data.userId;
        if(groupId==1){
            const chatHistory=localStorage.getItem("chatHistory");
            if(chatHistory && chatHistory.length>2){
                parsedChatHistory=JSON.parse(chatHistory);
                const lastMessageId=parsedChatHistory[parsedChatHistory.length-1].messageId;
                const response=await axios.get(`chat/messages/${groupId}?lastMessageId=${lastMessageId}`);
                const mergedListOfMessages=[...parsedChatHistory,...response.data];
                cachingChats = mergedListOfMessages.slice(-1000);
            }
            else{
                const response=await axios.get(`chat/messages/${groupId}?lastMessageId=${0}`);
                const messages=response.data;
                cachingChats = messages.slice(-1000);
            }
            localStorage.setItem("chatHistory",JSON.stringify(cachingChats));
            showMessage(cachingChats,userId)
        }
        else{
            const response=await axios.get(`chat/messages/${groupId}?lastMessageId=${0}`);
            const messages=response.data;
            showMessage(messages,userId);
        }
    }
    catch(error){
        if(error && error.response.status==401){
            alert("Session timeout,Pls login again..")
        }
        else{
            console.log(error);
        }
    }
}

// show message on screen
const messageList=messageSection.querySelector("#message-list");
function showMessage(messages,userId){
    const urlRegex = /^(https?:\/\/[^\s]+)/;
    messageList.innerHTML="";
    let HTMLcontent='';
    for (let item of messages){
      const date = new Date(item.date);
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDate = date.toLocaleString('en-US', options);
        if(item.userId==userId){
            if(item.isImage===true){
                HTMLcontent+=`
                    <div class="flex mb-3 w-full">
                        <div class="flex ml-auto">
                            <div class="py-2 px-2 bg-gradient-to-r from-violet-600  via-purple-600 to-purple-500 rounded-l-xl rounded-br-xl shadow-lg">
                                <div class="block text-sky-300 text-sm mb-1"><span>you</span></div>
                                <div class="block text-black my-1"><img class="w-50 h-40" src="${item.message}" alt=""></div>
                                <div class="flex text-xs text-gray-200 "><span class="ml-auto">${formattedDate}</span></div>
                            </div>
                            <div class="ml-1"><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${userId}/200" alt=""></div>
                        </div>
                    </div>`
            }
            else if(urlRegex.test(item.message)){
                HTMLcontent+=`
                    <div class="flex mb-3 w-full">
                        <div class="flex ml-auto w-3/5">
                            <div class=" py-1 px-2 max-w-lg ml-auto bg-gradient-to-r from-violet-600  via-purple-600 to-purple-500 rounded-l-xl rounded-br-xl shadow-lg">
                                <div class="flex mr-auto  text-sky-300 text-sm"><span>you</span></div>
                                <div class="flex  w-full  px-0 text-black text-base font-normal mb-1  break-all"><a target="_blank" class="  text-cyan-400  whitespace-normal" href="${item.message}">${item.message}iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</a></div>
                                <div class="flex   text-xs text-gray-200 "><span class="ml-auto w-fit">${formattedDate}</span></div>
                            </div>
                            <div class="ml-1 w-8"><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${userId}/200" alt=""></div>
                        </div>
                    </div>`
               
            }
            else{
                HTMLcontent+=` 
                    <div class="flex mb-3 w-full">
                        <div class="flex ml-auto w-3/5">
                            <div class=" py-1 px-2 max-w-lg ml-auto bg-gradient-to-r from-violet-600  via-purple-600 to-purple-500 rounded-l-xl rounded-br-xl shadow-lg">
                                <div class="flex mr-auto  text-sky-300 text-sm"><span>you</span></div>
                                <div class="flex  w-full  px-0 text-white text-base font-normal mb-1  break-all"><span class="">${item.message}</span></div>
                                <div class="flex   text-xs text-gray-200 "><span class="ml-auto w-fit">${formattedDate}</span></div>
                            </div>
                            <div class="ml-1 w-8"><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${userId}/200" alt=""></div>
                        </div>
                    </div>`
            }
        }
        else{
            if(item.isImage===true){
                HTMLcontent+=`
                    <div class="flex mb-3">
                        <div class="mr-1 "><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${item.userId}/200" alt=""></div>
                            <div class="py-1 px-2 bg-white rounded-r-xl rounded-bl-xl shadow-lg">
                                <div class="block text-sky-500 text-sm "><span>${item.name}</span></div>
                                <div class="block text-black my-1"><img class="w-50 h-40" src="${item.message}" alt=""></div>
                                <div class="flex text-xs text-gray-400 "><span class="ml-auto">${formattedDate}</span></div>
                            </div>
                        </div>
                    </div>`
            }
            else if(urlRegex.test(item.message)){
                HTMLcontent+=`
                    <div class="flex  w-3/5 mb-3">
                        <div class="mr-1 w-8"><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${item.userId}/200" alt=""></div>
                            <div class=" py-1 px-2 max-w-lg  bg-white rounded-r-xl rounded-bl-xl shadow-lg">
                                <div class="flex mr-auto  text-sky-300 text-sm"><span>${item.name}</span></div>
                                <div class="flex  w-full  px-0 text-black text-base font-normal mb-1  break-all"><a target="_blank" class="  text-blue-400  whitespace-normal" href="${item.message}">${item.message}kjewffffffffffffffffffffffffjfddddddffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</a></div>
                                <div class="flex   text-xs text-gray-400 "><span class="ml-auto w-fit">${formattedDate}</span></div>
                            </div>
                        </div>
                    </div>`
            }
            else{
                HTMLcontent+=`
                    <div class="flex  w-3/5 mb-3">
                        <div class="mr-1 w-8"><img class="rounded-full w-8 h-8" src="https://picsum.photos/seed/${item.userId}/200" alt=""></div>
                            <div class=" py-1 px-2 max-w-lg  bg-white rounded-r-xl rounded-bl-xl shadow-lg">
                                <div class="flex mr-auto  text-sky-300 text-sm"><span>${item.name}</span></div>
                                <div class="flex  w-full  px-0 text-black text-base font-normal mb-1  break-all"><span class="">${item.message}</span></div>
                                <div class="flex   text-xs text-gray-400 "><span class="ml-auto w-fit">${formattedDate}</span></div>
                            </div>
                        </div>
                    </div>`
            }
        }
    }
    messageList.innerHTML=HTMLcontent;
}



//left half of page

// create group
const pageLeft=document.querySelector("#page-left");
const groupModalButton=pageLeft.querySelector("#group-modal-button");
const groupForm=document.querySelector("#group-form");
const groupFormElements={
    name:groupForm.querySelector("#group-name"),
    description:groupForm.querySelector("#group-description"),
    userSearch:groupForm.querySelector("#group-members"),
    members:groupForm.querySelector("#member-list"),
    submit:groupForm.querySelector("#submit"),
    title:document.querySelector("#title"),
    id:groupForm.querySelector("#group-id"),
    close:document.querySelector("#group-modal-close")
};
groupModalButton.addEventListener("click",(event)=>{
    groupFormElements.title.innerText=`Create Group`;
    groupFormElements.submit.innerText="Create";
    groupForm.reset();
    showAllUser(event)
});

// show all user in create group form
async function  showAllUser(event){
    try{
        event.preventDefault();
        const userList=await axios.get("user/userlist");
        groupFormElements.members.innerHTML="";
        userList.data.forEach(user=>{
            groupFormElements.members.innerHTML+=`                                    
                    <li class="flex  justify-content-between mb-2">
                        <div class="flex  ml-2 align-items-center justify-content-between">
                            <img src="https://picsum.photos/seed/${user.id}/200"  alt="Profile Picture" class="rounded-full w-7 h-7">
                            <span class="font-semibold text-black ml-4" id="name">${user.name}</span>
                        </div>
                        <input type="checkbox" class="ml-10 mt-1" name="users" value="${user.id}" >
                    </li>`
        });
    }
    catch(error){
        if(error && error.response.status==401){
            alert("Session timeout,Pls login again..")
        }
        else{
            console.log(error);
        }
    }
}

//search user in create group form
groupFormElements.userSearch.addEventListener("keyup",searchUser);
function searchUser(e){
    search(e,groupFormElements.members);
}

// create new  group
groupFormElements.submit.onclick=createGroup;
async function createGroup(event){
    try{
        event.preventDefault();
        const name=groupFormElements.name.value;
        const description=groupFormElements.description.value;
        const groupMembers= Array.from(groupFormElements.members.querySelectorAll('input[name="users"]:checked'))
                    .map(checkbox => checkbox.value);
        if (name && description) {
            const data={
                name:name,
                description:description,
                members:groupMembers,
                nomember:groupMembers.length+1
            }
            if(groupFormElements.id.value==0){
                await axios.post("user/creategroup",data);
                groupFormElements.close.click();
                alert("Group created successfully!");
            }
            else{
                await axios.post(`user/updategroup/${groupFormElements.id.value}`,data);
                groupFormElements.close.click();
                alert("Group updated successfully!");
                setUpGroupHeader(groupId);
            }
            showGroup();
            groupForm.reset();
        }
    }
    catch(error){
        if(error.response && error.response.status === 400){
            alert("Group name already exists !!")
        }
        else if(error.response && error.response.status === 401){
            alert("Session timeout,Pls login again ...")
        }
        else{
            console.log(error)
        }
    }

}

// show group on screen
const groupList=pageLeft.querySelector("#group-list");
async function showGroup() {
    try {
        groupList.innerHTML=""
        const groupsResponse = await axios.get(`user/usergroups`);
        const lastSeen=await axios.get("user/lastseen");
        const lastSeenObj={}
        for(ele of lastSeen.data){
            lastSeenObj[ele.groupId]=ele.last_seen_at;
        }
        const userGroups = groupsResponse.data;
        userGroups.forEach(group=>{
            groupList.innerHTML+=`
                <li  class="flex items-center shadow-lg bg-white text-black rounded-xl mb-2 mx-3 justify-between p-2 tracking-tight overflow-hidden hover:bg-gray-100 cursor-pointer " id="group-${group.id}" title="${group.description}" onclick="switchGroup(${group.id})">
                    <div class="flex items-center" >
                        <div class="w-10 h-10  rounded-full">
                            <img class="rounded-full" src='https://picsum.photos/seed/${200+group.id}/200' alt="group-logo">
                        </div>
                        <div class="block">
                            <span class="block  font-semibold text-base ml-2" id="name">${group.name}</span>
                            <div class="flex w-4/5">
                            <span class="text-sm  ml-2 truncate overflow-hidden">${group.description}</span>
                            </div>
                        </div>
                    </div>
                    <span class="text-xs text-sky-400" id="lastseen-${group.id}">${calculateLastSeen(lastSeenObj[group.id])}</span> 

                </li>`
        })

    } catch (error) {
        if(error.response && error.response.status === 401){
            alert("Session timeout,Pls login again ...")
        }
        else{
            console.log(error)
        }
    }
}




function calculateLastSeen(lastSeenTime) {
    const currentTimestamp = new Date().getTime();
    const lastSeenDate = new Date(lastSeenTime).getTime();
    const timeDifference = currentTimestamp - lastSeenDate;
    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
      return `now`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
}
showGroup()


//group search bar
const searchBar=pageLeft.querySelector("#group-search");
searchBar.addEventListener("keyup",searchGroup);
function searchGroup(e){
    search(e,groupList);
}
function search(e,ulElement) {
    const text = e.target.value.toLowerCase();
    const ulItems = Array.from(ulElement.querySelectorAll('li'));
    ulItems.forEach(item=>{
        itemName=item.querySelector("#name").textContent;
        if(itemName.toLowerCase().indexOf(text)!=-1){
            item.classList.add("flex");
            item.classList.remove("hidden")
        }
        else{
            item.classList.add("hidden");
            item.classList.remove("flex")
        }
    });
}

const appIntro=document.querySelector("#app-intro");
function switchGroup(id){
    if(groupId!=0){
        updateLastSeen(groupId);
    }
    else{
        appIntro.classList.add("hidden");
        messageSection.classList.remove("hidden");
    }
    alterGroupStyle(groupId,id);
    groupId=id;
    setUpGroupHeader(groupId);
    getMessages(groupId);

}

async function updateLastSeen(groupId){
    try{
        await axios.put(`user/lastseen/${groupId}`);
        groupList.querySelector(`#lastseen-${groupId}`).innerText="now";
    }
    catch(error){
        if(error.response && error.response.status === 401){
            alert("Session timeout,Pls login again ...")
        }
        else{
            console.log(error)
        }
    }
}

const groupElements={
    groupName:messageSection.querySelector("#group-name"),
    groupProfileImage:messageSection.querySelector("#group-profile-img"),
    groupUsers:messageSection.querySelector("#group-members"),
    groupNoMembers:messageSection.querySelector("#nomember"),
    groupEdit:messageSection.querySelector("#group-edit")
}
async function setUpGroupHeader(groupId){
    try{
        const groupResponse=await axios.get(`user/group/${groupId}`);
        const userResponse=await axios.get('user/userdetails');
        const groupDetails=groupResponse.data.groupDetails;
        const groupMembers=groupResponse.data.groupMembers;
        let memberString='';
        for( ele of groupMembers){
            if(memberString!=""){
                memberString+=",";
            }
            memberString+=ele.name;
        }
        const userId=userResponse.data.userId;
        groupElements.groupName.innerText=groupDetails.name;
        groupElements.groupProfileImage.src=`https://picsum.photos/seed/${200+groupDetails.id}/200`;
        groupElements.groupNoMembers.innerHTML=`${groupDetails.nomember} Members`;
        groupElements.groupNoMembers.title=memberString;
        groupElements.groupUsers.innerText=memberString;
        if(userId===groupDetails.AdminId){
            groupElements.groupEdit.classList.remove("hidden");
        }
    }
    catch(error){
        if(error.response && error.response.status === 401){
            alert("Session timeout,Pls login again ...")
        }
        else{
            console.log(error)
        }
    }
}

groupElements.groupEdit.addEventListener("click",showGroupDetails);

async function showGroupDetails(){
    try{
        const groupResponse=await axios.get(`user/groupmembers/${groupId}`);
        const usersResponse=await axios.get('user/users');
        const groupMembers=groupResponse.data;
        const users=usersResponse.data;
        let memberSet=new Set(groupMembers.map(member=> member.id));
        groupFormElements.members.innerHTML="";
        let HTMLcontent='';
        users.forEach(user=>{
            if(memberSet.has(user.id)){
                console.log("inside for user ",user.id)
                HTMLcontent+=`                                    
                    <li class="flex  justify-content-between mb-2">
                        <div class="flex  ml-2 align-items-center justify-content-between">
                            <img src="https://picsum.photos/seed/${user.id}/200"  alt="Profile Picture" class="rounded-full w-7 h-7">
                            <span class="font-semibold text-black ml-4" id="name">${user.name}</span>
                        </div>
                        <input type="checkbox" class="ml-10 mt-1" name="users" value="${user.id}" checked>
                    </li>`
            }
            else{
                HTMLcontent+=`                                    
                    <li class="flex  justify-content-between mb-2">
                        <div class="flex  ml-2 align-items-center justify-content-between">
                            <img src="https://picsum.photos/seed/${user.id}/200"  alt="Profile Picture" class="rounded-full w-7 h-7">
                            <span class="font-semibold text-black ml-4" id="name">${user.name}</span>
                        </div>
                        <input type="checkbox" class="ml-10 mt-1" name="users" value="${user.id}">
                    </li>`
            }
            
        });
        groupFormElements.members.innerHTML=HTMLcontent;
        const groupResponse1=await axios.get(`user/group/${groupId}`);
        const groupDetails=groupResponse1.data.groupDetails;
        groupFormElements.name.value=groupDetails.name;
        groupFormElements.description.value=groupDetails.description;
        groupFormElements.title.innerText=`Edit ${groupDetails.name} Group`;
        groupFormElements.submit.innerText="Update Details"
        groupFormElements.id.value=groupDetails.id;
    }
    catch(error){
        if(error.response && error.response.status === 401){
            alert("Session timeout,Pls login again ...")
        }
        else{
            console.log(error)
        }
    }
} 

function alterGroupStyle(prevId,curId){
    if(prevId!=0){
        const preGroup=groupList.querySelector(`#group-${prevId}`);
        preGroup.classList.remove("bg-gray-800","text-white","hover:bg-gray-950");
        groupElements.groupEdit.classList.add("hidden");
    }
    const curGroup=groupList.querySelector(`#group-${curId}`);
    curGroup.classList.add("bg-gray-800","text-white","hover:bg-gray-950");
}

