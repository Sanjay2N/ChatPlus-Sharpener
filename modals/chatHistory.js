const sequelize=require("../util/database");
const Sequelize=require("sequelize");

const Chat=sequelize.define("chathistory",{
    id:{

        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,

    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isImage:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    imgurl:{
        type:Sequelize.STRING,
        allowNull:true
    },
    date:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    }
},
{
    timestamps: false
});

module.exports=Chat;