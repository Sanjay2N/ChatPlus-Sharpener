const { response } = require("express");
const Chat=require("../modals/chatHistory");
const {Op}=require("sequelize");


exports.sendMessage=async (request,response)=>{
    try{
        console.log(request.user)
        const user=request.user;
        const {message,groupId}=request.body;
        if(!message){
            return response.status(400).json({success:false});
        }
        // console.log(user)
       
        await user.createChathistory({
            message,groupId
        });
        return response.status(201).json({success:true})
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"server error"});
    }
    

}


exports.getMessage=async (request,response)=>{
    try{
        console.log("............................",request.params)
        console.log("/////////////////////////",request.query)

        let {lastMessageId}=request.query;
       console.log("last mess id ",lastMessageId)
        const { groupId } = request.params;
        const user=request.user;
        const userChats=await Chat.findAll({where:{groupId:groupId,id:{[Op.gt]:lastMessageId}}});
        return response.status(201).json(userChats)
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"server error"});
    }
    

}