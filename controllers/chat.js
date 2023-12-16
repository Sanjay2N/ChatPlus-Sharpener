const { response } = require("express");
const Chat=require("../modals/chat");


exports.sendMessage=async (request,response)=>{
    try{
        console.log(request.user)
        const user=request.user;
        const {message}=request.body;
        if(!message){
            return response.status(400).json({success:false});
        }
        await user.createChat({message:message});
        return response.status(201).json({success:true})
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"server error"});
    }
    

}


exports.getMessage=async (request,response)=>{
    try{
        console.log(request.user)
        const user=request.user;
        const userChats=await user.getChats();
        return response.status(201).json(userChats)
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"server error"});
    }
    

}