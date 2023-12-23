const { response, request } = require("express");
const awsService=require("../services/awsServices");
const Chat=require("../modals/chatHistory");
const User=require("../modals/user");
const {Op, Model}=require("sequelize");

exports.sendMessage=async (request,response)=>{
    try{
        const user=request.user;
        const {message,groupId}=request.body;
        if(!message){
            return response.status(400).json({success:false});
        }
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
        let {lastMessageId}=request.query;
        const { groupId } = request.params;
        const user=request.user;
        const chats=await Chat.findAll(
            {
                include: [
                    {
                        model: User,
                        attibutes: ['id', 'name']
                    }
                ],
                order: [['date', 'ASC']],
                where: {
                    groupId:groupId,
                    id:{[Op.gt]:lastMessageId}
                }
            });
        const userChats=chats.map(chat=>{
            return {
                messageId: chat.id,
                message: chat.message,
                isImage: chat.isImage,
                name: chat.user.name,
                userId: chat.userId,
                date: chat.date
            }
        })
   
        return response.status(200).json(userChats)
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Internal Server error!"});
    }
}


exports.sendImage=async(request,response)=>{
    try{
        const user = request.user;
        const image = request.file;
        const { groupId } = request.body;
        const filename = `chat-images/group${groupId}/user${user.id}/${Date.now()}_${image.originalname}`;
        const imageUrl = await awsService.uploadToS3(image.buffer, filename)
        await user.createChathistory({
            message: imageUrl,
            groupId:groupId,
            isImage: true
        });
        return response.status(201).json({ message: "image saved to database succesfully" })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
