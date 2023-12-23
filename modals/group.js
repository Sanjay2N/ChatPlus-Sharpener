const sequelize=require("../util/database");
const Sequelize=require("sequelize");

const Group=sequelize.define("group",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:true
    },
    nomember:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
},{
    timestamps:false
});


Group.afterSync(options => {
    if (options.force) {
      return Group.create({
        name: 'Common Group',
        description: 'Default Description',
        nomember:100
      });
    }
  });


module.exports=Group;