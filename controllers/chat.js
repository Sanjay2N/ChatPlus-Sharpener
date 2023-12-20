const { response, request } = require("express");
const awsService=require("../services/awsServices");
const Chat=require("../modals/chatHistory");
const {Op}=require("sequelize");
const { RequestSmsRecipientExport } = require("sib-api-v3-sdk");


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


exports.sendImage=async(request,response)=>{
    try{
        const user = request.user;
        const image = request.file;
        const { groupId } = request.body;
        console.log(user.id,groupId)
        const filename = `chat-images/group${groupId}/user${user.id}/${Date.now()}_${image.originalname}`;
        const imageUrl = await awsService.uploadToS3(image.buffer, filename)

       
        await user.createChathistory({
            message: imageUrl,
            groupId:groupId,
            isImage: true
        })
        

        return response.status(200).json({ message: "image saved to database succesfully" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
