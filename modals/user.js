const sequelize=require("../util/database");
const Sequelize=require('sequelize')
const User=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    phonenumber:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    imgurl:{
        type:Sequelize.STRING,
        allowNull:true
    }
});

module.exports=User;