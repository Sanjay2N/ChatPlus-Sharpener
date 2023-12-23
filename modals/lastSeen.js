const sequelize=require("../util/database");
const Sequelize=require("sequelize");

const LastSeen=sequelize.define("lastseen",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    last_seen_at:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    }
}
,{
    timestamps:false
}
)

module.exports=LastSeen;