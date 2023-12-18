const sequelize=require("../util/database");
const Sequelize=require("sequelize");

const UserGroup=sequelize.define("usergroup",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    
},{
    timestamps:false
});

module.exports=UserGroup;