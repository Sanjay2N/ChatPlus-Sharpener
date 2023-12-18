const User=require("../modals/user");
const Group=require("../modals/group");
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const userServices=require("../services/userService");
const { request, response } = require("express");
const {Op}=require("sequelize");


function isNotValidInput(inputs){
    for(input of inputs){
        if(input==='' || input==undefined){
            return true;
        }
    }
    return false;
    
}

exports.signUp=async(request,response)=>{
    try{
        const {name,email,phonenumber,password}=request.body;
        if(isNotValidInput([name,email,phonenumber,password])){
            return response.status(400).json('Please fill all fields');
        }
        const user=await userServices.getUserbyemail(email);
        if(user)return response.status(409).json('Email already exists');
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            await userServices.createUser(name,phonenumber,email,hash);
            return response.status(201).json({message:"successfull"});
        });
    }
    catch(error){
        console.log(error)
        return response.status(500).json(error);
    }
}



exports.logIn=async(request,response)=>{
    try{
        const {email,password}=request.body;
        const user=await userServices.getUserbyemail(email);
        if(!user)return response.status(404).json('User doesnt exists');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ userId: user.id }, process.env.SECRETE_KEY, { expiresIn: '1h' });
            response.cookie('token', token, { maxAge: 3600000 });
            return response.status(200).json({ message: "Login Successful" })
        } else {
            return response.status(401).json({ message: 'Invalid Password!' })
        }
        }
        catch(error){
            console.log(error);
            return response.status(500).json(error);
        }
}


exports.getAllUser=async(request,response)=>{
    try{
        const user=request.user;
        const userList= await User.findAll({where:{id:{ [Op.ne]: user.id}}});
        console.log("/////////////////////////////////////////////////////////////////////////////////////////////////")
        console.log(userList);
        return response.status(200).json(userList);
    }
    catch(error){
        console.log(error);
    }
}


exports.createGroup=async(request,response)=>{
    try{
        console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]")
        const user=request.user;
        console.log(request.body)
        const {name,description,members,nomember}=request.body;
        const group = await user.createGroup({
            name:name,
            description:description,
            nomember:nomember,
            AdminId: user.id
        })
        members.push(user.id);
        await group.addUsers(members.map((ele) => {
            return Number(ele)
        }));
        return response.status(200).json({ group, message: "Group is succesfylly created" })

    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"server error"});
    }
}

exports.getUserGroups=async (request,response)=>{
    try{
        const user=request.user;
        const groups=await user.getGroups();
        return response.status(200).json(groups);
    }
    catch(error){
        console.log(error)
        response.status(500).json({message:"server error"});
    }
    
    
}



exports.getGroupDetails=async(request,response)=>{
    try{
        const id=request.params.groupId;
        console.log(request.params)
        console.log(request.query)
        const groupDetail=await Group.findOne({where:{id:id}}); 
        return response.status(200).json(groupDetail);
    }
    catch(error){
        console.log(error)
        response.status(500).json({message:"server error"});
    }
    

}

exports.getGroupMembers=async(request,response)=>{
    try{
        const id = request.params.groupId;
        const group = await Group.findOne({ where: { id:id } });
        const usersData = await group.getUsers();
        const users = usersData.map((user) => {
            return {
                id: user.id,
                name: user.name,
            }
        })

        return response.status(200).json(users)
    }
    catch(error){
        console.log(error)
        response.status(500).json({message:"server error"});
    }
}


exports.getAllUsers=async (request,response)=>{
    try{
        const allUserData=await User.findAll({
            attributes: ['id', 'name', 'imgurl'],
            where:{id:{[Op.ne]:request.user.id}}
        });
        return response.status(200).json(allUserData);
    }
    catch(error){
        console.log(error)
        response.status(500).json({message:"server error"});
    }
}

exports.updateGroup=async (request,response)=>{
    try{

    
        const {groupId}=request.params;
        const user = request.user;
        const group = await Group.findOne({ where: { id:groupId } });
        const { name,description,members,nomember } = request.body;
        const updatedGroup = await group.update({
            name:name,
            nomember:nomember,
            description:description,
            AdminId: user.id
        })
        members.push(user.id);
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(members);
        return response.status(200).json({message: "Group is succesfylly updated" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}

exports.getuserDetails=async(request,response)=>{
    try{
        return response.status(200).json({userId:request.user.id});
    }
    catch(error){
        console.log(error)

        response.status(500).json({message:"server error"});

    }
}


exports.mainPage=(request,response)=>{
    response.status(200).sendFile("main.html",{root:"views"});
}