const User=require("../modals/user");
const bcrypt=require("bcrypt");
const userServices=require("../services/userService");


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
        console.log({name,email,phonenumber,password})
        if(isNotValidInput([name,email,phonenumber,password])){
            return response.status(400).json('Please fill all fields');
        }
        const user=await userServices.getUserbyemail(email);
        if(user)return response.status(409).json('Email already exists');
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            console.log("after the validation")
            console.log(name,phonenumber,email,password)
            await userServices.createUser(name,phonenumber,email,hash);
            return response.status(201).json({message:"successfull"});
    })

    }
    catch(error){
        console.log(error)
        return response.status(500).json(error);
    }
}