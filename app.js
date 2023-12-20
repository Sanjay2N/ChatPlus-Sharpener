require('dotenv').config();



const express=require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require('@socket.io/admin-ui');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const bodyParser=require("body-parser");
const ForgotPassword=require("./modals/forgotPassword");
const User=require("./modals/user");
const chatHistory=require("./modals/chatHistory");
const Group=require("./modals/group");
const UserGroup=require("./modals/userGroup");


const sequelize=require('./util/database')

const userRoutes=require('./routes/user');
const chatRoutes=require("./routes/chat");
const homeRoutes=require("./routes/home");

const app=new express();
app.use(cors({
    origin: '*',
    methods:['GET','POST'],
  
  }));

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin: ["https://admin.socket.io",],
        credentials: true
      }
 });

 
io.on("connection", (socket) => {
    socket.on('new-group-message', (groupId)=> {
        socket.broadcast.emit('group-message',groupId);
    })
  });
  
instrument(io, { auth: false })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("",homeRoutes);
app.use("/user",userRoutes);
app.use("/chat",chatRoutes);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User,{onDelete:"CASCADE"});
User.hasMany(chatHistory);
chatHistory.belongsTo(User,{ constraints: true });
User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup})
chatHistory.belongsTo(Group);
Group.hasMany(chatHistory);
Group.belongsTo(User,{foreignKey: 'AdminId',constraints:true,onDelete:'CASCADE'})



const PORT=process.env.PORT || 2000;
sequelize
.sync()
// .sync({force:true})
.then(res=>{
    httpServer.listen(PORT,()=>{
        console.log("Server started at port "+PORT);
    });
    
})
.catch(err=>{
    console.log(err);
})
