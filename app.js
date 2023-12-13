require('dotenv').config();



const express=require('express');
const cors=require('cors');


const sequelize=require('./util/database')

const userRoutes=require('./routes/user');

const app=new express();
app.use(cors());

app.use(express.json());

app.use("/user",userRoutes);

const PORT=process.env.PORT || 2000;
sequelize
.sync()
// .sync({force:true})
.then(res=>{
    app.listen(PORT,()=>{
        console.log("Server started at port "+PORT);
    });
    
})
.catch(err=>{
    console.log(err);
})
