const User=require("../modals/user");
const Group=require("../modals/group");
const LastSeen=require("../modals/lastSeen");
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const userServices=require("../services/userService");
const { request, response } = require("express");
const {Op, Sequelize}=require("sequelize");
const sequelize = require("../util/database");


function isNotValidInput(inputs){
    for(input of inputs){
        if(input==='' || input==undefined){
            return true;
        }
    }
    return false;
}

exports.signUp=async(request,response)=>{
    const t= await sequelize.transaction();
    try{
        const {name,email,phonenumber,password}=request.body;
        if(isNotValidInput([name,email,phonenumber,password])){
            return response.status(400).json('Please fill all fields');
        }
        const user=await userServices.getUserbyemail(email);
        if(user)return response.status(409).json('Email already exists');
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            const user=await userServices.createUser(name,phonenumber,email,hash);
            const group=await Group.findByPk(1);
            group.addUsers(user.id);
            await LastSeen.create({
                userId:user.id,
                groupId:1
            })
            return response.status(201).json({message:"successfull"});
        });
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});
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
            return response.status(500).json({message:"Server error"});
        }
}


exports.getAllUser=async(request,response)=>{
    try{
        const user=request.user;
        const userList= await User.findAll({where:{id:{ [Op.ne]: user.id}}});
        return response.status(200).json(userList);
    }
    catch(error){
        console.log(error);
        return response.status(500).json({message:"Server error"});
    }
}


exports.createGroup=async(request,response)=>{
    const t= await sequelize.transaction();
    try{
        const user=request.user;
        const {name,description,members,nomember}=request.body;
        const group = await user.createGroup({
            name:name,
            description:description,
            nomember:nomember,
            AdminId: user.id
        },{transaction:t})
        members.push(user.id);
        for(memberId of members){
            await group.addUsers(memberId,{transaction:t});
            await LastSeen.create({userId:memberId,groupId:group.id},{transaction:t});
        }
        await t.commit();
        return response.status(200).json({ group, message: "Group is succesfylly created" })
    }
    catch(error){
        await t.rollback();
        console.log(error)
        if(error && error.name==="SequelizeUniqueConstraintError"){
            return response.status(400).json({message:"Group name already exists"});
        }
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
        return response.status(500).json({message:"Server error"});
    }
}



exports.getGroupDetails=async(request,response)=>{
    try{
        const id=request.params.groupId;
        const group=await Group.findOne({where:{id:id}}); 
        const members=await group.getUsers();
        return response.status(200).json({groupDetails:group,groupMembers:members});
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});
    }
}

exports.userLastSeens=async(request,response)=>{
    try{
        const user=request.user;
        const lastSeens=await LastSeen.findAll({where:{userId:user.id}});
        return response.status(200).send(lastSeens);
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});
    }
}

exports.updateUserLastSeen=async(request,response)=>{
    try{
        const user=request.user;
        const {groupId}=request.params;
        await LastSeen.update({last_seen_at:new Date()},{where:{userId:user.id,groupId:groupId}});
        return response.status(204).json({message:"last seen updated"});
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});
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
        return response.status(500).json({message:"Server error"});
    }
}


exports.getAllUsers=async (request,response)=>{
    try{
        const allUserData=await User.findAll({
            attributes: ['id', 'name'],
            where:{id:{[Op.ne]:request.user.id}}
        });
        return response.status(200).json(allUserData);
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});
    }
}

exports.updateGroup=async (request,response)=>{
    const t=await sequelize.transaction();
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
        },{transaction:t})
        members.push(user.id);
        await updatedGroup.setUsers(null,{transaction:t});
        await updatedGroup.addUsers(members,{transaction:t});
        await t.commit();
        return response.status(200).json({message: "Group is succesfylly updated" })

    } catch (error) {
        console.log(error);
        await t.rollback();
        return response.status(500).json({message:"Server error"});
    }
}

exports.getuserDetails=async(request,response)=>{
    try{
        const user=request.user;
        const details={
            userId:user.id,
            name:user.name,
            email:user.email,
            phonenumber:user.phonenumber,

        }
        return response.status(200).json(details);
    }
    catch(error){
        console.log(error)
        return response.status(500).json({message:"Server error"});

    }
}


exports.mainPage=(request,response)=>{
    try{
        return response.status(200).sendFile("main.html",{root:"views"});
    }
    catch(error){
        return response.status(500).json({message:"Server error"});
    }
}