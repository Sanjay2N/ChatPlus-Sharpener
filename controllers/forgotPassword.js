
const User = require('../modals/user');
const ForgotPasswords = require('../modals/forgotPassword');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.FORGOT_PASSWORD_API;
const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.forgotPassword = async (request, response) => {
    try {
        const { email } = request.body;
        const user= await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const sender = {
                email: 'sanjaykcbcs@gmail.com',
                name: 'ChatPlus'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const resetresponse = await user.createForgotpassword({});
            const { id } = resetresponse;
            const mailresponse = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your Password",
                htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Password Reset</title>
                    </head>
                    <body>
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h1 class="text-center">Reset Your Password</h1>
                                            <p class="text-center">Click the button below to reset your admin account password:</p>
                                            <div class="text-center">
                                                <a href="${process.env.WEBSITE}/user/reset/{{params.role}}" class="btn btn-primary">Reset Password</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`,
                params: {
                    role: id
                }
            })
            return response.status(200).json({ message: 'Password reset email sent' });
        } else {
           return  response.status(404).json({ message: 'User not exists' });
        }


    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });
    }
}
exports.ResetpasswordPage= async (request, response, next) => {
    try {
        let forgotId = request.params.forgotId;
        const passwordreset = await ForgotPasswords.findByPk(forgotId);
        if (passwordreset.isactive) {
            passwordreset.isactive = false;
            await passwordreset.save();
            return response.sendFile('forgotPassword.html',{root:'views'})
        } else {
            return response.status(401).json({ message: "Link has been expired" })
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });

    }
}

exports.updatePassword = async (request, response, next) => {
    try {
        const { resetId, newpassword } = request.body;
        const passwordreset = await ForgotPasswords.findByPk(resetId);
        const currentTime = new Date();
        const createdAtTime = new Date(passwordreset.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 60 * 60 * 1000; 
        if(timeDifference <= timeLimit){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await User.update(
                    {
                        password: hashedPassword
                    },
                    {
                        where: { id: passwordreset.userId }
                    }
                );
            return response.status(200).json({ message: "Password reset successful." });
        }else{
            return response.status(403).json({ message: "Link has expired Generate a new link"});
        }
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: "Internal server error" });
    }
};
