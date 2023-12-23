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
        type:Sequelize.TEXT,
        allowNull:false
    },
    isImage:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
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