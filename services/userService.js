const User = require('../modals/user');

exports.createUser = async (name,phoneNumber,email,password) => {
    try {
        const user = await User.create({
            name:name,
            email:email,
            phonenumber:phoneNumber,
            password:password
        });
        return user;
        
    } catch (error) {
        throw error
    }
}
exports.getUserbyemail = async (email) => {
    try {
        const user=await User.findOne({where:{email}});
        return user;
        
    } catch (error) {
        throw error
    }
}