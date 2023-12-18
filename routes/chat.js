const express=require('express');
const chatControllers=require("../controllers/chat.js");
const authentication=require("../middleware/authentication.js");

const router=express.Router();

router.post("/messages",authentication.authorization,chatControllers.sendMessage);
router.get("/messages/:groupId",authentication.authorization,chatControllers.getMessage);
module.exports=router;