const User = require('../modals/user');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRETE_KEY;

exports.authorization = async(request,response,next)=>{
    try {
        const token = request.cookies.token;
        console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
        console.log(token)
        const decode = jwt.verify(token,secretKey);
        const user= await User.findByPk(decode.userId);
        if(user){
            request.user = user;
            next(); 
        }else{
            response.status(401).send({message:"Unauthorized"});
        }
      
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            response.status(401).json({ message: 'Time out please sign in again' });
        } else {
            console.log(error)
            response.status(500).json({ message: 'Something went wrong  - please sign again' });
        }
    }
}